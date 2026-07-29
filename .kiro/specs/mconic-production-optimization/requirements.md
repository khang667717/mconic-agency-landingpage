# MCONIC Production Optimization — Requirements

## Executive Summary

Enhance MCONIC landing page with enterprise-grade production optimization covering performance, SEO, documentation, and quality assurance. All components must work together without breaking existing functionality.

---

## 1. Performance Requirements

### 1.1 JavaScript & CSS Bundling

**Requirement**: Implement lightweight CSS/JS minification and bundling

- All CSS files (base.css, layout.css, components.css, style.css, insurance.css) bundled into single minified bundle per page
- All JavaScript files (script.js, insurance.js) bundled into single minified bundle per page
- Source maps generated for production debugging
- Bundle size goals: CSS < 50KB, JS < 50KB per page (gzipped)
- No webpack/complex tooling; use esbuild for simplicity
- Build command: `npm run build`
- Build output: `/dist/css/` and `/dist/js/` directories

**Acceptance Criteria**:
1. esbuild.config.js created and functional
2. `npm run build` generates minified files in `/dist/`
3. Bundle size reports show < 100KB combined (before gzip)
4. Sourcemaps included for debugging
5. Build completes in < 10 seconds

### 1.2 Critical CSS Inline

**Requirement**: Optimize first contentful paint by inlining critical-path CSS

- Critical CSS (navigation, hero, buttons, forms) extracted and inlined in `<head>` tag
- Non-critical CSS loaded asynchronously via `<link rel="preload">`
- Critical CSS size: 2-3KB max
- Improves FCP (First Contentful Paint) score

**Acceptance Criteria**:
1. Critical CSS identified and documented
2. Inline `<style>` block in head < 3KB
3. Non-critical CSS preloaded
4. Visual rendering unchanged
5. Lighthouse Performance score improves by ≥ 10 points

### 1.3 Font Optimization

**Requirement**: Optimize Google Fonts loading strategy

- Add `<link rel="preconnect">` for fonts.googleapis.com and fonts.gstatic.com
- Add `<link rel="dns-prefetch">` for CDN dependencies
- Keep `display=swap` for instant text rendering
- Document font fallback stack in CSS (system fonts)
- No self-hosted fonts (keeps file size low)

**Acceptance Criteria**:
1. Preconnect/dns-prefetch links added to both pages
2. Font display works with system fallback
3. No FOUT (Flash of Unstyled Text)
4. Google Fonts load in < 1s

### 1.4 Image Responsive Optimization

**Requirement**: Implement responsive image handling with srcset

- All hero/case study images include srcset (1x, 2x, 3x density)
- Lazy loading enabled for below-fold images (`loading="lazy"`)
- All images have width/height attributes (prevents CLS)
- WebP format maintained with JPG/PNG fallback
- ALT text present on all images

**Acceptance Criteria**:
1. Hero image has srcset with 2-3 density variants
2. Case study images have responsive srcset
3. Images below fold have `loading="lazy"`
4. Width/height attributes prevent layout shift
5. No visual regression in responsive design

### 1.5 Caching Strategy

**Requirement**: Implement HTTP cache headers for optimal browser caching

- Static assets (CSS, JS, images, WebP) cached for 1 year (`Cache-Control: public, max-age=31536000, immutable`)
- HTML pages cached for 1 hour (`Cache-Control: public, max-age=3600, must-revalidate`)
- API responses not cached (cache-busting for forms)

**Acceptance Criteria**:
1. Cache headers configured in Express server
2. Static assets return `max-age=31536000`
3. HTML returns `max-age=3600`
4. API responses uncached
5. Browser DevTools confirms caching behavior

---

## 2. SEO Requirements

### 2.1 Sitemap Generation

**Requirement**: Create and maintain XML sitemap for search engines

- Static sitemap.xml in root directory
- Includes both index.html and insurance.html
- Priority: 1.0 (homepage), 0.8 (insurance page)
- Change frequency: weekly
- Last modified dates accurate

**Acceptance Criteria**:
1. sitemap.xml created and valid XML
2. Can be accessed at `https://mconic.vn/sitemap.xml`
3. Contains both pages with proper priority
4. Google Search Console can read sitemap
5. No XML parsing errors

### 2.2 Robots.txt Configuration

**Requirement**: Create robots.txt for search engine crawlers

- Allow all public pages for indexing
- Disallow /api/admin/ to prevent admin interface indexing
- Disallow /api/ endpoints (not meant for search indexing)
- Reference sitemap.xml location
- Accessible at `https://mconic.vn/robots.txt`

**Acceptance Criteria**:
1. robots.txt created and properly formatted
2. Disallows /api/ paths correctly
3. Sitemap reference included
4. Can be accessed via robots.txt checker tools
5. No syntax errors

### 2.3 Structured Data (Schema.org)

**Requirement**: Implement schema.org structured data using ld+json format

**For index.html**:
- LocalBusiness schema with:
  - Company name, URL, logo, description
  - Contact phone number
  - Address (street, city, country)
  - Service area
  - Aggregate rating (if available)

**For insurance.html**:
- Product schema with:
  - Product name and description
  - Offers (price currency, availability)
  - Manufacturer/brand info

**Acceptance Criteria**:
1. ld+json scripts added to both pages
2. Valid per schema.org specifications
3. Google Structured Data Test Tool shows no errors
4. Rich snippets appear in Google Search Console
5. All required fields populated

### 2.4 Meta Tags Refinement

**Requirement**: Enhance meta tags for social sharing and SEO

- Open Graph tags (og:title, og:description, og:image, og:url, og:type)
- Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- Canonical tags (rel="canonical") to prevent duplicate content
- Hreflang alternates for multi-language support (if applicable)
- Description meta tag optimized for target keywords

**Acceptance Criteria**:
1. Open Graph tags present on both pages
2. Twitter Card tags configured
3. Canonical tags prevent duplicate content issues
4. Social sharing tests pass (Facebook, Twitter, LinkedIn)
5. Meta description 150-160 characters

---

## 3. Documentation Requirements

### 3.1 README.md

**Requirement**: Comprehensive project README with setup and deployment instructions

**Sections**:
- Project overview (hybrid landing page + backend)
- Tech stack summary
- Quick start guide (local development)
- Project structure with file descriptions
- Environment setup instructions
- Build and deployment workflow
- Testing command documentation
- Troubleshooting guide

**Acceptance Criteria**:
1. README.md exists in root directory
2. All npm scripts documented with examples
3. Environment variables section references .env.example
4. Quick start works end-to-end
5. Contains deployment instructions

### 3.2 API.md

**Requirement**: Complete API endpoint documentation

**For each endpoint** (/api/leads/contact, /api/leads/document, /api/leads/quote, /api/admin/leads):
- Method and path
- Description of functionality
- Authentication method (if applicable)
- Request body schema with examples
- Response schema with examples (200, 400, 429, 500)
- Rate limiting info
- Error codes and meanings
- cURL command examples
- Error handling notes

**Acceptance Criteria**:
1. API.md exists in root directory
2. All 4 endpoints documented
3. Request/response examples are valid JSON
4. Error codes documented for all scenarios
5. cURL examples copy-paste ready

### 3.3 DEPLOYMENT.md

**Requirement**: Step-by-step Vercel deployment guide

**Sections**:
- Prerequisites (Node.js, npm, Vercel account)
- Environment variables checklist with descriptions
- Database setup (SQLite local, Google Sheets sync)
- Email configuration (Gmail SMTP setup)
- Google Sheets API setup (if using)
- Manual deployment via CLI (`vercel deploy`)
- Automatic deployment via GitHub push
- Monitoring logs and errors on Vercel
- Rollback procedures
- Health checks and monitoring

**Acceptance Criteria**:
1. DEPLOYMENT.md exists in root directory
2. All environment variables explained
3. Step-by-step Vercel setup included
4. Email setup instructions clear
5. Troubleshooting section covers common issues

### 3.4 Enhanced .env.example

**Requirement**: Comprehensive environment variables template

**Must include**:
- Frontend base URL
- Node environment and port
- Database path
- All SMTP settings (host, port, user, pass, sender name)
- Admin email and contact phone
- Google Sheets ID, tab name, and credentials
- Google Sheets credentials (with format notes)
- Admin token for API access
- Rate limiting configuration
- Notes on obtaining each variable (Gmail, Google Cloud, etc.)

**Acceptance Criteria**:
1. .env.example updated with all variables
2. Comments explain each variable clearly
3. Sensitive variables marked with **SECRET** comment
4. Contains example values (not real credentials)
5. Matches all variables used in code

---

## 4. Testing Requirements

### 4.1 Unit Tests

**Requirement**: Jest-based unit tests for core utilities

**Test coverage**:
- Form validation (phone, email, name format)
- Email template generation
- Database schema validation
- Utility functions (phone formatting, sanitization)
- Request/response parsing

**Acceptance Criteria**:
1. Jest configured in package.json
2. Test files created in `tests/unit/`
3. Validation tests cover all validators
4. ≥ 90% code coverage for utilities
5. All tests pass: `npm run test:unit` returns 0

### 4.2 E2E Tests (Playwright)

**Requirement**: End-to-end tests for critical user flows

**Test scenarios**:
- **Contact Form Flow**: Navigate → Fill form → Submit → Success message
- **Document Request Flow**: Open modal → Select document → Submit → Confirmation
- **Insurance Quote Flow**: Enter age → View recommendation → Submit → Confirmation
- **Navigation**: All menu links navigate correctly
- **Responsive**: Mobile menu opens/closes properly

**Acceptance Criteria**:
1. Playwright configured in package.json
2. Test files created in `tests/e2e/`
3. At least 5 critical flows tested
4. Tests run on Chromium/Firefox/WebKit
5. All E2E tests pass: `npm run test:e2e` returns 0

### 4.3 Form Validation Testing

**Requirement**: Comprehensive form validation test suite

**Validation tested**:
- Phone number format (10 digits, starts with 0)
- Email format (valid email syntax)
- Name field (non-empty, no special chars)
- Age validation (number between 18-100)
- Required fields (all forms complete)

**Acceptance Criteria**:
1. Unit tests cover all validation rules
2. E2E tests verify error messages display correctly
3. Valid inputs accepted and submitted successfully
4. Invalid inputs rejected with helpful error messages
5. Form state resets after successful submission

### 4.4 API Integration Tests

**Requirement**: Tests for backend API endpoints

**Test scenarios**:
- Valid contact form submission
- Invalid phone number rejection
- Missing required fields rejection
- Document request with valid PDF
- Insurance quote calculation
- Rate limiting enforcement (5th request returns 429)
- Admin endpoint requires valid token

**Acceptance Criteria**:
1. Test files created in `tests/integration/`
2. Mock database used (no real SQLite writes)
3. All endpoints tested with valid and invalid inputs
4. Rate limiting verified
5. All integration tests pass

---

## 5. Build & Deployment Requirements

### 5.1 Build Pipeline

**Requirement**: Automated build process for production assets

- `npm run build` command minifies and bundles all assets
- Build output goes to `/dist/` directory
- Build completes without errors
- Source maps generated for debugging
- Build takes < 15 seconds

**Acceptance Criteria**:
1. Build script in package.json functional
2. All CSS files minified and bundled
3. All JS files minified and bundled
4. No build errors or warnings
5. Assets properly versioned/named

### 5.2 Vercel Integration

**Requirement**: Production deployment on Vercel

- Vercel build succeeds without errors
- All environment variables configured in Vercel dashboard
- API endpoints responsive after deployment
- Static assets served with correct cache headers
- No console errors in production

**Acceptance Criteria**:
1. Project deployable via `git push origin main`
2. Vercel build logs show successful deployment
3. All APIs accessible at deployed URL
4. Performance metrics maintained post-deployment
5. Monitoring/logs accessible in Vercel dashboard

---

## 6. Quality Metrics

All optimizations must maintain or improve these metrics:

| Metric | Current | Target |
|--------|---------|--------|
| Lighthouse Performance | 75-80 | ≥ 90 |
| Lighthouse SEO | 85-90 | ≥ 95 |
| Page Load Time | 2-3s | < 2s |
| CSS Bundle Size (gzipped) | ~25KB | < 30KB |
| JS Bundle Size (gzipped) | ~30KB | < 40KB |
| API Response Time | 100-150ms | < 100ms |
| Form Validation Pass Rate | 95% | 100% |
| Test Coverage | 0% | ≥ 80% |

---

## 7. Non-Functional Requirements

### 7.1 Backward Compatibility

- Existing functionality preserved exactly
- All forms continue to work as before
- Database operations unchanged
- API response structures unchanged
- No breaking changes to CSS selectors or HTML structure

### 7.2 Browser Compatibility

- All optimizations work in Chrome, Firefox, Safari, Edge
- No polyfills required (modern browser support)
- Mobile responsiveness maintained
- Touch interactions work on mobile

### 7.3 Scalability & Maintenance

- Documentation clear for future developers
- Code organized and commented where necessary
- Build process reproducible across environments
- Dependencies kept minimal and up-to-date

### 7.4 Security

- No sensitive data exposed in bundles
- API tokens and credentials never committed
- Environment variables properly managed
- Rate limiting prevents abuse

---

## 8. Constraints

| Constraint | Impact |
|-----------|--------|
| No complex bundler (keep esbuild) | Simpler CI/CD, faster builds |
| Maintain Vercel compatibility | Limited to serverless architecture |
| Plain CSS only (no SASS) | Manual CSS management |
| Vanilla JavaScript (no frameworks) | Direct DOM manipulation |
| Google Fonts (no self-hosting) | Smaller bundle, but external dependency |

---

## 9. Success Criteria Summary

✓ All 4 API endpoints documented and working
✓ Sitemap + robots.txt deployed and accessible
✓ Structured data valid per schema.org
✓ All images responsive with srcset
✓ CSS/JS bundled and minified (< 100KB combined)
✓ README + API docs + DEPLOYMENT guide complete
✓ .env.example comprehensive with all variables
✓ Unit tests cover form validation (≥ 90% coverage)
✓ E2E tests cover 5+ critical flows
✓ Integration tests validate all API endpoints
✓ Lighthouse Performance ≥ 90
✓ Lighthouse SEO ≥ 95
✓ Page load time < 2 seconds
✓ Zero console errors in production
✓ All features working exactly as before (backward compatible)

