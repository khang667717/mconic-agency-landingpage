# BÁO CÁO PHÂN TÍCH DỰ ÁN: MCONIC REDESIGN

> **Tên dự án:** MCONIC Event Agency — Hybrid Landing Page & Lead Management System  
> **Ngày lập:** 15/06/2026  
> **Công nghệ chính:** HTML5 · Vanilla CSS · Vanilla JavaScript · Node.js (Express) · SQLite · Google Sheets API · Nodemailer

---

## 4.0 DỰ ÁN NÀY LÀM VỀ CÁI GÌ

Dự án **MCONIC Redesign** là một **hybrid landing page** được thiết kế lại (redesign) cho công ty **MCONIC Event Agency** — đơn vị chuyên tổ chức sự kiện B2B (doanh nghiệp với doanh nghiệp) theo tiêu chuẩn quốc tế tại Việt Nam.

Gọi là "hybrid" vì dự án kết hợp **hai lớp** có bản chất khác nhau:
- **Lớp Landing Page** (Frontend): Toàn bộ nội dung tập trung vào một mục tiêu chuyển đổi duy nhất — thuyết phục khách hàng B2B liên hệ. Bố cục single-scroll với các section Hero → Dịch vụ → Case Study → Ưu điểm → FAQ → CTA, không có menu điều hướng nhiều tầng như corporate website truyền thống.
- **Lớp Backend thực sự** (Backend): Có Node.js/Express API riêng biệt, cơ sở dữ liệu SQLite, tích hợp Google Sheets, và hệ thống gửi email tự động — vượt xa một landing page tĩnh thông thường.

Hai mục tiêu cốt lõi:
1. **Chuyển đổi (Convert):** Đưa khách truy cập (giám đốc marketing, trưởng ban tổ chức sự kiện…) điền vào ít nhất một trong ba form chuyển đổi.
2. **Quản lý lead tự động:** Ghi nhận, lưu trữ và thông báo về mọi lead qua ba kênh (SQLite, Google Sheets, Email) mà không cần thao tác thủ công.

Hai trang trong hệ thống:
- `index.html` — Trang chính: giới thiệu, dịch vụ, case study, FAQ, tải tài liệu, form liên hệ.
- `insurance.html` — Trang MCONIC Protect: giới thiệu gói bảo hiểm sự kiện, công cụ tính phí theo tuổi, đăng ký báo giá.

---

## 4.1 ĐẶC TẢ YÊU CẦU BÀI TOÁN

### 4.1.1 Nhiệm vụ của hệ thống

| # | Nhiệm vụ | Mô tả chi tiết |
|---|---|---|
| 1 | **Trưng bày thương hiệu** | Hiển thị thông tin về công ty, đội ngũ, số liệu thành tích (1000+ sự kiện, 500+ đối tác…) |
| 2 | **Giới thiệu dịch vụ** | Mô tả 6 nhóm dịch vụ cốt lõi: MICE, Concert & Gala, Booth Triển lãm, Product Launch, Year End Party, Brand Activation |
| 3 | **Thu thập lead tư vấn** | Cho phép khách hàng điền form yêu cầu tư vấn (họ tên, SĐT, email) |
| 4 | **Phân phối tài liệu kỹ thuật số** | Gửi tài liệu PDF (Company Profile, Event Checklist, Báo cáo Ngành) vào email khách sau khi thu thập thông tin |
| 5 | **Tính phí bảo hiểm sự kiện** | Cung cấp công cụ tra cứu/tính phí bảo hiểm dựa trên tuổi người dùng, đề xuất hạng thẻ phù hợp |
| 6 | **Lưu trữ & thông báo lead** | Ghi toàn bộ lead vào cơ sở dữ liệu SQLite và Google Sheets, đồng thời gửi email thông báo cho admin và email xác nhận cho khách hàng |

### 4.1.2 Chức năng hệ thống

**Frontend (Giao diện người dùng):**
- Điều hướng (Navigation): Menu desktop + mobile drawer (responsive).
- FAQ Accordion: Câu hỏi thường gặp mở/đóng.
- Document Modal: Popup form yêu cầu tài liệu.
- Contact Form: Form liên hệ với validation phía client.
- Insurance Quote Calculator: Công cụ tính phí bảo hiểm + highlight gói đề xuất.
- Scroll animations (Reveal): Hiệu ứng xuất hiện khi cuộn trang.
- Marquee banner: Dải chạy chữ giới thiệu các loại sự kiện.

**Backend (Máy chủ):**
- REST API (Express.js): 4 endpoint chính.
- Database (SQLite): Lưu trữ lead cục bộ.
- Email Service (Nodemailer + Gmail SMTP): Gửi email thông báo & gửi tài liệu đính kèm.
- Google Sheets Integration: Đồng bộ lead sang Google Sheets để dễ quản lý.
- Rate Limiter: Giới hạn 5 request/phút/IP để chống spam.
- Logging (Winston + Morgan): Ghi log lỗi và request HTTP.

### 4.1.3 Phạm vi hệ thống

| Trong phạm vi | Ngoài phạm vi |
|---|---|
| Website landing page 2 trang | Hệ thống CRM/ERP đầy đủ |
| Thu thập lead (contact, document, quote) | Thanh toán trực tuyến thực sự (chỉ hiển thị logo cổng thanh toán) |
| Lưu trữ SQLite + Google Sheets | Cơ sở dữ liệu quan hệ phức tạp |
| Gửi email (thông báo + PDF) | Hệ thống chat/ticketing hỗ trợ khách hàng |
| Công cụ tính phí bảo hiểm theo tuổi | Hệ thống quản lý hợp đồng bảo hiểm thực |
| Trang admin xem lead (GET /api/admin/leads) | Dashboard quản trị trực quan đầy đủ |

---

## 4.2 PHÂN TÍCH HỆ THỐNG

### 4.2.1 Sơ đồ phân cấp chức năng (Function Hierarchy Diagram)

```
MCONIC Website System
├── 1. Hiển thị thông tin (Presentation)
│   ├── 1.1 Hero Banner (giới thiệu tổng quan)
│   ├── 1.2 About / Thống kê công ty
│   ├── 1.3 Danh sách dịch vụ (6 nhóm)
│   ├── 1.4 Case Study (3 dự án nổi bật)
│   ├── 1.5 Testimonials (đánh giá khách hàng)
│   ├── 1.6 Advantages (3 ưu điểm cạnh tranh)
│   └── 1.7 FAQ Accordion (5 câu hỏi)
│
├── 2. Thu thập Lead
│   ├── 2.1 Form liên hệ tư vấn
│   │   ├── 2.1.1 Validate client-side
│   │   ├── 2.1.2 POST /api/leads/contact
│   │   ├── 2.1.3 Lưu SQLite
│   │   ├── 2.1.4 Ghi Google Sheets
│   │   └── 2.1.5 Gửi email (admin + user)
│   │
│   ├── 2.2 Form yêu cầu tài liệu (Modal)
│   │   ├── 2.2.1 Chọn tài liệu (3 loại PDF)
│   │   ├── 2.2.2 Validate client-side
│   │   ├── 2.2.3 POST /api/leads/document
│   │   ├── 2.2.4 Lưu SQLite
│   │   ├── 2.2.5 Ghi Google Sheets
│   │   └── 2.2.6 Gửi email đính kèm PDF
│   │
│   └── 2.3 Form tính phí bảo hiểm
│       ├── 2.3.1 Validate client-side
│       ├── 2.3.2 Tính toán hạng thẻ theo tuổi (local JS)
│       ├── 2.3.3 Hiển thị gói đề xuất
│       ├── 2.3.4 POST /api/leads/quote
│       ├── 2.3.5 Lưu SQLite
│       └── 2.3.6 Ghi Google Sheets + email admin
│
├── 3. Quản trị (Admin)
│   └── 3.1 GET /api/admin/leads?token=xxx
│       ├── 3.1.1 Xác thực token
│       └── 3.1.2 Trả về danh sách lead từ SQLite
│
└── 4. Hạ tầng & Hỗ trợ
    ├── 4.1 Rate Limiting (chống spam)
    ├── 4.2 Logging (Winston + Morgan)
    ├── 4.3 Compression (gzip)
    ├── 4.4 CORS
    └── 4.5 Static File Serving
```

---

### 4.2.2 Sơ đồ luồng dữ liệu (DFD — Data Flow Diagram)

#### DFD Mức 0 (Context Diagram)

```
                    ┌─────────────────────────┐
                    │                         │
   Khách hàng  ────►│  MCONIC Website System  │────► Admin (Email thông báo)
   (Browser)   ◄────│                         │────► Khách hàng (Email xác nhận)
                    │                         │────► Google Sheets (Dữ liệu lead)
                    └─────────────────────────┘
```

#### DFD Mức 1 (Level 1)

```
Khách hàng
    │
    ├── [Thông tin tư vấn: tên, SĐT, email]
    │       │
    │       ▼
    │   ┌─────────────────────────────────┐
    │   │  P1: Xử lý form liên hệ        │
    │   │  - Validate dữ liệu            │
    │   │  - Insert vào D1 (leads)       │
    │   │  - Ghi vào D2 (Google Sheets)  │
    │   │  - Gửi email thông báo         │
    │   └─────────────────────────────────┘
    │           │
    │           └──► Admin nhận email [LEAD MỚI]
    │           └──► Khách hàng nhận email xác nhận
    │
    ├── [Tên, email, ID tài liệu]
    │       │
    │       ▼
    │   ┌──────────────────────────────────────┐
    │   │  P2: Xử lý yêu cầu tài liệu         │
    │   │  - Validate & kiểm tra file PDF      │
    │   │  - Insert vào D1 (leads)             │
    │   │  - Ghi vào D2 (Google Sheets)        │
    │   │  - Gửi email đính kèm PDF            │
    │   └──────────────────────────────────────┘
    │           │
    │           └──► Khách hàng nhận email kèm PDF
    │
    └── [Tên, SĐT, tuổi]
            │
            ▼
        ┌────────────────────────────────────────────┐
        │  P3: Tính phí & quản lý báo giá bảo hiểm  │
        │  - Tính toán hạng thẻ theo tuổi (client)  │
        │  - Insert vào D1 (leads)                  │
        │  - Ghi vào D2 (Google Sheets)             │
        │  - Gửi email admin [LEAD BẢO HIỂM]        │
        └────────────────────────────────────────────┘
                │
                └──► Admin nhận email [LEAD BẢO HIỂM]
                └──► UI highlight hạng thẻ phù hợp

D1: SQLite Database (leads.db)
D2: Google Sheets (Cloud)
```

---

### 4.2.3 Sơ đồ liên kết dữ liệu (ERD — Entity Relationship Diagram)

Do hệ thống chỉ sử dụng **một bảng duy nhất** trong SQLite, ERD ở đây được mô tả cùng với các thực thể logic:

```
┌─────────────────────────────────────────────────┐
│                    LEAD                         │
│ (Bảng: leads — SQLite)                          │
├─────────────────────────────────────────────────┤
│  PK  id          INTEGER  (Auto Increment)      │
│      type        TEXT     'contact'|'document'  │
│                           |'quote'              │
│      name        TEXT     Họ và tên             │
│      phone       TEXT     Số điện thoại         │
│      email       TEXT     Địa chỉ email         │
│      age         INTEGER  Tuổi (cho quote)      │
│      details     TEXT     ID tài liệu / hạng   │
│                           thẻ / JSON chi tiết   │
│      created_at  DATETIME Timestamp tạo         │
└─────────────────────────────────────────────────┘

Chú thích: Hệ thống sử dụng kiến trúc single-table với
cột "type" phân biệt loại lead. Đây là thiết kế phù hợp
với quy mô MVP (Minimum Viable Product).
```

---

### 4.2.4 Sơ đồ quan hệ dữ liệu (Quan hệ giữa các thành phần)

```
                        ┌─────────────────────────┐
                        │   index.html (Trang chủ) │
                        └────────────┬────────────┘
                                     │ liên kết
                    ┌────────────────┼────────────────┐
                    ▼                ▼                 ▼
           ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
           │  js/script.js│  │  css/*.css   │  │insurance.html│
           │ (Logic UI)   │  │ (Giao diện)  │  │(Trang BH)    │
           └──────┬───────┘  └──────────────┘  └──────┬───────┘
                  │                                    │ dùng
                  │ gọi API                            ▼
                  │                          ┌──────────────────┐
                  │                          │ js/insurance.js  │
                  │                          │ (Logic tính phí) │
                  │                          └────────┬─────────┘
                  │                                   │ gọi API
                  ▼                                   ▼
         ┌───────────────────────────────────────────────────────┐
         │                  api/server.js (Express Backend)       │
         │                                                        │
         │  POST /api/leads/contact                              │
         │  POST /api/leads/document                             │
         │  POST /api/leads/quote                                │
         │  GET  /api/admin/leads                                │
         └──────┬────────────────────┬──────────────────────────┘
                │                    │                    │
                ▼                    ▼                    ▼
        ┌───────────────┐  ┌──────────────────┐  ┌──────────────┐
        │ leads.db      │  │ Google Sheets API │  │ Nodemailer   │
        │ (SQLite)      │  │ (Cloud Storage)   │  │ (Gmail SMTP) │
        └───────────────┘  └──────────────────┘  └──────────────┘
```

---

## 4.3 XÂY DỰNG CHƯƠNG TRÌNH

### 4.3a Các chức năng dự kiến xây dựng

| # | Chức năng dự kiến | Module liên quan |
|---|---|---|
| F1 | Landing page giới thiệu dịch vụ | `index.html`, `css/style.css` |
| F2 | Form liên hệ tư vấn (Contact Lead) | `index.html`, `js/script.js`, `api/server.js` |
| F3 | Modal yêu cầu & nhận tài liệu PDF | `index.html`, `js/script.js`, `api/server.js` |
| F4 | Trang bảo hiểm & công cụ tính phí | `insurance.html`, `js/insurance.js` |
| F5 | Lưu lead vào SQLite Database | `api/server.js`, `leads.db` |
| F6 | Đồng bộ lead lên Google Sheets | `api/server.js`, `google-credentials.json` |
| F7 | Gửi email thông báo admin & xác nhận user | `api/server.js`, `.env` |
| F8 | Rate limiting chống spam | `api/server.js` |
| F9 | Admin API xem danh sách lead | `api/server.js` |
| F10 | Responsive design (mobile/desktop) | `css/layout.css`, `css/components.css` |
| F11 | Scroll reveal animation | `js/script.js`, `css/style.css` |
| F12 | Mobile navigation drawer | `js/script.js` |

---

### 4.3b Các chức năng đã xây dựng được

#### F1 — Trang chủ Landing Page (`index.html`)

Website trang chủ được xây dựng hoàn chỉnh với phong cách **Pop-art bold**, bố cục chia thành các section:

| Section | Nội dung | Ghi chú |
|---|---|---|
| **Hero** | H1 + tagline + 2 CTA button + hình hero | Fetch priority high cho ảnh |
| **Marquee** | Dải chạy tên loại sự kiện | CSS animation |
| **About** | Mô tả công ty + 4 con số thống kê | `reveal` animation |
| **Services** | 6 thẻ dịch vụ dạng grid | Ảnh lazy load |
| **Case Studies** | 3 dự án nổi bật với badge kết quả | |
| **Testimonials** | 3 quote đánh giá khách hàng | |
| **Advantages** | 3 ưu điểm cạnh tranh | |
| **FAQ** | 5 câu hỏi accordion | ARIA a11y |
| **Resources** | 3 tài liệu + nút trigger modal | |
| **Contact** | Form liên hệ tư vấn | Real-time validation |
| **Footer** | Địa chỉ, liên kết, thanh toán, mạng xã hội | |

**Giao diện tương ứng:**  
- Font: `Archivo` (display) + `Public Sans` (body) từ Google Fonts  
- Màu sắc: Đen `#161310`, Đỏ `#D32F2F`, Nền cream `#FBF6EE`  
- Hiệu ứng: Scroll reveal (IntersectionObserver), hover scale/shadow trên card  

---

#### F2 — Form Liên hệ Tư vấn

**Luồng hoạt động:**
```
User nhập [Tên + SĐT + Email]
  → Validate client (JS regex: phone = /^0[0-9]{9}$/, email regex)
  → POST /api/leads/contact
  → Server validate lại (server-side)
  → INSERT SQLite leads
  → Append Google Sheets
  → Gửi email admin (HTML template, tiêu đề "[LEAD MỚI] ...")
  → Gửi email xác nhận user (HTML template đầy đủ thông tin)
  → Frontend: Thay thế form bằng màn hình success animation (icon checkmark)
```

**Validation rules:**
- Họ tên: bắt buộc, không rỗng
- SĐT: 10 chữ số, bắt đầu bằng `0` (regex: `/^0[0-9]{9}$/`)
- Email: định dạng hợp lệ (regex email)

---

#### F3 — Modal Yêu cầu Tài liệu PDF

**3 tài liệu có sẵn:**

| ID | Tên tài liệu | File |
|---|---|---|
| `company-profile` | MCONIC Company Profile 2026 | `company-profile.pdf` |
| `event-checklist` | MCONIC Event Master Checklist | `event-checklist.pdf` |
| `industry-report` | MCONIC Báo cáo Ngành 2026 | `industry-report.pdf` |

**Luồng hoạt động:**
```
User click "Yêu cầu qua email" trên tài liệu bất kỳ
  → Mở modal popup (aria-hidden toggle)
  → User nhập [Tên + Email]
  → Validate client-side
  → POST /api/leads/document { name, email, docId }
  → Server kiểm tra file PDF tồn tại trên disk
  → INSERT SQLite + Google Sheets
  → Gửi email kèm file PDF đính kèm
  → Modal hiển thị màn hình success với icon animation
```

---

#### F4 — Trang Bảo hiểm & Công cụ Tính Phí (`insurance.html`)

**Thuật toán tính phí bảo hiểm (logic trong `js/insurance.js`):**

Dựa vào tuổi đầu vào, hệ thống phân loại vào hạng thẻ theo bảng:

| Khoảng tuổi | Hạng thẻ | Phí/năm |
|---|---|---|
| < 18 | Chưa đủ tuổi | — |
| 18 – 30 | Thẻ Bạc | 500.000đ |
| 31 – 40 | Thẻ Titan | 800.000đ |
| 41 – 50 | Thẻ Vàng | 1.200.000đ |
| 51 – 60 | Thẻ Bạch Kim | 1.800.000đ |
| 61 – 75 | Thẻ Kim Cương | 3.000.000đ |
| > 75 | Không đủ điều kiện | — |

**Sau khi tính toán:**
- Hạng thẻ phù hợp được highlight (class `tier--recommended`)
- Các hạng khác bị ẩn (class `tier-hidden`)
- Nút "Xem thêm các gói khác" xuất hiện để hiện tất cả
- Dữ liệu lead gửi về `POST /api/leads/quote` (async, không blocking UI)

---

#### F5 — SQLite Database

Bảng `leads` được tạo tự động khi khởi động server:

```sql
CREATE TABLE IF NOT EXISTS leads (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    type       TEXT NOT NULL,   -- 'contact' | 'document' | 'quote'
    name       TEXT NOT NULL,
    phone      TEXT,
    email      TEXT,
    age        INTEGER,
    details    TEXT,            -- Tên tài liệu / hạng thẻ đề xuất
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_email      ON leads(email);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_leads_type       ON leads(type);
```

---

#### F6 — Google Sheets Integration

- Sử dụng `googleapis` SDK với xác thực Service Account.
- Tự động tạo header row nếu sheet còn trống.
- Tự động nhận diện tên tab (hỗ trợ cả tên tiếng Việt như "Trang tính 1").
- Mỗi lead ghi một row với 7 cột: `Thời gian, Phân loại, Họ và tên, Số điện thoại, Email, Tuổi, Chi tiết khác`.

---

#### F7 — Email Service (Nodemailer)

3 loại email được gửi:

| Loại email | Người nhận | Nội dung |
|---|---|---|
| Admin alert — Contact | Admin | Thông tin khách hàng yêu cầu tư vấn |
| User confirm — Contact | Khách hàng | Xác nhận đăng ký, cam kết 24h liên hệ lại |
| User doc — Document | Khách hàng | Gửi kèm PDF đính kèm |
| Admin alert — Quote | Admin | Thông tin khách hàng tra cứu bảo hiểm |

---

#### F8 — Rate Limiting

```
Giới hạn: 5 request/phút cho mỗi IP
Áp dụng cho: tất cả route /api/*
Response khi vượt giới hạn: HTTP 429
Message: "Số yêu cầu vượt quá giới hạn. Vui lòng thử lại sau 1 phút."
```

---

#### F9 — Admin API

```
GET /api/admin/leads?token=<ADMIN_TOKEN>
→ Xác thực token từ biến môi trường ADMIN_TOKEN
→ Trả về JSON: { success, count, data: [...] }
→ Mỗi item: id, type, name, phone, email, age, details, created_at
```

---

#### F10 — Responsive Design

- Mobile-first CSS với breakpoints tại `768px` và `1024px`.
- Navigation desktop/mobile hoàn toàn tách biệt, mobile dùng slide-in drawer.
- Grid tự điều chỉnh (1 cột → 2 cột → 3 cột) theo viewport.

---

#### F11, F12 — Animations & Mobile Menu

- **Scroll reveal:** Dùng `IntersectionObserver` API (gracefully fallback nếu không hỗ trợ hoặc `prefers-reduced-motion` bật).
- **Mobile menu:** Slide-in drawer với overlay backdrop, Escape key để đóng, xử lý điều hướng cross-page đúng cách.

---

### 4.3c Các chức năng dự kiến nhưng chưa xây dựng được

| # | Chức năng còn thiếu | Lý do / Ghi chú |
|---|---|---|
| 1 | **Trang chi tiết dịch vụ riêng lẻ** | Hiện tại 6 dịch vụ chỉ là card link tới form liên hệ, không có trang riêng |
| 2 | **Dashboard admin trực quan** | `GET /api/admin/leads` chỉ trả JSON thô, chưa có giao diện quản trị |
| 3 | **Portfolio / Gallery dự án** | Case study chỉ có 3 bài tĩnh, chưa có hệ thống CMS |
| 4 | **Blog / Tin tức** | Không có hệ thống nội dung động |
| 5 | **Tích hợp thanh toán thực** | Footer hiển thị logo Visa/Mastercard/VNPAY/MoMo nhưng chưa tích hợp cổng thanh toán |
| 6 | **Hệ thống đăng nhập tài khoản** | Không có user authentication cho khách hàng/admin |
| 7 | **Chatbot / Live chat** | Hiện chỉ có hotline điện thoại |
| 8 | **SEO nâng cao** | Thiếu sitemap.xml, robots.txt, structured data (JSON-LD) |
| 9 | **Tracking & Analytics** | Chưa tích hợp Google Analytics hoặc Facebook Pixel |
| 10 | **Chính sách pháp lý** | Các link "Chính sách bảo mật", "Điều khoản dịch vụ" ở footer dẫn đến `#` (trang chưa tồn tại) |
| 11 | **Trang 404 tùy chỉnh** | Không có error page |

---

### 4.3d Các sản phẩm khác

| Sản phẩm | Mô tả |
|---|---|
| **`PHAN_TICH_DU_AN.md`** (file này) | Tài liệu phân tích hệ thống toàn diện |
| **`.env.example`** | Template cấu hình môi trường cho developer mới |
| **`vercel.json`** | Cấu hình triển khai serverless lên Vercel |
| **`google-credentials.json`** | Service Account key cho Google Sheets (không commit lên Git) |
| **`leads.db`** | File SQLite database chứa dữ liệu lead thực tế |
| **Thư mục `assets/documents/`** | Nơi lưu trữ các file PDF để gửi qua email |
| **Thư mục `logs/`** | File log lỗi do Winston ghi (chỉ chạy local, bỏ qua trên Vercel) |

---

## 4.4 TẠO LẬP BẢNG CSDL

### Bảng duy nhất: `leads`

| Cột | Kiểu dữ liệu | Ràng buộc | Mô tả |
|---|---|---|---|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Khóa chính tự tăng |
| `type` | TEXT | NOT NULL | Loại lead: `'contact'`, `'document'`, `'quote'` |
| `name` | TEXT | NOT NULL | Họ và tên khách hàng |
| `phone` | TEXT | NULL | Số điện thoại (10 chữ số, bắt đầu bằng 0) |
| `email` | TEXT | NULL | Địa chỉ email |
| `age` | INTEGER | NULL | Tuổi (chỉ dùng cho lead `quote`) |
| `details` | TEXT | NULL | Thông tin bổ sung: ID tài liệu / hạng thẻ đề xuất |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |

**Indexes:**

| Tên Index | Cột | Mục đích |
|---|---|---|
| `idx_leads_email` | `email` | Tìm kiếm lead theo email nhanh |
| `idx_leads_created_at` | `created_at` | Sắp xếp theo thời gian |
| `idx_leads_type` | `type` | Lọc lead theo loại |

**Ví dụ dữ liệu mẫu:**

```sql
-- Lead từ form tư vấn
INSERT INTO leads VALUES (1, 'contact', 'Nguyễn Văn A', '0901234567', 'a@company.com', NULL, NULL, '2026-06-15 09:00:00');

-- Lead yêu cầu tài liệu
INSERT INTO leads VALUES (2, 'document', 'Trần Thị B', NULL, 'b@corp.vn', NULL, 'company-profile', '2026-06-15 10:00:00');

-- Lead tra cứu bảo hiểm
INSERT INTO leads VALUES (3, 'quote', 'Lê Văn C', '0912345678', NULL, 35, 'Thẻ Titan', '2026-06-15 11:00:00');
```

**Cấu hình biến môi trường (`.env`):**

| Biến | Mô tả | Giá trị mặc định |
|---|---|---|
| `PORT` | Cổng server | `3000` |
| `SMTP_HOST` | SMTP server | `smtp.gmail.com` |
| `SMTP_PORT` | Cổng SMTP | `587` |
| `SMTP_USER` | Tài khoản Gmail gửi mail | *(bắt buộc)* |
| `SMTP_PASS` | App Password Gmail | *(bắt buộc)* |
| `ADMIN_EMAIL` | Email nhận thông báo lead | `hello@mconic.vn` |
| `SENDER_NAME` | Tên hiển thị email gửi | `MCONIC Event Agency` |
| `GOOGLE_SHEET_ID` | ID Google Spreadsheet | *(tùy chọn)* |
| `GOOGLE_SHEET_TAB_NAME` | Tên tab trong sheet | `Sheet1` |
| `ADMIN_TOKEN` | Token bảo vệ admin API | *(bắt buộc nếu dùng)* |
| `DATABASE_PATH` | Đường dẫn file SQLite | `./leads.db` |

---

## 4.5 NHẬN XÉT, ĐÁNH GIÁ: SO SÁNH LÝ THUYẾT VÀ THỰC TIỄN

### 4.5.1 Những điểm phù hợp với lý thuyết

| Khía cạnh | Lý thuyết | Thực tiễn trong dự án |
|---|---|---|
| **Kiến trúc Client-Server** | Frontend tách biệt backend, giao tiếp qua API | ✅ HTML/JS frontend gọi REST API Node.js |
| **REST API Design** | HTTP Methods đúng ngữ nghĩa, JSON response | ✅ POST để tạo lead, GET để đọc; response chuẩn `{ success, message, data }` |
| **Validation 2 lớp** | Validate cả client và server để bảo mật | ✅ JS regex validate → server validate lại trước khi ghi DB |
| **Database Indexing** | Index trên cột hay tìm kiếm để tăng performance | ✅ Index trên `email`, `created_at`, `type` |
| **Separation of Concerns** | CSS, HTML, JS tách riêng file | ✅ Có `base.css`, `layout.css`, `components.css`, `style.css`, `insurance.css` |
| **Error Handling** | Bắt lỗi và phản hồi phù hợp | ✅ try/catch ở mọi async operation, logger.error() |
| **Rate Limiting** | Bảo vệ API khỏi abuse | ✅ express-rate-limit: 5 req/min/IP |
| **Environment Variables** | Không hardcode secret vào code | ✅ `.env` cho SMTP, Google Sheets, admin token |

### 4.5.2 Những điểm còn khoảng cách với lý thuyết

| Khía cạnh | Lý thuyết đề xuất | Thực tiễn |
|---|---|---|
| **Database Design** | Nhiều bảng rõ ràng (Contacts, Documents, Quotes...) | ⚠️ Dùng 1 bảng `leads` với cột `type` phân biệt — đơn giản nhưng khó mở rộng |
| **Authentication & Authorization** | JWT/Session cho admin, không dùng query param | ⚠️ Admin API dùng `?token=` trong URL — không an toàn cho production (token lộ trong browser history/log) |
| **Input Sanitization** | Lọc HTML entities, SQL injection prevention | ⚠️ Dùng parameterized query (SQLite) là đúng, nhưng chưa sanitize XSS cho dữ liệu email HTML template |
| **HTTPS** | Bắt buộc dùng HTTPS | ✅ (Vercel tự handle HTTPS; local dev chưa có SSL) |
| **API Versioning** | `/api/v1/leads/contact` | ⚠️ Hiện tại không có versioning |
| **Unit Testing** | Test coverage cho backend API | ❌ Không có test nào được viết |
| **Logging** | Ghi log đầy đủ (request + response + error) | ⚠️ Morgan ghi request log, Winston chỉ ghi error — thiếu info/debug log |
| **Graceful Shutdown** | Xử lý SIGTERM để đóng DB connection | ❌ Server chưa xử lý graceful shutdown |

---

## 4.6 ĐỀ XUẤT CÁC GIẢI PHÁP CẢI THIỆN

### Cải thiện ngắn hạn (có thể thực hiện ngay)

| # | Giải pháp | Ưu tiên |
|---|---|---|
| 1 | **Thêm trang chi tiết cho từng dịch vụ** — Tạo `services/mice.html`, `services/gala.html`... với nội dung SEO đầy đủ | Cao |
| 2 | **Thêm `sitemap.xml` và `robots.txt`** để tối ưu SEO kỹ thuật | Cao |
| 3 | **Thêm trang chính sách bảo mật và điều khoản** — Các link ở footer hiện dẫn đến `#` | Cao |
| 4 | **Bảo mật Admin Token** — Chuyển sang HTTP Authorization header (`Bearer token`) thay vì query param | Cao |
| 5 | **Thêm trang 404 tùy chỉnh** (`404.html`) với nội dung thương hiệu | Trung bình |
| 6 | **Tích hợp Google Analytics 4** — Theo dõi hành vi người dùng và hiệu quả form | Trung bình |
| 7 | **Thêm Open Graph / Twitter Card meta tags** — Để chia sẻ mạng xã hội trông đẹp hơn | Trung bình |

### Cải thiện trung hạn (cần lập kế hoạch)

| # | Giải pháp | Lợi ích |
|---|---|---|
| 8 | **Tách bảng CSDL** — Tạo `contacts`, `document_requests`, `insurance_quotes` riêng biệt thay vì 1 bảng `leads` | Dữ liệu cấu trúc rõ hơn, dễ báo cáo |
| 9 | **Xây dựng Admin Dashboard** — Trang web quản trị nội bộ với chart, filter, export CSV | Quản lý lead hiệu quả hơn |
| 10 | **Thêm unit/integration test** (Jest + Supertest) — Test các API endpoint | Đảm bảo chất lượng khi thay đổi code |
| 11 | **Triển khai CI/CD** (GitHub Actions) — Tự động test và deploy khi push code | Quy trình phát triển chuyên nghiệp |
| 12 | **Thêm input sanitization** — Dùng thư viện như `DOMPurify` (frontend) hoặc `sanitize-html` (backend) | Bảo mật chống XSS |

### Cải thiện dài hạn (tầm nhìn chiến lược)

| # | Giải pháp | Mô tả |
|---|---|---|
| 13 | **Tích hợp CRM** (HubSpot/Salesforce) — Đồng bộ lead từ website vào CRM thay vì chỉ Google Sheets | Quản lý pipeline bán hàng đầy đủ |
| 14 | **Hệ thống đặt lịch tư vấn** — Tích hợp Calendly hoặc xây dựng booking system riêng | Tự động hóa quy trình tư vấn |
| 15 | **Nâng cấp lên framework** (Next.js) — Hỗ trợ SSR, ISR cho SEO tốt hơn, quản lý state phức tạp | Mở rộng tính năng dài hạn |
| 16 | **Tích hợp cổng thanh toán thực** (VNPAY/MoMo API) — Cho phép đặt cọc online | Rút ngắn sales cycle |
| 17 | **Hệ thống đánh giá & review thực** — Thay testimonials tĩnh bằng review động từ khách hàng thực | Tăng social proof |

---

*Tài liệu này được tạo bởi phân tích tự động toàn bộ source code của dự án MCONIC Redesign vào ngày 15/06/2026.*
