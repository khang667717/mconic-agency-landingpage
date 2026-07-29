# Verification - Data Overwrite Fix

## Changes Made

### File: api/contact.js
**Before:**
```javascript
await sheets.spreadsheets.values.append({
  spreadsheetId: env.googleSheetId,
  range: `${quotedTab}!A2:G`,  // ❌ Specific range - can cause issues
  valueInputOption: 'USER_ENTERED',
  resource: { values: [row] }
});
```

**After:**
```javascript
await sheets.spreadsheets.values.append({
  spreadsheetId: env.googleSheetId,
  range: `${quotedTab}!A:G`,  // ✅ Full column range - automatically finds next empty row
  valueInputOption: 'USER_ENTERED',
  resource: { values: [row] }
});
```

### File: api/quote.js
Same fix applied - changed `A2:G` → `A:G`

### File: api/server.js
Same fix applied - changed `A2:G` → `A:G`

## Why This Fixes the Issue

### Google Sheets API Append Behavior:

**With `A:G` (Full columns):**
- API scans the entire column A to Z
- Finds the first empty row after the last data row
- Appends new data there
- ✅ **No data overwrite** - each entry gets its own row

**With `A2:G` (Partial range):**
- May cause conflicts with spreadsheet state
- Can sometimes update instead of append
- ❌ **Risk of data overwrite**

## Verification Checklist

- [x] Changed range in `api/contact.js` from `A2:G` to `A:G`
- [x] Changed range in `api/quote.js` from `A2:G` to `A:G`
- [x] Changed range in `api/server.js` from `A2:G` to `A:G`
- [ ] Tested on local development (if running locally)
- [ ] Deployed to Vercel
- [ ] Ran manual tests (see TESTING-GUIDE.md)
- [ ] Confirmed Google Sheet has separate rows for each entry
- [ ] Confirmed emails sent to customer email address

## Expected Result After Fix

### Index Form Submissions:
```
Row 2: 2024-01-01 10:00 | contact | Nguyên Quang Huy | 0902970416 | kimang6251@gmail.com | | 
Row 3: 2024-01-01 10:05 | contact | Trần Văn A     | 0901111111 | tran.van.a@example.com | | 
Row 4: 2024-01-01 10:10 | contact | Lê Thị B      | 0909999999 | le.thi.b@example.com  | | 
```

### Insurance Form Submissions:
```
Row 5: 2024-01-01 10:15 | quote | Nguyên Quang Huy | 0902970416 |  | 25 | Thẻ Vàng
Row 6: 2024-01-01 10:20 | quote | Trần Văn C     | 0908888888 |  | 35 | Thẻ Bạch Kim
```

✅ **Each row is independent - no data overwrite**

## Next Steps

1. Commit and push changes to GitHub
2. Vercel will auto-deploy
3. Wait 2-3 minutes for deployment
4. Run tests from TESTING-GUIDE.md
5. Verify Google Sheet data integrity
6. Confirm emails received by customers
