# API Endpoints Summary

## ✅ Available Endpoints:

### `/api/contact` (POST)
- **Purpose:** Handle contact form submissions from main page
- **JavaScript:** `js/script.js` line ~281
- **Features:** Google Sheets logging, admin + user email notifications
- **Body:** `{ name, phone, email }`

### `/api/document` (POST)  
- **Purpose:** Handle document request submissions
- **JavaScript:** `js/script.js` line ~190
- **Features:** Google Sheets logging, user confirmation email
- **Body:** `{ name, email, docId }`

### `/api/quote` (POST)
- **Purpose:** Handle insurance quote requests from insurance page
- **JavaScript:** `js/insurance.js` line ~181
- **Features:** Google Sheets logging, admin notification email
- **Body:** `{ name, phone, age, recommendedTier }`

### `/api/test` (GET)
- **Purpose:** Debug endpoint to check environment variables
- **Usage:** Visit directly in browser to check API status
- **Response:** Shows which environment variables are set

## 📋 Environment Variables Required:

For all endpoints to work properly, set these on Vercel:

- `GOOGLE_CREDENTIALS_JSON` - Service account credentials (JSON)
- `GOOGLE_SHEET_ID` - Spreadsheet ID  
- `GOOGLE_SHEET_TAB_NAME` - Sheet tab name (default: "Trang tính1")
- `SMTP_HOST` - Email server (default: smtp.gmail.com)
- `SMTP_PORT` - Email port (default: 587)
- `SMTP_SECURE` - Use SSL (default: false)
- `SMTP_USER` - Email username
- `SMTP_PASS` - Email password/app password
- `ADMIN_EMAIL` - Admin notification email
- `SENDER_NAME` - Email sender name

## 🔧 Error Handling:

All endpoints include:
- ✅ CORS support for frontend calls
- ✅ Input validation
- ✅ Non-blocking Google Sheets logging  
- ✅ Non-blocking email sending
- ✅ Graceful error responses
- ✅ Detailed console logging

## 🚀 Testing:

1. **API Status:** Visit `/api/test`
2. **Contact Form:** Submit form on main page
3. **Document Request:** Click document download buttons
4. **Insurance Quote:** Complete insurance calculator on insurance.html