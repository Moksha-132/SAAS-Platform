import pool from '../config/db.js';

export const createUser = async ({ email, passwordHash, role, companyName }) => {
  const query = `
    INSERT INTO users (email, password_hash, role, company_name)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, role, is_approved, payment_completed, company_name, created_at
  `;
  const values = [email, passwordHash, role, companyName || null];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const findUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const query = 'SELECT id, email, role, is_approved, payment_completed, company_name, created_at FROM users WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const updateManagerApproval = async (id, isApproved) => {
  const query = 'UPDATE users SET is_approved = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, is_approved';
  const { rows } = await pool.query(query, [isApproved, id]);
  return rows[0];
};

export const updateManagerPaymentStatus = async (id, paymentCompleted) => {
  const query = 'UPDATE users SET payment_completed = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, payment_completed';
  const { rows } = await pool.query(query, [paymentCompleted, id]);
  return rows[0];
};

export const getPendingManagersList = async () => {
  const query = `
    SELECT id, email, company_name, created_at 
    FROM users 
    WHERE role = 'manager' AND is_approved = FALSE AND payment_completed = FALSE
    ORDER BY created_at DESC
  `;
  const { rows } = await pool.query(query);
  return rows;
};
