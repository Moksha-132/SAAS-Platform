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
      await pool.query(sqlSchema);
      console.log('PostgreSQL database tables created successfully.');
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
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_spend DECIMAL(10, 2) DEFAULT 49.00;');
    await pool.query('ALTER TABLE software ADD COLUMN IF NOT EXISTS deployment_link VARCHAR(555);');
    await pool.query('ALTER TABLE software ADD COLUMN IF NOT EXISTS document_url VARCHAR(555);');
    await pool.query('ALTER TABLE chats ADD COLUMN IF NOT EXISTS file_url VARCHAR(555);');
    await pool.query('ALTER TABLE chats ADD COLUMN IF NOT EXISTS file_name VARCHAR(255);');
    await pool.query('CREATE TABLE IF NOT EXISTS website_settings (key VARCHAR(255) PRIMARY KEY, value JSONB NOT NULL);');
    await pool.query(`CREATE TABLE IF NOT EXISTS password_reset_tokens (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      token VARCHAR(255) NOT NULL,
      expires_at TIMESTAMP NOT NULL
    );`);
  } catch (error) {
    console.error('Critical Error during database initialization:', error);
  }
};