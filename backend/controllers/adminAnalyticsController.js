import { fetchSystemAnalytics } from '../models/analyticsModel.js';

export const getSystemAnalytics = async (req, res, next) => {
  try {
    const stats = await fetchSystemAnalytics();
    res.json(stats);
  } catch (e) {
    next(e);
  }
};
