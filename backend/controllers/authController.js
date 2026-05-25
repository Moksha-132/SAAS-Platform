import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { createUser, findUserByEmail, updateManagerPaymentStatus } from '../models/userModel.js';

// Setup email transporter using user credentials
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendNotificationEmail = async (to, subject, text, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Skipping email notification: SMTP credentials not set.');
      return;
    }
    await transporter.sendMail({
      from: `"SyncSaaS Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html
    });
    console.log(`Notification email successfully sent to: ${to}`);
  } catch (error) {
    console.error('Email Notification Error:', error.message);
  }
};

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, role, companyName } = req.body;
    
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password and role are required.' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Save to Database
    const newUser = await createUser({
      email,
      passwordHash,
      role,
      companyName
    });

    // Send email notification upon registration
    let emailSubject = 'Welcome to SyncSaaS Platform!';
    let emailText = `Hello! Thank you for registering at SyncSaaS as a ${role}.`;
    let emailHtml = `<p>Hello!</p><p>Thank you for registering at <strong>SyncSaaS</strong> as a <strong>${role}</strong>.</p>`;

    if (role === 'manager') {
      emailSubject = 'SyncSaaS Manager Account Pending Activation';
      emailText += '\nYour manager account is pending activation. Please complete the $99 payment or await administrator approval.';
      emailHtml += `<p>Your manager account is pending activation. Please complete the $99 activation payment or await administrator approval.</p>`;
    }

    await sendNotificationEmail(email, emailSubject, emailText, emailHtml);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        isApproved: newUser.is_approved,
        paymentCompleted: newUser.payment_completed,
        companyName: newUser.company_name
      }
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Create JWT Token claims matching middleware expectations
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        is_approved: user.is_approved,
        payment_completed: user.payment_completed
      },
      process.env.JWT_SECRET || 'supersecretjwtkey12345',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isApproved: user.is_approved,
        paymentCompleted: user.payment_completed,
        companyName: user.company_name
      }
    });
  } catch (error) {
    next(error);
  }
};

export const processManagerPayment = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required for manager payment activation.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== 'manager') {
      return res.status(400).json({ message: 'Account is not registered as a manager.' });
    }

    // Set payment completed and automatically approve manager since they paid
    await updateManagerPaymentStatus(user.id, true);
    
    // Run updateManagerApproval helper query directly
    import('../config/db.js').then(async (dbModule) => {
      await dbModule.default.query(
        "UPDATE users SET is_approved = true, updated_at = NOW() WHERE id = $1",
        [user.id]
      );
    });

    await sendNotificationEmail(
      email,
      'SyncSaaS Manager Account Activated!',
      'Your payment was received. Your manager portal access is now fully active.',
      '<p>Your payment of $99 was received. Your manager portal access is now <strong>fully active</strong>.</p>'
    );

    res.json({
      message: 'Manager activation payment processed successfully. Account is now active.',
      email
    });
  } catch (error) {
    next(error);
  }
};
