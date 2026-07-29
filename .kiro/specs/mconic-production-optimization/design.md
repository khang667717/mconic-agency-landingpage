# MCONIC Production Optimization — Technical Design

## 1. System Overview

Transform MCONIC landing page from development-ready to production-optimized by implementing:
- **Performance**: CSS/JS minification, bundling, font optimization, critical CSS
- **SEO**: Sitemap, robots.txt, structured data (ld+json), meta refinement
- **Documentation**: README, API docs, deployment guide, environment config
- **Testing**: Unit tests, E2E tests, form validation tests

**Key constraint**: Zero bundler currently used. Solution must be lightweight, Vercel-compatible, no rebuild required.

---

## 2. Performance Optimization Architecture

### 2.1 Build Pipeline (esbuild-based)

**Why esbuild**:
- Ultra-fast JavaScript/CSS bundler (1000x faster than Webpack)
- Minimal configuration
- No Node.js rebuild loop on Vercel
- Produces single optimized bundle + sourcemaps
- Handles CSS minification natively

**Build outputs**:
```
dist/
├── css/
│   ├── main.min.css          # All CSS bundled + minified (index)
│   ├── insurance.min.css     # Insurance page CSS
│   └── admin.min.css         # Admin panel CSS (future)
├── js/
│   ├── main.min.js           # All JS bundled + minified
│   ├── admin.min.js          # Admin scripts (future)
│   └── *.min.js.map          # Sourcemaps for debugging
└── html/
    ├── index.min.html        # Minified HTML
    ├── insurance.min.html    # Minified HTML
    └── 404.min.html          # Custom 404 page
```

**Build configuration** (`esbuild.config.js`):
```javascript
require('esbuild').buildSync({
  entryPoints: ['css/main.css', 'js/script.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  outdir: 'dist',
  loader: { '.webp': 'dataurl', '.png': 'file' },
  define: { 'process.env.NODE_ENV': '"production"' }
});
```

**npm scripts**:
```json
{
  "build": "node esbuild.config.js",
  "build:watch": "node esbuild.config.js --watch",
  "dev": "concurrently \"npm run build:watch\" \"npm run server:dev\"",
  "server:dev": "node --watch api/server.js"
}
```

### 2.2 Critical CSS Optimization

**Strategy**: Inline critical-path CSS in `<head>`, defer non-critical CSS via `<link rel="preload">`

**Critical CSS** (for above-the-fold hero):
- Navigation styles
- Hero banner
- Button styles
- Form basics

**Implementation**:
```html
<!-- Inline critical CSS in <head> -->
<style>
  /* ~2-3KB critical path CSS */
  nav { ... }
  .hero { ... }
  .btn { ... }
</style>

<!-- Preload + defer non-critical CSS -->
<link rel="preload" href="/dist/css/main.min.css" as="style">
<link rel="stylesheet" href="/dist/css/main.min.css">
```

### 2.3 Font Optimization

**Current**: Google Fonts loaded via CDN with `display=swap`

**Optimization**:
1. Keep Google Fonts for now (reduce HTTP requests by NOT self-hosting)
2. Add preconnect + dns-prefetch:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">
   ```

3. Use `font-display: swap` in Google Fonts import (already set)

4. Add fallback system-stack fonts in CSS:
   ```css
   --font-display: 'Archivo', 'Georgia', serif;
   --font-body: 'Public Sans', system-ui, -apple-system, sans-serif;
   ```

### 2.4 Image Optimization

**Current**: WebP + JPG/PNG fallback already implemented ✓

**Additional**:
1. Add `srcset` for responsive images (3x, 2x, 1x):
   ```html
   <img 
     src="images/hero.webp" 
     srcset="images/hero@2x.webp 2x, images/hero@3x.webp 3x"
     alt="Hero banner"
     loading="lazy"
     width="1200" height="600"
   >
   ```

2. Lazy load below-fold images:
   ```html
   <img loading="lazy" src="..." alt="...">
   ```

3. Add width/height attributes (prevents cumulative layout shift)

### 2.5 Compression & Caching

**Already enabled**:
- Gzip compression middleware in Express ✓
- Vercel automatic compression ✓

**Additional**:
- Add Cache-Control headers:
  ```javascript
  app.use((req, res, next) => {
    if (req.url.match(/\.(js|css|webp|png|jpg)$/)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    }
    next();
  });
  ```

---

## 3. SEO Architecture

### 3.1 Sitemap Generation

**File**: `sitemap.xml` (static, manually maintained)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://mconic.vn/</loc>
    <lastmod>2026-07-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://mconic.vn/insurance.html</loc>
    <lastmod>2026-07-29</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### 3.2 Robots Configuration

**File**: `robots.txt`

```txt
User-agent: *
Allow: /
Disallow: /api/admin/

# Sitemaps
Sitemap: https://mconic.vn/sitemap.xml
```

### 3.3 Structured Data (Schema.org ld+json)

Add to `<head>` in both pages:

**For index.html** (Organization + LocalBusiness):
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "MCONIC Event Agency",
  "url": "https://mconic.vn",
  "logo": "https://mconic.vn/images/logo.png",
  "description": "Công ty thiết kế & tổ chức sự kiện chuyên nghiệp. Pop-art, mạnh mẽ, cam kết không rủi ro.",
  "telephone": "+84901234567",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Nguyễn Văn A",
    "addressLocality": "TP.HCM",
    "addressCountry": "VN"
  },
  "areaServed": "VN",
  "priceRange": "$$$$",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "ratingCount": "500"
  }
}
</script>
```

**For insurance.html** (Product):
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "MCONIC Protect — Event Insurance",
  "description": "Bảo hiểm sự kiện toàn diện cho các doanh nghiệp",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "VND",
    "price": "0",
    "availability": "https://schema.org/InStock"
  }
}
</script>
```

### 3.4 Meta Tags Refinement

Update `<head>` with:
```html
<!-- Open Graph for social sharing -->
<meta property="og:title" content="MCONIC — Kiến tạo sự kiện, vang danh thương hiệu">
<meta property="og:description" content="Công ty thiết kế & tổ chức sự kiện chuyên nghiệp...">
<meta property="og:image" content="https://mconic.vn/images/og-image.jpg">
<meta property="og:url" content="https://mconic.vn/">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="MCONIC — Kiến tạo sự kiện">
<meta name="twitter:description" content="...">
<meta name="twitter:image" content="https://mconic.vn/images/og-image.jpg">

<!-- Canonical + Alternate -->
<link rel="canonical" href="https://mconic.vn/">
<link rel="alternate" hreflang="vi" href="https://mconic.vn/">
```

---

## 4. Documentation Architecture

### 4.1 README.md Structure

```markdown
# MCONIC Event Agency — Landing Page

## Overview
Hybrid landing page + backend system for event agency lead generation...

## Quick Start
- Local development: `npm run dev`
- Build for production: `npm run build`
- Deploy to Vercel: `git push origin main`

## Project Structure
- `index.html` / `insurance.html` — Frontend pages
- `api/server.js` — Express backend
- `css/` — Stylesheets (bundled via esbuild)
- `js/` — JavaScript (bundled via esbuild)
- `dist/` — Production-ready minified assets

## Environment Setup
See `.env.example` for all required variables...

## Testing
- Unit tests: `npm run test:unit`
- E2E tests: `npm run test:e2e`

## Deployment
See DEPLOYMENT.md for Vercel setup guide...
```

### 4.2 API.md Documentation

Complete endpoint documentation with:
- Authentication method
- Request/response examples
- Error codes
- Rate limiting info
- Example cURL commands

```markdown
# MCONIC API Reference

## POST /api/leads/contact
Submit contact form for event consultation...

### Request
```json
{
  "name": "John Doe",
  "phone": "0901234567",
  "email": "john@example.com"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "message": "Yêu cầu tư vấn đã được tiếp nhận thành công!"
}
```

### Error Responses
- 400: Invalid input
- 429: Rate limit exceeded
- 500: Server error

## ...
```

### 4.3 DEPLOYMENT.md Guide

Step-by-step Vercel deployment guide with:
- Environment variables needed
- Database setup (SQLite local vs Google Sheets)
- Email configuration
- Monitoring & logs

---

## 5. Testing Architecture

### 5.1 Unit Tests (Jest)

**Test files**:
```
tests/unit/
├── validation.test.js     # Form validation helpers
├── email.test.js          # Email formatting
├── schemas.test.js        # Database schemas
└── utils.test.js          # Utility functions
```

**Example**:
```javascript
// validation.test.js
describe('Form Validation', () => {
  test('Phone validation accepts 10-digit numbers starting with 0', () => {
    expect(validatePhone('0901234567')).toBe(true);
    expect(validatePhone('0123456')).toBe(false);
  });
});
```

### 5.2 E2E Tests (Playwright)

**Test files**:
```
tests/e2e/
├── contact-form.spec.js   # Contact form submission flow
├── document-flow.spec.js  # Document request flow
├── insurance-flow.spec.js # Insurance quote flow
└── navigation.spec.js     # Page navigation & links
```

**Example**:
```javascript
// contact-form.spec.js
test('Submit contact form with valid data', async ({ page }) => {
  await page.goto('https://mconic.vn/');
  await page.fill('input[name="name"]', 'John Doe');
  await page.fill('input[name="phone"]', '0901234567');
  await page.fill('input[name="email"]', 'john@example.com');
  await page.click('button[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

### 5.3 Integration Tests

**Test files**:
```
tests/integration/
├── api-contact.test.js    # /api/leads/contact endpoint
├── api-document.test.js   # /api/leads/document endpoint
└── api-quote.test.js      # /api/leads/quote endpoint
```

---

## 6. Configuration Management

### 6.1 Enhanced .env.example

```bash
# ===== FRONTEND =====
VITE_BASE_URL=http://localhost:3000

# ===== BACKEND =====
NODE_ENV=development
PORT=3000

# ===== DATABASE =====
DATABASE_PATH=./leads.db

# ===== EMAIL (Gmail SMTP) =====
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@mconic.vn
SENDER_NAME=MCONIC Event Agency

# ===== GOOGLE SHEETS =====
GOOGLE_SHEET_ID=your-sheet-id
GOOGLE_SHEET_TAB_NAME=Leads
GOOGLE_CREDENTIALS_JSON={"type":"service_account",...}

# ===== SECURITY =====
ADMIN_TOKEN=your-secret-admin-token
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=5

# ===== VERCEL =====
# Auto-set by Vercel platform
```

### 6.2 Build Configuration (esbuild.config.js)

```javascript
const esbuild = require('esbuild');
const path = require('path');

esbuild.buildSync({
  entryPoints: {
    main: 'js/script.js',
    insurance: 'js/insurance.js',
  },
  bundle: true,
  minify: true,
  sourcemap: process.env.NODE_ENV !== 'production',
  outdir: 'dist/js',
  loader: {
    '.js': 'jsx',
    '.png': 'dataurl',
    '.webp': 'dataurl'
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  logLevel: 'info'
});

// CSS bundling
esbuild.buildSync({
  entryPoints: {
    main: 'css/base.css',
    insurance: 'css/insurance.css'
  },
  bundle: true,
  minify: true,
  outdir: 'dist/css',
  loader: {
    '.woff2': 'dataurl',
    '.webp': 'dataurl'
  }
});

console.log('✓ Build complete');
```

---

## 7. Integration Checkpoints

| Phase | Checkpoint | Validation |
|-------|-----------|-----------|
| Build | esbuild generates minified assets | All files in `/dist` created |
| Performance | CSS/JS bundles < 100KB each | Verify bundle sizes |
| SEO | Sitemap + robots.txt accessible | `curl https://mconic.vn/sitemap.xml` works |
| SEO | Structured data valid | Test with Google SDTT |
| Docs | README updated with new scripts | All npm scripts documented |
| Docs | API.md complete | All endpoints documented |
| Testing | Unit tests pass | `npm run test:unit` returns 0 |
| Testing | E2E tests pass | `npm run test:e2e` green |
| Deploy | Vercel build succeeds | No build errors in logs |
| Deploy | All APIs responsive | curl `/api/leads/contact` returns 200 |

---

## 8. Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Build breaks existing pages | Keep old HTML intact; serve from /dist only after testing |
| Missing sourcemaps in production | Generate sourcemaps, upload to error tracking service |
| Tests become maintenance burden | Write only high-value tests (form validation, critical flows) |
| Vercel build timeout | Cache dependencies in .vercelignore |
| SEO changes hurt rankings | Keep URLs same; monitor with Google Search Console |

---

## 9. Implementation Phases

### Phase 1: Setup Build System
- Add esbuild & npm scripts
- Create esbuild.config.js
- Test bundling locally

### Phase 2: Performance Optimization
- Implement critical CSS
- Add font preload
- Update images with srcset
- Verify bundle sizes

### Phase 3: SEO Implementation
- Generate sitemap.xml
- Add robots.txt
- Implement structured data
- Update meta tags

### Phase 4: Documentation
- Write README.md
- Document API endpoints
- Create DEPLOYMENT.md
- Update .env.example

### Phase 5: Testing
- Setup Jest for unit tests
- Setup Playwright for E2E
- Write test suites
- Integrate in CI/CD

### Phase 6: Deploy & Monitor
- Deploy to Vercel
- Monitor performance metrics
- Verify all systems operational

---

## 10. Success Metrics

✓ Bundle sizes < 100KB (CSS + JS combined)
✓ Lighthouse Performance score > 90
✓ Lighthouse SEO score > 95
✓ All 4 API endpoints documented
✓ 100% form validation test coverage
✓ E2E tests cover critical user paths
✓ Zero console errors in production
✓ Page load time < 2 seconds

