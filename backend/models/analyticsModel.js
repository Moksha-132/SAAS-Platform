import pool from '../config/db.js';

export const fetchSystemAnalytics = async () => {
  const [companies, active, pending, subs, userSpends] = await Promise.all([
    pool.query("SELECT COUNT(*) FROM users WHERE role = 'user'"),
    pool.query("SELECT COUNT(*) FROM users WHERE role = 'manager' AND is_approved = true"),
    pool.query("SELECT COUNT(*) FROM users WHERE role = 'manager' AND is_approved = false"),
    pool.query("SELECT COALESCE(SUM(amount_paid), 0) as total FROM subscriptions"),
    pool.query("SELECT COALESCE(SUM(monthly_spend), 0) as total FROM users WHERE role = 'user'")
  ]);

  const subRevenue = parseFloat(subs.rows[0].total || 0);
  const monthlySpendRevenue = parseFloat(userSpends.rows[0].total || 0);

  return {
    totalRevenue: subRevenue + monthlySpendRevenue,
    companiesCount: parseInt(companies.rows[0].count || 0),
    activeManagersCount: parseInt(active.rows[0].count || 0),
    pendingManagersCount: parseInt(pending.rows[0].count || 0)
  };
};
