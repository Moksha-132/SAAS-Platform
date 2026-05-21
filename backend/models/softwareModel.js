import pool from '../config/db.js';

export const createSoftware = async ({ name, description, monthlyPrice, yearlyPrice, ownerId }) => {
  const query = `
    INSERT INTO software (name, description, monthly_price, yearly_price, owner_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `;
  const values = [name, description, monthlyPrice, yearlyPrice, ownerId];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getAllSoftware = async (searchTerm = '') => {
  let query = 'SELECT * FROM software';
  const values = [];

  if (searchTerm) {
    query += ' WHERE name ILIKE $1 OR description ILIKE $1';
    values.push(`%${searchTerm}%`);
  }

  query += ' ORDER BY created_at DESC';
  const { rows } = await pool.query(query, values);
  return rows;
};

export const assignManagerToSoftware = async (managerId, softwareId) => {
  const query = `
    INSERT INTO manager_software (manager_id, software_id)
    VALUES ($1, $2)
    ON CONFLICT (manager_id, software_id) DO NOTHING
    RETURNING *
  `;
  const { rows } = await pool.query(query, [managerId, softwareId]);
  return rows[0];
};

export const getSoftwareByManager = async (managerId) => {
  const query = `
    SELECT s.* FROM software s
    JOIN manager_software ms ON s.id = ms.software_id
    WHERE ms.manager_id = $1
  `;
  const { rows } = await pool.query(query, [managerId]);
  return rows;
};
