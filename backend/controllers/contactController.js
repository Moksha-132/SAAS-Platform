import nodemailer from 'nodemailer';
import pool from '../config/db.js';

export const handleContactSubmission = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ success: false, message: 'Email and Message fields are required.' });
    }

    // 1. Fetch contact email dynamically from database settings
    let targetAdminEmail = process.env.EMAIL_USER || 'info@shnoor.com';
    try {
      const { rows } = await pool.query(
        "SELECT value FROM website_settings WHERE key = 'syncsaas_website_settings'"
      );
      if (rows.length > 0 && rows[0].value && rows[0].value.contactEmail) {
        targetAdminEmail = rows[0].value.contactEmail;
      }
    } catch (dbErr) {
      console.error('Error fetching admin email from database settings, using fallback:', dbErr);
    }

    // 2. Create the transporter with standard secure credentials
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const emailSubject = subject ? `Contact Request: ${subject}` : `New Contact Form Submission from ${name || 'Visitor'}`;

    // 3. Dispatch the mail
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail({
        from: `"SaaS Platform Contact Center" <${process.env.EMAIL_USER}>`,
        to: targetAdminEmail,
        replyTo: email,
        subject: emailSubject,
        html: `
          <div style="font-family:sans-serif;max-width:550px;margin:auto;padding:32px;background:#f8fafc;border-radius:24px;border:1px solid #e2e8f0;box-shadow:0 4px 6px -1px rgba(0,0,0,0.05)">
            <h2 style="color:#0f172a;font-size:22px;font-weight:800;margin-bottom:6px;letter-spacing:-0.5px">New Contact Submission</h2>
            <p style="color:#64748b;font-size:14px;margin-bottom:24px;font-weight:500">A visitor sent a request from the platform contact portal.</p>
            
            <div style="background:#ffffff;padding:20px;border-radius:16px;border:1px solid #f1f5f9;margin-bottom:24px">
              <table style="width:100%;border-collapse:collapse">
                <tr>
                  <td style="padding:6px 0;font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase;width:120px">Sender Name:</td>
                  <td style="padding:6px 0;font-size:14px;font-weight:700;color:#0f172a">${name || 'Anonymous Visitor'}</td>
                </tr>
                <tr>
                  <td style="padding:6px 0;font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase">Email Address:</td>
                  <td style="padding:6px 0;font-size:14px;font-weight:700;color:#f97316"><a href="mailto:${email}" style="color:#f97316;text-decoration:none">${email}</a></td>
                </tr>
                ${subject ? `
                <tr>
                  <td style="padding:6px 0;font-size:13px;font-weight:700;color:#94a3b8;text-transform:uppercase">Subject:</td>
                  <td style="padding:6px 0;font-size:14px;font-weight:700;color:#0f172a">${subject}</td>
                </tr>
                ` : ''}
              </table>
            </div>

            <div style="background:#f1f5f9;padding:20px;border-radius:16px;margin-bottom:12px">
              <p style="margin:0 0 6px 0;font-size:11px;font-weight:800;color:#64748b;text-transform:uppercase">Message Body:</p>
              <p style="margin:0;font-size:14px;line-height:1.6;color:#334155;white-space:pre-wrap">${message}</p>
            </div>
            
            <p style="color:#94a3b8;font-size:11px;margin-top:24px;text-align:center">This email was dispatched automatically via SyncSaaS Platform SMTP.</p>
          </div>
        `
      });
    } else {
      // In development / testing environment without SMTP
      console.log(`[DEV EMAIL] Contact submission by ${name} (${email}): [${emailSubject}] -> ${message}`);
    }

    res.json({ success: true, message: 'Your message has been successfully sent to support! We will get back to you shortly.' });
  } catch (error) {
    next(error);
  }
};
