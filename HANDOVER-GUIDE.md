# 📋 Hướng Dẫn Bàn Giao Dự Án Landing Page MCONIC

## Tóm Tắt Nhanh (Cho Người Quản Lý)

✅ **Dự án đã hoàn thành 100%**
- Landing page toàn bộ chức năng hoạt động
- Tích hợp Google Sheets để lưu lead
- Tích hợp email để gửi thông báo
- Tự động deploy khi cập nhật code

🌐 **Link Truy Cập:**
- Trang chủ: https://mconic-redesign.vercel.app/
- Trang bảo hiểm: https://mconic-redesign.vercel.app/insurance.html

---

## 📦 Những Gì Bạn Nhận Được

### 1. **GitHub Repository** (Nơi Lưu Code)
```
Link: https://github.com/khang667717/mconic-redesign
```
- Tất cả code đều lưu ở đây
- Ai cũng có thể xem được (public)
- Tự động deploy lên Vercel khi có update

### 2. **Vercel Deployment** (Nơi Chạy Website)
```
Link: https://vercel.com/khang667717/mconic-redesign
```
- Website tự động cập nhật khi code thay đổi
- Không cần lo về server, lưu trữ
- Miễn phí cho project tĩnh (static)

### 3. **Google Sheets** (Nơi Lưu Thông Tin Khách)
```
Link: https://docs.google.com/spreadsheets/d/10gHUhGOXVKRLlYXmnW9PVY2Cu2JhGvCfcs1BbhcUlqA/edit
```
- Tự động ghi lại thông tin khách hàng
- Khi khách submit form → dữ liệu vào đây
- Có thể download thành Excel

---

## 🎯 Chức Năng Hoạt Động

### ✅ Trang Chủ (index.html)
- **Form Tư Vấn Sự Kiện**: Khách điền thông tin → Email gửi thông báo
- **Giới Thiệu**: Mô tả về công ty
- **Dịch Vụ**: Liệt kê các dịch vụ
- **Liên Hệ**: Form liên hệ

### ✅ Trang Bảo Hiểm (insurance.html)
- **Tính Phí Bảo Hiểm**: Khách nhập tuổi → Hệ thống tính ra gói phù hợp
- **Bảng Thẻ**: Hiển thị các gói bảo hiểm (Thẻ Bạc, Vàng, Bạch Kim, v.v)
- **Email Thông Báo**: Admin nhận email khi có lead mới

---

## 📧 Email & Thông Báo

### Ai Nhận Email?
- **Admin**: leduykhang25012005@gmail.com (mỗi khi có form submit)
- **Khách Hàng**: Email mà khách điền (xác nhận yêu cầu)

### Cách Thay Đổi Email Admin
1. Vào Vercel Dashboard
2. Project: mconic-redesign
3. Settings → Environment Variables
4. Tìm `ADMIN_EMAIL` → Sửa email mới
5. Bấm Save & Redeploy

---

## 🔧 Cách Cập Nhật Website

### Cách 1: Không Biết Code (Cơ Bản)

**Chỉnh Sửa Text/Ảnh:**
1. Vào GitHub: https://github.com/khang667717/mconic-redesign
2. Bấm nút Edit (✏️) file HTML
3. Sửa text cần thay đổi
4. Bấm "Commit changes"
5. **Chờ 2-3 phút** → Website tự động cập nhật

**Thay Đổi Ảnh:**
1. Vào folder `images` trên GitHub
2. Upload ảnh mới
3. Thay đổi tên ảnh trong HTML

### Cách 2: Có Người Biết Code

**Để Người Quản Lý Kỹ Thuật:**
1. Clone repo: `git clone https://github.com/khang667717/mconic-redesign.git`
2. Chỉnh sửa code
3. Push lên: `git push origin main`
4. Vercel tự động deploy

---

## 📊 Xem Dữ Liệu Lead

### Xem Khách Hàng Nào Đã Submit Form
1. Vào Google Sheets: 
   https://docs.google.com/spreadsheets/d/10gHUhGOXVKRLlYXmnW9PVY2Cu2JhGvCfcs1BbhcUlqA/edit

2. Dữ liệu sẽ tự động xuất hiện khi:
   - Khách điền form tư vấn (index.html)
   - Khách tính phí bảo hiểm (insurance.html)

3. Mỗi dòng có:
   - **Thời gian**: Khi nào submit
   - **Phân loại**: contact (tư vấn) hay quote (bảo hiểm)
   - **Họ và tên**: Tên khách
   - **SĐT**: Số điện thoại
   - **Email**: Email khách
   - **Tuổi**: (chỉ có với form bảo hiểm)

### Download Dữ Liệu
1. Google Sheets → Menu → Download
2. Chọn "Excel" hoặc "CSV"
3. Import vào Salesforce/CRM của công ty

---

## ⚠️ Cần Biết

### Email Không Đến?
- Kiểm tra folder **Spam/Junk**
- Xác nhận SMTP credentials đúng (yêu cầu người code kiểm tra)

### Website Bị Lỗi?
1. Refresh page (Ctrl + F5)
2. Xoá cache browser
3. Nếu vẫn lỗi → Liên hệ người code

### Không Muốn Dùng Vercel Nữa?
- Export code về (GitHub có tất cả)
- Dùng host khác (WordPress, Shared Hosting, etc.)
- Không sợ mất code vì tất cả ở GitHub

---

## 👤 Người Liên Hệ

**Người Phát Triển:** Khang (Thực tập sinh)
- Email: leduykhang25012005@gmail.com
- GitHub: https://github.com/khang667717

---

## 🎓 Ghi Chú Bàn Giao

- ✅ Tất cả code đã test và hoạt động
- ✅ Có hướng dẫn chi tiết (file này)
- ✅ Không cần cấu hình thêm
- ✅ Tự động deploy khi update code
- ✅ Dữ liệu an toàn (lưu ở Google Sheets + Database)

---

**Ngày bàn giao:** [Ngày tháng năm]
**Người bàn giao:** [Tên người thực tập]
**Người nhận:** [Tên quản lý công ty]

---

# 📚 Hướng Dẫn Chi Tiết Cho Quản Lý Kỹ Thuật

## Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────┐
│                    Landing Page MCONIC                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (HTML/CSS/JS)         Backend (Serverless)       │
│  ├─ index.html                  ├─ api/contact.js         │
│  ├─ insurance.html              ├─ api/quote.js           │
│  ├─ css/                         └─ api/document.js        │
│  ├─ js/                                                    │
│  └─ images/                                                │
│                                                              │
│                    ↓ Deploy ↓                               │
│                   Vercel                                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Stack Kỹ Thuật

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js Serverless Functions (Vercel)
- **Database**: Google Sheets (via API)
- **Email**: Nodemailer (Gmail SMTP)
- **Hosting**: Vercel (Free tier)
- **Version Control**: GitHub

## Cấu Hình Vercel Environment Variables

```
GOOGLE_SHEET_ID=10gHUhGOXVKRLlYXmnW9PVY2Cu2JhGvCfcs1BbhcUlqA
GOOGLE_SHEET_TAB_NAME=Trang tính1
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER= ghi email  vào đây
SMTP_PASS=[App Password]
ADMIN_EMAIL= ghi email vào đây
SENDER_NAME=MCONIC Event Agency
```

## Cách Maintain

### Hàng Ngày
- Monitor email notifications
- Check Google Sheets for new leads
- Respond to customer inquiries

### Hàng Tuần
- Check Vercel deployment status
- Review analytics if available
- Backup Google Sheets data

### Hàng Tháng
- Review form conversion rates
- Update content if needed
- Check for security updates

## Troubleshooting

### Issue: CSS/JS không load
**Solution:** 
- Xoá cache browser
- Kiểm tra Network tab (F12)
- Verify file paths đúng

### Issue: Email không gửi
**Solution:**
- Check SMTP credentials
- Verify Gmail App Password
- Check spam folder

### Issue: Data không save vào Sheet
**Solution:**
- Verify Google Sheet access
- Check API credentials
- Review Vercel function logs

## Nâng Cấp Tương Lai

Có thể thêm:
- [ ] CRM integration (Salesforce/HubSpot)
- [ ] SMS notifications
- [ ] Chatbot support
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] A/B testing

---

**Handover Date:** [Date]
**Prepared By:** [Developer Name]
**Reviewed By:** [Manager Name]
