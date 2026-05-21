import express from 'express';
import { registerUser, loginUser, processManagerPayment } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/manager/payment', processManagerPayment);

export default router;
