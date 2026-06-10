require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const morgan = require('morgan');
const winston = require('winston');
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const compression = require('compression');
const { google } = require('googleapis');

const app = express();
const PORT = process.env.PORT || 3000;

// Winston Logger configuration for logging errors
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: path.join(__dirname, '..', 'logs', 'error.log'), level: 'error' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Ensure assets/documents directory exists
const docsDir = path.join(__dirname, '..', 'assets', 'documents');
if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(path.join(__dirname, '..', 'assets'), { recursive: true });
  fs.mkdirSync(docsDir, { recursive: true });
}

// Database instance
let db;

// ==================== GOOGLE SHEETS INTEGRATION ====================
let googleSheetsClient = null;

async function getGoogleSheetsClient() {
  if (googleSheetsClient) return googleSheetsClient;
  
  const credentialsPath = path.join(__dirname, '..', 'google-credentials.json');
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const credentialsEnv = process.env.GOOGLE_CREDENTIALS_JSON;
  
  if (!sheetId) {
    return null;
  }

  if (!fs.existsSync(credentialsPath) && !credentialsEnv) {
    return null;
  }
  
  try {
    let authConfig;
    if (fs.existsSync(credentialsPath)) {
      authConfig = {
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      };
    } else {
      authConfig = {
        credentials: JSON.parse(credentialsEnv),
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
      };
    }

    const auth = new google.auth.GoogleAuth(authConfig);
    const authClient = await auth.getClient();
    googleSheetsClient = google.sheets({ version: 'v4', auth: authClient });
    return googleSheetsClient;
  } catch (error) {
    logger.error('Failed to initialize Google Sheets client:', error);
    return null;
  }
}

async function logLeadToGoogleSheets(lead) {
  try {
    const sheets = await getGoogleSheetsClient();
    if (!sheets) return;

    const sheetId = process.env.GOOGLE_SHEET_ID;

    // Dynamically retrieve the spreadsheet tabs to handle localized default names (e.g., 'Trang tính 1')
    let tabName = process.env.GOOGLE_SHEET_TAB_NAME || '';
    try {
      const metadata = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
      const sheetsList = metadata.data.sheets || [];
      const tabExists = sheetsList.some(s => s.properties.title === tabName);
      if ((!tabName || !tabExists) && sheetsList.length > 0) {
        tabName = sheetsList[0].properties.title;
      }
    } catch (e) {
      logger.error('Failed to query spreadsheet metadata, using configured tab name:', e.message);
    }

    if (!tabName) tabName = 'Sheet1';

    // Wrap the tab name in single quotes to handle sheet names with spaces/numbers correctly
    const quotedTab = `'${tabName}'`;

    // Check if the sheet already has headers in row 1
    let hasHeaders = false;
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${quotedTab}!A1:G1`,
      });
      if (response.data.values && response.data.values.length > 0 && response.data.values[0][0]) {
        hasHeaders = true;
      }
    } catch (e) {
      // If range is empty or not parsed, we assume no headers yet
      logger.error('Warning checking headers (will try initializing):', e.message);
    }

    // Initialize headers if they do not exist
    if (!hasHeaders) {
      const headers = ['Thời gian', 'Phân loại', 'Họ và tên', 'Số điện thoại', 'Email', 'Tuổi', 'Chi tiết khác'];
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: `${quotedTab}!A1:G1`,
          valueInputOption: 'USER_ENTERED',
          resource: {
            values: [headers]
          }
        });
        console.log(`Google Sheet headers initialized successfully on tab: ${tabName}`);
      } catch (e) {
        logger.error('Failed to initialize Google Sheet headers:', e);
      }
    }

    const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    const row = [
      timestamp,
      lead.type || 'unknown',
      lead.name || '',
      lead.phone || '',
      lead.email || '',
      lead.age !== undefined ? lead.age : '',
      lead.details || ''
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${quotedTab}!A:G`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [row]
      }
    });
    console.log(`Lead logged to Google Sheet successfully: ${lead.email || lead.phone || lead.name}`);
  } catch (error) {
    logger.error('Error logging lead to Google Sheets:', error);
  }
}

// Initialize SQLite Database
async function initDatabase() {
  try {
    const dbPath = process.env.DATABASE_PATH || path.join(__dirname, '..', 'leads.db');
    
    // Ensure parent directory for database exists if custom path is set
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Create leads table
    await db.exec(`
      CREATE TABLE IF NOT EXISTS leads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,          -- 'contact', 'document', 'quote'
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        age INTEGER,
        details TEXT,                -- Stores document ID, selected tier, or JSON details
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create Indexes for fast querying as requested
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_leads_type ON leads(type)`);

    console.log('Database initialized successfully with indexes.');
  } catch (error) {
    logger.error('Failed to initialize database (running in no-db/serverless mode):', error.message);
  }
}

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // HTTP request logging

// Serve Static Frontend files
app.use(express.static(path.join(__dirname, '..')));

// Rate Limiter: Max 5 requests per minute per IP to prevent spam
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: {
    success: false,
    message: 'Số yêu cầu vượt quá giới hạn. Vui lòng thử lại sau 1 phút.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiter to all API endpoints
app.use('/api/', apiLimiter);

// Nodemailer SMTP Transporter
function getMailTransporter() {
  // Check if SMTP details are configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

// Document configuration mapping
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

// ==================== API ENDPOINTS ====================

// 1. API: Contact Form Submission ("Trò chuyện cùng chuyên gia")
app.post('/api/leads/contact', async (req, res) => {
  const { name, phone, email } = req.body;

  // Server-side validation
  if (!name || !phone || !email) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  // Clean phone number (digits only)
  const cleanedPhone = phone.replace(/[\s.-]/g, '');
  if (!/^0[0-9]{9}$/.test(cleanedPhone)) {
    return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ.' });
  }

  try {
    // Insert into Database (optional/non-blocking for serverless hosting)
    try {
      if (db) {
        await db.run(
          'INSERT INTO leads (type, name, phone, email) VALUES (?, ?, ?, ?)',
          ['contact', name, cleanedPhone, email]
        );
      }
    } catch (dbErr) {
      logger.error('SQLite contact insert failed:', dbErr.message);
    }

    // Log to Google Sheets
    logLeadToGoogleSheets({ type: 'contact', name, phone: cleanedPhone, email }).catch(err => {
      logger.error('Failed to log contact lead to Google Sheets:', err);
    });

    // Send Alert Emails
    const transporter = getMailTransporter();
    if (transporter) {
      // 1. Alert Email to Admin
      const adminMailOptions = {
        from: `"${process.env.SENDER_NAME || 'MCONIC'}" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || 'hello@mconic.vn',
        subject: `[LEAD MỚI] Yêu cầu tư vấn từ ${name}`,
        html: `
          <h3>Thông tin khách hàng mới đăng ký tư vấn:</h3>
          <p><strong>Họ và tên:</strong> ${name}</p>
          <p><strong>Số điện thoại:</strong> ${cleanedPhone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
        `
      };
      transporter.sendMail(adminMailOptions).catch(err => {
        logger.error('Failed to send admin contact email notification:', err);
      });

      // 2. Confirmation Email to User
      const userMailOptions = {
        from: `"${process.env.SENDER_NAME || 'MCONIC'}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Xác nhận yêu cầu tư vấn sự kiện - MCONIC`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #161310; max-width: 600px; margin: 0 auto; border: 2px solid #161310; padding: 2rem; border-radius: 12px; background-color: #FBF6EE; box-shadow: 6px 6px 0 #161310;">
            <h2 style="color: #D32F2F; text-transform: uppercase; margin-bottom: 1.5rem; font-family: sans-serif; font-weight: bold;">MCONIC Event Agency</h2>
            <p>Xin chào <strong>${name}</strong>,</p>
            <p>Cảm ơn bạn đã quan tâm và gửi yêu cầu tư vấn tổ chức sự kiện tại MCONIC.</p>
            <p>Chúng tôi đã tiếp nhận thông tin yêu cầu của bạn:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA; font-weight: bold; width: 150px;">Họ và tên:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA; font-weight: bold;">Số điện thoại:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA;">${cleanedPhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA; font-weight: bold;">Email liên hệ:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA;">${email}</td>
              </tr>
            </table>
            <p>Đội ngũ của chúng tôi sẽ phân tích sơ bộ và chủ động liên hệ lại với bạn qua số điện thoại trên trong vòng <strong>24 giờ làm việc</strong> để tư vấn phương án thiết kế cũng như gửi kèm file đánh giá rủi ro (Risk Assessment) hoàn toàn miễn phí.</p>
            <p>Nếu bạn cần thảo luận gấp, vui lòng liên hệ trực tiếp hotline 24/7 của chúng tôi: <strong>0901 234 567</strong>.</p>
            <br>
            <p style="border-top: 2px solid #E3DACA; padding-top: 1rem; font-size: 0.85rem; color: #8A8074; margin-top: 1.5rem;">
              © 2026 MCONIC Event Agency · Địa chỉ: Tòa nhà MCONIC, 123 Nguyễn Văn A, Q.1, TP.HCM
            </p>
          </div>
        `
      };
      transporter.sendMail(userMailOptions).catch(err => {
        logger.error('Failed to send user contact confirmation email:', err);
      });
    }

    return res.status(200).json({ success: true, message: 'Yêu cầu tư vấn đã được tiếp nhận thành công!' });
  } catch (error) {
    logger.error('Error handling contact form submission:', error);
    return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi trên hệ thống. Vui lòng thử lại sau.' });
  }
});

// 2. API: Document Request Form Submission ("Tài liệu chuyên môn")
app.post('/api/leads/document', async (req, res) => {
  const { name, email, docId } = req.body;

  if (!name || !email || !docId) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  const docConfig = DOCUMENTS_MAP[docId];
  if (!docConfig) {
    return res.status(400).json({ success: false, message: 'Tài liệu yêu cầu không hợp lệ.' });
  }

  const docPath = path.join(docsDir, docConfig.file);
  if (!fs.existsSync(docPath)) {
    logger.error(`Document file not found at path: ${docPath}`);
    return res.status(404).json({ success: false, message: 'Tài liệu này hiện chưa sẵn sàng trên hệ thống. Vui lòng quay lại sau.' });
  }

  try {
    // Insert into Database (optional/non-blocking for serverless hosting)
    try {
      if (db) {
        await db.run(
          'INSERT INTO leads (type, name, email, details) VALUES (?, ?, ?, ?)',
          ['document', name, email, docId]
        );
      }
    } catch (dbErr) {
      logger.error('SQLite document insert failed:', dbErr.message);
    }

    // Log to Google Sheets
    logLeadToGoogleSheets({ type: 'document', name, email, details: docId }).catch(err => {
      logger.error('Failed to log document lead to Google Sheets:', err);
    });

    // Send Document Email to User (non-blocking)
    const transporter = getMailTransporter();
    if (transporter) {
      const mailOptions = {
        from: `"${process.env.SENDER_NAME || 'MCONIC'}" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `Tài liệu của bạn: ${docConfig.title} - MCONIC`,
        html: `
          <h3>Xin chào ${name},</h3>
          <p>Cảm ơn bạn đã quan tâm đến tài liệu chuyên môn của MCONIC Event Agency.</p>
          <p>Chúng tôi xin gửi kèm tài liệu <strong>${docConfig.title}</strong> mà bạn đã yêu cầu ở file đính kèm dưới đây.</p>
          <p>Nếu bạn cần tư vấn thêm về dịch vụ tổ chức sự kiện trọn gói, vui lòng liên hệ hotline <strong>0901 234 567</strong>.</p>
          <br>
          <p>Trân trọng,</p>
          <p><strong>Đội ngũ MCONIC</strong></p>
        `,
        attachments: [{
          filename: docConfig.file,
          path: docPath
        }]
      };

      transporter.sendMail(mailOptions).catch(err => {
        logger.error('Failed to send document email to user:', err);
      });
    }

    return res.status(200).json({ success: true, message: 'Tài liệu đã được gửi tới email của bạn thành công!' });
  } catch (error) {
    logger.error('Error handling document request:', error);
    return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi trên hệ thống. Vui lòng thử lại sau.' });
  }
});

// 3. API: Insurance Quote Form Submission ("Hạng thẻ bảo hiểm")
app.post('/api/leads/quote', async (req, res) => {
  const { name, phone, age, recommendedTier } = req.body;

  if (!name || !phone || isNaN(age)) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  const cleanedPhone = phone.replace(/[\s.-]/g, '');
  if (!/^0[0-9]{9}$/.test(cleanedPhone)) {
    return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ.' });
  }

  try {
    // Insert into Database (optional/non-blocking for serverless hosting)
    try {
      if (db) {
        await db.run(
          'INSERT INTO leads (type, name, phone, age, details) VALUES (?, ?, ?, ?, ?)',
          ['quote', name, cleanedPhone, parseInt(age), recommendedTier || 'N/A']
        );
      }
    } catch (dbErr) {
      logger.error('SQLite quote insert failed:', dbErr.message);
    }

    // Log to Google Sheets
    logLeadToGoogleSheets({ type: 'quote', name, phone: cleanedPhone, age: parseInt(age), details: recommendedTier || 'N/A' }).catch(err => {
      logger.error('Failed to log quote lead to Google Sheets:', err);
    });

    // Send Alert Email to Admin
    const transporter = getMailTransporter();
    if (transporter) {
      const adminMailOptions = {
        from: `"${process.env.SENDER_NAME || 'MCONIC Protect'}" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || 'hello@mconic.vn',
        subject: `[LEAD BẢO HIỂM] Yêu cầu báo giá từ ${name}`,
        html: `
          <h3>Thông tin khách hàng tính phí bảo hiểm:</h3>
          <p><strong>Họ và tên:</strong> ${name}</p>
          <p><strong>Số điện thoại:</strong> ${cleanedPhone}</p>
          <p><strong>Tuổi:</strong> ${age}</p>
          <p><strong>Gói thẻ đề xuất:</strong> ${recommendedTier || 'N/A'}</p>
          <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
        `
      };
      transporter.sendMail(adminMailOptions).catch(err => {
        logger.error('Failed to send admin quote email notification:', err);
      });
    }

    return res.status(200).json({ success: true, message: 'Yêu cầu tính phí bảo hiểm đã được lưu và gửi tới chuyên viên!' });
  } catch (error) {
    logger.error('Error handling quote form submission:', error);
    return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi trên hệ thống. Vui lòng thử lại sau.' });
  }
});

// 4. API: Admin GET Leads (Basic secure route for viewing logs)
app.get('/api/admin/leads', async (req, res) => {
  // Simple check for basic authorization or password (can be configured in production)
  const token = req.query.token;
  if (!token || token !== process.env.ADMIN_TOKEN) {
    // If token is missing/wrong, return unauthorized
    return res.status(401).json({ success: false, message: 'Chưa được cấp quyền truy cập.' });
  }

  try {
    if (!db) {
      return res.status(200).json({ success: true, count: 0, data: [], message: 'SQLite database is offline (running in serverless mode).' });
    }
    const rows = await db.all('SELECT * FROM leads ORDER BY created_at DESC');
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    logger.error('Error fetching leads from database:', error);
    return res.status(500).json({ success: false, message: 'Lỗi truy xuất cơ sở dữ liệu.' });
  }
});

// Export app for serverless platforms like Vercel
module.exports = app;

// Initialize database and start the server only if run directly (not as a module on serverless)
if (require.main === module) {
  initDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
    });
  });
} else {
  // Trigger database initialization asynchronously in the background for serverless warmups
  initDatabase();
}
