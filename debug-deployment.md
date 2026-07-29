# Debug Vercel Deployment Issues

## Nếu deployment vẫn fail:

### 1. Check Build Logs
- Vào Vercel Dashboard
- Chọn project "mconic-redesign"  
- Tab "Deployments"
- Click vào deployment có X đỏ
- Xem "Build Logs" và "Function Logs"

### 2. Common Issues & Solutions:

**Build fails:**
- Node version issue: Set `NODE_VERSION=18.x` trong Environment Variables
- Dependency issue: Delete `node_modules`, run `npm install`

**Function fails:**
- Missing environment variables (GOOGLE_CREDENTIALS_JSON, etc.)
- File path issues in serverless environment

**Static files not updating:**
- Vercel cache: Settings → Functions → Clear Cache
- Browser cache: Hard refresh (Ctrl+Shift+R)

### 3. Force Redeploy:
```bash
# Trigger empty commit để force redeploy
git commit --allow-empty -m "Force redeploy"
git push origin main
```

### 4. Environment Variables cần set trên Vercel:
- GOOGLE_CREDENTIALS_JSON
- GOOGLE_SHEET_ID  
- GOOGLE_SHEET_TAB_NAME
- SMTP_HOST, SMTP_USER, SMTP_PASS
- ADMIN_EMAIL

### 5. Manual Deploy (backup):
Nếu tất cả fail, có thể deploy manual:
- Download build từ local
- Upload trực tiếp lên Vercel