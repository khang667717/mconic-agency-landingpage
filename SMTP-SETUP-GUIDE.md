# 📧 Hướng Dẫn Tạo Gmail App Password cho SMTP

**⚠️ QUAN TRỌNG:** `SMTP_PASS` phải là **App Password**, KHÔNG phải password Gmail thường!

---

## 🎯 Tóm Tắt

Website cần email để gửi thông báo cho admin & khách.  
Gmail yêu cầu dùng **App Password** thay vì regular password (vì an toàn).

**Hiện tại:**
```
SMTP_USER = leduykhang25012005@gmail.com
SMTP_PASS = bppc twet oqss bisr  ← App Password (16 ký tự)
```

---

## 📱 Bước 1: Bật 2-Factor Authentication

Gmail yêu cầu 2FA mới cho phép tạo App Password.

1. **Vào:** https://myaccount.google.com/security
2. **Tìm:** "2-Step Verification"
3. **Bấm:** "Enable 2-Step Verification"
4. **Chọn:** Phương thức xác nhận (SMS/Call)
5. **Xác nhận:** Nhập mã từ phone
6. **Lưu:** Backup codes (rất quan trọng!)

✅ **Sau bước này:** Gmail có 2FA, sẵn sàng tạo App Password

---

## 🔐 Bước 2: Tạo App Password

### Tại https://myaccount.google.com/apppasswords

**Nếu không thấy "App passwords":**
- Chưa bật 2FA → Quay lại Bước 1
- Hoặc không phải Gmail thường (có thể G Suite)

**Nếu thấy "App passwords":**

1. **Select app:** Mail (dropdown 1)
2. **Select device:** Windows Computer (dropdown 2)
   - Hoặc chọn device bạn dùng
3. **Bấm:** Generate

**Google sẽ hiển thị:**
```
Your app password for Gmail on Windows Computer is:

bppc twet oqss bisr
```

⚠️ **Copy đầy đủ 16 ký tự (gồm cả space)**

---

## 🖥️ Bước 3: Cập Nhật Vercel

1. **Vào:** https://vercel.com/khang667717/mconic-redesign
2. **Settings** → **Environment Variables**
3. **Tìm:** SMTP_PASS
4. **Paste:** bppc twet oqss bisr
5. **Bấm:** Save (auto redeploy trong 2-3 phút)

---

## ✅ Bước 4: Test Email Gửi Được Không

**Cách test:**

1. **Vào website:** https://mconic-redesign.vercel.app
2. **Submit form contact** (điền: tên, SĐT, email)
3. **Check:**
   - Email nhận được confirmation?
   - Admin email nhận thông báo?

**Nếu không nhận email:**
- Check spam folder
- Xem Vercel logs (dashboard → Deployments → Logs)
- Xác nhận SMTP_PASS copy đầy đủ

---

## ❌ Lỗi Thường Gặp

### "App password not generated"
→ 2FA chưa bật, quay lại Bước 1

### "Invalid credentials"
→ Password sai/typo, copy lại từ Google

### "Inbox is full"
→ Xóa email cũ trong Gmail

### "Email không gửi"
→ Check:
- SMTP_HOST = smtp.gmail.com ✓
- SMTP_PORT = 587 ✓
- SMTP_USER = [email] ✓
- SMTP_PASS = [app password] ✓
- 2FA bật ✓

---

## 🔒 Security Tips

✅ **Nên:**
- Dùng App Password (không regular password)
- Bật 2FA
- Lưu backup codes
- Rotate password 6 tháng/lần
- Chỉ lưu ở Vercel, không share

❌ **Không:**
- Không share password
- Không commit lên GitHub
- Không hardcode trong code
- Không viết trên giấy

---

## 📋 Checklist

- [ ] 2FA enabled
- [ ] App Password created
- [ ] Password copied (16 ký tự)
- [ ] Vercel updated
- [ ] Redeploy done
- [ ] Form tested
- [ ] Email received
- [ ] Backup codes saved

---

**Hoàn thành!** Email sẽ gửi được ngay khi form submit.
