# 📁 Cấu Trúc File Project MCONIC Redesign

## 🎯 Tóm Tắt

**Tổng cộng: 20 file chính (JS + CSS)**

### JavaScript Files (11 files)
### CSS Files (9 files)

---

## 📊 Chi Tiết Cấu Trúc File

### **1. API Backend Files** (Vercel Serverless Functions)

```
api/
├── contact.js      ← POST /api/contact (Tư vấn sự kiện)
├── document.js     ← POST /api/document (Tài liệu)
└── quote.js        ← POST /api/quote (Bảo hiểm)
```

**Vị trí trên Vercel:** Tự động map tới `/api/[filename]`  
**Cách hoạt động:** Khi form gửi `POST /api/contact`, Vercel gọi `api/contact.js`

**Các file này được RECREATE bởi tôi vì:**
- Ban đầu chúng bị xóa (chỉ còn `.DS_Store`)
- Tôi recreate với fix: `range: A1:G1` + `insertDataOption: 'INSERT_ROWS'`
- **Nằm ở:** `/api/` folder

---

### **2. Frontend JS Files** (Client-side)

#### Nằm ở Root:
```
script.js          ← Main logic (index.html dùng)
insurance.js       ← Logic cho insurance.html
server.js          ← Development server (local only)
test.js            ← Test file
test-api.js        ← API test script
contact.js         ← Có vẻ duplicate
document.js        ← Có vẻ duplicate
quote.js           ← Có vẻ duplicate
```

#### Nằm ở `/dist/js/`:
```
dist/js/
├── main.js         ← Bundled version của script.js
└── insurance.js    ← Bundled version của insurance.js
```

**❓ Vì sao có duplicate?**
- `script.js` + `dist/js/main.js` - Cùng logic (main.js là bundled/minified version)
- `insurance.js` + `dist/js/insurance.js` - Cùng logic (dist version là bundled)
- `contact.js`, `document.js`, `quote.js` ở root là **sai vị trí** (phải ở `/api/`)

**👉 Khi dùng Local (Go Live):**
- HTML link tới `script.js` (root)
- `script.js` gọi `/api/contact` → chạy `api/contact.js` (Vercel serverless)
- **Nhưng local không có Vercel**, nên cần chạy `server.js` để mock API

**👉 Khi dùng Vercel (GitHub + Vercel):**
- HTML link tới `script.js` (root)
- `script.js` gọi `/api/contact`
- Vercel automatically routes tới `api/contact.js` ✓

---

### **3. CSS Files** (9 files)

#### Nằm ở Root:
```
base.css           ← Base styling (variables, resets)
components.css     ← Component styles (buttons, forms, etc.)
layout.css         ← Layout & grid styles
style.css          ← Main styles
insurance.css      ← Insurance page specific styles
```

#### Nằm ở `/dist/css/`:
```
dist/css/
├── main.css        ← Bundled version của base.css + components.css + layout.css + style.css
└── insurance.css   ← Bundled version của insurance.css
```

**HTML linking:**
```html
<!-- index.html -->
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/style.css">

<!-- insurance.html -->
<link rel="stylesheet" href="css/base.css">
<link rel="stylesheet" href="css/layout.css">
<link rel="stylesheet" href="css/components.css">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/insurance.css">
```

---

## ⚠️ LỜI GIẢI THÍCH: Tại Sao GitHub + Vercel OK Nhưng Local Bị Lỗi?

### **1. Vercel (GitHub → Vercel)**
```
GitHub push
  ↓
Vercel auto-detect
  ↓
Deploy serverless functions
  ├── api/contact.js → POST /api/contact ✓
  ├── api/document.js → POST /api/document ✓
  └── api/quote.js → POST /api/quote ✓
  ↓
HTML files serve from root
  ├── index.html → link script.js ✓
  └── insurance.html → link insurance.js ✓
  ↓
Browser fetch /api/contact
  → Vercel routes to api/contact.js ✓
  → Returns response ✓
```

**Result: ✅ UI/UX Normal**

---

### **2. Local (Go Live)**
```
npm run dev / node server.js
  ↓
Express server starts (port 3000)
  ├── Serves static files (HTML, CSS, JS from root)
  ├── Serves index.html when you visit /
  └── Serves script.js when loaded
  ↓
Browser fetch /api/contact
  → Express server receives request
  → server.js has route handler for /api/contact? 
     ├── YES ✓ (server.js defines route → works)
     └── NO ❌ (no route → 404 error)
```

**Problem: ❌ Nếu không có Express server:**
- Local server chỉ serve static files (HTML, CSS, JS)
- `/api/contact` không có route definition
- Browser error: `404 Not Found` hoặc `CORS error`
- Form không gửi được → UI shows error

**Solution: ✅ Cách fix**
```bash
# Option 1: Run Express server (server.js)
node api/server.js

# Option 2: Use Vercel locally
npx vercel dev

# Option 3: Use VS Code Live Server NHƯNG
# - Live Server chỉ serve static files
# - API calls sẽ FAIL (no backend)
```

---

## 🔴 Vấn Đề: Duplicate Files (contact.js, document.js, quote.js ở root)

Hiện tại có:
```
✅ api/contact.js     ← ĐÚNG (Vercel serverless)
❌ contact.js        ← SAI (phải xóa)

✅ api/document.js    ← ĐÚNG (Vercel serverless)
❌ document.js       ← SAI (phải xóa)

✅ api/quote.js       ← ĐÚNG (Vercel serverless)
❌ quote.js          ← SAI (phải xóa)
```

**Tại sao bị duplicate?**
- Trước đây, tôi tạo file ở root như temporary test files
- Sau đó tạo file ở `/api/` folder (đúng cách)
- Quên không xóa file ở root

**Nên xóa:**
```bash
rm "/Users/leduykhang/Downloads/manulife/MCONIC Redesign/contact.js"
rm "/Users/leduykhang/Downloads/manulife/MCONIC Redesign/document.js"
rm "/Users/leduykhang/Downloads/manulife/MCONIC Redesign/quote.js"
rm "/Users/leduykhang/Downloads/manulife/MCONIC Redesign/test.js"
rm "/Users/leduykhang/Downloads/manulife/MCONIC Redesign/test-api.js"
```

---

## 📚 Tóm Tắt Cấu Trúc Đúng

```
MCONIC Redesign/
├── index.html
├── insurance.html
├── api/                           ← Vercel Serverless Functions
│   ├── contact.js   ✅ Dùng
│   ├── document.js  ✅ Dùng
│   ├── quote.js     ✅ Dùng
│   └── server.js    ✅ Local development
├── css/                           ← Stylesheets
│   ├── base.css     ✅ Dùng
│   ├── components.css ✅ Dùng
│   ├── layout.css   ✅ Dùng
│   ├── style.css    ✅ Dùng
│   └── insurance.css ✅ Dùng
├── js/                            ← Frontend JavaScript
│   ├── script.js    ✅ Dùng (index.html)
│   └── insurance.js ✅ Dùng (insurance.html)
├── dist/                          ← Bundled/minified (optional)
│   ├── css/
│   │   ├── main.css
│   │   └── insurance.css
│   └── js/
│       ├── main.js
│       └── insurance.js
├── contact.js       ❌ REMOVE (duplicate)
├── document.js      ❌ REMOVE (duplicate)
├── quote.js         ❌ REMOVE (duplicate)
├── test.js          ❌ REMOVE (test file)
├── test-api.js      ❌ REMOVE (test file)
└── ...other files
```

---

## 🚀 Deployment Flow

### **GitHub Push → Vercel Deploy:**

```
1. git push origin main
2. Vercel auto-deploys
3. Vercel reads vercel.json
4. Maps API routes:
   - POST /api/contact → api/contact.js
   - POST /api/document → api/document.js
   - POST /api/quote → api/quote.js
5. Deploys static files (HTML, CSS, JS)
6. Live site works ✅
```

### **Local Development (Go Live):**

```
Option A: Run server.js
  npm install (install dependencies)
  node api/server.js
  → Port 3000 available
  → API routes work ✅

Option B: Use Vercel CLI
  npm i -g vercel
  npx vercel dev
  → Emulates Vercel locally ✅

Option C: Live Server (NO API support)
  → CSS/JS loads ✓
  → API calls FAIL ❌
```

---

## 💡 Key Takeaway

**Vì sao Vercel OK nhưng Local bị lỗi UI/UX?**

| Aspect | Vercel | Local (No Server) | Local (with server.js) |
|--------|--------|-------------------|------------------------|
| Static Files (HTML, CSS, JS) | ✅ | ✅ | ✅ |
| API Routes | ✅ (Serverless) | ❌ | ✅ (Express) |
| Forms Submit | ✅ | ❌ | ✅ |
| UI/UX Status | OK | BROKEN | OK |

**Giải pháp:** Always use `node api/server.js` or `vercel dev` when developing locally.
