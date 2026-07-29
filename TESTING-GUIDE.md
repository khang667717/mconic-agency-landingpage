# Testing Guide - Fix Data Overwrite Issue

## Problem Fixed
- ❌ **Trước**: Khi thêm khách hàng mới, nó ghi đè dữ liệu khách hàng cũ
- ✅ **Giờ**: Mỗi khách hàng mới được ghi vào dòng mới trong Google Sheets

## Solution
Đã thay đổi Google Sheets API `append()` range từ `A2:G` → `A:G`
- `A:G` = Chỉ định tất cả cột, để API tự tìm dòng trống tiếp theo
- Điều này là cách chuẩn để append dữ liệu không ghi đè

## Test Steps

### Test 1: Index Form (Tư vấn sự kiện)
```
1. Truy cập: https://your-site.vercel.app/
2. Scroll xuống section "Trò chuyện cùng chuyên gia"
3. Điền form:
   - Họ và tên: Nguyên Quang Huy
   - Số điện thoại: 0902970416
   - Email: kimang6251@gmail.com
4. Click "Gửi yêu cầu"
5. Kiểm tra:
   - ✅ Hiển thị "Đăng ký thành công!"
   - ✅ Email nhận được thông báo tại kimang6251@gmail.com
   - ✅ Google Sheet thêm 1 dòng mới
```

### Test 2: Insurance Form (Tính phí bảo hiểm)
```
1. Truy cập: https://your-site.vercel.app/insurance.html
2. Scroll xuống form
3. Điền form:
   - Họ và tên: Nguyên Quang Huy
   - Số điện thoại: 0902970416
   - Tuổi: 25
4. Click "Tính phí"
5. Kiểm tra:
   - ✅ Hiển thị gói thẻ đề xuất (ví dụ: Thẻ Vàng)
   - ✅ Google Sheet thêm 1 dòng mới (không ghi đè dòng index form)
   - ✅ Dòng này có tuổi: 25
```

### Test 3: Verify No Overwrite - Add Different Person
```
1. Quay lại Index Form
2. Điền dữ liệu khách hàng khác:
   - Họ và tên: Trần Văn A
   - Số điện thoại: 0901111111
   - Email: tran.van.a@example.com
3. Click "Gửi yêu cầu"
4. Kiểm tra Google Sheet:
   - ✅ Row cũ (Nguyên Quang Huy) vẫn còn nguyên
   - ✅ Row mới (Trần Văn A) được thêm
   - ✅ Tất cả dữ liệu không bị mất
```

## Google Sheet Expected Structure

Sau khi test xong, Google Sheet sẽ có dạng:

| Thời gian | Phân loại | Họ và tên | Số điện thoại | Email | Tuổi | Chi tiết khác |
|-----------|----------|----------|--------------|-------|------|---------------|
| 2024-01-01 10:30 | contact | Nguyên Quang Huy | 0902970416 | kimang6251@gmail.com | | |
| 2024-01-01 10:35 | quote | Nguyên Quang Huy | 0902970416 | | 25 | Thẻ Vàng |
| 2024-01-01 10:40 | contact | Trần Văn A | 0901111111 | tran.van.a@example.com | | |

✅ **Mỗi hàng là một entry riêng, không ghi đè**

## Email Verification

### Từ Index Form - Email Khách Hàng
- **To**: Email mà khách điền (ví dụ: kimang6251@gmail.com)
- **Subject**: "Xác nhận yêu cầu tư vấn sự kiện - MCONIC"
- **Content**: Xác nhận đã nhận yêu cầu, sẽ liên hệ trong 24h

### Từ Index Form - Email Admin
- **To**: ADMIN_EMAIL (mặc định: leduykhang25012005@gmail.com)
- **Subject**: "[LEAD MỚI] Yêu cầu tư vấn từ [Tên khách]"
- **Content**: Chi tiết thông tin khách hàng

### Từ Insurance Form - Email Admin
- **To**: ADMIN_EMAIL
- **Subject**: "[LEAD BẢO HIỂM] Yêu cầu báo giá từ [Tên khách]"
- **Content**: Chi tiết thông tin khách hàng kèm gói thẻ đề xuất

## Deployment

```bash
# 1. Commit changes
git add .
git commit -m "fix: prevent data overwrite in Google Sheets append"

# 2. Push to deploy
git push origin main

# 3. Vercel will auto-deploy
# Wait 2-3 minutes for deployment to complete

# 4. Run tests
```

## Troubleshooting

### Email không đến
- [ ] Check SMTP credentials trên Vercel dashboard
- [ ] Check ADMIN_EMAIL environment variable đúng chưa
- [ ] Check thư mục spam/junk

### Dữ liệu vẫn bị ghi đè
- [ ] Verify `A:G` range trong append() call
- [ ] Check Google Sheet có được cấp quyền đúng không
- [ ] Kiểm tra console log trong Vercel Functions

### Google Sheet không cập nhật
- [ ] Verify GOOGLE_SHEET_ID đúng chưa (có trong .env)
- [ ] Verify google-credentials.json được load (check Vercel logs)
- [ ] Verify google-credentials.json có quyền edit Sheet

## Success Criteria

✅ **Tất cả điều kiện phải đúng:**
1. [ ] Dữ liệu không bị ghi đè - mỗi submit là 1 dòng mới
2. [ ] Index form gửi email tới email khách nhập
3. [ ] Insurance form ghi đủ dữ liệu (họ tên, sdt, tuổi)
4. [ ] Admin nhận được email thông báo lead mới
5. [ ] Google Sheet hiển thị đủ thông tin
