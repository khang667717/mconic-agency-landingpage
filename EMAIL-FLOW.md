# Email Flow Documentation

## Overview
Hệ thống gửi email thông báo khi có khách hàng submit form. Có 2 loại form, mỗi loại có email flow khác nhau.

---

## 1. Index Form (Tư vấn sự kiện) - `/api/contact`

### Email 1: Gửi tới KHÁCH HÀNG ✉️
```
To: [Email mà khách điền] (ví dụ: kimang6251@gmail.com)
From: MCONIC Event Agency <leduykhang25012005@gmail.com>
Subject: Xác nhận yêu cầu tư vấn sự kiện - MCONIC
```

**Content (tiếng Việt, HTML formatted):**
- Chào [Tên khách]
- Cảm ơn đã gửi yêu cầu tư vấn
- Thông báo sẽ liên hệ qua [Số điện thoại] trong 24h làm việc
- Footer: MCONIC Event Agency

**Code location:** `api/contact.js`, dòng ~165-180

### Email 2: Gửi tới ADMIN (BẠN) 📧
```
To: ADMIN_EMAIL (mặc định: leduykhang25012005@gmail.com)
From: MCONIC Event Agency <leduykhang25012005@gmail.com>
Subject: [LEAD MỚI] Yêu cầu tư vấn từ [Tên khách]
```

**Content:**
- Tiêu đề: "Thông tin khách hàng mới đăng ký tư vấn"
- Họ và tên: [Tên khách]
- Số điện thoại: [SĐT]
- Email: [Email khách]
- Thời gian: [Timestamp]

**Code location:** `api/contact.js`, dòng ~150-160

---

## 2. Insurance Form (Bảo hiểm) - `/api/quote`

### Email: Gửi tới ADMIN (BẠN) 📧
```
To: ADMIN_EMAIL (mặc định: leduykhang25012005@gmail.com)
From: MCONIC Protect <leduykhang25012005@gmail.com>
Subject: [LEAD BẢO HIỂM] Yêu cầu báo giá từ [Tên khách]
```

**Content:**
- Tiêu đề: "MCONIC Protect - Lead Bảo Hiểm"
- Bảng thông tin:
  - Họ và tên: [Tên khách]
  - Số điện thoại: [SĐT]
  - Tuổi: [Tuổi]
  - Gói thẻ đề xuất: [Tier] (ví dụ: Thẻ Vàng)
  - Thời gian: [Timestamp]
- Footer: "Vui lòng liên hệ khách hàng trong 24h để tư vấn"

**Code location:** `api/quote.js`, dòng ~200-235

**Note:** Insurance form KHÔNG gửi email xác nhận tới khách hàng (chỉ gửi admin)

---

## Email Configuration

### SMTP Settings (từ .env)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=leduykhang25012005@gmail.com
SMTP_PASS=bppc twet oqss bisr
```

### Sender Information
```env
SENDER_NAME=MCONIC Event Agency  # Cho contact form
# MCONIC Protect (hard-coded cho quote form)

ADMIN_EMAIL=leduykhang25012005@gmail.com
```

---

## How It Works

### 1. Khách submit form
```
User fills: Họ tên, SĐT, Email (+ Tuổi cho insurance)
User clicks: Submit button
```

### 2. Frontend validates
```javascript
// Kiểm tra client-side
- Họ tên: không trống
- SĐT: 10 số, bắt đầu bằng 0
- Email: format hợp lệ (contact only)
- Tuổi: số từ 0-120 (insurance only)
```

### 3. API processes (serverless)
```
POST /api/contact or /api/quote
├─ Server-side validation
├─ Log to Google Sheets (append new row)
├─ Send emails (if SMTP configured)
└─ Return success response
```

### 4. Email sent via SMTP
```
Nodemailer connects to Gmail SMTP
├─ Email 1: To customer (contact only)
└─ Email 2: To admin (both contact & insurance)
```

### 5. Frontend shows success
```
Success message displayed
User can submit another form
```

---

## Error Handling

### If Email Fails:
- ❌ Email service error (SMTP down, credentials wrong)
- ✅ Request still succeeds (doesn't block the submission)
- ✅ Data still saved to Google Sheets
- 📝 Error logged to console for debugging

### Common Email Issues:
1. **SMTP credentials wrong** → Check .env file
2. **Gmail App Password expired** → Generate new one
3. **Email not in Vercel env vars** → Add to Vercel dashboard
4. **Gmail SMTP blocked** → Enable "Less secure app access"

---

## Testing Email Flow

### Step 1: Fill Contact Form
```
Name: Nguyên Quang Huy
Phone: 0902970416
Email: kimang6251@gmail.com
Submit
```

### Step 2: Check Emails
- [ ] Email received at kimang6251@gmail.com (customer email)
- [ ] Email received at leduykhang25012005@gmail.com (admin email)
- [ ] Email has correct subject line
- [ ] Email has correct customer info

### Step 3: Fill Insurance Form
```
Name: Nguyên Quang Huy
Phone: 0902970416
Age: 25
Submit
```

### Step 4: Check Email
- [ ] Email received at leduykhang25012005@gmail.com (admin only)
- [ ] Email subject: "[LEAD BẢO HIỂM] Yêu cầu báo giá từ Nguyên Quang Huy"
- [ ] Email shows age: 25
- [ ] Email shows recommended tier (e.g., Thẻ Vàng)

---

## Vercel Environment Variables Required

Để emails hoạt động trên Vercel, cần set những biến này:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=leduykhang25012005@gmail.com
SMTP_PASS=bppc twet oqss bisr
ADMIN_EMAIL=leduykhang25012005@gmail.com
SENDER_NAME=MCONIC Event Agency
```

**Steps to add:**
1. Go to Vercel Dashboard
2. Select your project (MCONIC)
3. Settings → Environment Variables
4. Add each variable above
5. Redeploy or wait for next deployment

---

## Email Security

### HTML Escaping
- User input được escape để prevent XSS injection
- Function: `escapeHtml()` converts `<`, `>`, `&` → HTML entities

### SMTP Security
- Port 587 (TLS) được dùng thay vì 465 (SSL)
- `SMTP_SECURE=false` vì TLS được handle sau STARTTLS command

---

## Troubleshooting Checklist

- [ ] Email từ customer không tới?
  - Kiểm tra SMTP_USER, SMTP_PASS đúng chưa
  - Check Gmail inbox spam/junk folder
  - Verify email address format hợp lệ

- [ ] Email từ admin không tới?
  - Kiểm tra ADMIN_EMAIL đúng chưa
  - Verify SMTP credentials valid

- [ ] Email chậm tới?
  - Gmail SMTP có thể 1-5 phút để deliver
  - Check internet connection ổn định

- [ ] Dữ liệu không save nhưng email gửi được?
  - Google Sheets credentials có issue
  - Check GOOGLE_SHEET_ID, google-credentials.json valid

- [ ] Dữ liệu save được nhưng email không gửi?
  - SMTP credentials wrong
  - Email service down
  - Không có `to` address
