import { getAllSoftware } from '../models/softwareModel.js';
import { createSubscription, getSubscriptionsByUser } from '../models/subscriptionModel.js';

export const listAllSoftware = async (req, res, next) => {
  try {
    const { search } = req.query;
    const softwareList = await getAllSoftware(search || '');
    res.json(softwareList);
  } catch (error) {
    next(error);
  }
};

export const handleCheckout = async (req, res, next) => {
  try {
    const { softwareId, planType, amountPaid } = req.body;
    const userId = req.user.id;

    if (!softwareId || !planType || !amountPaid) {
      return res.status(400).json({ message: 'Software ID, plan type, and amount paid are required.' });
    }

    const endDate = new Date();
    if (planType === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const subscription = await createSubscription({
      userId,
      softwareId,
      planType,
      amountPaid,
      endDate
    });

    res.status(201).json({
      message: 'Subscription purchased successfully.',
      subscription
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const subs = await getSubscriptionsByUser(userId);
    res.json(subs);
  } catch (error) {
    next(error);
  }
};
