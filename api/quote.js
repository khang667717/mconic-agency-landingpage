const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// Sanitize email subject to prevent header injection
function sanitizeEmailSubject(subject) {
  return subject.replace(/[\r\n\t]/g, ' ').trim();
}

// HTML escape function to prevent email injection and XSS
function escapeHtmlEmail(text) {
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
  adminEmail: process.env.ADMIN_EMAIL,
  senderName: process.env.SENDER_NAME || 'MCONIC Protect'
});

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

    // Check if headers exist
    let hasHeaders = false;
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: env.googleSheetId,
        range: `${quotedTab}!A1:G1`,
      });
      if (response.data.values && response.data.values.length > 0 && response.data.values[0][0]) {
        hasHeaders = true;
      }
    } catch (e) {
      console.log('Headers check failed, will initialize');
    }

    // Initialize headers if needed
    if (!hasHeaders) {
      const headers = ['Thời gian', 'Phân loại', 'Họ và tên', 'Số điện thoại', 'Email', 'Tuổi', 'Chi tiết khác'];
      try {
        await sheets.spreadsheets.values.update({
          spreadsheetId: env.googleSheetId,
          range: `${quotedTab}!A1:G1`,
          valueInputOption: 'USER_ENTERED',
          resource: { values: [headers] }
        });
        console.log('Google Sheet headers initialized successfully');
      } catch (e) {
        console.error('Failed to initialize headers:', e);
      }
    }

    // Check if this is a quote update (has phone and age) on existing contact row
    if (lead.type === 'quote' && lead.phone && lead.age !== undefined) {
      try {
        // Get all data to find matching row
        const allDataResponse = await sheets.spreadsheets.values.get({
          spreadsheetId: env.googleSheetId,
          range: `${quotedTab}!A:G`,
        });
        
        const allRows = allDataResponse.data.values || [];
        let matchingRowData = null;
        let matchingRowIndex = -1;

        // Find row with same name and phone (case-insensitive, trim spaces)
        // Start from row 2 (index 1) since row 1 is headers
        for (let i = 1; i < allRows.length; i++) {
          const row = allRows[i];
          const rowName = (row[2] || '').trim().toLowerCase();
          const rowPhone = (row[3] || '').trim();
          
          if (rowName === lead.name.toLowerCase().trim() && rowPhone === lead.phone) {
            matchingRowData = row;
            matchingRowIndex = i + 1; // A1 notation is 1-indexed (row 2 = index 1, so +1)
            console.log(`Found matching row at index ${matchingRowIndex}: ${rowName} - ${rowPhone}`);
            console.log(`Existing email in row: ${row[4]}`);
            break;
          }
        }

        if (matchingRowIndex > 0 && matchingRowData) {
          // Update existing row: preserve email, add/update age and details
          // IMPORTANT: matchingRowData[4] contains the email from the existing contact row - ALWAYS use it
          const preservedEmail = matchingRowData[4] || ''; // Get email from existing row (will be preserved)
          const updateRow = [
            new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }), // A: Thời gian
            'quote', // B: Phân loại (updated to quote)
            lead.name || '', // C: Họ và tên
            lead.phone || '', // D: Số điện thoại
            preservedEmail, // E: Email (PRESERVED - never overwrite with empty string)
            lead.age !== undefined ? lead.age : '', // F: Tuổi
            lead.details || '' // G: Chi tiết khác
          ];

          await sheets.spreadsheets.values.update({
            spreadsheetId: env.googleSheetId,
            range: `${quotedTab}!A${matchingRowIndex}:G${matchingRowIndex}`,
            valueInputOption: 'USER_ENTERED',
            resource: { values: [updateRow] }
          });

          console.log(`Insurance quote updated existing row ${matchingRowIndex}, email preserved: ${matchingRowData[4]}`);
          return;
        }
      } catch (e) {
        console.error('Error searching for matching row:', e);
        // Fall through to append if search fails
      }
    }

    // No matching row found or this is initial contact - append new row
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

    await sheets.spreadsheets.values.append({
      spreadsheetId: env.googleSheetId,
      range: `${quotedTab}!A:G`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [row] }
    });
    
    console.log('Insurance quote logged to Google Sheet successfully');
  } catch (error) {
    console.error('Error logging insurance quote to Google Sheets:', error);
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
        subject: `[LEAD BẢO HIỂM] Yêu cầu báo giá từ ${escapeHtml(name)}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #161310; max-width: 600px; margin: 0 auto; border: 2px solid #161310; padding: 2rem; border-radius: 12px; background-color: #FBF6EE;">
            <h2 style="color: #D32F2F; text-transform: uppercase; margin-bottom: 1.5rem;">MCONIC Protect - Lead Bảo Hiểm</h2>
            <h3>Thông tin khách hàng tính phí bảo hiểm:</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0;">
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA; font-weight: bold; width: 150px;">Họ và tên:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA;">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA; font-weight: bold;">Số điện thoại:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA;">${escapeHtml(cleanedPhone)}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA; font-weight: bold;">Tuổi:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA;">${age}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA; font-weight: bold;">Gói thẻ đề xuất:</td>
                <td style="padding: 8px 0; border-bottom: 1px solid #E3DACA;">${escapeHtml(recommendedTier || 'N/A')}</td>
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