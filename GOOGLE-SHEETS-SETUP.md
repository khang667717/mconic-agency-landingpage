# 🔐 Hướng Dẫn Transfer Google Sheets & Credentials

**⚠️ QUAN TRỌNG:** File `google-credentials.json` chứa private key. KHÔNG ĐƯỢC commit lên GitHub hoặc share công khai.

---

## 📋 Tổng Quan

Website cần kết nối tới Google Sheets để lưu dữ liệu khách hàng. Hiện tại đang dùng:
- **Google Sheets ID:** 10gHUhGOXVKRLlYXmnW9PVY2Cu2JhGvCfcs1BbhcUlqA
- **Email Service Account:** (được tạo từ Google Cloud)

**Để bàn giao:** Công ty phải có Google Sheet của riêng mình + Service Account mới.

---

## ✅ Cách 1: Nếu Công Ty Có Google Workspace / Gmail Business

*(Cách này an toàn và dễ nhất)*

### Bước 1: Tạo Google Sheet Mới

1. Vào https://sheets.google.com
2. Bấm **"+"** (New Sheet)
3. Đặt tên: `MCONIC Lead Management` hoặc tên khác tùy ý
4. Lưu ý lấy **Sheet ID** (phần dài trong URL)

**Ví dụ URL:**
```
https://docs.google.com/spreadsheets/d/10gHUhGOXVKRLlYXmnW9PVY2Cu2JhGvCfcs1BbhcUlqA/edit
                                    └─── Sheet ID ────────────────────────────────┘
```

### Bước 2: Tạo Service Account (Google Cloud)

1. Vào https://console.cloud.google.com
2. Tạo project baru hoặc dùng project cũ
3. Tìm **"Service Accounts"**
4. Bấm **"Create Service Account"**
5. Điền thông tin:
   - Name: `MCONIC Landing Page`
   - ID: `mconic-landing-page`
6. Bấm **"Create and Continue"**

### Bước 3: Tạo Key (JSON)

1. Vào Service Account vừa tạo
2. Tab **"Keys"**
3. Bấm **"Add Key"** → **"Create New Key"**
4. Chọn **"JSON"**
5. Bấm **"Create"** → File sẽ download về
6. **Lưu file này an toàn** - đây là `google-credentials.json` mới

### Bước 4: Share Sheet cho Service Account

1. Mở Google Sheet mới (từ Bước 1)
2. Bấm **"Share"** (nút trên cùng)
3. Tìm email Service Account (trong file JSON vừa download)
   - Key: `"client_email"` → Email như: `mconic-landing-page@[project-id].iam.gserviceaccount.com`
4. Share với quyền **"Editor"**

### Bước 5: Enable Google Sheets API

1. Vào Google Cloud Console
2. Tìm **"APIs & Services"** → **"Library"**
3. Tìm **"Google Sheets API"**
4. Bấm **"Enable"**

### Bước 6: Cập Nhật Vercel

1. Vào Vercel Dashboard
2. Project: `mconic-redesign`
3. Settings → **Environment Variables**
4. Cập nhật:
   - `GOOGLE_SHEET_ID`: [ID mới từ Bước 1]
   - `GOOGLE_SHEET_TAB_NAME`: Tên tab trong Sheet (mặc định: `Trang tính1`)
5. **Thêm biến mới:** `GOOGLE_CREDENTIALS_JSON`
   - Value: Nội dung file JSON (toàn bộ, từ `{` đến `}`)
6. Bấm **"Save"**
7. Chờ Vercel redeploy (2-3 phút)

### Bước 7: Test

1. Truy cập website
2. Submit form test
3. Kiểm tra dữ liệu vào Google Sheet mới
4. Nếu thành công → Hoàn tất! ✅

---

## 🔄 Cách 2: Transfer Từ Account Cũ Sang Account Mới

*(Nếu muốn giữ lại account cũ)*

### Bước 1: Copy Dữ Liệu (Optional)

```
Account Cũ Google Sheet → Copy tất cả dữ liệu → Paste vào Sheet mới
```

### Bước 2: Tạo Service Account Mới (Như Cách 1)

### Bước 3: Cấp Quyền Cho Service Account Mới

- Share Sheet mới cho Service Account email
- Quyền: **Editor**

### Bước 4: Cập Nhật Vercel

- GOOGLE_SHEET_ID: [ID Sheet mới]
- GOOGLE_CREDENTIALS_JSON: [JSON mới từ google-credentials.json]

### Bước 5: Xoá Account Cũ (Optional)

```
Nếu không cần account cũ nữa:
1. Xoá Service Account cũ từ Google Cloud
2. Xoá Sheet cũ (hoặc giữ để backup)
```

---

## 📧 Email SMTP (Gửi Email)

### Hiện Tại Dùng

```
Email: leduykhang25012005@gmail.com
App Password: bppc twet oqss bisr (đã tạo từ Gmail)
```

### Cần Thay Đổi Không?

**Option 1: Dùng Email Công Ty**
- Email: admin@mconic.vn
- Cần tạo App Password mới
- Hướng dẫn:
  1. Vào https://myaccount.google.com
  2. Security → App passwords
  3. Tạo password cho "Mail" + "Windows"
  4. Copy password → Cập nhật Vercel

**Option 2: Giữ Nguyên**
- Giữ email `leduykhang25012005@gmail.com`
- Nhưng phải chuyển quyền sở hữu

### Cập Nhật Vercel

Settings → Environment Variables:
```
SMTP_USER: [email mới hoặc cũ]
SMTP_PASS: [app password mới]
ADMIN_EMAIL: [email quản lý công ty]
SENDER_NAME: MCONIC Event Agency
```

---

## 🔒 Bảo Mật - QUAN TRỌNG!

### ❌ KHÔNG ĐƯỢC

- ❌ Commit `google-credentials.json` lên GitHub
- ❌ Share file JSON công khai
- ❌ Gửi password qua email
- ❌ Để private key trong source code

### ✅ NÊN

- ✅ Lưu file JSON ở nơi an toàn (máy cá nhân, safe)
- ✅ Chỉ paste nội dung vào Vercel Environment Variables
- ✅ Rotate credentials 6 tháng 1 lần
- ✅ Xoá credentials cũ khi không dùng

### File `.gitignore` Đã Chặn

```
google-credentials.json   # ← Đã ở trong .gitignore
.env                      # ← Không commit env file
```

Nên file JSON KHÔNG BẰNG CÁCH NÀO commit lên GitHub ✅

---

## 📝 Checklist Bàn Giao Google Credentials

- [ ] **Google Sheet mới được tạo**
  - Link: ___________________________
  - Sheet ID: ___________________________

- [ ] **Service Account được tạo**
  - Email: ___________________________
  - Project ID: ___________________________

- [ ] **google-credentials.json được download**
  - Lưu vị trí: ___________________________
  - Backup: Có / Không

- [ ] **API Enable**
  - [ ] Google Sheets API
  - [ ] Google Drive API (optional, nếu cần)

- [ ] **Share Sheet cho Service Account**
  - Permission: Editor ✓

- [ ] **Vercel Environment Variables Updated**
  - [ ] GOOGLE_SHEET_ID
  - [ ] GOOGLE_SHEET_TAB_NAME
  - [ ] GOOGLE_CREDENTIALS_JSON

- [ ] **Email SMTP Setup**
  - [ ] SMTP_USER: ___________________________
  - [ ] SMTP_PASS: [ẩn vì bảo mật]
  - [ ] ADMIN_EMAIL: ___________________________

- [ ] **Test**
  - [ ] Submit form test
  - [ ] Dữ liệu lưu vào Sheet
  - [ ] Email nhận được

---

## 🆘 Troubleshooting

### Google Sheet Không Lưu Dữ Liệu

**Kiểm tra:**
1. Sheet ID đúng chưa?
2. Service Account có quyền Editor không?
3. Credentials JSON hợp lệ không?

**Fix:**
```
1. Verify Sheet ID: copy lại từ URL
2. Check share settings: Sheet → Share → Check email Service Account
3. Test API: Gọi Google Sheets API test
```

### Email Không Gửi Được

**Kiểm tra:**
1. SMTP credentials đúng?
2. 2-Factor Authentication bật không?
3. App Password hợp lệ?

**Fix:**
```
1. Vào Gmail → Security → App passwords
2. Tạo password mới cho "Mail"
3. Copy vào Vercel: SMTP_PASS
```

### API Permission Denied

**Kiểm tra:**
1. Google Sheets API enabled?
2. google-credentials.json hợp lệ?

**Fix:**
```
1. Google Cloud → Enable Google Sheets API
2. Tạo credentials mới
```

---

## 📞 Support

**Nếu cần hỗ trợ setup:**

1. **Tự setup (Easy):**
   - Follow hướng dẫn Cách 1 bên trên
   - Test lại

2. **Cần giúp:**
   - Contact: [Người code]
   - Email: leduykhang25012005@gmail.com
   - Chuẩn bị: Sheet ID + Service Account Email

---

## 🎓 Cheat Sheet - Lệnh / Link Nhanh

| Cái Cần | Link / Command |
|--------|----------------|
| **Tạo Sheet** | https://sheets.google.com |
| **Google Cloud** | https://console.cloud.google.com |
| **Vercel Settings** | https://vercel.com/khang667717/mconic-redesign/settings |
| **Gmail App Passwords** | https://myaccount.google.com/apppasswords |
| **Service Account** | Google Cloud → Service Accounts |
| **Enable API** | Google Cloud → APIs & Services → Library |

---

## ✍️ Ký Xác Nhận

**Người Thực Tập (Hướng Dẫn):**
- Tên: _____________________
- Chữ ký: ___________________
- Ngày: _____________________

**Người Nhận (Công Ty):**
- Tên: _____________________
- Chữ ký: ___________________
- Ngày: _____________________

**Xác nhận:**
- ✅ Hiểu cách setup Google Credentials
- ✅ Biết cách update Vercel Environment Variables
- ✅ Biết cách bảo mật credentials
- ✅ Có backup google-credentials.json

---

**Last Updated:** [Ngày hôm nay]
**Version:** 1.0
**Status:** Ready for Handover ✅
