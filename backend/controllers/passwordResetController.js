import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { findUserByEmail } from '../models/userModel.js';
import { createResetToken, findResetToken, deleteResetToken } from '../models/resetTokenModel.js';
import pool from '../config/db.js';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.json({ success: true, message: 'If this email is registered, you will receive a reset link shortly.' });
    }

    const token = await createResetToken(user.id);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"SyncSaaS Platform" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset Your SyncSaaS Password',
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:auto;padding:32px;background:#f8fafc;border-radius:16px">
            <h2 style="color:#0f172a;font-size:24px;margin-bottom:8px">Password Reset Request</h2>
            <p style="color:#64748b;margin-bottom:24px">We received a request to reset your password for <strong>${email}</strong>. Click the button below to proceed.</p>
            <a href="${resetLink}" style="display:inline-block;background:#f97316;color:#fff;padding:14px 28px;border-radius:10px;font-weight:700;text-decoration:none;font-size:15px">Reset Password</a>
            <p style="color:#94a3b8;font-size:12px;margin-top:24px">This link expires in 1 hour. If you did not request this, please ignore this email.</p>
          </div>
        `
      });
    } else {
      console.log(`[DEV] Password reset link for ${email}: ${resetLink}`);
    }

    res.json({ success: true, message: 'If this email is registered, you will receive a reset link shortly.' });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const resetRecord = await findResetToken(token);
    if (!resetRecord) {
      return res.status(400).json({ message: 'This reset link is invalid or has expired.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [passwordHash, resetRecord.user_id]
    );

    await deleteResetToken(resetRecord.user_id);

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (error) {
    next(error);
  }
};
