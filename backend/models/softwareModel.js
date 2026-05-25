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

export const hostSoftwareRecord = async ({ name, description, deploymentLink, documentUrl, monthlyPrice, yearlyPrice, ownerId }) => {
  const query = `
    INSERT INTO software (name, description, deployment_link, document_url, monthly_price, yearly_price, owner_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const values = [name, description, deploymentLink || null, documentUrl || null, monthlyPrice, yearlyPrice, ownerId];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const checkSoftwareOwnership = async (id, ownerId) => {
  const query = 'SELECT 1 FROM software WHERE id = $1 AND owner_id = $2';
  const { rows } = await pool.query(query, [id, ownerId]);
  return rows.length > 0;
};

export const updateSoftwareRecord = async (id, { name, description, deploymentLink, documentUrl, monthlyPrice, yearlyPrice }) => {
  const query = `
    UPDATE software 
    SET name = $1, description = $2, deployment_link = $3, document_url = $4, monthly_price = $5, yearly_price = $6, updated_at = NOW()
    WHERE id = $7
    RETURNING *
  `;
  const values = [name, description, deploymentLink, documentUrl, monthlyPrice, yearlyPrice, id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const deleteSoftwareRecord = async (id) => {
  const query = 'DELETE FROM software WHERE id = $1';
  await pool.query(query, [id]);
};

export const checkManagerSoftwareAuthorization = async (managerId, softwareId) => {
  const query = 'SELECT 1 FROM manager_software WHERE manager_id = $1 AND software_id = $2';
  const { rows } = await pool.query(query, [managerId, softwareId]);
  return rows.length > 0;
};

export const findSoftwarePriceDetails = async (id) => {
  const query = 'SELECT name, monthly_price, yearly_price FROM software WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};
