import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import pool from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = async () => {
  try {
    console.log('Checking database table configurations...');
    
    // Check if the "users" table already exists
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `;
    const res = await pool.query(checkTableQuery);
    const tablesExist = res.rows[0].exists;

    if (!tablesExist) {
      console.log('No active tables found. Loading schema.sql template...');
      const schemaPath = path.join(__dirname, '..', 'models', 'schema.sql');
      const sqlSchema = fs.readFileSync(schemaPath, 'utf8');

      // Execute SQL schema creation
      await pool.query(sqlSchema);
      console.log('PostgreSQL database tables created successfully.');

      // Seed default demo credentials
      console.log('Seeding default demo profiles into tables...');
      
      const adminPassHash = await bcrypt.hash('admin123', 10);
      const managerPassHash = await bcrypt.hash('manager123', 10);
      const userPassHash = await bcrypt.hash('user123', 10);

      // 1. Seed Admin
      await pool.query(
        `INSERT INTO users (email, password_hash, role, is_approved, payment_completed, company_name) 
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING`,
        ['admin@syncsaas.com', adminPassHash, 'admin', true, true, 'SHNOOR Admin Services']
      );

      // 2. Seed Manager
      await pool.query(
        `INSERT INTO users (email, password_hash, role, is_approved, payment_completed, company_name) 
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING`,
        ['manager@syncsaas.com', managerPassHash, 'manager', true, true, 'Shnoor Manager Group']
      );

      // 3. Seed User
      await pool.query(
        `INSERT INTO users (email, password_hash, role, is_approved, payment_completed, company_name) 
         VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING`,
        ['user@company.com', userPassHash, 'user', true, true, 'Shnoor Client Corp']
      );

      console.log('Database seeding complete! Ready for local execution.');
    } else {
      console.log('PostgreSQL tables verified. Database is operational.');
    }

    // Always run an ALTER command to dynamically add deployment_link and document_url columns if missing
    await pool.query('ALTER TABLE software ADD COLUMN IF NOT EXISTS deployment_link VARCHAR(555);');
    await pool.query('ALTER TABLE software ADD COLUMN IF NOT EXISTS document_url VARCHAR(555);');
    
    // Add file fields to chats table for attachments
    await pool.query('ALTER TABLE chats ADD COLUMN IF NOT EXISTS file_url VARCHAR(555);');
    await pool.query('ALTER TABLE chats ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);');
  } catch (error) {
    console.error('Critical Error during database initialization:', error);
  }
};
