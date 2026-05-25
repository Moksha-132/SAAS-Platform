import { 
  getSoftwareByManager, 
  hostSoftwareRecord, 
  checkSoftwareOwnership, 
  updateSoftwareRecord, 
  deleteSoftwareRecord, 
  checkManagerSoftwareAuthorization,
  assignManagerToSoftware
} from '../models/softwareModel.js';
import { createSubscription } from '../models/subscriptionModel.js';
import { 
  fetchManagerSalesAnalytics, 
  fetchManagerUpcomingMeetings, 
  fetchManagerRecentSales 
} from '../models/managerModel.js';
import { findClientByEmail } from '../models/userModel.js';

// Retrieve dashboard aggregates for the logged-in manager
export const getManagerDashboard = async (req, res, next) => {
  try {
    const managerId = req.user.id;

    // Fetch dashboard aggregates from model methods
    const analytics = await fetchManagerSalesAnalytics(managerId);
    const upcomingMeetings = await fetchManagerUpcomingMeetings(managerId);
    const recentSales = await fetchManagerRecentSales(managerId);

    res.json({
      success: true,
      analytics,
      upcomingMeetings,
      recentSales
    });
  } catch (error) {
    next(error);
  }
};

// Retrieve software listings managed by this manager
export const getAssignedSoftware = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const softwareList = await getSoftwareByManager(managerId);
    
    res.json({
      success: true,
      software: softwareList
    });
  } catch (error) {
    next(error);
  }
};

// Process an offline manual sale recorded by the manager
export const logSale = async (req, res, next) => {
  try {
    const { clientEmail, softwareId, planType, amountPaid } = req.body;

    if (!clientEmail || !softwareId || !planType || !amountPaid) {
      return res.status(400).json({ message: 'All sales fields are required.' });
    }

    // 1. Look up the client by email address using model method
    const client = await findClientByEmail(clientEmail);
    if (!client) {
      return res.status(404).json({ message: 'No registered user was found with that email address.' });
    }

    const clientId = client.id;

    // 2. Double check if this manager is authorized to sell this software using model method
    const isAuthorized = await checkManagerSoftwareAuthorization(req.user.id, softwareId);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'You are not assigned to manage or sell this software product.' });
    }

    // 3. Compute duration end date (30 days for monthly, 365 days for yearly)
    const durationDays = planType === 'monthly' ? 30 : 365;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    // 4. Create the active subscription record using model method
    const subscription = await createSubscription({
      userId: clientId,
      softwareId,
      planType,
      amountPaid,
      endDate
    });

    res.status(201).json({
      success: true,
      message: 'Sale logged successfully and client subscription activated.',
      subscription
    });
  } catch (error) {
    next(error);
  }
};

// Host a new SaaS product directly by the manager
export const hostSoftware = async (req, res, next) => {
  try {
    const { name, description, deploymentLink, documentUrl, monthlyPrice, yearlyPrice } = req.body;
    const managerId = req.user.id;

    if (!name || !monthlyPrice || !yearlyPrice) {
      return res.status(400).json({ message: 'Name, monthly price, and yearly price are required.' });
    }

    // Insert new software using model method
    const newSoftware = await hostSoftwareRecord({
      name,
      description,
      deploymentLink,
      documentUrl,
      monthlyPrice,
      yearlyPrice,
      ownerId: managerId
    });

    // Automatically link this manager to the new software using model method
    await assignManagerToSoftware(managerId, newSoftware.id);

    res.status(201).json({
      success: true,
      message: 'Software successfully hosted and linked to your portal.',
      software: newSoftware
    });
  } catch (error) {
    next(error);
  }
};

// Edit an existing SaaS product
export const editSoftware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, deploymentLink, documentUrl, monthlyPrice, yearlyPrice } = req.body;
    const managerId = req.user.id;

    // Verify ownership using model method
    const isOwner = await checkSoftwareOwnership(id, managerId);
    if (!isOwner) {
      return res.status(403).json({ message: 'Unauthorized to edit this software.' });
    }

    // Update using model method
    const updatedSoftware = await updateSoftwareRecord(id, {
      name,
      description,
      deploymentLink,
      documentUrl,
      monthlyPrice,
      yearlyPrice
    });

    res.json({
      success: true,
      message: 'Software updated successfully.',
      software: updatedSoftware
    });
  } catch (error) {
    next(error);
  }
};

// Delete a SaaS product
export const deleteSoftware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;

    // Verify ownership using model method
    const isOwner = await checkSoftwareOwnership(id, managerId);
    if (!isOwner) {
      return res.status(403).json({ message: 'Unauthorized to delete this software.' });
    }

    // Delete using model method
    await deleteSoftwareRecord(id);

    res.json({
      success: true,
      message: 'Software deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
