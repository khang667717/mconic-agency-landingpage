// Simple API test endpoint
module.exports = (req, res) => {
  const { method } = req;
  
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  if (method === 'GET') {
    return res.status(200).json({
      success: true,
      message: 'API is working!',
      timestamp: new Date().toISOString(),
      environment: {
        hasGoogleSheetId: !!process.env.GOOGLE_SHEET_ID,
        hasGoogleCredentials: !!process.env.GOOGLE_CREDENTIALS_JSON,
        hasSmtpUser: !!process.env.SMTP_USER,
        hasSmtpPass: !!process.env.SMTP_PASS,
        nodeVersion: process.version,
        vercel: !!process.env.VERCEL
      }
    });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
};