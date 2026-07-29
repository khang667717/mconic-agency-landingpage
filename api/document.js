const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// HTML escape function to prevent email injection and XSS
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Environment variables
const getEnvVars = () => ({
  googleSheetId: process.env.GOOGLE_SHEET_ID,
  googleCredentials: process.env.GOOGLE_CREDENTIALS_JSON,
  googleTabName: process.env.GOOGLE_SHEET_TAB_NAME || 'Trang tính1',
  smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
  smtpPort: parseInt(process.env.SMTP_PORT || '587'),
  smtpSecure: process.env.SMTP_SECURE === 'true',
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  senderName: process.env.SENDER_NAME || 'MCONIC Event Agency'
});

// Document mapping
const DOCUMENTS_MAP = {
  'company-profile': {
    file: 'company-profile.pdf',
    title: 'MCONIC Company Profile 2026'
  },
  'event-checklist': {
    file: 'event-checklist.pdf',
    title: 'MCONIC Event Master Checklist'
  },
  'industry-report': {
    file: 'industry-report.pdf',
    title: 'MCONIC Báo cáo Ngành 2026'
  }
};

// Google Sheets client (same as contact.js)
let googleSheetsClient = null;

async function getGoogleSheetsClient() {
  if (googleSheetsClient) return googleSheetsClient;
  
  const env = getEnvVars();
  if (!env.googleSheetId || !env.googleCredentials) {
    return null;
  }
  
  try {
    const parsedCreds = JSON.parse(env.googleCredentials);
    if (parsedCreds && parsedCreds.private_key) {
      parsedCreds.private_key = parsedCreds.private_key.replace(/\\n/g, '\n');
    }
    
    const auth = new google.auth.GoogleAuth({
      credentials: parsedCreds,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    const authClient = await auth.getClient();
    googleSheetsClient = google.sheets({ version: 'v4', auth: authClient });
    return googleSheetsClient;
  } catch (error) {
    console.error('Failed to initialize Google Sheets client:', error);
    return null;
  }
}

async function logLeadToGoogleSheets(lead) {
  try {
    const sheets = await getGoogleSheetsClient();
    const env = getEnvVars();
    
    if (!sheets || !env.googleSheetId) return;

    const quotedTab = `'${env.googleTabName}'`;
    const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    const row = [
      timestamp,
      lead.type || 'document',
      lead.name || '',
      lead.phone || '',
      lead.email || '',
      lead.age !== undefined ? lead.age : '',
      lead.details || ''
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: env.googleSheetId,
      range: `${quotedTab}!A:G`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [row] }
    });
    
    console.log('Document lead logged to Google Sheet successfully');
  } catch (error) {
    console.error('Error logging document lead to Google Sheets:', error);
  }
}

function getMailTransporter() {
  const env = getEnvVars();
  if (!env.smtpUser || !env.smtpPass) {
    return null;
  }
  
  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPass
    }
  });
}

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { name, email, docId } = req.body;

  if (!name || !email || !docId) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  // Security: Validate docId to prevent directory traversal attacks
  // Only allow alphanumeric, hyphens, and underscores
  if (!/^[a-zA-Z0-9_-]+$/.test(docId)) {
    return res.status(400).json({ success: false, message: 'Tài liệu yêu cầu không hợp lệ.' });
  }

  const docConfig = DOCUMENTS_MAP[docId];
  if (!docConfig) {
    return res.status(400).json({ success: false, message: 'Tài liệu yêu cầu không hợp lệ.' });
  }

  // For Vercel serverless, we'll just log the request and send confirmation email
  // Documents would need to be uploaded to Vercel or served from external storage

  try {
    const env = getEnvVars();
    
    // Log to Google Sheets (non-blocking)
    try {
      await logLeadToGoogleSheets({ 
        type: 'document', 
        name, 
        email, 
        details: docId 
      });
      console.log('Document request logged to Google Sheets');
    } catch (err) {
      console.error('Failed to log to Google Sheets:', err);
      // Continue processing even if Sheets fails
    }

    // Send confirmation email
    const transporter = getMailTransporter();
    if (transporter) {
      const mailOptions = {
        from: `"${env.senderName}" <${env.smtpUser}>`,
        to: email,
        subject: `Yêu cầu tài liệu: ${escapeHtml(docConfig.title)} - MCONIC`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #161310; max-width: 600px; margin: 0 auto; border: 2px solid #161310; padding: 2rem; border-radius: 12px; background-color: #FBF6EE;">
            <h2 style="color: #D32F2F; text-transform: uppercase; margin-bottom: 1.5rem;">MCONIC Event Agency</h2>
            <p>Xin chào <strong>${escapeHtml(name)}</strong>,</p>
            <p>Cảm ơn bạn đã quan tâm đến tài liệu <strong>${escapeHtml(docConfig.title)}</strong>.</p>
            <p>Chúng tôi đã ghi nhận yêu cầu của bạn và sẽ gửi tài liệu qua email trong thời gian sớm nhất.</p>
            <p>Nếu cần hỗ trợ thêm, vui lòng liên hệ: <strong>0901 234 567</strong></p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log('Document confirmation email sent');
      } catch (err) {
        console.error('Failed to send document email:', err);
        // Don't fail the request if email fails
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Yêu cầu tài liệu đã được ghi nhận. Chúng tôi sẽ gửi tài liệu qua email sớm nhất!' 
    });
    
  } catch (error) {
    console.error('Error handling document request:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Đã xảy ra lỗi trên hệ thống. Vui lòng thử lại sau.' 
    });
  }
};