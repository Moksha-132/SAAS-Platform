import express from 'express';
import { getSystemAnalytics, getPendingManagers, approveManager, registerSoftware } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All admin routes are protected and admin only
router.use(protect, adminOnly);

router.get('/analytics', getSystemAnalytics);
router.get('/managers/pending', getPendingManagers);
router.patch('/managers/:id/approve', approveManager);
router.post('/software', registerSoftware);

export default router;
