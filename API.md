# MCONIC API Reference

Complete documentation for MCONIC backend REST API endpoints.

**Base URL**: `https://mconic.vn/api` (production) or `http://localhost:3000/api` (local)

---

## 1. POST /api/leads/contact

**Description**: Submit contact form for event consultation request

**HTTP Method**: `POST`  
**Content-Type**: `application/json`  
**Authentication**: None (public)  
**Rate Limit**: 5 requests per minute per IP

### Request Body

```json
{
  "name": "Nguyễn Văn A",
  "phone": "0901234567",
  "email": "john@company.com"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| name | string | ✓ | Non-empty, max 255 chars |
| phone | string | ✓ | 10 digits starting with 0 (format: 0xxxxxxxxx) |
| email | string | ✓ | Valid email format (user@domain.com) |

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Yêu cầu tư vấn đã được tiếp nhận thành công!"
}
```

**What happens**:
1. Lead saved to SQLite database (local) and Google Sheets (cloud)
2. Email notification sent to admin (ADMIN_EMAIL)
3. Confirmation email sent to user (contact details included)

### Error Responses

**400 Bad Request** - Invalid Input
```json
{
  "success": false,
  "message": "Vui lòng cung cấp đầy đủ thông tin."
}
```

Possible causes:
- Missing required fields (name, phone, or email)
- Invalid phone format (not 10 digits or doesn't start with 0)
- Invalid email format

**429 Too Many Requests** - Rate Limited
```json
{
  "success": false,
  "message": "Số yêu cầu vượt quá giới hạn. Vui lòng thử lại sau 1 phút."
}
```

Limit: 5 requests per 60 seconds per IP address

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Đã xảy ra lỗi trên hệ thống. Vui lòng thử lại sau."
}
```

Possible causes:
- Database unavailable
- SMTP email service down
- Google Sheets API unavailable

### Example Requests

**cURL**:
```bash
curl -X POST https://mconic.vn/api/leads/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "email": "contact@company.com"
  }'
```

**JavaScript / Fetch API**:
```javascript
fetch('/api/leads/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Nguyễn Văn A',
    phone: '0901234567',
    email: 'contact@company.com'
  })
})
.then(res => res.json())
.then(data => console.log(data.message));
```

**Python / Requests**:
```python
import requests

response = requests.post('https://mconic.vn/api/leads/contact', json={
    'name': 'Nguyễn Văn A',
    'phone': '0901234567',
    'email': 'contact@company.com'
})
print(response.json())
```

---

## 2. POST /api/leads/document

**Description**: Request digital PDF document (sent via email)

**HTTP Method**: `POST`  
**Content-Type**: `application/json`  
**Authentication**: None (public)  
**Rate Limit**: 5 requests per minute per IP

### Request Body

```json
{
  "name": "Trần Hùng",
  "email": "hung@company.com",
  "docId": "company-profile"
}
```

| Field | Type | Required | Valid Values |
|-------|------|----------|--------------|
| name | string | ✓ | Non-empty, max 255 chars |
| email | string | ✓ | Valid email format |
| docId | string | ✓ | `company-profile`, `event-checklist`, `industry-report` |

### Available Documents

| docId | Title | Description |
|-------|-------|-------------|
| `company-profile` | MCONIC Company Profile 2026 | Company overview, services, portfolio |
| `event-checklist` | MCONIC Event Master Checklist | Planning checklist for event organizers |
| `industry-report` | MCONIC Báo cáo Ngành 2026 | Industry analysis and trends report |

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Tài liệu đã được gửi tới email của bạn thành công!"
}
```

**What happens**:
1. Lead saved to SQLite and Google Sheets with document type recorded
2. PDF document attached and sent to user email
3. Admin notified of document request

### Error Responses

**400 Bad Request** - Invalid Document ID
```json
{
  "success": false,
  "message": "Tài liệu yêu cầu không hợp lệ."
}
```

Possible causes:
- Unknown `docId` value
- Missing required fields

**404 Not Found** - Document File Missing
```json
{
  "success": false,
  "message": "Tài liệu này hiện chưa sẵn sàng trên hệ thống. Vui lòng quay lại sau."
}
```

Cause: PDF file not found in `/assets/documents/` directory

**429 Too Many Requests** - Rate Limited
```json
{
  "success": false,
  "message": "Số yêu cầu vượt quá giới hạn. Vui lòng thử lại sau 1 phút."
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Đã xảy ra lỗi trên hệ thống. Vui lòng thử lại sau."
}
```

### Example Requests

**cURL**:
```bash
curl -X POST https://mconic.vn/api/leads/document \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Trần Hùng",
    "email": "hung@company.com",
    "docId": "company-profile"
  }'
```

**JavaScript**:
```javascript
document.getElementById('docForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const response = await fetch('/api/leads/document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementById('name').value,
      email: document.getElementById('email').value,
      docId: document.getElementById('docId').value
    })
  });
  
  const data = await response.json();
  alert(data.message);
});
```

---

## 3. POST /api/leads/quote

**Description**: Submit insurance quote request and store recommended tier

**HTTP Method**: `POST`  
**Content-Type**: `application/json`  
**Authentication**: None (public)  
**Rate Limit**: 5 requests per minute per IP

### Request Body

```json
{
  "name": "Lê Phương",
  "phone": "0909876543",
  "age": 28,
  "recommendedTier": "Premium"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|-----------|
| name | string | ✓ | Non-empty, max 255 chars |
| phone | string | ✓ | 10 digits starting with 0 |
| age | number | ✓ | Integer between 18-100 |
| recommendedTier | string | Optional | "Basic", "Professional", "Premium" |

### Tier Options

| Tier | Coverage | Annual Premium (est.) |
|------|----------|----------------------|
| Basic | Essential coverage | 2-3M VND |
| Professional | Standard + extras | 5-7M VND |
| Premium | Full coverage + benefits | 10-15M VND |

### Success Response (200 OK)

```json
{
  "success": true,
  "message": "Yêu cầu tính phí bảo hiểm đã được lưu và gửi tới chuyên viên!"
}
```

**What happens**:
1. Lead saved with age and recommended tier
2. Admin notified of insurance inquiry
3. Specialist will contact customer with formal quote

### Error Responses

**400 Bad Request** - Invalid Input
```json
{
  "success": false,
  "message": "Vui lòng cung cấp đầy đủ thông tin."
}
```

Possible causes:
- Missing required fields
- Invalid phone format
- Age not a number or outside 18-100 range

**429 Too Many Requests**
```json
{
  "success": false,
  "message": "Số yêu cầu vượt quá giới hạn. Vui lòng thử lại sau 1 phút."
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Đã xảy ra lỗi trên hệ thống. Vui lòng thử lại sau."
}
```

### Example Requests

**cURL**:
```bash
curl -X POST https://mconic.vn/api/leads/quote \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lê Phương",
    "phone": "0909876543",
    "age": 28,
    "recommendedTier": "Premium"
  }'
```

**JavaScript**:
```javascript
async function submitQuote(age) {
  // Calculate recommended tier based on age
  let tier = age < 25 ? 'Professional' : 
             age < 40 ? 'Premium' : 'Professional';
  
  const response = await fetch('/api/leads/quote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: document.getElementById('name').value,
      phone: document.getElementById('phone').value,
      age: parseInt(age),
      recommendedTier: tier
    })
  });
  
  return await response.json();
}
```

---

## 4. GET /api/admin/leads

**Description**: Retrieve all leads from database (admin-only endpoint)

**HTTP Method**: `GET`  
**Authentication**: Required (query parameter token)  
**Rate Limit**: 5 requests per minute per IP  
**Response Format**: JSON

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|------------|
| token | string | ✓ | Admin token (from ADMIN_TOKEN env var) |

### Success Response (200 OK)

```json
{
  "success": true,
  "count": 42,
  "data": [
    {
      "id": 1,
      "type": "contact",
      "name": "Nguyễn Văn A",
      "phone": "0901234567",
      "email": "contact@company.com",
      "age": null,
      "details": null,
      "created_at": "2026-07-29 10:30:45"
    },
    {
      "id": 2,
      "type": "document",
      "name": "Trần Hùng",
      "phone": null,
      "email": "hung@company.com",
      "age": null,
      "details": "company-profile",
      "created_at": "2026-07-29 10:32:15"
    },
    {
      "id": 3,
      "type": "quote",
      "name": "Lê Phương",
      "phone": "0909876543",
      "email": null,
      "age": 28,
      "details": "Premium",
      "created_at": "2026-07-29 10:35:30"
    }
  ]
}
```

### Lead Types

| Type | Fields | Details |
|------|--------|---------|
| `contact` | name, phone, email | Event consultation request |
| `document` | name, email, details | Document request (details = docId) |
| `quote` | name, phone, age, details | Insurance quote (details = tier) |

### Error Responses

**401 Unauthorized** - Invalid/Missing Token
```json
{
  "success": false,
  "message": "Chưa được cấp quyền truy cập."
}
```

**500 Internal Server Error**
```json
{
  "success": false,
  "message": "Lỗi truy xuất cơ sở dữ liệu."
}
```

### Example Requests

**cURL**:
```bash
curl "https://mconic.vn/api/admin/leads?token=YOUR_ADMIN_TOKEN"
```

**JavaScript**:
```javascript
async function getLeads(adminToken) {
  const response = await fetch(`/api/admin/leads?token=${adminToken}`);
  const data = await response.json();
  
  if (data.success) {
    console.log(`Total leads: ${data.count}`);
    data.data.forEach(lead => {
      console.log(`${lead.name} (${lead.type}) - ${lead.created_at}`);
    });
  } else {
    console.error('Access denied');
  }
}
```

**Python**:
```python
import requests

admin_token = 'YOUR_ADMIN_TOKEN'
response = requests.get(f'https://mconic.vn/api/admin/leads?token={admin_token}')
data = response.json()

if data['success']:
    for lead in data['data']:
        print(f"{lead['name']} ({lead['type']}) - {lead['created_at']}")
```

---

## Common HTTP Status Codes

| Code | Meaning | Typical Cause |
|------|---------|--------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid authentication token |
| 404 | Not Found | Resource doesn't exist (e.g., document file) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Database, email, or API service error |

---

## Rate Limiting

**Limit**: 5 requests per 60 seconds per IP address

**Applies to**: All `/api/` endpoints

**When exceeded**: Returns HTTP 429 with message  
**Reset time**: 60 seconds from first request

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
Retry-After: 45
```

---

## Data Validation

### Phone Number
- **Format**: Must be 10 digits starting with 0
- **Example valid formats**:
  - `0901234567` ✓
  - `09 0123 4567` (spaces stripped) ✓
  - `090-123-4567` (hyphens stripped) ✓
- **Invalid**:
  - `901234567` (no leading 0)
  - `09012345678` (too many digits)
  - `+84901234567` (international format not accepted)

### Email
- **Format**: Standard email regex validation
- **Example valid**:
  - `user@company.com` ✓
  - `name.surname@company.co.uk` ✓
- **Invalid**:
  - `invalid.email` (missing @)
  - `user@` (incomplete domain)

### Age
- **Range**: Integer from 18 to 100
- **Type**: Must be a number (not string)

---

## Error Handling Best Practices

1. **Always check `response.ok` or status code** before parsing JSON
2. **Implement retry logic** for 500 errors (exponential backoff recommended)
3. **Handle 429 with exponential backoff** - don't retry immediately
4. **Display user-friendly error messages** from response (already Vietnamese)
5. **Log errors for debugging** but don't expose to users

### Example Error Handling (JavaScript)

```javascript
async function submitForm(data) {
  try {
    const response = await fetch('/api/leads/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result.success) {
      alert('✓ ' + result.message);
    } else {
      alert('✗ ' + result.message);
    }
    
  } catch (error) {
    console.error('API Error:', error);
    alert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
  }
}
```

---

## CORS & Headers

**CORS Enabled**: ✓ Yes  
**Allowed Origins**: All (`*`)  
**Allowed Methods**: POST, GET, OPTIONS  
**Allowed Headers**: Content-Type, Authorization

**Request Headers** (automatically added):
```
Content-Type: application/json
```

---

## Changelog

**v1.0.0** (2026-07-29)
- Initial API release
- 4 endpoints: /contact, /document, /quote, /admin/leads
- Rate limiting: 5/min per IP
- Email notifications
- Google Sheets sync
- SQLite database

