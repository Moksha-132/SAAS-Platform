import { getPendingManagersList, updateManagerApproval, findUserById, updateUserDetailFields, deleteUserById } from '../models/userModel.js';
import { fetchAllManagers } from '../models/managerModel.js';
import nodemailer from 'nodemailer';

const mailer = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendMail = async (to, sub, txt, html) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) return;
    await mailer.sendMail({
      from: `"SyncSaaS Admin" <${process.env.EMAIL_USER}>`,
      to,
      subject: sub,
      text: txt,
      html
    });
  } catch (e) {
    console.error('Mail fail:', e.message);
  }
};

export const getPendingManagers = async (req, res, next) => {
  try {
    const list = await getPendingManagersList();
    res.json(list);
  } catch (e) {
    next(e);
  }
};

export const approveManager = async (req, res, next) => {
  try {
    const id = req.params.id || req.body.id;
    if (!id) return res.status(400).json({ error: 'Manager ID required' });

    const usr = await findUserById(id);
    if (!usr) return res.status(404).json({ error: 'Manager not found' });

    const approved = await updateManagerApproval(id, true);

    await sendMail(
      approved.email,
      'SyncSaaS Account Approved!',
      'Your manager request has been approved. You can now log into your dashboard.',
      '<p>Your manager account request has been <strong>approved</strong> by the platform owner. You can now log into your dashboard.</p>'
    );

    res.json({ success: true, manager: approved });
  } catch (e) {
    next(e);
  }
};

export const getAllManagers = async (req, res, next) => {
  try {
    const list = await fetchAllManagers();
    res.json(list);
  } catch (e) {
    next(e);
  }
};

export const updateManagerDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyName, email, isApproved, paymentCompleted, monthlySpend } = req.body;

    if (!id) return res.status(400).json({ error: 'ID required' });

    const updated = await updateUserDetailFields(id, { companyName, email, isApproved, paymentCompleted, monthlySpend });
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ success: true, manager: updated });
  } catch (e) {
    next(e);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: 'ID required' });

    const deleted = await deleteUserById(id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });

    if (deleted.role === 'manager') {
      await sendMail(
        deleted.email,
        'SyncSaaS Account Rejected/Removed',
        'Your registration request has been rejected or your account has been removed by the administrator.',
        '<p>Your manager registration request has been <strong>rejected</strong> or your account has been removed by the platform administrator.</p>'
      );
    }

    res.json({ success: true, message: 'User deleted successfully', user: deleted });
  } catch (e) {
    next(e);
  }
};
