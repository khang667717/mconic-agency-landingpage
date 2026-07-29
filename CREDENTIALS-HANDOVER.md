# 🔐 Hướng Dẫn Bàn Giao Credentials (An Toàn)

**⚠️ QUAN TRỌNG:** File này hướng dẫn cách bàn giao các credentials nhạy cảm. Không được public, không được commit lên GitHub.

---

## 📋 Danh Sách Credentials Cần Bàn Giao

| Credentials | Hiện Tại | Bàn Giao Sang | Bảo Mật |
|------------|---------|--------------|--------|
| **GOOGLE_SHEET_ID** | 10gHUhGOXVKRLlYXmnW9PVY2Cu2JhGvCfcs1BbhcUlqA | [ID Sheet mới] | ⭐ Công khai (OK) |
| **GOOGLE_SHEET_TAB_NAME** | Trang tính1 | Trang tính1 | ⭐ Công khai (OK) |
| **SMTP_HOST** | smtp.gmail.com | smtp.gmail.com | ⭐ Công khai (OK) |
| **SMTP_PORT** | 587 | 587 | ⭐ Công khai (OK) |
| **SMTP_USER** | leduykhang25012005@gmail.com | [Email công ty] | ⭐ Có thể public |
| **SMTP_PASS** | bppc twet oqss bisr | [Password mới] | 🔴 BẢNG MẬT (Tuyệt đối) |
| **ADMIN_EMAIL** | leduykhang25012005@gmail.com | [Email quản lý] | ⭐ Công khai (OK) |
| **SENDER_NAME** | MCONIC Event Agency | MCONIC Event Agency | ⭐ Công khai (OK) |
| **google-credentials.json** | [Private Key File] | [File mới] | 🔴 BẢNG MẬT (Tuyệt đối) |

---

## 🎯 Cách Bàn Giao Từng Credentials

### 1️⃣ GOOGLE_SHEET_ID (Công Khai ✅)

```
Hiện tại: 10gHUhGOXVKRLlYXmnW9PVY2Cu2JhGvCfcs1BbhcUlqA
```

**Cách bàn giao:**
1. Công ty tạo Google Sheet mới
2. Lấy Sheet ID từ URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID_ĐÂY]/edit
   ```
3. Ghi vào file hoặc gửi qua email bình thường

**Cập nhật Vercel:**
- Vào Vercel Dashboard
- Settings → Environment Variables
- Sửa `GOOGLE_SHEET_ID` = Sheet ID mới
- Bấm Save → Auto redeploy

---

### 2️⃣ SMTP_USER (Email SMTP - Có thể public ✅)

```
Hiện tại: leduykhang25012005@gmail.com
```

**Cách bàn giao:**
1. **Option A: Dùng email công ty**
   - Email: admin@mconic.vn (hoặc email công ty khác)
   - Gửi qua email bình thường OK

2. **Option B: Giữ nguyên**
   - Giữ email cũ
   - Nhưng phải thay password

**Cập nhật Vercel:**
- Settings → Environment Variables
- Sửa `SMTP_USER` = email mới
- Bấm Save

---

### 3️⃣ SMTP_PASS (Password SMTP - 🔴 BẢO MẬT CÓ)

```
Hiện tại: bppc twet oqss bisr
```

**⚠️ QUAN TRỌNG:**
- **KHÔNG BẰNG CÁCH NÀO** gửi qua email, chat, hoặc công khai
- **KHÔNG** commit lên GitHub
- **KHÔNG** để trên tờ giấy hay document công khai

**Cách bàn giao AN TOÀN:**

#### **Cách 1: Trực tiếp Trên Máy (An Toàn Nhất)**
```
1. Người quản lý ngồi cạnh
2. Bạn mở Vercel trên máy
3. Bạn gõ password vào ô SMTP_PASS
4. Bấm Save
5. Xong - Người quản lý thấy nó được lưu nhưng không nhìn thấy password
```

#### **Cách 2: Qua File Encrypted (An Toàn)**
```
1. Tạo file .txt chứa password
2. Encrypt file bằng công cụ (7-Zip, WinRAR, PGP, etc.)
3. Gửi file encrypted + password unlock qua 2 kênh khác nhau:
   - File qua email
   - Password qua Telegram/WhatsApp
4. Người nhận decrypt → Copy password → Paste vào Vercel
```

#### **Cách 3: Tạo Password Mới (Nên Nhất)**
```
Nếu bạn muốn transfer hẳn cho công ty:

1. Công ty tạo Gmail account hoặc dùng email công ty
2. Tạo App Password mới:
   - Gmail → Security → App passwords
   - Tạo password (không phải password Gmail thường)
3. Ghi password mới này vào Vercel
4. Xoá password cũ (của bạn) từ Vercel
```

**Cập nhật Vercel:**
- Settings → Environment Variables
- Sửa `SMTP_PASS` = password mới
- Bấm Save
- ⚠️ Ai update, người đó mới thấy được password lúc nhập

---

### 4️⃣ ADMIN_EMAIL (Email Nhận Thông Báo - Công Khai ✅)

```
Hiện tại: leduykhang25012005@gmail.com
```

**Cách bàn giao:**
1. Công ty gửi email nhận thông báo
   - Ví dụ: admin@mconic.vn
2. Gửi qua email bình thường OK

**Cập nhật Vercel:**
- Settings → Environment Variables
- Sửa `ADMIN_EMAIL` = email quản lý công ty
- Bấm Save

---

### 5️⃣ google-credentials.json (Private Key - 🔴 BẢO MẬT CÓ)

**⚠️ CẢNH BÁO:**
- File này chứa **Private Key** của Service Account
- **KHÔNG BẰNG CÁCH NÀO** public, commit, hoặc share
- Nếu leak → Bất kỳ ai cũng có thể access Google Sheets của công ty!

**Cách bàn giao AN TOÀN:**

#### **Bước 1: Công Ty Tạo Service Account Mới (Khuyến Khích Nhất)**

```
(Xem chi tiết trong file GOOGLE-SHEETS-SETUP.md)

1. Công ty vào Google Cloud Console
2. Tạo Service Account
3. Tạo JSON Key
4. Download file json_credentials.json
5. Công ty lưu file này an toàn (không share)
```

#### **Bước 2: Bàn Giao File (Nếu Công Ty Không Biết Tạo)**

**Nếu bàn giao file cũ:**
```
❌ KHÔNG LÀM:
- Không email file
- Không upload file lên cloud public
- Không share link Google Drive

✅ NÊN LÀM:
- Trực tiếp copy file từ máy sang máy
- Hoặc: Mã hóa file + gửi qua đĩa CD/USB
- Hoặc: Tạo account Google mới cho công ty → Công ty download file từ Google Cloud
```

#### **Bước 3: Thêm Vào Vercel (Cách Khác Với File Local)**

**Vercel không hỗ trợ upload file, phải paste nội dung:**

1. Mở file `google-credentials.json` bằng Text Editor
2. Copy toàn bộ nội dung (từ `{` đến `}`)
3. Vào Vercel → Settings → Environment Variables
4. **Thêm biến mới:**
   - Key: `GOOGLE_CREDENTIALS_JSON`
   - Value: Paste toàn bộ nội dung JSON
5. Bấm Save

**Ví dụ nội dung JSON:**
```json
{
  "type": "service_account",
  "project_id": "mconic-landing-page",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "mconic-landing-page@mconic-landing-page.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

---

## 📝 Bảng Tóm Tắt Bàn Giao

| Credentials | Cách Gửi | An Toàn | Ghi Chú |
|------------|---------|---------|--------|
| GOOGLE_SHEET_ID | Email / Chat | ✅ | Công khai |
| SMTP_USER | Email / Chat | ✅ | Công khai |
| SMTP_PASS | Trực tiếp / Encrypted | 🔴 | BẢNG MẬT |
| ADMIN_EMAIL | Email / Chat | ✅ | Công khai |
| google-credentials.json | Trực tiếp / Disk | 🔴 | BẢNG MẬT |

---

## ✅ Checklist Bàn Giao Credentials

### Để Cho Người Thực Tập (Bạn)
- [ ] Lấy được GOOGLE_SHEET_ID mới từ công ty
- [ ] Lấy được SMTP_USER (email) từ công ty
- [ ] Lấy được SMTP_PASS từ công ty (an toàn)
- [ ] Lấy được ADMIN_EMAIL từ công ty
- [ ] Nhận được google-credentials.json từ công ty (hoặc hướng dẫn tạo)
- [ ] Đã test lại trên Vercel
- [ ] Form submit → Email gửi ✅
- [ ] Form submit → Dữ liệu vào Google Sheet ✅

### Để Cho Người Quản Lý (Công Ty)
- [ ] Hiểu tại sao credentials nhạy cảm
- [ ] Biết không nên gửi credentials qua email
- [ ] Đã cấp GOOGLE_SHEET_ID mới
- [ ] Đã cấp SMTP_USER mới (email)
- [ ] Đã cấp SMTP_PASS mới an toàn
- [ ] Đã cấp ADMIN_EMAIL
- [ ] Đã cấp google-credentials.json an toàn
- [ ] Đã test website hoạt động
- [ ] Biết ai liên hệ khi có vấn đề

---

## 🚨 Cảnh Báo Bảo Mật

### ❌ KHÔNG ĐƯỢC LÀM
- ❌ Commit credentials lên GitHub
- ❌ Gửi password qua email, Slack, Discord
- ❌ Viết password trên giấy công khai
- ❌ Share google-credentials.json file công khai
- ❌ Để credentials trong source code
- ❌ Screenshot password rồi gửi

### ✅ NÊN LÀM
- ✅ Dùng Vercel Environment Variables
- ✅ Gửi credentials trực tiếp trên máy
- ✅ Mã hóa file trước khi gửi
- ✅ Xoá credentials cũ khi không dùng
- ✅ Rotate password 6 tháng 1 lần
- ✅ Ai access, thì người đó quản lý

---

## 🔄 Quy Trình Bàn Giao Hoàn Chỉnh

### Ngày 1: Chuẩn Bị
```
1. Bàn thảo với công ty:
   - Tạo Google Sheet mới?
   - Dùng email công ty nào?
   - Ai quản lý credentials?

2. Công ty chuẩn bị:
   - Tạo Google Sheet
   - Tạo Service Account (Google Cloud)
   - Download google-credentials.json
   - Tạo email SMTP (nếu cần)
   - Tạo App Password
```

### Ngày 2: Bàn Giao Thực Tế
```
1. Vào phòng họp / Online meeting

2. Bàn giao công khai (qua email/chat):
   - GOOGLE_SHEET_ID
   - SMTP_USER
   - ADMIN_EMAIL

3. Bàn giao riêng tư (trực tiếp):
   - SMTP_PASS (Bạn gõ vào Vercel)
   - google-credentials.json (USB/Encrypted)

4. Test lại:
   - Submit form
   - Check Google Sheet
   - Check email

5. Ký xác nhận
```

### Ngày 3+: Follow-up
```
1. Công ty test độc lập
2. Nếu lỗi → Liên hệ support
3. Xoá credentials cũ (nếu cần)
```

---

## 📞 Liên Hệ Support

**Nếu xảy ra lỗi bảo mật:**
- [ ] Email gửi không được?
- [ ] Google Sheet không lưu?
- [ ] Credentials bị leak?

**Liên hệ ngay:**
- Email: leduykhang25012005@gmail.com
- GitHub: https://github.com/khang667717

---

## ✍️ Ký Xác Nhận Bàn Giao Credentials

### Người Thực Tập
- **Tên:** _____________________
- **Chữ ký:** ___________________
- **Ngày:** _____________________

**Xác nhận đã:**
- ✅ Bàn giao tất cả credentials an toàn
- ✅ Hướng dẫn công ty quản lý credentials
- ✅ Không giữ lại backup credentials

### Người Quản Lý (Công Ty)
- **Tên:** _____________________
- **Chữ ký:** ___________________
- **Ngày:** _____________________

**Xác nhận đã:**
- ✅ Nhận tất cả credentials
- ✅ Lưu credentials an toàn
- ✅ Test website hoạt động
- ✅ Biết cách quản lý credentials

---

**Handover Date:** _____________________
**Status:** ✅ Ready for Transfer
**Version:** 1.0
