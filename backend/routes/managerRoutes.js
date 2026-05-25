import express from 'express';
import { getManagerDashboard, getAssignedSoftware, logSale, hostSoftware, editSoftware, deleteSoftware } from '../controllers/managerController.js';
import { protect, managerOnly, isApprovedManager } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// All manager routes are protected, manager-specific, and check if manager is approved/paid
router.use(protect, managerOnly, isApprovedManager);

router.get('/dashboard', getManagerDashboard);
router.get('/software', getAssignedSoftware);
router.post('/software', hostSoftware);
router.put('/software/:id', editSoftware);
router.delete('/software/:id', deleteSoftware);
router.post('/sales', logSale);

// Endpoint for direct device file uploads
router.post('/upload-document', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded.' });
    }
    const documentUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    res.json({
      success: true,
      message: 'File uploaded successfully!',
      documentUrl,
      fileName: req.file.originalname
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
