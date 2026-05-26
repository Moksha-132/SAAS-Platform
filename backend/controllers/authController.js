import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { createUser, findUserByEmail, updateManagerPaymentStatus, updateManagerApproval } from '../models/userModel.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
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

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      is_approved: user.is_approved,
      payment_completed: user.payment_completed
    },
    process.env.JWT_SECRET || 'supersecretjwtkey12345',
    { expiresIn: '30d' }
  );
};

export const registerUser = async (req, res, next) => {
  try {
    const { email, password, role, companyName } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    if (!['user', 'manager'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Choose user or manager.' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'An account with that email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await createUser({
      email,
      passwordHash,
      role,
      companyName
    });

    let emailSubject = 'Welcome to SyncSaaS Platform!';
    let emailText = `Hello! Thank you for registering at SyncSaaS as a ${role}.`;
    let emailHtml = `<p>Hello!</p><p>Thank you for registering at <strong>SyncSaaS</strong> as a <strong>${role}</strong>.</p>`;

    if (role === 'manager') {
      emailSubject = 'SyncSaaS Manager Account Pending Activation';
      emailText += '\nYour manager account is pending activation. Please complete the $99 payment or await administrator approval.';
      emailHtml += `<p>Your manager account is pending activation. Please complete the $99 activation payment or await administrator approval.</p>`;
    }

    await sendNotificationEmail(email, emailSubject, emailText, emailHtml);

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: role === 'manager' 
        ? 'Manager account registered successfully. Requires payment activation or admin approval.' 
        : 'User account registered and activated successfully.',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        isApproved: newUser.is_approved,
        paymentCompleted: newUser.payment_completed,
        companyName: newUser.company_name
      },
      token
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

    const token = generateToken(user);

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isApproved: user.is_approved,
        paymentCompleted: user.payment_completed,
        companyName: user.company_name
      },
      token
    });
  } catch (error) {
    next(error);
  }
};

export const processManagerPayment = async (req, res, next) => {
  try {
    const { email, managerId } = req.body;

    let user = null;
    if (email) {
      user = await findUserByEmail(email);
    } else if (managerId) {
      const { findUserById } = await import('../models/userModel.js');
      user = await findUserById(managerId);
    }

    if (!user) {
      return res.status(404).json({ message: 'Manager account not found.' });
    }

    if (user.role !== 'manager') {
      return res.status(400).json({ message: 'Account is not registered as a manager.' });
    }

    const updated = await updateManagerPaymentStatus(user.id, true);
    await updateManagerApproval(user.id, true);

    await sendNotificationEmail(
      user.email,
      'SyncSaaS Manager Account Activated!',
      'Your payment of $99 was received. Your manager portal access is now fully active.',
      '<p>Your payment of $99 was received. Your manager portal access is now <strong>fully active</strong>.</p>'
    );

    res.json({
      success: true,
      message: 'Manager activation payment completed successfully.',
      manager: {
        ...updated,
        is_approved: true
      }
    });
  } catch (error) {
    next(error);
  }
};
