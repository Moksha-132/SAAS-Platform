import pool from '../config/db.js';

export const createMeeting = async ({ chatId, title, scheduledTime, meetingLink }) => {
  const query = `
    INSERT INTO meetings (chat_id, title, scheduled_time, meeting_link)
    VALUES ($1, $2, $3, $4)
    RETURNING *
  `;
  const values = [chatId, title, scheduledTime, meetingLink];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const fetchMeetingsForUser = async (userId) => {
  const query = `
    SELECT m.*, c.sender_id, c.receiver_id 
    FROM meetings m
    JOIN chats c ON m.chat_id = c.id
    WHERE (c.sender_id = $1 OR c.receiver_id = $1)
      AND m.scheduled_time >= CURRENT_TIMESTAMP
    ORDER BY m.scheduled_time ASC
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

export const updateMeetingStatus = async (meetingId, status) => {
  const query = `
    UPDATE meetings
    SET status = $1
    WHERE id = $2
    RETURNING *
  `;
  const { rows } = await pool.query(query, [status, meetingId]);
  return rows[0];
};
