import { getAllSoftware, findSoftwarePriceDetails } from '../models/softwareModel.js';
import { createSubscription, getSubscriptionsByUser } from '../models/subscriptionModel.js';
import { updateUser } from '../models/userModel.js';
import bcrypt from 'bcryptjs';

export const updateUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { email, name, password } = req.body;
    
    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required.' });
    }

    let passwordHash = null;
    if (password && password.trim() !== '') {
      const salt = await bcrypt.genSalt(10);
      passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedUser = await updateUser(userId, { 
      email, 
      companyName: name, 
      passwordHash 
    });

    res.json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        companyName: updatedUser.company_name
      }
    });
  } catch (error) {
    next(error);
  }
};

export const listAllSoftware = async (req, res, next) => {
  try {
    const { search } = req.query;
    const softwareList = await getAllSoftware(search);
    
    res.json({
      success: true,
      count: softwareList.length,
      software: softwareList
    });
  } catch (error) {
    next(error);
  }
};

export const handleCheckout = async (req, res, next) => {
  try {
    const { cartItems } = req.body;
    const userId = req.user.id;

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart items are required to process checkout.' });
    }

    const processedSubscriptions = [];

    for (const item of cartItems) {
      const { softwareId, planType } = item;

      if (!softwareId || !planType || !['monthly', 'yearly'].includes(planType)) {
        return res.status(400).json({ message: 'Invalid cart details. softwareId and planType ("monthly"/"yearly") are required.' });
      }

      const software = await findSoftwarePriceDetails(softwareId);

      if (!software) {
        return res.status(404).json({ message: `Software product not found.` });
      }

      const amountPaid = planType === 'monthly' ? software.monthly_price : software.yearly_price;

      const expirationDate = new Date();
      if (planType === 'monthly') {
        expirationDate.setDate(expirationDate.getDate() + 30);
      } else {
        expirationDate.setDate(expirationDate.getDate() + 365);
      }

      const subscription = await createSubscription({
        userId,
        softwareId,
        planType,
        amountPaid,
        endDate: expirationDate
      });

      processedSubscriptions.push({
        softwareName: software.name,
        ...subscription
      });
    }

    res.status(201).json({
      success: true,
      message: 'Checkout completed successfully! Your subscriptions are now active.',
      subscriptions: processedSubscriptions
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const subscriptions = await getSubscriptionsByUser(userId);
    
    res.json({
      success: true,
      subscriptions
    });
  } catch (error) {
    next(error);
  }
};
