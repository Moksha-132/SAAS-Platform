import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, updateManagerPaymentStatus } from '../models/userModel.js';

// Generate standard JWT token with role information
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

// Register a new user (active immediately) or manager (requires payment/approval)
export const registerUser = async (req, res, next) => {
  try {
    const { email, password, role, companyName } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password, and role are required.' });
    }

    if (!['user', 'manager'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Choose user or manager.' });
    }

    // 1. Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'An account with that email address already exists.' });
    }

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 3. Create the user in the database
    const newUser = await createUser({
      email,
      passwordHash,
      role,
      companyName
    });

    // 4. Generate JWT
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

// Authenticate user credentials and return session token
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    // 1. Verify user exists
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 2. Match credentials
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // 3. Generate token
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

// Process checkout fee to activate manager account immediately
export const processManagerPayment = async (req, res, next) => {
  try {
    const { managerId } = req.body;

    if (!managerId) {
      return res.status(400).json({ message: 'Manager ID is required.' });
    }

    // Update payment status to true
    const updated = await updateManagerPaymentStatus(managerId, true);

    res.json({
      success: true,
      message: 'Manager activation payment completed successfully.',
      manager: updated
    });
  } catch (error) {
    next(error);
  }
};
