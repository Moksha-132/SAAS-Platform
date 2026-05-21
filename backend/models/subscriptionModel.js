import pool from '../config/db.js';

export const createSubscription = async ({ userId, softwareId, planType, amountPaid, endDate }) => {
  const query = `
    INSERT INTO subscriptions (user_id, software_id, plan_type, amount_paid, end_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [userId, softwareId, planType, amountPaid, endDate];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getSubscriptionsByUser = async (userId) => {
  const query = `
    SELECT sub.*, s.name as software_name, s.description as software_description
    FROM subscriptions sub
    JOIN software s ON sub.software_id = s.id
    WHERE sub.user_id = $1
    ORDER BY sub.created_at DESC
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
};

// Analytics query: calculates revenue aggregates & growth
export const getAdminRevenueAnalytics = async () => {
  const totalRevenueQuery = 'SELECT COALESCE(SUM(amount_paid), 0) as total_revenue FROM subscriptions';
  const monthlyRevenueQuery = `
    SELECT 
      TO_CHAR(created_at, 'YYYY-MM') as month,
      SUM(amount_paid) as revenue,
      COUNT(id) as subscription_count
    FROM subscriptions
    GROUP BY TO_CHAR(created_at, 'YYYY-MM')
    ORDER BY month ASC
  `;

  const totalRes = await pool.query(totalRevenueQuery);
  const monthlyRes = await pool.query(monthlyRevenueQuery);

  return {
    totalRevenue: parseFloat(totalRes.rows[0].total_revenue),
    monthlyGrowth: monthlyRes.rows
  };
};
