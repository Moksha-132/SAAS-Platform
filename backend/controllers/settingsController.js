import pool from '../config/db.js';

export const getSettings = async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT value FROM website_settings WHERE key = 'syncsaas_website_settings'"
    );
    if (rows.length === 0) {
      return res.json({ success: true, settings: null });
    }
    res.json({ success: true, settings: rows[0].value });
  } catch (error) {
    next(error);
  }
};

export const saveSettings = async (req, res, next) => {
  try {
    const { settings } = req.body;
    if (!settings) {
      return res.status(400).json({ message: 'Settings object is required.' });
    }
    await pool.query(
      `INSERT INTO website_settings (key, value) 
       VALUES ('syncsaas_website_settings', $1) 
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
      [JSON.stringify(settings)]
    );
    if (req.io) {
      req.io.emit('settings_updated', settings);
    }
    res.json({ success: true, message: 'Settings saved successfully.' });
  } catch (error) {
    next(error);
  }
};
