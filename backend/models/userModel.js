import pool from '../config/db.js';

export const createUser = async ({ email, passwordHash, role, companyName }) => {
  const query = `
    INSERT INTO users (email, password_hash, role, company_name, is_approved, payment_completed)
    VALUES ($1, $2, $3, $4, true, true)
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

export const fetchChatPartners = async (userId, role) => {
  let query;
  if (role === 'user') {
    // Users can chat with all managers
    query = `
      SELECT u.id, u.email, u.role, u.company_name, 
        COALESCE(unread.cnt, 0)::INTEGER AS unread_count
      FROM users u
      LEFT JOIN (
        SELECT sender_id, COUNT(*) AS cnt 
        FROM chats 
        WHERE receiver_id = $1 AND is_read = FALSE 
        GROUP BY sender_id
      ) unread ON u.id = unread.sender_id
      WHERE u.role = 'manager'
      ORDER BY u.company_name ASC
    `;
  } else if (role === 'manager') {
    // Managers can chat with all clients
    query = `
      SELECT u.id, u.email, u.role, u.company_name, 
        COALESCE(unread.cnt, 0)::INTEGER AS unread_count
      FROM users u
      LEFT JOIN (
        SELECT sender_id, COUNT(*) AS cnt 
        FROM chats 
        WHERE receiver_id = $1 AND is_read = FALSE 
        GROUP BY sender_id
      ) unread ON u.id = unread.sender_id
      WHERE u.role = 'user'
      ORDER BY u.email ASC
    `;
  } else {
    // Admins can chat with everyone except other admins
    query = `
      SELECT u.id, u.email, u.role, u.company_name, 
        COALESCE(unread.cnt, 0)::INTEGER AS unread_count
      FROM users u
      LEFT JOIN (
        SELECT sender_id, COUNT(*) AS cnt 
        FROM chats 
        WHERE receiver_id = $1 AND is_read = FALSE 
        GROUP BY sender_id
      ) unread ON u.id = unread.sender_id
      WHERE u.role != 'admin'
      ORDER BY u.email ASC
    `;
  }
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

export const findClientByEmail = async (email) => {
  const query = "SELECT id FROM users WHERE email = $1 AND role = 'user'";
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

export const updateUser = async (id, { email, companyName, passwordHash }) => {
  if (passwordHash) {
    const query = 'UPDATE users SET email = $1, company_name = $2, password_hash = $3, updated_at = NOW() WHERE id = $4 RETURNING id, email, role, company_name';
    const { rows } = await pool.query(query, [email, companyName, passwordHash, id]);
    return rows[0];
  } else {
    const query = 'UPDATE users SET email = $1, company_name = $2, updated_at = NOW() WHERE id = $3 RETURNING id, email, role, company_name';
    const { rows } = await pool.query(query, [email, companyName, id]);
    return rows[0];
  }
};
