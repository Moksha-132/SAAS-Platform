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

export const getManagerDashboard = async (req, res, next) => {
  try {
    const managerId = req.user.id;

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

export const logSale = async (req, res, next) => {
  try {
    const { clientEmail, softwareId, planType, amountPaid } = req.body;

    if (!clientEmail || !softwareId || !planType || !amountPaid) {
      return res.status(400).json({ message: 'All sales fields are required.' });
    }

    const client = await findClientByEmail(clientEmail);
    if (!client) {
      return res.status(404).json({ message: 'No registered user was found with that email address.' });
    }

    const clientId = client.id;

    const isAuthorized = await checkManagerSoftwareAuthorization(req.user.id, softwareId);
    if (!isAuthorized) {
      return res.status(403).json({ message: 'You are not assigned to manage or sell this software product.' });
    }

    const durationDays = planType === 'monthly' ? 30 : 365;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

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

export const hostSoftware = async (req, res, next) => {
  try {
    const { name, description, deploymentLink, documentUrl, monthlyPrice, yearlyPrice } = req.body;
    const managerId = req.user.id;

    if (!name || !monthlyPrice || !yearlyPrice) {
      return res.status(400).json({ message: 'Name, monthly price, and yearly price are required.' });
    }

    const newSoftware = await hostSoftwareRecord({
      name,
      description,
      deploymentLink,
      documentUrl,
      monthlyPrice,
      yearlyPrice,
      ownerId: managerId
    });

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

export const editSoftware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, deploymentLink, documentUrl, monthlyPrice, yearlyPrice } = req.body;
    const managerId = req.user.id;

    const isOwner = await checkSoftwareOwnership(id, managerId);
    if (!isOwner) {
      return res.status(403).json({ message: 'Unauthorized to edit this software.' });
    }

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

export const deleteSoftware = async (req, res, next) => {
  try {
    const { id } = req.params;
    const managerId = req.user.id;

    const isOwner = await checkSoftwareOwnership(id, managerId);
    if (!isOwner) {
      return res.status(403).json({ message: 'Unauthorized to delete this software.' });
    }

    await deleteSoftwareRecord(id);

    res.json({
      success: true,
      message: 'Software deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
};
