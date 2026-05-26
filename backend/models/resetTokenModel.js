import pool from '../config/db.js';
import crypto from 'crypto';

export const createResetToken = async (userId) => {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token, expires_at)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id) DO UPDATE SET token = EXCLUDED.token, expires_at = EXCLUDED.expires_at`,
    [userId, token, expiresAt]
  );

  return token;
};

export const findResetToken = async (token) => {
  const { rows } = await pool.query(
    `SELECT prt.*, u.email FROM password_reset_tokens prt
     JOIN users u ON u.id = prt.user_id
     WHERE prt.token = $1 AND prt.expires_at > NOW()`,
    [token]
  );
  return rows[0];
};

export const deleteResetToken = async (userId) => {
  await pool.query('DELETE FROM password_reset_tokens WHERE user_id = $1', [userId]);
};
