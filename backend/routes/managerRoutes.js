import express from 'express';
import { getManagerDashboard, getAssignedSoftware, logSale } from '../controllers/managerController.js';
import { protect, managerOnly, isApprovedManager } from '../middleware/auth.js';

const router = express.Router();

// All manager routes are protected, manager-specific, and check if manager is approved/paid
router.use(protect, managerOnly, isApprovedManager);

router.get('/dashboard', getManagerDashboard);
router.get('/software', getAssignedSoftware);
router.post('/sales', logSale);

export default router;
