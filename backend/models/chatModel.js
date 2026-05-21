import pool from '../config/db.js';

export const saveChatMessage = async ({ senderId, receiverId, message }) => {
  const query = `
    INSERT INTO chats (sender_id, receiver_id, message)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const values = [senderId, receiverId, message];
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
