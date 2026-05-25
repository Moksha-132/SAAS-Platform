import { saveChatMessage, fetchConversationHistory, markMessagesAsRead, findChatById } from '../models/chatModel.js';
import { createMeeting, fetchMeetingsForUser } from '../models/meetingModel.js';
import { fetchChatPartners } from '../models/userModel.js';

// Fetch the chat dialogue history between logged-in user and support/client
export const getChatHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { partnerId } = req.params;

    if (!partnerId) {
      return res.status(400).json({ message: 'Conversation partner ID is required.' });
    }

    // 1. Fetch dialogue history
    const history = await fetchConversationHistory(userId, partnerId);

    // 2. Proactively mark all unread messages from partner to us as read
    await markMessagesAsRead(partnerId, userId);

    res.json({
      success: true,
      history
    });
  } catch (error) {
    next(error);
  }
};

// Post a chat message and fire real-time WebSocket signals
export const sendMessage = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiverId, message, fileUrl, fileName } = req.body;

    if (!receiverId || ((!message || message.trim() === '') && !fileUrl)) {
      return res.status(400).json({ message: 'Receiver ID and either a message or a file are required.' });
    }

    // 1. Save chat log in database
    const savedMsg = await saveChatMessage({ senderId, receiverId, message, fileUrl, fileName });

    // 2. Real-time delivery via WebSocket (check if req.io is active)
    if (req.io) {
      req.io.to(receiverId).emit('receive_message', savedMsg);
      
      // Fire global toast notification to the recipient
      req.io.to(receiverId).emit('notification', {
        type: 'chat',
        senderId,
        message: fileUrl ? `Sent a file: "${fileName || 'attachment'}"` : `New message: "${message.substring(0, 30)}${message.length > 30 ? '...' : ''}"`
      });
    }

    res.status(201).json({
      success: true,
      chat: savedMsg
    });
  } catch (error) {
    next(error);
  }
};

// Directly schedule a meeting event from the active chat panel context
export const scheduleMeeting = async (req, res, next) => {
  try {
    const { chatId, title, scheduledTime, meetingLink } = req.body;

    if (!chatId || !title || !scheduledTime || !meetingLink) {
      return res.status(400).json({ message: 'All meeting details (chatId, title, scheduledTime, meetingLink) are required.' });
    }

    // 1. Double check that the chat message reference exists
    const chatDetails = await findChatById(chatId);

    if (!chatDetails) {
      return res.status(404).json({ message: 'The referenced chat record could not be found.' });
    }

    // 2. Create the meeting event
    const meeting = await createMeeting({
      chatId,
      title,
      scheduledTime,
      meetingLink
    });

    // 3. Notify the other party in the chat room via WebSocket
    const notifyId = chatDetails.sender_id === req.user.id ? chatDetails.receiver_id : chatDetails.sender_id;

    if (req.io) {
      req.io.to(notifyId).emit('meeting_scheduled', {
        meeting,
        message: `A meeting "${title}" has been scheduled for ${new Date(scheduledTime).toLocaleString()}`
      });

      req.io.to(notifyId).emit('notification', {
        type: 'meeting',
        senderId: req.user.id,
        message: `Meeting Scheduled: "${title}"`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Meeting scheduled successfully and calendar updated.',
      meeting
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve upcoming and past scheduled meetings for the user
export const getMeetings = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const meetings = await fetchMeetingsForUser(userId);

    res.json({
      success: true,
      meetings
    });
  } catch (error) {
    next(error);
  }
};

// Fetch potential chat targets based on the current user's role
export const getChatPartners = async (req, res, next) => {
  try {
    const role = req.user.role;
    const userId = req.user.id;
    
    const partners = await fetchChatPartners(userId, role);
    
    res.json({
      success: true,
      partners
    });
  } catch (error) {
    next(error);
  }
};
