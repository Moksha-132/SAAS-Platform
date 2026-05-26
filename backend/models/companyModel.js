import pool from '../config/db.js';

export const fetchRegisteredCompanies = async () => {
  const { rows } = await pool.query(
    "SELECT id, email, company_name, is_approved, 49 AS monthly_spend, created_at FROM users WHERE role = 'user' ORDER BY created_at DESC"
  );
  return rows;
};
