// Vercel Serverless Function for Document Requests
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
    const { name, email, docId } = req.body;

    // Basic validation
    if (!name || !email || !docId) {
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

    // Valid document IDs
    const validDocs = ['company-profile', 'event-checklist', 'industry-report'];
    if (!validDocs.includes(docId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid document ID' 
      });
    }

    // Log the document request (in real app, save to database and send email)
    console.log('Document request:', { name, email, docId, timestamp: new Date().toISOString() });

    // Simulate success
    return res.status(200).json({ 
      success: true, 
      message: 'Document request submitted successfully' 
    });

  } catch (error) {
    console.error('Document request error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}