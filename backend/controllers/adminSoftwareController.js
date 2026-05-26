import { createSoftware, deleteSoftwareRecord } from '../models/softwareModel.js';

export const registerSoftware = async (req, res, next) => {
  try {
    const { name, description, monthlyPrice, yearlyPrice } = req.body;
    const ownerId = req.user.id;

    if (!name || !monthlyPrice || !yearlyPrice) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const sw = await createSoftware({
      name,
      description,
      monthlyPrice,
      yearlyPrice,
      ownerId
    });

    res.status(201).json({ success: true, software: sw });
  } catch (e) {
    next(e);
  }
};

export const removeSoftware = async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteSoftwareRecord(id);
    res.status(200).json({ success: true, message: 'Software deleted successfully' });
  } catch (e) {
    next(e);
  }
};
