import pool from '../config/db.js';
import { updateManagerApproval, getPendingManagersList } from '../models/userModel.js';
import { createSoftware } from '../models/softwareModel.js';
import { getAdminRevenueAnalytics } from '../models/subscriptionModel.js';

// Retrieve all administrative analytics metrics
export const getSystemAnalytics = async (req, res, next) => {
  try {
    // 1. Fetch total companies/clients count
    const companyCountQuery = 'SELECT COUNT(id) as company_count FROM users WHERE role = \'user\'';
    const companyCountRes = await pool.query(companyCountQuery);

    // 2. Fetch total active managers count
    const managerCountQuery = 'SELECT COUNT(id) as manager_count FROM users WHERE role = \'manager\'';
    const managerCountRes = await pool.query(managerCountQuery);

    // 3. Fetch revenue analytics
    const revenueStats = await getAdminRevenueAnalytics();

    res.json({
      success: true,
      analytics: {
        totalCompanies: parseInt(companyCountRes.rows[0].company_count, 10),
        totalManagers: parseInt(managerCountRes.rows[0].manager_count, 10),
        ...revenueStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve a list of all managers awaiting admin verification
export const getPendingManagers = async (req, res, next) => {
  try {
    const list = await getPendingManagersList();
    res.json({
      success: true,
      pendingManagers: list
    });
  } catch (error) {
    next(error);
  }
};

// Approve manager registration profile
export const approveManager = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Manager account ID is required.' });
    }

    const updated = await updateManagerApproval(id, true);

    res.json({
      success: true,
      message: 'Manager profile approved and activated successfully.',
      manager: updated
    });
  } catch (error) {
    next(error);
  }
};

// Publish a new SaaS product on the marketplace
export const registerSoftware = async (req, res, next) => {
  try {
    const { name, description, monthlyPrice, yearlyPrice } = req.body;
    const adminId = req.user.id;

    if (!name || !monthlyPrice || !yearlyPrice) {
      return res.status(400).json({ message: 'Software name, monthly price, and yearly price are required.' });
    }

    const newSoftware = await createSoftware({
      name,
      description,
      monthlyPrice,
      yearlyPrice,
      ownerId: adminId
    });

    res.status(201).json({
      success: true,
      message: 'New SaaS product published successfully.',
      software: newSoftware
    });
  } catch (error) {
    next(error);
  }
};
