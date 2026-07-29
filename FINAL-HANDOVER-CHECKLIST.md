# ✅ Checklist Bàn Giao Cuối Cùng (FINAL)

**Chỉ 6 bước → Công ty có website riêng hoàn toàn độc lập**

---

## 📋 Quy Trình Bàn Giao (Công ty làm)

### Bước 1️⃣: Tạo Google Sheet Mới

**Công ty làm:**
1. Vào https://sheets.google.com
2. Bấm **"+"** (New Sheet)
3. Đặt tên: `MCONIC Lead Management` (hoặc tên khác)
4. **Copy Sheet ID từ URL:**
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID_ĐÂY]/edit
   ```
5. Lưu Sheet ID vào chỗ an toàn

✅ **Xong:**

---

### Bước 2️⃣: Tạo Service Account & Key (Google Cloud)

**Công ty IT làm:**
1. Vào https://console.cloud.google.com
2. Tạo **Project mới** hoặc dùng project cũ
3. **IAM & Admin** → **Service Accounts**
4. Bấm **"Create Service Account"**
5. Điền:
   - Name: `mconic-landing-page`
   - ID: `mconic-landing-page`
6. Bấm **"Create and Continue"**

✅ **Xong:** Service Account được tạo

---

### Bước 3️⃣: Tạo JSON Key

**Công ty IT tiếp tục:**
1. Vào Service Account vừa tạo
2. Tab **"Keys"**
3. Bấm **"Add Key"** → **"Create New Key"**
4. Chọn **"JSON"**
5. Bấm **"Create"** → **File download về máy**
6. **Lưu file an toàn** (đây là `google-credentials.json`)

**File sẽ trông như:**
```json
{
  "type": "service_account",
  "project_id": "mconic-landing-page",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "mconic-landing-page@mconic-landing-page.iam.gserviceaccount.com",
  ...
}
```

✅ **Xong:** JSON file downloaded

---

### Bước 4️⃣: Share Sheet cho Service Account

**Công ty làm:**
1. Mở Google Sheet (từ Bước 1)
2. Bấm **"Share"** (nút trên cùng)
3. **Tìm email Service Account** (từ JSON file):
   ```
   Tìm key: "client_email"
   Copy email: mconic-landing-page@mconic-landing-page.iam.gserviceaccount.com
   ```
4. **Paste email vào Share dialog**
5. Chọn quyền: **"Editor"** (cho phép edit)
6. Bấm **"Share"**

✅ **Xong:** Service Account có quyền edit Sheet

---

### Bước 5️⃣: Enable Google Sheets API

**Công ty IT làm:**
1. Vào https://console.cloud.google.com
2. **APIs & Services** → **Library**
3. Tìm **"Google Sheets API"**
4. Bấm **"Enable"**

✅ **Xong:** API enabled

---

### Bước 6️⃣: Cập Nhật Vercel Environment Variables

**Công ty IT làm:**

#### 6a. Chuẩn bị dữ liệu:
```
GOOGLE_SHEET_ID = [Sheet ID từ Bước 1]
GOOGLE_SHEET_TAB_NAME = Trang tính1 (hoặc tên sheet khác)
```

#### 6b. Chuẩn bị JSON:
```
Mở file JSON (từ Bước 3)
Copy toàn bộ nội dung (từ { đến })
```

#### 6c. Vào Vercel Dashboard:
```
https://vercel.com/[company]/mconic-redesign
→ Settings → Environment Variables
```

#### 6d. Cập nhật từng biến:

| Biến | Giá trị | Ghi chú |
|------|--------|--------|
| `GOOGLE_SHEET_ID` | [Sheet ID mới] | Từ Bước 1 |
| `GOOGLE_SHEET_TAB_NAME` | Trang tính1 | Tên sheet tab |
| `GOOGLE_CREDENTIALS_JSON` | [Toàn bộ JSON content] | Paste nội dung file |
| `SMTP_HOST` | smtp.gmail.com | Giữ nguyên |
| `SMTP_PORT` | 587 | Giữ nguyên |
| `SMTP_USER` | [Email Gmail mới] | Công ty cấp |
| `SMTP_PASS` | [App Password] | Xem SMTP-SETUP-GUIDE.md |
| `ADMIN_EMAIL` | [Email quản lý] | Nơi nhận thông báo |
| `SENDER_NAME` | MCONIC Event Agency | Hoặc tên khác |

**Bấm Save** → Vercel tự động redeploy (2-3 phút)

✅ **Xong:** Vercel updated

---

### Bước 7️⃣: Thay Đổi `.env` (Local - Nếu Cần)

**Công ty IT (optional):**
```
Nếu chạy local, edit .env file:

GOOGLE_SHEET_ID=10gHUhGOXVKRLlYXmnW9PVY2Cu2JhGvCfcs1BbhcUlqA
GOOGLE_SHEET_TAB_NAME=Trang tính1
GOOGLE_CREDENTIALS_JSON={...}
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=admin@mconic.vn
SMTP_PASS=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=admin@mconic.vn
SENDER_NAME=MCONIC Event Agency
```

✅ **Xong:** `.env` updated (KHÔNG commit lên GitHub!)

---

### Bước 8️⃣: Test Website

**Công ty làm:**
1. Vào website: https://mconic-redesign.vercel.app/insurance.html
2. **Test Contact Form:**
   - Điền thông tin
   - Submit
   - ✅ Check: Email nhận thông báo?
   - ✅ Check: Dữ liệu vào Google Sheet?

3. **Test Quote Form:**
   - Điền tuổi (18-75)
   - Submit
   - ✅ Check: Admin email nhận được?
   - ✅ Check: Dữ liệu + tier vào Google Sheet?

4. **Nếu tất cả OK** → Bàn giao thành công! 🎉

---

### Bước 9️⃣: Gửi Source Code

**Công ty nhận:**
1. GitHub repo: https://github.com/khang667717/mconic-redesign
2. Tất cả source code ở đây
3. Công ty có thể:
   - Fork repo
   - Clone về máy
   - Deploy ở host khác nếu cần

✅ **Xong:** Bàn giao 100%

---

## ⚠️ Những Điều Phải Nhớ

### ❌ KHÔNG LÀM
- ❌ KHÔNG share google-credentials.json (private key!)
- ❌ KHÔNG commit .env lên GitHub
- ❌ KHÔNG share SMTP password qua email/chat
- ❌ KHÔNG để credentials trong source code

### ✅ NÊN LÀM
- ✅ Lưu credentials vào Vercel Environment Variables
- ✅ Xóa google-credentials.json sau khi update Vercel
- ✅ Rotate credentials 6 tháng 1 lần
- ✅ Backup Google Sheet data hằng tuần

---

## 📞 Sau Khi Bàn Giao

### Công ty Có Thể Tự Làm
✅ Xem dữ liệu lead trong Google Sheets
✅ Download dữ liệu thành Excel
✅ Thay đổi admin email (Vercel → Settings)
✅ Update content website (GitHub → commit)
✅ Chạy website trên host khác

### Không Cần Liên Hệ Developer Nữa
- Website chạy độc lập
- Tất cả credentials nằm ở Vercel (bảo mật)
- Source code ở GitHub (không thể bị mất)
- Email notifications tự động
- Data save tự động vào Google Sheets

**➡️ Công ty hoàn toàn độc lập!**

---

## 🎯 Quick Checklist - Công Ty Cần Làm

- [ ] **Bước 1:** Tạo Google Sheet mới → Lấy Sheet ID
- [ ] **Bước 2-3:** Tạo Service Account + JSON Key → Download file
- [ ] **Bước 4:** Share Sheet cho Service Account (Editor)
- [ ] **Bước 5:** Enable Google Sheets API
- [ ] **Bước 6:** Cập nhật Vercel 9 biến environment
- [ ] **Bước 7:** (Optional) Update .env local
- [ ] **Bước 8:** Test website (contact + quote forms)
- [ ] **Bước 9:** GitHub access (nếu cần maintain code)

---

## 📧 Liên Hệ Lúc Cần

**Developer:** Khang (Thực tập sinh)
- Email: leduykhang25012005@gmail.com
- GitHub: https://github.com/khang667717

**Hỗ trợ:** Chỉ khi cần troubleshoot lỗi kỹ thuật

**Hết thực tập:** Không còn support, công ty tự manage

---

## ✅ Bàn Giao Hoàn Tất

**Công ty nhận:**
- ✅ Website hoàn chỉnh (2 pages)
- ✅ API hoạt động (3 endpoints)
- ✅ Email notifications
- ✅ Google Sheets integration
- ✅ Source code (GitHub)
- ✅ Tất cả tài liệu hướng dẫn
- ✅ Không cần support thêm

**Công ty quản lý:**
- 📊 Google Sheets (dữ liệu lead)
- 🔑 Vercel (deployment + environment)
- 📧 Email (SMTP credentials)
- 💻 GitHub (source code)

---

**Thành công! 🎉 Công ty có website riêng 100%**

*Ngày bàn giao: ________________*  
*Ký xác nhận:* ________________
