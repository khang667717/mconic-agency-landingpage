# Quick Test - Verify Data Overwrite Fix

## Test Plan

### Test 1: First Contact Form Submission
```
Step 1: Go to your site's index page
Step 2: Fill contact form:
  - Họ tên: Nguyên Quang Huy
  - SĐT: 0902970416
  - Email: kimang6251@gmail.com
Step 3: Submit
Step 4: Check Google Sheet
  Expected: Row 2 has this data
```

### Test 2: First Insurance Form Submission
```
Step 1: Go to insurance.html
Step 2: Fill form:
  - Họ tên: Trần Văn A
  - SĐT: 0909999999
  - Tuổi: 35
Step 3: Submit
Step 4: Check Google Sheet
  Expected: 
    - Row 2: Nguyên Quang Huy (from Test 1) - UNTOUCHED ✓
    - Row 3: Trần Văn A (NEW ROW) ✓
```

### Test 3: Second Contact Form Submission
```
Step 1: Go back to index page
Step 2: Fill contact form:
  - Họ tên: Lê Thị B
  - SĐT: 0901234567
  - Email: le.thi.b@example.com
Step 3: Submit
Step 4: Check Google Sheet
  Expected:
    - Row 2: Nguyên Quang Huy - UNTOUCHED ✓
    - Row 3: Trần Văn A - UNTOUCHED ✓
    - Row 4: Lê Thị B (NEW ROW) ✓
```

### Test 4: Second Insurance Form Submission (Same Person)
```
Step 1: Go to insurance.html
Step 2: Fill form:
  - Họ tên: Lê Thị B
  - SĐT: 0901234567
  - Tuổi: 28
Step 3: Submit
Step 4: Check Google Sheet
  Expected:
    - Row 2-4: All UNTOUCHED ✓
    - Row 5: Lê Thị B (NEW ROW) ✓
```

---

## Success Criteria

✅ **All criteria must be met:**

- [ ] After Test 1: 1 row of data
- [ ] After Test 2: 2 rows (Test 1 + Test 2) - Row 1 NOT overwritten
- [ ] After Test 3: 3 rows (Test 1 + Test 2 + Test 3) - Rows 1,2 NOT overwritten
- [ ] After Test 4: 4 rows (Test 1 + Test 2 + Test 3 + Test 4) - Rows 1,2,3 NOT overwritten

---

## Email Verification

### Index Form Should Send:
- ✅ Email to khách (kimang6251@gmail.com, le.thi.b@example.com)
- ✅ Email to admin (leduykhang25012005@gmail.com)

### Insurance Form Should Send:
- ✅ Email to admin only (leduykhang25012005@gmail.com)

---

## Final Check

If all 4 tests pass with data in separate rows:
✅ **FIX SUCCESSFUL - NO DATA OVERWRITE** 🎉

If data is still being overwritten:
❌ **Issue still exists - need investigation**
