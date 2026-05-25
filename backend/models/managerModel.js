import pool from '../config/db.js';

export const fetchAllManagers = async () => {
  const { rows } = await pool.query(
    "SELECT id, email, company_name, is_approved, payment_completed, created_at FROM users WHERE role = 'manager' ORDER BY created_at DESC"
  );
  return rows;
};
