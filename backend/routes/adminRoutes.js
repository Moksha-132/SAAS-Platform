import express from 'express';
import { getSystemAnalytics } from '../controllers/adminAnalyticsController.js';
import { getPendingManagers, approveManager, getAllManagers, updateManagerDetails, deleteUser } from '../controllers/adminManagerController.js';
import { registerSoftware } from '../controllers/adminSoftwareController.js';
import { getRegisteredCompanies } from '../controllers/adminCompanyController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/analytics', getSystemAnalytics);
router.get('/managers/pending', getPendingManagers);
router.get('/managers', getAllManagers);
router.get('/companies', getRegisteredCompanies);
router.patch('/managers/:id/approve', approveManager);
router.patch('/managers/:id', updateManagerDetails);
router.delete('/managers/:id', deleteUser);
router.post('/software', registerSoftware);

export default router;
