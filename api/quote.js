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
      const decoded = Buffer.from(
        process.env.GOOGLE_CREDENTIALS_BASE64, 
        'base64'
      ).toString('utf-8');
      
      // Validate it's valid JSON before using
      JSON.parse(decoded);
      googleCredentials = decoded;
      console.log('✅ Base64 credentials decoded successfully');
    } catch (e) {
      console.warn('❌ Failed to decode/validate Base64 credentials:', e.message);
      // Continue to fallback methods
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
    senderName: process.env.SENDER_NAME || 'MCONIC Protect'
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
      lead.type || 'quote',
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
    
    console.log('✅ Insurance quote logged to Google Sheets - Updated Range:', appendResponse.data.updates?.updatedRange);
  } catch (error) {
    console.error('❌ Error logging insurance quote to Google Sheets:', error.message);
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

  const { name, phone, age, recommendedTier } = req.body;

  if (!name || !phone || isNaN(age)) {
    return res.status(400).json({ success: false, message: 'Vui lòng cung cấp đầy đủ thông tin.' });
  }

  const cleanedPhone = phone.replace(/[\s.-]/g, '');
  if (!/^0[0-9]{9}$/.test(cleanedPhone)) {
    return res.status(400).json({ success: false, message: 'Số điện thoại không hợp lệ.' });
  }

  try {
    const env = getEnvVars();
    
    // Log to Google Sheets (non-blocking)
    try {
      await logLeadToGoogleSheets({ 
        type: 'quote', 
        name, 
        phone: cleanedPhone, 
        age: parseInt(age), 
        details: recommendedTier || 'N/A' 
      });
      console.log('Insurance quote logged to Google Sheets');
    } catch (err) {
      console.error('Failed to log to Google Sheets:', err);
      // Continue processing even if Sheets fails
    }

    // Send admin notification email
    const transporter = getMailTransporter();
    if (transporter) {
      const adminMailOptions = {
        from: `"${env.senderName}" <${env.smtpUser}>`,
        to: env.adminEmail,
        subject: `[LEAD BẢO HIỂM] Yêu cầu báo giá từ ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #161310; max-width: 600px; margin: 0 auto; border: 2px solid #161310; padding: 2rem; border-radius: 12px; background-color: #FBF6EE;">
            <h2 style="color: #D32F2F; text-transform: uppercase; margin-bottom: 1.5rem;">MCONIC Protect - Lead Bảo Hiểm</h2>
            <h3>Thông tin khách hàng tính phí bảo hiểm:</h3>
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
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA; font-weight: bold;">Tuổi:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA;">${age}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA; font-weight: bold;">Gói thẻ đề xuất:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA;">${recommendedTier || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Thời gian:</td>
                <td style="padding: 8px 0;">${new Date().toLocaleString('vi-VN')}</td>
              </tr>
            </table>
            <p style="margin-top: 1.5rem; padding-top: 1rem; border-top: 2px solid #E3DACA; font-size: 0.9rem; color: #8A8074;">
              Vui lòng liên hệ khách hàng trong vòng 24h để tư vấn chi tiết về gói bảo hiểm phù hợp.
            </p>
          </div>
        `
      };

      try {
        await transporter.sendMail(adminMailOptions);
        console.log('Insurance quote admin notification sent');
      } catch (err) {
        console.error('Failed to send admin notification:', err);
        // Don't fail the request if email fails
      }
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Yêu cầu tính phí bảo hiểm đã được lưu và gửi tới chuyên viên!' 
    });
    
  } catch (error) {
    console.error('Error handling quote form submission:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Đã xảy ra lỗi trên hệ thống. Vui lòng thử lại sau.' 
    });
  }
};
