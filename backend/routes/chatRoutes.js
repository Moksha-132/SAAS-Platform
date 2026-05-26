import express from 'express';
import { getChatHistory, sendMessage, scheduleMeeting, getMeetings, getChatPartners } from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Chat is a protected resource
router.use(protect);

router.get('/partners', getChatPartners);
router.get('/history/:partnerId', getChatHistory);
router.post('/message', sendMessage);
router.post('/meetings/schedule', scheduleMeeting);
router.get('/meetings', getMeetings);

export default router;
