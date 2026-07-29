// Vercel Serverless Function for Insurance Quote
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
    const { name, phone, email, age, premium, tier } = req.body;

    // Basic validation
    if (!name || !phone || !email || !age || !premium) {
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

    // Age validation
    if (age < 18 || age > 80) {
      return res.status(400).json({ 
        success: false, 
        message: 'Age must be between 18 and 80' 
      });
    }

    // Log the quote request (in real app, save to database)
    console.log('Insurance quote:', { 
      name, 
      phone, 
      email, 
      age, 
      premium, 
      tier,
      timestamp: new Date().toISOString() 
    });

    // Simulate success
    return res.status(200).json({ 
      success: true, 
      message: 'Insurance quote request submitted successfully' 
    });

  } catch (error) {
    console.error('Insurance quote error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}