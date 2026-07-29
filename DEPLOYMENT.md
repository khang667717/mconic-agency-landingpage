# MCONIC — Vercel Deployment Guide

Complete step-by-step guide for deploying MCONIC landing page to Vercel.

---

## Prerequisites

Before deploying, ensure you have:

- ✓ GitHub account (for connecting repository)
- ✓ Vercel account (free at [vercel.com](https://vercel.com))
- ✓ Gmail account with 2-Factor Authentication enabled
- ✓ Google Cloud project with Sheets API enabled
- ✓ All credentials prepared (.env values)

---

## Step 1: Prepare Your Repository

### 1.1 Ensure .gitignore is configured

Make sure sensitive files are NOT committed:

```bash
# Check .gitignore includes:
cat .gitignore
```

Should include:
```
node_modules/
.env
.env.local
*.db
logs/
dist/
.DS_Store
google-credentials.json
```

### 1.2 Commit production-ready code

```bash
# Build assets
npm run build

# Verify no uncommitted changes
git status

# Commit all changes
git add -A
git commit -m "feat: production optimization with SEO, performance, and testing"

# Push to main branch
git push origin main
```

### 1.3 Verify build works locally

```bash
# Clean build
rm -rf dist/
npm run build

# Start server
npm run dev:server

# Test API: curl http://localhost:3000/api/leads/contact
```

---

## Step 2: Connect GitHub to Vercel

### 2.1 Create Vercel Project

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **"Import Project"**
3. Select **"GitHub"** (if not already connected, authorize Vercel)
4. Search for your repository: `mconic-redesign`
5. Click **"Import"**

### 2.2 Configure Project Settings

**Root Directory**: `.` (leave as default)

**Build Command**: (should auto-detect)
```
npm run build
```

**Output Directory**: (should detect `dist/` or root)
```
dist
```

**Environment Variables**: (DO NOT FILL YET - will do in Step 3)

Click **"Deploy"** (it will fail without env vars, which is expected)

---

## Step 3: Configure Environment Variables

### 3.1 Prepare all credentials

Gather the following values:

#### Gmail SMTP
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password  # From Google App Passwords
SMTP_SECURE=false
ADMIN_EMAIL=admin@mconic.vn
SENDER_NAME=MCONIC Event Agency
```

**How to get Gmail App Password**:
1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Select "Mail" and "Windows Computer"
3. Copy the generated 16-character password
4. Use it as `SMTP_PASS`

#### Google Sheets
```bash
GOOGLE_SHEET_ID=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p  # From URL
GOOGLE_SHEET_TAB_NAME=Leads
GOOGLE_CREDENTIALS_JSON={...}  # Full JSON as one-line string
```

**How to get Google Sheets credentials**:
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create new project
3. Enable "Google Sheets API"
4. Create Service Account → Generate JSON key
5. Download and save the JSON file
6. Convert to one-line string for .env (replace line breaks with `\n`)

#### Security
```bash
ADMIN_TOKEN=generate-a-strong-random-token
RATE_LIMIT_MAX=5
RATE_LIMIT_WINDOW_MS=60000
```

### 3.2 Add Environment Variables to Vercel

**Option A: Vercel Dashboard**

1. Go to your Vercel project
2. Click **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: Variable name (e.g., `SMTP_USER`)
   - **Value**: Variable value
   - **Environments**: Select "Production"
4. Click **Save**

Repeat for all variables:
```
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASS
SMTP_SECURE
ADMIN_EMAIL
SENDER_NAME
GOOGLE_SHEET_ID
GOOGLE_SHEET_TAB_NAME
GOOGLE_CREDENTIALS_JSON
ADMIN_TOKEN
RATE_LIMIT_MAX
RATE_LIMIT_WINDOW_MS
NODE_ENV=production
```

**Option B: CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Link local project to Vercel
vercel link

# Add environment variables interactively
vercel env add SMTP_USER
# (enter value, select environments)

vercel env add SMTP_PASS
# ... repeat for each variable
```

### 3.3 Redeploy with environment variables

After adding all env vars:

1. Go back to Vercel project
2. Click **Deployments**
3. Find the failed deployment
4. Click the **...** menu → **Redeploy**
5. Watch logs for successful build

Or trigger from Git:
```bash
git commit --allow-empty -m "chore: trigger redeploy with env vars"
git push origin main
```

---

## Step 4: Verify Deployment

### 4.1 Check Build Success

In Vercel dashboard:
1. Click **Deployments**
2. Most recent should show ✓ **Ready** (green checkmark)
3. Click it and check build logs

Look for:
```
✓ Build completed
```

### 4.2 Test Production URL

Get your Vercel domain (e.g., `mconic.vercel.app`):

**Test static pages**:
```bash
curl https://mconic.vercel.app/
curl https://mconic.vercel.app/insurance.html
```

Should return 200 with HTML content

**Test API endpoints**:

Contact Form:
```bash
curl -X POST https://mconic.vercel.app/api/leads/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "phone": "0901234567",
    "email": "test@example.com"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Yêu cầu tư vấn đã được tiếp nhận thành công!"
}
```

Check admin email for notification

**Test admin endpoint**:
```bash
curl "https://mconic.vercel.app/api/admin/leads?token=YOUR_ADMIN_TOKEN"
```

Should return list of leads

### 4.3 Run Lighthouse Audit

1. Open your deployed site in Chrome
2. Press F12 (DevTools)
3. Click **Lighthouse** tab
4. Select **Mobile** (or Desktop)
5. Click **Analyze page load**

Target scores:
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 95

### 4.4 Test on mobile

1. Open production URL on phone
2. Test contact form
3. Test document request
4. Test insurance calculator
5. Test navigation/menu

---

## Step 5: Setup Custom Domain (Optional)

### 5.1 Add custom domain

1. Go to Vercel project → **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `mconic.vn`)
4. Follow DNS setup instructions
5. Add CNAME or A records to your domain registrar
6. Wait for DNS propagation (up to 24h)

### 5.2 Setup SSL/HTTPS

Vercel automatically provisions SSL certificates (free)

Verify:
```bash
curl -I https://mconic.vn/
```

Should show:
```
HTTP/2 200
```

---

## Step 6: Setup Monitoring & Logs

### 6.1 View Real-time Logs

In Vercel dashboard:

1. Click **Deployments** → Select latest deployment
2. Click **Logs** tab
3. Monitor real-time function logs and errors

### 6.2 Enable Error Tracking

**Option: Sentry Integration**

1. Create Sentry account at [sentry.io](https://sentry.io)
2. Create new project
3. Go to Vercel → Integrations → Add **Sentry**
4. Select your Vercel project and Sentry DSN
5. Errors now tracked automatically

### 6.3 Monitor Performance

In Vercel dashboard:

1. Click **Analytics**
2. View real-time metrics:
   - Page load times
   - Edge hits/misses
   - Status codes
   - Request count

---

## Step 7: Continuous Deployment

### 7.1 GitHub Auto-Deploy

Any push to `main` branch automatically deploys:

```bash
# Make changes
git add file.js
git commit -m "fix: improve form validation"
git push origin main

# Automatically deploys to Vercel
# Check Deployments tab for live update
```

### 7.2 Setup Preview Deployments

Create feature branch to test before merging:

```bash
git checkout -b feature/new-feature
git push origin feature/new-feature
```

Vercel automatically creates preview URL (e.g., `mconic-git-feature-user.vercel.app`)

Test changes, then create GitHub PR

---

## Troubleshooting Deployment

### Build Fails: "Module not found"

```
Error: Cannot find module 'esbuild'
```

**Solution**:
```bash
npm install --save-dev esbuild
git add package.json package-lock.json
git push origin main
```

### Build Fails: "PORT already in use"

Vercel sets PORT environment variable automatically. Make sure `api/server.js` uses it:

```javascript
const PORT = process.env.PORT || 3000;
app.listen(PORT);
```

### Emails Not Sending

Check:
1. SMTP_USER and SMTP_PASS correct
2. Gmail 2FA enabled and App Password generated
3. ADMIN_EMAIL is valid
4. Check Vercel logs for SMTP errors

### Google Sheets Not Syncing

Check:
1. GOOGLE_SHEET_ID correct
2. GOOGLE_CREDENTIALS_JSON valid JSON
3. Service account email has access to sheet
4. GOOGLE_SHEET_TAB_NAME matches actual sheet name

### Static Assets (CSS/JS) Return 404

Check:
1. Build completed successfully
2. `/dist/` directory exists in Vercel functions
3. `vercel.json` includes file rules:
```json
{
  "functions": {
    "api/server.js": {
      "includeFiles": "dist/**"
    }
  }
}
```

---

## Rollback to Previous Deployment

If something breaks:

1. Go to Vercel dashboard → **Deployments**
2. Find the previous working deployment
3. Click the **...** menu → **Promote to Production**
4. Confirms rollback (live immediately)

---

## Performance Optimization

### 7.1 Enable Vercel Analytics

1. Go to **Settings** → **Analytics**
2. Toggle **Enable Analytics**
3. View Core Web Vitals and metrics

### 7.2 Edge Caching

Vercel automatically caches:
- Static assets: 1 year
- HTML: 1 hour
- API: no cache (as configured)

To verify:
```bash
curl -I https://mconic.vn/dist/js/main.js | grep Cache-Control
# Should show: Cache-Control: public, max-age=31536000, immutable
```

### 7.3 Gzip Compression

Already enabled in `api/server.js`:
```javascript
app.use(compression());
```

Verify:
```bash
curl -I https://mconic.vn/ | grep Content-Encoding
# Should show: Content-Encoding: gzip
```

---

## Maintenance & Updates

### Schedule Regular Checks

- **Weekly**: Check analytics and error logs
- **Monthly**: Review performance metrics and Lighthouse scores
- **Quarterly**: Update dependencies
  ```bash
  npm update
  npm audit fix
  ```

### Backup Configuration

Keep a secure backup of:
- `.env` values (store in password manager)
- Google Sheets credentials (store JSON securely)
- Admin token (regenerate regularly)

### Update Deployment

To deploy code updates:

```bash
# Make changes
npm run build
git add -A
git commit -m "feat: add new feature"
git push origin main

# Vercel auto-deploys
```

---

## Security Checklist

Before going live:

- [ ] Environment variables configured in Vercel (not in code)
- [ ] `.env` in `.gitignore` and never committed
- [ ] Admin token is strong/random
- [ ] Gmail 2FA enabled
- [ ] Google Service Account limited to Sheets API only
- [ ] Rate limiting configured (5/min)
- [ ] CORS configured correctly
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] No console.log() with sensitive data
- [ ] All secrets rotated periodically

---

## Getting Help

**Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)

**Common Issues**:
- [Build Errors](https://vercel.com/docs/platform/deployments#troubleshooting)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Error Logs](https://vercel.com/docs/platform/deployments#logs)

**MCONIC Support**:
- Email: contact.mconic@gmail.com
- Phone: 0901 234 567 (24/7)

---

## Deployment Checklist (Final)

- [ ] GitHub repo connected to Vercel
- [ ] All environment variables added to Vercel
- [ ] Build successful (✓ Ready status)
- [ ] All API endpoints tested
- [ ] Contact form working (email received)
- [ ] Google Sheets syncing
- [ ] Lighthouse scores ≥ 90
- [ ] Mobile responsive confirmed
- [ ] Sitemap accessible
- [ ] SEO tags present
- [ ] HTTPS enabled
- [ ] Monitoring/logs accessible
- [ ] Custom domain working (if applicable)
- [ ] Error tracking setup
- [ ] Security checklist complete

**Status**: Production Ready ✓

