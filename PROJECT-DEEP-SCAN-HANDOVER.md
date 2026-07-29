# 🔍 MCONIC Landing Page — Deep Scan & Complete Handover Documentation

**Phiên bản:** 1.0  
**Ngày tạo:** 2026-07-29  
**Trạng thái:** Ready for Handover ✅  
**Người phát triển:** Khang (Thực tập sinh)

---

## 📚 Quick Start

### Project Overview
- **Type:** Landing page + Insurance product page
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** 3 Serverless API functions (Vercel)
- **Database:** Google Sheets
- **Email:** Gmail SMTP
- **Status:** 100% Complete, Production Ready ✅

### Two Pages
1. **index.html** - Main landing page (6 services, contact form, FAQ)
2. **insurance.html** - Insurance page (quote calculator, 5 tiers)

### Three API Endpoints
1. **api/contact.js** - Contact form → Google Sheets + 2 emails
2. **api/quote.js** - Insurance quote → Google Sheets + admin email
3. **api/document.js** - Document download → Email with PDF

### Data Flow
```
User Form → JavaScript Validation → POST /api/* → Backend Validation 
→ Google Sheets Logging → Email Notifications → Success Response
```

---

## 📊 Architecture at a Glance

```
Frontend (index.html, insurance.html)
    ↓
JavaScript (script.js, insurance.js)
    ↓
API Calls (/api/contact, /api/quote, /api/document)
    ↓
Backend Processing (Validate + Log + Email)
    ↓
├─ Google Sheets (Lead Storage)
└─ Gmail SMTP (Notifications)
```

---

## 🎯 For Non-Technical Managers

**What you received:**
- ✅ Working website on Vercel
- ✅ Automatic lead capture to Google Sheets
- ✅ Email notifications for new leads
- ✅ All code on GitHub
- ✅ Complete documentation

**What you need to do:**
1. Create your own Google Sheets (or use existing)
2. Setup Service Account in Google Cloud (or use company account)
3. Update email credentials if needed
4. Test the forms work
5. Monitor Google Sheets for leads

**Who maintains it:**
- Code updates: Company's developer or original developer
- Credentials: Company's email & Google account
- Monitoring: Company's sales/marketing team

---

## 👨‍💻 For Technical Teams

### Frontend Structure
```
Index.html (Main page)
├── Nav (menu, logo, hotline)
├── Hero (headline, CTA)
├── About (company info)
├── Services (6 services grid)
├── Cases (3 case studies)
├── Advantages (why choose us)
├── FAQ (accordion)
├── Contact Form (name, phone, email)
├── Resources (download docs)
├── Testimonials
└── Footer

Insurance.html (Product page)
├── Nav (same as main)
├── Hero + Quote Calculator Form
├── Insurance Partners (logo carousel)
├── Process (3 steps)
├── Insurance Tiers (5 cards: Silver, Titan, Gold, Platinum, Diamond)
└── Footer (same as main)
```

### Backend Functions
```
api/contact.js
├── Validate: name, phone (10 digits), email
├── Log: POST data to Google Sheets
├── Email: Send to admin + customer confirmation
└── Response: success/error

api/quote.js
├── Validate: name, phone, age (18-75)
├── Calculate: Which tier based on age
├── Log: POST data + tier to Google Sheets
├── Email: Send admin notification with tier recommendation
└── Response: success/error

api/document.js
├── Validate: name, email, docId
├── Log: request to Google Sheets
├── Email: Send PDF attachment to customer
└── Response: success/error
```

### Technology Stack
- Node.js 18+
- Express.js
- Nodemailer (Gmail SMTP)
- Google APIs (Sheets + Auth)
- Vercel Serverless
- GitHub (version control)

---

## 📧 Email System

### Email Types Sent

**1. Admin Notification (Contact Form)**
- To: ADMIN_EMAIL (from env var)
- When: User submits contact form
- Contains: name, phone, email, timestamp

**2. Customer Confirmation (Contact Form)**
- To: Customer's email (from form)
- When: User submits contact form
- Contains: Thanks message, will call in 24h

**3. Admin Notification (Quote Form)**
- To: ADMIN_EMAIL
- When: User submits quote form
- Contains: name, phone, age, recommended insurance tier

**4. Document Email**
- To: Customer's email (from modal)
- When: User requests document download
- Contains: PDF attachment

### SMTP Configuration
```
Host: smtp.gmail.com
Port: 587
User: [Gmail account email]
Pass: [Gmail App Password - NOT regular password]
From: "MCONIC" <email>
```

---

## 📊 Google Sheets Structure

**Automatic columns created:**
| Thời gian | Phân loại | Họ và tên | Số điện thoại | Email | Tuổi | Chi tiết khác |
|-----------|----------|----------|---------------|-------|------|---|

**Example rows:**
```
2026-07-29 10:30 | contact | Nguyễn A | 0902970416 | a@email.com | | từ form tư vấn
2026-07-29 11:00 | quote | Trần B | 0909999999 | | 35 | Thẻ Vàng
```

**Auto-behavior:**
- Headers created automatically on first run
- Rows appended (never overwritten)
- Timestamp in Vietnam timezone (Asia/Ho_Chi_Minh)
- No duplicates (each submission = new row)

---

## 🔐 Security & Credentials

### What's Protected
- ✅ google-credentials.json in .gitignore (not in GitHub)
- ✅ .env file in .gitignore (not in GitHub)
- ✅ SMTP password never in code
- ✅ HTML form inputs escaped (XSS protection)
- ✅ Server-side validation (backend double-checks)

### What's in Vercel Environment
- GOOGLE_SHEET_ID
- GOOGLE_SHEET_TAB_NAME
- GOOGLE_CREDENTIALS_JSON (full JSON content)
- SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
- ADMIN_EMAIL
- SENDER_NAME

### To Update Credentials
1. Vercel Dashboard → Project → Settings
2. Environment Variables section
3. Update each variable
4. Auto-redeploy (2-3 minutes)

---

## 🚀 Deployment Info

### Current Setup
- **Hosting:** Vercel
- **Repository:** GitHub
- **Auto-Deploy:** ON (push to main = auto deploy)
- **Serverless Functions:** 3 APIs

### Vercel Configuration
```json
{
  "rewrites": [
    {
      "source": "/((?!api/)(?!images/)(?!css/)(?!js/)(?!assets/)(?!\\..*).*)$",
      "destination": "/index.html"
    }
  ],
  "functions": {
    "api/contact.js": { "memory": 1024, "maxDuration": 60 },
    "api/quote.js": { "memory": 1024, "maxDuration": 60 },
    "api/document.js": { "memory": 1024, "maxDuration": 60, "includeFiles": "assets/documents/**" }
  }
}
```

**What it does:**
- Routes all non-API requests to index.html (SPA)
- Each API function gets 1GB memory + 60s timeout
- PDF assets included in document.js bundle

---

## 📋 For Company Takeover - Checklist

### Week 1: Setup
- [ ] Create Google Sheet for leads
- [ ] Create Service Account in Google Cloud
- [ ] Download google-credentials.json
- [ ] Transfer GitHub access
- [ ] Transfer Vercel access
- [ ] Update email credentials if needed
- [ ] Test contact form
- [ ] Test quote form

### Week 2: Training
- [ ] Train sales team on Google Sheets
- [ ] Show how to download leads
- [ ] Show how to follow up with customers
- [ ] Setup email forwarding if needed
- [ ] Document company procedures

### Week 3+: Operations
- [ ] Daily: Check new leads in Google Sheets
- [ ] Daily: Follow up with customers
- [ ] Weekly: Backup data
- [ ] Monthly: Review conversion rates
- [ ] Quarterly: Rotate credentials

---

## 🆘 Quick Troubleshooting

| Problem | Check | Fix |
|---------|-------|-----|
| Form not submitting | Console errors (F12) | Check network, API response |
| Email not received | SMTP credentials | Recreate Gmail App Password |
| Data not in Sheets | Sheet ID, credentials | Verify auth, check permissions |
| Page loading slow | Image sizes | Compress/optimize images |
| Mobile menu broken | JavaScript error | Clear cache, hard refresh |

---

**Full documentation in separate files:**
- HANDOVER-GUIDE.md - Complete guide
- USER-MANUAL.md - How to use
- CREDENTIALS-HANDOVER.md - How to transfer credentials safely
- GOOGLE-SHEETS-SETUP.md - How to setup Google Sheets

