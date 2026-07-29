# MCONIC Event Agency — Landing Page & Lead Management System

## 📖 Overview

**MCONIC** is a professional hybrid landing page for event management company MCONIC Event Agency. It combines a conversion-focused single-page website with a robust backend system for lead capture, email notifications, and event insurance quoting.

### Key Features
- **Landing Page**: Showcase services, case studies, team, and FAQ
- **Lead Capture**: Contact forms, document requests, insurance quotes
- **Backend System**: REST API, SQLite database, Google Sheets sync, Nodemailer integration
- **Production Ready**: Optimized for Vercel, SEO-configured, security hardened
- **Responsive Design**: Mobile-first approach with pop-art aesthetic

### Tech Stack
- **Frontend**: HTML5, Vanilla CSS, Vanilla JavaScript (no frameworks)
- **Backend**: Node.js, Express.js
- **Database**: SQLite (local), Google Sheets (cloud sync)
- **Build**: esbuild (minification & bundling)
- **Hosting**: Vercel (serverless functions)
- **Testing**: Jest (unit), Playwright (E2E)

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18.0.0
- npm or yarn
- Git

### Local Development

1. **Clone repository** (if not already done)
   ```bash
   git clone https://github.com/mconic/mconic-redesign.git
   cd mconic-redesign
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your credentials (Gmail SMTP, Google Sheets, etc.)
   ```

4. **Build assets** (esbuild)
   ```bash
   npm run build
   ```

5. **Start development server** (with watch mode)
   ```bash
   npm run dev
   ```
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3000/api/

### Project Structure

```
mconic-redesign/
├── index.html              # Main landing page
├── insurance.html          # Insurance product page
├── css/                    # Stylesheets (bundled into /dist/)
│   ├── base.css           # Design tokens, resets, typography
│   ├── layout.css         # Grid, spacing, containers
│   ├── components.css     # UI components (buttons, forms, etc.)
│   ├── style.css          # Page-specific styles
│   └── insurance.css      # Insurance page styles
├── js/                    # JavaScript (bundled into /dist/)
│   ├── script.js          # Main page interactivity
│   └── insurance.js       # Insurance page calculator
├── api/
│   └── server.js          # Express backend (Node.js serverless)
├── images/                # Optimized images (WebP + fallbacks)
├── dist/                  # Build output (CSS/JS minified)
│   ├── css/
│   ├── js/
│   └── *.map             # Source maps for debugging
├── tests/                 # Test suites
│   ├── unit/              # Jest unit tests
│   └── e2e/               # Playwright E2E tests
├── .kiro/specs/          # Specification documents (design, requirements, tasks)
├── logs/                  # Application logs (not on Vercel)
├── vercel.json            # Vercel deployment config
├── esbuild.config.js      # Build configuration
├── jest.config.js         # Unit test configuration
├── playwright.config.js   # E2E test configuration
├── package.json           # Dependencies & scripts
├── sitemap.xml            # SEO sitemap
├── robots.txt             # Search engine crawlers
└── README.md              # This file
```

---

## 📦 Build & Production

### Building for Production

```bash
# Build CSS/JS bundles (minified)
npm run build

# Output: /dist/css/ and /dist/js/ with .map files
```

**Build Output:**
- `dist/css/main.css` (~2KB minified) - Main CSS bundle
- `dist/css/insurance.css` (~19KB minified) - Insurance page CSS
- `dist/js/main.js` (~13KB minified) - Main JS bundle
- `dist/js/insurance.js` (~10KB minified) - Insurance JS bundle
- All bundles include `.map` files for production debugging

### NPM Scripts Reference

| Script | Purpose |
|--------|---------|
| `npm run build` | One-time production build |
| `npm run build:watch` | Watch CSS/JS and rebuild on changes |
| `npm run dev` | Development: watch build + start server |
| `npm run dev:server` | Start Express server only (manual build) |
| `npm run test` | Run unit + E2E tests |
| `npm run test:unit` | Jest unit tests with coverage |
| `npm run test:e2e` | Playwright E2E tests |
| `npm start` | Production server (uses pre-built /dist) |

---

## 🔧 Environment Setup

### Email Configuration (Gmail SMTP)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer"
   - Copy the 16-character password
3. **Add to .env**:
   ```bash
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxxxxxxxxxxx  # 16-char app password
   ADMIN_EMAIL=admin@mconic.vn
   ```

### Google Sheets Integration

1. **Create Google Cloud Project**:
   - Go to [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project
   - Enable "Google Sheets API"

2. **Create Service Account**:
   - Go to Service Accounts → Create Service Account
   - Generate new key (JSON format)
   - Download and save credentials

3. **Setup Spreadsheet**:
   - Create a new Google Sheet
   - Share it with the service account email
   - Get the Spreadsheet ID from URL: `docs.google.com/spreadsheets/d/{ID}/`

4. **Add to .env**:
   ```bash
   GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
   GOOGLE_SHEET_TAB_NAME=Leads
   GOOGLE_CREDENTIALS_JSON={"type":"service_account",...}  # Paste entire JSON
   ```

### Database Setup

- **Local Development**: SQLite database at `./leads.db` (auto-created)
- **Vercel Production**: SQLite unavailable (read-only filesystem). Use Google Sheets as primary storage.

---

## 📡 API Endpoints

### POST /api/leads/contact
**Contact form submission for event consultation**

```bash
curl -X POST http://localhost:3000/api/leads/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "phone": "0901234567",
    "email": "john@example.com"
  }'
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Yêu cầu tư vấn đã được tiếp nhận thành công!"
}
```

**Error Responses**:
- `400`: Invalid input (missing fields, invalid phone format)
- `429`: Rate limit exceeded (5 requests per minute per IP)
- `500`: Server error

---

### POST /api/leads/document
**Request digital document (PDF)**

```bash
curl -X POST http://localhost:3000/api/leads/document \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@company.com",
    "docId": "company-profile"
  }'
```

**Valid docId values**:
- `company-profile` → Company Profile 2026
- `event-checklist` → Event Master Checklist
- `industry-report` → Industry Report 2026

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Tài liệu đã được gửi tới email của bạn thành công!"
}
```

---

### POST /api/leads/quote
**Insurance quote calculation**

```bash
curl -X POST http://localhost:3000/api/leads/quote \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Johnson",
    "phone": "0909876543",
    "age": 32,
    "recommendedTier": "Premium"
  }'
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Yêu cầu tính phí bảo hiểm đã được lưu và gửi tới chuyên viên!"
}
```

---

### GET /api/admin/leads
**Admin endpoint: Retrieve all leads (requires token)**

```bash
curl http://localhost:3000/api/admin/leads?token=YOUR_ADMIN_TOKEN
```

**Response (200 OK)**:
```json
{
  "success": true,
  "count": 42,
  "data": [
    {
      "id": 1,
      "type": "contact",
      "name": "John Doe",
      "phone": "0901234567",
      "email": "john@example.com",
      "age": null,
      "details": null,
      "created_at": "2026-07-29 10:30:45"
    },
    ...
  ]
}
```

**Error Responses**:
- `401`: Invalid or missing token
- `500`: Database error

---

### Rate Limiting
- **Limit**: 5 requests per 60 seconds per IP
- **Headers**: Returns `Retry-After` on 429 responses
- **Applies to**: All `/api/` endpoints

---

## 🧪 Testing

### Unit Tests (Jest)

```bash
# Run all unit tests with coverage
npm run test:unit

# Watch mode (re-run on file changes)
npm run test:unit -- --watch

# Run specific test file
npm run test:unit -- tests/unit/validation.test.js
```

**Test Coverage**:
- Form validation (phone, email, name)
- Email template formatting
- Database schema
- Utility functions

### E2E Tests (Playwright)

```bash
# Run all E2E tests
npm run test:e2e

# Run in headed mode (see browser)
npm run test:e2e -- --headed

# Run specific test file
npm run test:e2e -- tests/e2e/contact-form.spec.js

# Run against production URL
PLAYWRIGHT_TEST_BASE_URL=https://mconic.vn npm run test:e2e
```

**Test Scenarios**:
- Contact form submission with valid data
- Document request flow
- Insurance quote calculator
- Navigation and links
- Responsive mobile menu

---

## 🌐 SEO & Performance

### SEO Files
- `sitemap.xml` → Search engine indexing
- `robots.txt` → Crawler directives
- Structured data (ld+json) → Rich snippets

### Performance Optimization
- **CSS/JS minification**: esbuild compression
- **Critical CSS**: Inlined for FCP optimization
- **Font preload**: Faster font rendering
- **Image optimization**: WebP with fallbacks, srcset, lazy loading
- **Caching**: 1-year cache for static assets, 1-hour for HTML

### Lighthouse Targets
- Performance: ≥ 90
- SEO: ≥ 95
- Accessibility: ≥ 90
- Best Practices: ≥ 90

---

## 🚢 Deployment

### Vercel Deployment

1. **Connect GitHub Repository**:
   ```bash
   git push origin main  # Triggers automatic deploy
   ```

2. **Configure Environment Variables** in Vercel Dashboard:
   - Go to Settings → Environment Variables
   - Add all variables from `.env.example`
   - **Important**: Never commit `.env` to git

3. **Verify Deployment**:
   - Check Vercel logs for build errors
   - Test all API endpoints: `https://your-project.vercel.app/api/leads/contact`
   - Run Lighthouse audit

### Deployment Checklist
- [ ] All environment variables configured in Vercel
- [ ] Build succeeds without errors
- [ ] API endpoints responding
- [ ] Contact form submitting successfully
- [ ] Emails sending to admin and user
- [ ] Google Sheets syncing leads
- [ ] Sitemap accessible at `/sitemap.xml`
- [ ] Structured data valid (Google SDTT)
- [ ] Lighthouse Performance ≥ 90

---

## 🐛 Troubleshooting

### Build Issues

**Problem**: esbuild fails with "watch" error
```
❌ [ERROR] Invalid option in build() call: "watch"
```
**Solution**: Use `npm run build:watch` instead of direct esbuild

**Problem**: CSS not loading in browser
```
Solution: Make sure esbuild ran successfully: npm run build
Check dist/css/ exists and has main.css + insurance.css
```

### Email Issues

**Problem**: Emails not sending
```
Solution: Verify Gmail app password (not your regular password)
Check SMTP_USER and SMTP_PASS in .env
Ensure "Less Secure Apps" setting if not using 2FA
```

**Problem**: Emails going to spam
```
Solution: Check email templates in api/server.js
Add SPF/DKIM records to your email domain
Test with Google Postmaster Tools
```

### Google Sheets Issues

**Problem**: Leads not syncing to Google Sheets
```
Solution: Verify GOOGLE_SHEET_ID is correct
Check service account email has access to sheet
Verify GOOGLE_CREDENTIALS_JSON format (should be valid JSON string)
Check browser console for error messages
```

### API Issues

**Problem**: 429 Too Many Requests error
```
Solution: Wait 60 seconds before retrying
Rate limit is 5 requests per minute per IP
Check if multiple tabs/processes making requests
```

---

## 📚 Documentation Files

- **README.md** (this file) — Project overview and setup
- **API.md** — Complete API endpoint reference
- **DEPLOYMENT.md** — Step-by-step Vercel deployment guide
- **./kiro/specs/mconic-production-optimization/** — Specification documents
  - `requirements.md` — Full requirements
  - `design.md` — Technical architecture
  - `tasks.md` — Implementation task list

---

## 📋 License & Credits

**Author**: MCONIC Event Agency  
**License**: ISC  
**Last Updated**: July 29, 2026

**Built with**:
- Express.js
- Google Sheets API
- Nodemailer
- Winston Logger
- Jest & Playwright
- esbuild

---

## 💬 Support

For issues, questions, or feature requests:
- Email: [contact.mconic@gmail.com](mailto:contact.mconic@gmail.com)
- Phone: [0901 234 567](tel:0901234567)
- Website: [mconic.vn](https://mconic.vn)
