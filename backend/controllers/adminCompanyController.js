import { fetchRegisteredCompanies } from '../models/companyModel.js';

export const getRegisteredCompanies = async (req, res, next) => {
  try {
    const list = await fetchRegisteredCompanies();
    res.json(list);
  } catch (e) {
    next(e);
  }
};
