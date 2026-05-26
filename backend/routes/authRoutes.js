import express from 'express';
import { registerUser, loginUser, processManagerPayment } from '../controllers/authController.js';
import { getSettings } from '../controllers/settingsController.js';
import { forgotPassword, resetPassword } from '../controllers/passwordResetController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/manager/payment', processManagerPayment);
router.get('/settings', getSettings);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
