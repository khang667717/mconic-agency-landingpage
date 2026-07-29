# ✅ Checklist Bàn Giao Dự Án Landing Page MCONIC

**Ngày bàn giao:** _______________
**Người thực tập:** _______________
**Người quản lý nhận:** _______________
**Chữ ký bàn giao:** _______________

---

## 📋 Phần 1: Chuẩn Bị Tài Liệu

- [ ] **HANDOVER-GUIDE.md** - Hướng dẫn bàn giao (file này giải thích tất cả)
- [ ] **USER-MANUAL.md** - Hướng dẫn sử dụng cho người không biết code
- [ ] **TECHNICAL-GUIDE.md** - Hướng dẫn cho kỹ thuật viên (nếu có)
- [ ] **README.md** - Tài liệu trong GitHub
- [ ] **Danh sách access** - Tất cả các tài khoản, password

---

## 🌐 Phần 2: Access & Tài Khoản

### GitHub
- [ ] Link repo: https://github.com/khang667717/mconic-redesign
- [ ] Access type: Public (ai cũng xem được)
- [ ] Người quản lý có tài khoản GitHub chưa?
  - [ ] Có (username: _____________)
  - [ ] Không (yêu cầu tạo)

### Vercel
- [ ] Link project: https://vercel.com/khang667717/mconic-redesign
- [ ] Đã transfer ownership chưa?
  - [ ] Chưa → Cần transfer ngay
  - [ ] Đã → Vercel email mới: _____________

### Google Sheets (Lưu Lead)
- [ ] Link: https://docs.google.com/spreadsheets/d/10gHUhGOXVKRLlYXmnW9PVY2Cu2JhGvCfcs1BbhcUlqA/edit
- [ ] Đã share cho công ty chưa?
  - [ ] Chưa → Chia sẻ ngay
  - [ ] Đã → Google account: _____________

### Email Admin
- [ ] Email nhận thông báo: _____________
- [ ] Đã test nhận email chưa?
  - [ ] Chưa → Test ngay
  - [ ] Đã ✓

### Gmail SMTP (Gửi Email)
- [ ] Gmail account: leduykhang25012005@gmail.com
- [ ] App Password: [ẩn vì bảo mật]
- [ ] Có thay đổi account nào không?
  - [ ] Không (giữ nguyên)
  - [ ] Có → New account: _____________

---

## 🌍 Phần 3: Website Hoạt Động

### Trang Chủ (index.html)
- [ ] Layout hiển thị đúng trên desktop
- [ ] Layout hiển thị đúng trên mobile
- [ ] Tất cả ảnh load được
- [ ] Tất cả link hoạt động
- [ ] Form tư vấn hoạt động
  - [ ] Validate input đúng
  - [ ] Submit thành công
  - [ ] Email nhận được

### Trang Bảo Hiểm (insurance.html)
- [ ] Layout hiển thị đúng
- [ ] Form tính phí hoạt động
  - [ ] Input age
  - [ ] Validate tuổi (18-75)
  - [ ] Hiển thị gói phù hợp
- [ ] Submit thành công
- [ ] Email admin nhận được

### Email Notifications
- [ ] Email xác nhận gửi tới khách
  - [ ] Nhận được
  - [ ] Nội dung đúng
- [ ] Email thông báo gửi tới admin
  - [ ] Nhận được
  - [ ] Nội dung đúng

### Google Sheets
- [ ] Dữ liệu khách tự động lưu
  - [ ] Sau form tư vấn
  - [ ] Sau form bảo hiểm
- [ ] Dữ liệu đầy đủ
- [ ] Có thể export Excel

---

## 📦 Phần 4: Tài Liệu & Hướng Dẫn

### Tài Liệu Trong Project
- [ ] HANDOVER-GUIDE.md (file này)
- [ ] USER-MANUAL.md (hướng dẫn không code)
- [ ] README.md (trong GitHub)
- [ ] EMAIL-FLOW.md (cách email hoạt động)
- [ ] WORKFLOW-DETAILED.md (quy trình chi tiết)

### Tài Liệu Cần Chuẩn Bị
- [ ] Danh sách access & password
- [ ] Hướng dẫn đổi email admin
- [ ] Hướng dẫn thêm người quản lý
- [ ] Hướng dẫn backup dữ liệu

---

## 🔧 Phần 5: Cấu Hình & Bảo Mật

### Environment Variables (Vercel)
- [ ] GOOGLE_SHEET_ID ✓
- [ ] GOOGLE_SHEET_TAB_NAME ✓
- [ ] SMTP_HOST ✓
- [ ] SMTP_PORT ✓
- [ ] SMTP_USER ✓
- [ ] SMTP_PASS ✓
- [ ] ADMIN_EMAIL ✓
- [ ] SENDER_NAME ✓

### Google Sheets Credentials
- [ ] google-credentials.json được upload
- [ ] Có quyền edit Sheet
- [ ] Service account được active

### Gmail SMTP
- [ ] App Password đã tạo (không phải password Gmail thường)
- [ ] 2-factor authentication được bật
- [ ] SMTP port 587 hoạt động

---

## 📊 Phần 6: Data & Backup

### Dữ Liệu Hiện Tại
- [ ] Google Sheets có bao nhiêu lead? ___ records
- [ ] Dữ liệu hoàn chỉnh không?
  - [ ] Có ✓
  - [ ] Thiếu → Chi tiết: _____________

### Backup
- [ ] Đã backup dữ liệu chưa?
  - [ ] Chưa → Backup ngay
  - [ ] Đã → Ngày backup: _____________
- [ ] Biết cách backup hàng tuần chưa?
  - [ ] Rồi
  - [ ] Chưa → Giải thích

---

## 📱 Phần 7: Testing

### Desktop Testing
- [ ] Chrome ✓
- [ ] Firefox ✓
- [ ] Safari ✓
- [ ] Edge ✓

### Mobile Testing
- [ ] iPhone (Safari) ✓
- [ ] Android (Chrome) ✓
- [ ] Tablet (iPad) ✓

### Form Submission Testing
- [ ] Index form (tư vấn)
  - [ ] Test đầu tiên
  - [ ] Test lần 2
  - [ ] Dữ liệu lưu đúng chưa?
- [ ] Insurance form (bảo hiểm)
  - [ ] Test tuổi hợp lệ (30 tuổi)
  - [ ] Test tuổi không hợp lệ (17 tuổi)
  - [ ] Dữ liệu lưu đúng chưa?

### Email Testing
- [ ] Gửi email test
- [ ] Email nhận được trong 5 phút
- [ ] Nội dung đúng
- [ ] Không bị vào spam

---

## 👥 Phần 8: Transfer Quyền

### GitHub
- [ ] Thêm collaborator (nếu cần)
- [ ] Gõ GitHub username: _____________
- [ ] Set permission: _____ (Admin/Write/Read)

### Vercel
- [ ] Transfer project sang email công ty
- [ ] Email: _____________
- [ ] Xác nhận access Vercel

### Google Sheets
- [ ] Share Sheet cho đội quản lý
- [ ] Email: _____________
- [ ] Permission: _____ (Editor/Viewer)

### Email Admin SMTP
- [ ] Nếu muốn thay email khác:
  - [ ] Yêu cầu cấp email nào: _____________
  - [ ] App Password đã tạo chưa?
    - [ ] Chưa → Tạo ngay
    - [ ] Đã → _____________ (ẩn password)

---

## 🎓 Phần 9: Training

### Người Quản Lý (Không Cần Code)
- [ ] Hướng dẫn xem dữ liệu Lead ✓
- [ ] Hướng dẫn download Excel ✓
- [ ] Hướng dẫn nhận email thông báo ✓
- [ ] Hướng dẫn thay email admin ✓
- [ ] Q&A ✓

### Kỹ Thuật Viên (Nếu Có)
- [ ] Giải thích code structure ✓
- [ ] Cách update website ✓
- [ ] Cách deploy Vercel ✓
- [ ] Troubleshooting ✓
- [ ] Q&A ✓

---

## 📝 Phần 10: Documentation Handover

### Files Bàn Giao
- [ ] Source code (GitHub) ✓
- [ ] Hosting (Vercel) ✓
- [ ] Database (Google Sheets) ✓
- [ ] Hướng dẫn sử dụng ✓
- [ ] Danh sách tài khoản ✓

### Thông Tin Bàn Giao
- [ ] Tất cả link & password
- [ ] Tài khoản email SMTP
- [ ] Google Sheets ID
- [ ] Vercel project settings
- [ ] Emergency contact (người code)

---

## 🚨 Phần 11: Vấn đề Tiềm Ẩn & Giải Pháp

### Vấn đề Có Thể Xảy Ra
1. **Email không gửi được**
   - [ ] Giải pháp: Kiểm tra SMTP credentials
   - [ ] Contact: [Người code]

2. **Website bị lỗi**
   - [ ] Giải pháp: Refresh cache, liên hệ support
   - [ ] Contact: [Người code]

3. **Dữ liệu không lưu**
   - [ ] Giải pháp: Check Google Sheets access
   - [ ] Contact: [Người code]

4. **Quên password**
   - [ ] Giải pháp: Reset qua email tương ứng
   - [ ] Contact: [Người code]

---

## 📞 Phần 12: Support & Liên Hệ

### Người Phát Triển
- **Tên:** Khang (Thực tập sinh)
- **Email:** leduykhang25012005@gmail.com
- **GitHub:** https://github.com/khang667717
- **Thời gian hỗ trợ:** [Thỏa thuận với công ty]

### Hỗ Trợ Kỹ Thuật Sau
- [ ] 1 tuần miễn phí (bug fix)
- [ ] 1 tháng hỗ trợ
- [ ] Không có support thêm

---

## ✍️ Ký Xác Nhận

### Người Thực Tập (Bàn Giao)
- **Tên:** _____________________
- **Chữ ký:** ___________________
- **Ngày:** _____________________

**Xác nhận bàn giao:**
- ✅ Tất cả code đã commit lên GitHub
- ✅ Website hoạt động 100%
- ✅ Tài liệu đầy đủ
- ✅ Người quản lý đã hiểu cách sử dụng

### Người Quản Lý / Công Ty (Nhận)
- **Tên:** _____________________
- **Chữ ký:** ___________________
- **Ngày:** _____________________

**Xác nhận nhận:**
- ✅ Nhận tất cả tài liệu
- ✅ Đã hiểu cách sử dụng
- ✅ Có access tất cả tài khoản
- ✅ Biết ai để liên hệ khi cần hỗ trợ

---

## 🎉 Hoàn Tất!

**Bàn giao thành công vào ngày: _____________________**

**Ghi chú thêm:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

**Note:** Giữ file này để làm bằng chứng bàn giao chính thức
