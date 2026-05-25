import { saveChatMessage, fetchConversationHistory, markMessagesAsRead } from '../models/chatModel.js';
import { createMeeting, fetchMeetingsForUser } from '../models/meetingModel.js';

export const getChatHistory = async (req, res, next) => {
  try {
    const { withUser } = req.query;
    const userId = req.user.id;

    if (!withUser) {
      return res.status(400).json({ message: 'withUser query parameter is required.' });
    }

    const history = await fetchConversationHistory(userId, withUser);
    
    // Mark received messages as read
    await markMessagesAsRead(withUser, userId);

    res.json(history);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !message) {
      return res.status(400).json({ message: 'Receiver ID and message content are required.' });
    }

    const savedMessage = await saveChatMessage({
      senderId,
      receiverId,
      message
    });

    // Real-time socket dispatch
    if (req.io) {
      req.io.to(receiverId).emit('receive_message', savedMessage);
      req.io.to(receiverId).emit('notification', {
        type: 'chat',
        senderId,
        message: `New message: "${message.substring(0, 30)}..."`
      });
    }

    res.status(201).json(savedMessage);
  } catch (error) {
    next(error);
  }
};

export const scheduleMeeting = async (req, res, next) => {
  try {
    const { chatId, title, scheduledTime, meetingLink } = req.body;

    if (!title || !scheduledTime || !meetingLink) {
      return res.status(400).json({ message: 'Title, scheduled time, and meeting link are required.' });
    }

    const meeting = await createMeeting({
      chatId: chatId || null,
      title,
      scheduledTime,
      meetingLink
    });

    res.status(201).json({
      message: 'Meeting scheduled successfully.',
      meeting
    });
  } catch (error) {
    next(error);
  }
};

export const getMeetings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const list = await fetchMeetingsForUser(userId);
    res.json(list);
  } catch (error) {
    next(error);
  }
};
