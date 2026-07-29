const { google } = require('googleapis');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Environment variables
const getEnvVars = () => {
  let googleCredentials = process.env.GOOGLE_CREDENTIALS_JSON;
  
  // Try Base64 decode first (preferred method)
  if (!googleCredentials && process.env.GOOGLE_CREDENTIALS_BASE64) {
    try {
      googleCredentials = Buffer.from(
        process.env.GOOGLE_CREDENTIALS_BASE64, 
        'base64'
      ).toString('utf-8');
      console.log('✅ Base64 credentials decoded successfully');
    } catch (e) {
      console.warn('❌ Failed to decode Base64 credentials:', e.message);
    }
  }
  
  // Fallback: try to build from parts
  if (!googleCredentials) {
    const part1 = process.env.GOOGLE_PRIVATE_KEY_PART1 || '';
    const part2 = process.env.GOOGLE_PRIVATE_KEY_PART2 || '';
    
    if (part1 && part2) {
      const privateKey = part1 + part2;
      googleCredentials = JSON.stringify({
        type: process.env.GOOGLE_CREDENTIALS_TYPE || 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: privateKey,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: process.env.GOOGLE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
        token_uri: process.env.GOOGLE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.GOOGLE_CERT_URL,
        universe_domain: 'googleapis.com'
      });
      console.log('✅ Credentials built from PART1+PART2');
    } else {
      // Try reading from file
      try {
        const credPath = path.join(process.cwd(), 'google-credentials.json');
        if (fs.existsSync(credPath)) {
          googleCredentials = fs.readFileSync(credPath, 'utf-8');
          console.log('✅ Credentials loaded from file');
        }
      } catch (e) {
        console.warn('❌ Could not read google-credentials.json from file');
      }
    }
  }
  
  return {
    googleSheetId: process.env.GOOGLE_SHEET_ID,
    googleCredentials: googleCredentials,
    googleTabName: process.env.GOOGLE_SHEET_TAB_NAME || 'Trang tính1',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpPort: parseInt(process.env.SMTP_PORT || '587'),
    smtpSecure: process.env.SMTP_SECURE === 'true',
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    adminEmail: process.env.ADMIN_EMAIL,
    senderName: process.env.SENDER_NAME || 'MCONIC Event Agency'
  };
};

// Google Sheets client
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

    // Check if headers exist and initialize if needed
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: env.googleSheetId,
        range: `${quotedTab}!A1:G1`,
      });
      
      const hasHeaders = response.data.values && response.data.values.length > 0;
      
      if (!hasHeaders) {
        const headers = ['Thời gian', 'Phân loại', 'Họ và tên', 'Số điện thoại', 'Email', 'Tuổi', 'Chi tiết khác'];
        await sheets.spreadsheets.values.update({
          spreadsheetId: env.googleSheetId,
          range: `${quotedTab}!A1:G1`,
          valueInputOption: 'USER_ENTERED',
          resource: { values: [headers] }
        });
        console.log('✅ Google Sheet headers initialized');
      }
    } catch (e) {
      console.warn('Headers check failed, will reinitialize:', e.message);
      const headers = ['Thời gian', 'Phân loại', 'Họ và tên', 'Số điện thoại', 'Email', 'Tuổi', 'Chi tiết khác'];
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId: env.googleSheetId,
          range: `${quotedTab}!A1:G1`,
          valueInputOption: 'USER_ENTERED',
          resource: { values: [headers] }
        });
      } catch (err) {
        console.error('Failed to initialize headers:', err.message);
      }
    }

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

    console.log('📝 Appending row to Google Sheets:', row);

    // Use append() on the entire sheet - it will find the next empty row
    const appendResponse = await sheets.spreadsheets.values.append({
      spreadsheetId: env.googleSheetId,
      range: `${quotedTab}!A:G`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [row] }
    });
    
    console.log('✅ Document request logged to Google Sheets - Updated Range:', appendResponse.data.updates?.updatedRange);
  } catch (error) {
    console.error('❌ Error logging document request to Google Sheets:', error.message);
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

  const docConfig = DOCUMENTS_MAP[docId];
  if (!docConfig) {
    return res.status(400).json({ success: false, message: 'Tài liệu yêu cầu không hợp lệ.' });
  }

  const docsDir = path.join(process.cwd(), 'assets', 'documents');
  const docPath = path.join(docsDir, docConfig.file);
  
  if (!fs.existsSync(docPath)) {
    console.error(`Document file not found at path: ${docPath}`);
    return res.status(404).json({ success: false, message: 'Tài liệu này hiện chưa sẵn sàng trên hệ thống. Vui lòng quay lại sau.' });
  }

  try {
    const env = getEnvVars();
    
    // Log to Google Sheets
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
    }

    // Send document to user
    const transporter = getMailTransporter();
    if (transporter) {
      const mailOptions = {
        from: `"${env.senderName}" <${env.smtpUser}>`,
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

      try {
        await transporter.sendMail(mailOptions);
        console.log('Document email sent successfully');
      } catch (err) {
        console.error('Failed to send document email:', err);
      }
    }

    return res.status(200).json({ success: true, message: 'Tài liệu đã được gửi tới email của bạn thành công!' });
  } catch (error) {
    console.error('Error handling document request:', error);
    return res.status(500).json({ success: false, message: 'Đã xảy ra lỗi trên hệ thống. Vui lòng thử lại sau.' });
  }
};
