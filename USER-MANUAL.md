# 👤 Hướng Dẫn Sử Dụng Cho Người Quản Lý (Không Cần Biết Code)

## 🌐 Truy Cập Website

**Trang Chủ:** https://mconic-redesign.vercel.app/
**Trang Bảo Hiểm:** https://mconic-redesign.vercel.app/insurance.html

---

## 📱 Các Form Khách Hàng Có Thể Submit

### Form 1: Tư Vấn Sự Kiện (Trang Chủ)
**Vị trí:** Cuộn xuống → Tìm tiêu đề "Trò chuyện cùng chuyên gia"

**Khách điền:**
- Họ và tên
- Số điện thoại (10 số, bắt đầu 0)
- Email

**Khi submit:**
- ✅ Khách thấy "Đăng ký thành công!"
- ✅ Email xác nhận gửi tới email khách
- ✅ Dữ liệu lưu vào Google Sheets
- ✅ Admin nhận email thông báo

---

### Form 2: Tính Phí Bảo Hiểm (Trang Bảo Hiểm)
**Vị trí:** Bấm link "Sản phẩm bảo hiểm" từ trang chủ → Tìm form

**Khách điền:**
- Họ và tên
- Số điện thoại (10 số, bắt đầu 0)
- Tuổi (từ 18-75 tuổi)

**Khi submit:**
- ✅ Hệ thống tính ra gói bảo hiểm phù hợp
- ✅ Hiển thị gói thẻ (Bạc, Vàng, Bạch Kim, Kim Cương)
- ✅ Dữ liệu lưu vào Google Sheets
- ✅ Admin nhận email thông báo

---

## 📊 Xem Dữ Liệu Khách Hàng

### Cách Truy Cập Google Sheets

1. **Mở Link:**
   https://docs.google.com/spreadsheets/d/10gHUhGOXVKRLlYXmnW9PVY2Cu2JhGvCfcs1BbhcUlqA/edit

2. **Đăng Nhập** (nếu cần):
   - Dùng tài khoản Google Company hoặc tài khoản cá nhân

3. **Xem Dữ Liệu:**
   - Mỗi dòng = 1 khách hàng
   - Cột theo thứ tự: Thời gian, Phân loại, Tên, SĐT, Email, Tuổi, Chi tiết khác

### Hiểu Các Cột

| Cột | Ý Nghĩa | Ví Dụ |
|-----|---------|-------|
| **Thời gian** | Khi nào submit | 2024-01-15 10:30 |
| **Phân loại** | Loại form | contact (tư vấn) / quote (bảo hiểm) |
| **Họ và tên** | Tên khách | Nguyễn Quang Huy |
| **Số điện thoại** | SĐT khách | 0902970416 |
| **Email** | Email khách | kimang6251@gmail.com |
| **Tuổi** | Tuổi (nếu form bảo hiểm) | 25 |
| **Chi tiết khác** | Gói bảo hiểm hoặc thông tin thêm | Thẻ Vàng |

---

## 📥 Tải Dữ Liệu

### Tải Xuống Thành Excel

1. **Google Sheets** → Chọn tất cả dữ liệu (Ctrl + A)
2. **File** → **Download** → Chọn **Excel (.xlsx)**
3. Lưu file về máy

### Tải Xuống Thành CSV

1. **File** → **Download** → Chọn **CSV**
2. Có thể import vào CRM, Database khác

---

## 📧 Nhận Email Thông Báo

### Email Admin (Người Quản Lý)

**Khi nào nhận:**
- Có khách submit form tư vấn
- Có khách submit form bảo hiểm

**Email từ:** MCONIC Event Agency <leduykhang25012005@gmail.com>
**Nội dung:** Thông tin khách hàng (tên, SĐT, email)

### Email Khách Hàng

**Tư Vấn Form:**
- Khách nhận email xác nhận yêu cầu
- Nội dung: Chúng tôi sẽ liên hệ trong 24h

**Bảo Hiểm Form:**
- Khách không nhận email
- Chỉ admin nhận thông báo

---

## 🔧 Thay Đổi Email Admin

### Bước 1: Vào Vercel Dashboard
```
https://vercel.com/khang667717/mconic-redesign
```

### Bước 2: Truy Cập Settings
1. Bấm vào project **mconic-redesign**
2. Chọn tab **Settings**
3. Tìm **Environment Variables**

### Bước 3: Thay Đổi Email
1. Tìm biến `ADMIN_EMAIL`
2. Sửa email thành email công ty mới
3. Bấm **Save**
4. Chờ tự động redeploy (2-3 phút)

**Ví dụ:**
- Cũ: `leduykhang25012005@gmail.com`
- Mới: `admin@mconic.vn`

---

## ❓ Câu Hỏi Thường Gặp

### Q: Email không đến?
**A:** 
1. Kiểm tra folder **Spam/Junk**
2. Thêm email vào danh sách liên hệ
3. Nếu vẫn không được → Liên hệ kỹ thuật

### Q: Dữ liệu có bị mất không?
**A:** Không! Dữ liệu lưu tại:
- Google Sheets (cloud, an toàn)
- Có thể backup hàng ngày

### Q: Khách submit form mà không thấy dữ liệu?
**A:**
1. Refresh Google Sheets (F5)
2. Kiểm tra tab/sheet đúng chưa
3. Xem lại lần submit form

### Q: Website bị lỗi?
**A:**
1. Refresh page (Ctrl + F5)
2. Xoá cache browser
3. Thử trên trình duyệt khác
4. Nếu vẫn lỗi → Liên hệ kỹ thuật

### Q: Cần thay đổi nội dung website?
**A:** Liên hệ kỹ thuật, họ sẽ cập nhật trong vòng 1-2 giờ

### Q: Tại sao ghi "không đủ tuổi"?
**A:** Bảo hiểm chỉ chấp nhận từ 18-75 tuổi

---

## 📱 Trên Mobile

**Website hoạt động tốt trên:**
- ✅ iPhone/iPad
- ✅ Android
- ✅ Tablet

**Mẹo:**
- Nếu form không submit → Refresh page
- Nếu hiển thị lệch → Xoá cache

---

## 📞 Liên Hệ Hỗ Trợ

**Kỹ thuật:** Khang
- Email: leduykhang25012005@gmail.com
- GitHub: https://github.com/khang667717

**Cần báo cáo:**
- Website không hoạt động
- Email không gửi được
- Dữ liệu bị lỗi
- Cần thay đổi gì đó

---

## 🎓 Tips Quản Lý

### Hàng Ngày
- [ ] Check Google Sheets có lead mới
- [ ] Gọi/email khách hàng để follow-up
- [ ] Kiểm tra email nhận đủ chưa

### Hàng Tuần
- [ ] Tổng hợp số lead
- [ ] Phân tích conversion rate
- [ ] Export dữ liệu backup

### Hàng Tháng
- [ ] Báo cáo KPI (số lead, conversion)
- [ ] Đề xuất cải thiện
- [ ] Review content có cần update không

---

## 📊 Ví Dụ Dữ Liệu

### Form Tư Vấn
| Thời gian | Phân loại | Họ và tên | SĐT | Email | Tuổi |
|-----------|----------|----------|-----|-------|------|
| 2024-01-15 10:00 | contact | Nguyễn A | 0902970416 | a@example.com | |
| 2024-01-15 10:15 | contact | Trần B | 0909999999 | b@example.com | |

### Form Bảo Hiểm  
| Thời gian | Phân loại | Họ và tên | SĐT | Email | Tuổi | Chi tiết khác |
|-----------|----------|----------|-----|-------|------|---------------|
| 2024-01-15 11:00 | quote | Lê C | 0901234567 | | 25 | Thẻ Vàng |
| 2024-01-15 11:30 | quote | Phạm D | 0908888888 | | 35 | Thẻ Bạch Kim |

---

**Hướng dẫn cập nhật:** Hằng ngày
**Phiên bản:** 1.0
**Ngày tạo:** [Ngày hôm nay]
