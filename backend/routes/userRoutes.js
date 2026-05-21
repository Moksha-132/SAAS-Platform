import express from 'express';
import { listAllSoftware, handleCheckout, getUserSubscriptions } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// General users can look up software without log in
router.get('/software', listAllSoftware);

// Subscriptions and checkout require login
router.post('/checkout', protect, handleCheckout);
router.get('/subscriptions', protect, getUserSubscriptions);

export default router;
