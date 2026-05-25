import pool from '../config/db.js';

export const saveChatMessage = async ({ senderId, receiverId, message, fileUrl, fileName }) => {
  const query = `
    INSERT INTO chats (sender_id, receiver_id, message, file_url, file_name)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [senderId, receiverId, message || '', fileUrl, fileName];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const fetchConversationHistory = async (userA, userB) => {
  const query = `
    SELECT * FROM chats
    WHERE (sender_id = $1 AND receiver_id = $2)
       OR (sender_id = $2 AND receiver_id = $1)
    ORDER BY created_at ASC
  `;
  const { rows } = await pool.query(query, [userA, userB]);
  return rows;
};

export const markMessagesAsRead = async (senderId, receiverId) => {
  const query = `
    UPDATE chats
    SET is_read = TRUE
    WHERE sender_id = $1 AND receiver_id = $2 AND is_read = FALSE
    RETURNING id
  `;
  const { rows } = await pool.query(query, [senderId, receiverId]);
  return rows;
};

export const findChatById = async (chatId) => {
  const query = 'SELECT sender_id, receiver_id FROM chats WHERE id = $1';
  const { rows } = await pool.query(query, [chatId]);
  return rows[0];
};
