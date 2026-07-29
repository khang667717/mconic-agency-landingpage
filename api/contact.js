// Vercel Serverless Function for Contact Form
export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  try {
    const { name, phone, email } = req.body;

    // Basic validation
    if (!name || !phone || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    // Phone validation (Vietnamese format)
    const phoneRegex = /^0[0-9]{9}$/;
    if (!phoneRegex.test(phone.replace(/[\s.-]/g, ''))) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid phone format' 
      });
    }

    // Log the contact (in real app, save to database or send email)
    console.log('New contact:', { name, phone, email, timestamp: new Date().toISOString() });

    // Simulate success
    return res.status(200).json({ 
      success: true, 
      message: 'Contact form submitted successfully' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}