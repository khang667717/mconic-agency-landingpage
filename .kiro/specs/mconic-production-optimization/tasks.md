# MCONIC Production Optimization — Task List

## Phase 1: Build System Setup

### Task 1.1: Install esbuild and dependencies
- [ ] Run: `npm install --save-dev esbuild@latest`
- [ ] Run: `npm install --save-dev concurrently` (for parallel dev tasks)
- [ ] Verify installation: `npm list esbuild concurrently`
- [ ] Document versions in package.json

### Task 1.2: Create esbuild.config.js
- [ ] Create file: `/esbuild.config.js`
- [ ] Configure JS entry points: `js/script.js` → `dist/js/main.min.js`
- [ ] Configure CSS entry points: `css/base.css` → `dist/css/main.min.css`
- [ ] Enable minification and sourcemaps
- [ ] Set `process.env.NODE_ENV` define
- [ ] Test config: `node esbuild.config.js`

### Task 1.3: Update package.json scripts
- [ ] Add `"build": "node esbuild.config.js"`
- [ ] Add `"build:watch": "node esbuild.config.js --watch"`
- [ ] Add `"dev": "concurrently \"npm run build:watch\" \"npm run server:dev\""`
- [ ] Rename `"dev"` → `"server:dev"`
- [ ] Test all scripts work: `npm run build`, `npm run dev`, `npm run server:dev`

### Task 1.4: Verify build output
- [ ] Run `npm run build`
- [ ] Check `/dist/js/` contains `main.min.js` and `.map`
- [ ] Check `/dist/css/` contains `main.min.css` and `.map`
- [ ] Verify bundles minified (no whitespace, smaller size)
- [ ] Commit configuration files to git

---

## Phase 2: Performance Optimization

### Task 2.1: Implement critical CSS inline
- [ ] Analyze above-fold content in index.html
- [ ] Extract critical CSS: nav, hero, buttons, forms (~2-3KB)
- [ ] Create `css/critical.css` file with critical styles
- [ ] Add `<style>` block in `index.html` `<head>` with critical CSS
- [ ] Add `<style>` block in `insurance.html` `<head>` with critical CSS
- [ ] Add `<link rel="preload" as="style">` for main CSS
- [ ] Test in browser: Hero should render before full CSS loads
- [ ] Verify no visual regression

### Task 2.2: Optimize font loading
- [ ] Add `<link rel="preconnect" href="https://fonts.googleapis.com">`
- [ ] Add `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>`
- [ ] Add `<link rel="dns-prefetch" href="https://cdnjs.cloudflare.com">`
- [ ] Verify Google Fonts URL includes `display=swap`
- [ ] Update CSS fallback fonts: `'Archivo', 'Georgia', serif` and `'Public Sans', system-ui, -apple-system, sans-serif`
- [ ] Test font rendering with DevTools (throttle network to slow 3G)

### Task 2.3: Add image srcset and lazy loading
- [ ] Update hero image: add `srcset` with 2x, 3x variants
- [ ] Update all case study images: add `srcset`
- [ ] Add `loading="lazy"` to images below fold
- [ ] Add `width` and `height` attributes to all images (prevent CLS)
- [ ] Update WebP and JPG images with density variants
- [ ] Test responsive images with DevTools
- [ ] Verify layout doesn't shift during load

### Task 2.4: Configure caching headers
- [ ] Open `api/server.js`
- [ ] Add Cache-Control middleware after compression middleware
- [ ] Static assets (*.js, *.css, *.webp, *.png, *.jpg): `max-age=31536000, immutable`
- [ ] HTML pages: `max-age=3600, must-revalidate`
- [ ] API responses: `no-cache, no-store, must-revalidate`
- [ ] Test with curl: `curl -i https://mconic.vn/dist/js/main.min.js | grep Cache-Control`

### Task 2.5: Verify performance metrics
- [ ] Run Lighthouse in Chrome DevTools (Performance tab)
- [ ] Screenshot Performance score (target: ≥ 90)
- [ ] Check FCP (First Contentful Paint) < 1.5s
- [ ] Check LCP (Largest Contentful Paint) < 2.5s
- [ ] Check CLS (Cumulative Layout Shift) < 0.1
- [ ] Document baseline metrics before submission

---

## Phase 3: SEO Implementation

### Task 3.1: Create sitemap.xml
- [ ] Create file: `/sitemap.xml`
- [ ] Add urlset for `/` (priority: 1.0, changefreq: weekly)
- [ ] Add urlset for `/insurance.html` (priority: 0.8, changefreq: weekly)
- [ ] Format with proper lastmod dates (YYYY-MM-DD)
- [ ] Validate XML: `xmllint --noout sitemap.xml` or use online validator
- [ ] Test accessibility: `curl https://mconic.vn/sitemap.xml`

### Task 3.2: Create robots.txt
- [ ] Create file: `/robots.txt`
- [ ] Add `User-agent: *`
- [ ] Add `Allow: /`
- [ ] Add `Disallow: /api/`
- [ ] Add `Disallow: /api/admin/`
- [ ] Add `Sitemap: https://mconic.vn/sitemap.xml`
- [ ] Test with robots.txt checker tool

### Task 3.3: Add structured data (ld+json)
- [ ] Add LocalBusiness schema to `index.html` `<head>`
  - Include: name, url, logo, description, telephone, address, areaServed, aggregateRating
- [ ] Add Product schema to `insurance.html` `<head>`
  - Include: name, description, offers
- [ ] Validate with Google Structured Data Test Tool
- [ ] Check for errors/warnings (should show 0 errors)

### Task 3.4: Update meta tags
- [ ] Add/update Open Graph tags (og:title, og:description, og:image, og:url, og:type) in both pages
- [ ] Add Twitter Card tags (twitter:card, twitter:title, twitter:description, twitter:image)
- [ ] Add canonical links: `<link rel="canonical" href="https://mconic.vn/">`
- [ ] Add hreflang: `<link rel="alternate" hreflang="vi" href="https://mconic.vn/">`
- [ ] Update description meta (150-160 characters)
- [ ] Test with Facebook Share Debugger and Twitter Card Validator

---

## Phase 4: Documentation

### Task 4.1: Create README.md
- [ ] Create file: `/README.md`
- [ ] Add project overview (2-3 paragraphs)
- [ ] Add tech stack section
- [ ] Add quick start guide
- [ ] Add project structure with descriptions
- [ ] Add environment setup section
- [ ] Add all npm scripts with examples
- [ ] Add testing command reference
- [ ] Add deployment section (link to DEPLOYMENT.md)
- [ ] Add troubleshooting section

### Task 4.2: Create API.md
- [ ] Create file: `/API.md`
- [ ] Document `/api/leads/contact` endpoint (method, auth, request, response, errors, examples)
- [ ] Document `/api/leads/document` endpoint
- [ ] Document `/api/leads/quote` endpoint
- [ ] Document `/api/admin/leads` endpoint
- [ ] Include rate limiting info (5/min per IP)
- [ ] Include cURL examples for each endpoint
- [ ] Add error code reference (400, 429, 500, etc.)

### Task 4.3: Create DEPLOYMENT.md
- [ ] Create file: `/DEPLOYMENT.md`
- [ ] Add prerequisites (Node.js, npm, Vercel account)
- [ ] Add environment variables section (checklist with descriptions)
- [ ] Add Gmail SMTP setup instructions
- [ ] Add Google Sheets API setup (if used)
- [ ] Add step-by-step Vercel deployment
- [ ] Add GitHub auto-deploy setup
- [ ] Add monitoring and logs section
- [ ] Add health check procedures

### Task 4.4: Update .env.example
- [ ] Update file: `/.env.example`
- [ ] Add FRONTEND variables (VITE_BASE_URL)
- [ ] Add BACKEND variables (NODE_ENV, PORT)
- [ ] Add DATABASE variables (DATABASE_PATH)
- [ ] Add SMTP variables (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL, SENDER_NAME)
- [ ] Add GOOGLE_SHEETS variables (ID, TAB_NAME, CREDENTIALS_JSON)
- [ ] Add SECURITY variables (ADMIN_TOKEN, RATE_LIMIT settings)
- [ ] Add comments explaining each variable and how to obtain it
- [ ] Test that `.env` can be created from `.env.example` template

---

## Phase 5: Testing Setup

### Task 5.1: Setup Jest for unit testing
- [ ] Run: `npm install --save-dev jest @types/jest`
- [ ] Create file: `jest.config.js`
- [ ] Add to package.json: `"test:unit": "jest tests/unit"`
- [ ] Create directory: `tests/unit/`
- [ ] Test Jest setup: `npm run test:unit` (should run 0 tests initially)

### Task 5.2: Create form validation unit tests
- [ ] Create file: `tests/unit/validation.test.js`
- [ ] Write test: Phone validation accepts 10-digit starting with 0
- [ ] Write test: Phone validation rejects non-10-digit numbers
- [ ] Write test: Email validation accepts valid emails
- [ ] Write test: Email validation rejects invalid emails
- [ ] Write test: Name validation rejects empty strings
- [ ] Write test: Age validation accepts 18-100
- [ ] Run: `npm run test:unit` (all tests should pass)
- [ ] Verify coverage ≥ 90%

### Task 5.3: Setup Playwright for E2E testing
- [ ] Run: `npm install --save-dev @playwright/test`
- [ ] Create file: `playwright.config.js`
- [ ] Add to package.json: `"test:e2e": "playwright test"`
- [ ] Create directory: `tests/e2e/`
- [ ] Test Playwright setup: `npm run test:e2e` (should run 0 tests initially)

### Task 5.4: Write E2E test for contact form
- [ ] Create file: `tests/e2e/contact-form.spec.js`
- [ ] Write test: Navigate to page → Fill contact form → Submit → Success message
- [ ] Write test: Invalid phone number shows error
- [ ] Write test: Empty fields prevent submission
- [ ] Run: `npm run test:e2e` (tests should pass)

### Task 5.5: Write E2E tests for document and insurance flows
- [ ] Create file: `tests/e2e/document-flow.spec.js`
- [ ] Write test: Open document modal → Select document → Submit → Confirmation
- [ ] Create file: `tests/e2e/insurance-flow.spec.js`
- [ ] Write test: Enter age → View recommendation → Submit → Success
- [ ] Run all E2E tests: `npm run test:e2e` (all should pass)

---

## Phase 6: Deployment & Verification

### Task 6.1: Prepare for production
- [ ] Run: `npm run build` (verify clean build with no errors)
- [ ] Delete old assets if needed (clean previous builds)
- [ ] Verify all tests pass: `npm run test:unit && npm run test:e2e`
- [ ] Run Lighthouse audit (document scores)
- [ ] Check for console errors: Open DevTools and reload page

### Task 6.2: Deploy to Vercel
- [ ] Commit all changes: `git add . && git commit -m "feat: production optimization"`
- [ ] Push to main: `git push origin main`
- [ ] Monitor Vercel build logs
- [ ] Verify build succeeds (no errors)
- [ ] Check Vercel deployment URL

### Task 6.3: Verify deployed features
- [ ] Test contact form on production
- [ ] Test document request form
- [ ] Test insurance quote form
- [ ] Verify sitemap accessible: `https://mconic.vn/sitemap.xml`
- [ ] Verify robots.txt accessible: `https://mconic.vn/robots.txt`
- [ ] Test structured data: Google SDTT should show no errors
- [ ] Verify cache headers: `curl -i https://mconic.vn/dist/js/main.min.js`

### Task 6.4: Final quality checks
- [ ] Run Lighthouse on production URL (all scores ≥ target)
- [ ] Check Core Web Vitals (all green)
- [ ] Verify no 404 errors in console
- [ ] Test mobile responsiveness on actual device
- [ ] Test on Chrome, Firefox, Safari
- [ ] Verify API rate limiting (test 6 requests quickly)

