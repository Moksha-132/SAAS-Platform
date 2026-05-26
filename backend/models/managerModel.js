import pool from '../config/db.js';

export const fetchAllManagers = async () => {
  const { rows } = await pool.query(
    "SELECT id, email, company_name, is_approved, payment_completed, created_at FROM users WHERE role = 'manager' ORDER BY created_at DESC"
  );
  return rows;
};

export const fetchManagerSalesAnalytics = async (managerId) => {
  const query = `
    SELECT 
      COALESCE(SUM(sub.amount_paid), 0) as total_sales,
      COUNT(sub.id) as total_transactions
    FROM subscriptions sub
    JOIN manager_software ms ON sub.software_id = ms.software_id
    WHERE ms.manager_id = $1
  `;
  const { rows } = await pool.query(query, [managerId]);
  return {
    totalRevenue: parseFloat(rows[0].total_sales),
    salesCount: parseInt(rows[0].total_transactions, 10)
  };
};

export const fetchManagerUpcomingMeetings = async (managerId) => {
  const query = `
    SELECT DISTINCT ON (m.id) m.*, u.email as client_email, 
      (
        SELECT s.name 
        FROM subscriptions sub 
        JOIN software s ON sub.software_id = s.id 
        WHERE sub.user_id = u.id 
        LIMIT 1
      ) as software_name
    FROM meetings m
    JOIN chats c ON m.chat_id = c.id
    JOIN users u ON (c.sender_id = u.id OR c.receiver_id = u.id)
    WHERE (c.sender_id = $1 OR c.receiver_id = $1)
      AND u.id != $1
      AND m.scheduled_time >= CURRENT_TIMESTAMP
    ORDER BY m.id, m.scheduled_time ASC
    LIMIT 10
  `;
  const { rows } = await pool.query(query, [managerId]);
  return rows;
};

export const fetchManagerRecentSales = async (managerId) => {
  const query = `
    SELECT 
      sub.id,
      sub.amount_paid,
      sub.plan_type,
      sub.created_at,
      u.email as client_email,
      s.name as software_name
    FROM subscriptions sub
    JOIN users u ON sub.user_id = u.id
    JOIN software s ON sub.software_id = s.id
    JOIN manager_software ms ON s.id = ms.software_id
    WHERE ms.manager_id = $1
    ORDER BY sub.created_at DESC
    LIMIT 5
  `;
  const { rows } = await pool.query(query, [managerId]);
  return rows;
};
