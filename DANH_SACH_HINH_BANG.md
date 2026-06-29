# DANH SÁCH CÁC BẢNG BIỂU VÀ HÌNH VẼ CHI TIẾT

Dưới đây là chi tiết nội dung của các bảng biểu và mã nguồn Mermaid để tạo các hình vẽ/sơ đồ. Bạn có thể sử dụng nội dung này để đưa vào báo cáo.

---

## 1. CÁC BẢNG BIỂU

### Bảng 4.1: Bảng mô tả chi tiết các luồng chức năng của hệ thống

| STT | Phân hệ | Tên chức năng | Mô tả chi tiết |
|:---:|:---|:---|:---|
| 1 | Frontend (B2B) | Form liên hệ tư vấn | Thu thập thông tin khách hàng (Tên, SĐT, Email). Validate client-side bằng Regex. Hiển thị thông báo thành công. |
| 2 | Frontend (B2B) | Đăng ký nhận tài liệu | Popup modal cho phép khách hàng chọn loại tài liệu (Profile, Checklist, Report) và nhập email để nhận file PDF. |
| 3 | Frontend (B2B) | Tính phí bảo hiểm | Công cụ JavaScript tính hạng thẻ bảo hiểm (Bạc, Titan, Vàng...) dựa trên tuổi khách hàng nhập vào. |
| 4 | Frontend (B2C) | Đăng ký tham gia sự kiện | Form đăng ký với các trường thông tin gia đình. Tích hợp đếm ngược thời gian sự kiện. |
| 5 | Backend | Xử lý API & Lưu CSDL | Tiếp nhận request từ Frontend, validate server-side, lưu dữ liệu Lead vào cơ sở dữ liệu SQLite. |
| 6 | Backend | Đồng bộ Google Sheets | Tự động ghi dữ liệu khách hàng mới lên Google Sheets theo thời gian thực qua API v4. |
| 7 | Backend | Gửi Email tự động | Sử dụng Nodemailer gửi email thông báo cho Admin và email xác nhận/đính kèm tài liệu cho khách hàng. |

### Bảng 4.2: Cấu trúc từ điển dữ liệu bảng Leads (SQLite)

| Tên trường | Kiểu dữ liệu | Ràng buộc | Mô tả |
|:---|:---|:---|:---|
| `id` | INTEGER | PRIMARY KEY, AUTOINCREMENT | Mã định danh duy nhất của khách hàng |
| `type` | TEXT | NOT NULL | Loại khách hàng (contact, document, quote, event) |
| `name` | TEXT | NOT NULL | Họ và tên khách hàng đại diện |
| `phone` | TEXT | NULL | Số điện thoại liên hệ |
| `email` | TEXT | NULL | Địa chỉ thư điện tử |
| `age` | INTEGER | NULL | Tuổi (dùng cho tính phí bảo hiểm) |
| `details` | TEXT | NULL | Thông tin bổ sung (Hạng thẻ, Tên tài liệu, Số người tham gia) |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Thời gian tạo bản ghi |

### Bảng 4.3: So sánh đánh giá giữa lý thuyết và thực tiễn áp dụng

| Tiêu chí | Kiến thức lý thuyết | Thực tiễn áp dụng tại doanh nghiệp |
|:---|:---|:---|
| **Kiến trúc hệ thống** | Tách biệt Client - Server hoàn toàn, giao tiếp qua RESTful API chuẩn mực. | Áp dụng đúng lý thuyết. Frontend dùng HTML/JS gọi API đến Backend Node.js. |
| **Cơ sở dữ liệu** | Phân chia thành nhiều bảng có quan hệ (1-n, n-n) theo chuẩn hóa (3NF). | Tối giản hóa thành 1 bảng `leads` duy nhất với cột `type` để tăng tốc độ triển khai MVP. |
| **Bảo mật** | Sử dụng JWT (JSON Web Token) ở header cho mọi luồng xác thực. | Dùng Query Parameter (`?token=`) cho Admin API để ưu tiên tính tiện dụng và tốc độ code. |
| **Giao diện Front-end** | Sử dụng các Framework lớn như React/Vue để quản lý state và component. | Dùng Vanilla JS, HTML/CSS thuần kết hợp kĩ thuật tối ưu hiệu năng (Critical CSS, Parallax) để landing page nhẹ và tải nhanh nhất. |

---

## 2. CÁC HÌNH VẼ, BIỂU ĐỒ (SƠ ĐỒ MERMAID)
*(Ghi chú: Copy các khối mã bên dưới vào các công cụ hỗ trợ Mermaid như Notion, GitHub, hoặc draw.io để tự động tạo ra hình vẽ. Đối với các Hình 4.5 đến 4.8 là hình ảnh giao diện, bạn cần chụp màn hình thực tế của website để chèn vào Word).*

### Hình 2.1: Sơ đồ cơ cấu tổ chức Văn phòng MClass Sài Gòn

```mermaid
graph TD
    MClass[Văn phòng Manulife MClass Sài Gòn<br>LIM Tower, Quận 1] --> Agency[I. KHỐI KINH DOANH<br>Agency Network]
    MClass --> BackOffice[II. KHỐI CHỨC NĂNG<br>Back-Office]
    MClass --> Council[III. HỘI ĐỒNG THỦ LĨNH<br>Agency Council]

    %% ================= KHỐI KINH DOANH =================
    subgraph Khối Lực lượng Đại lý
        Agency --> A1[1. Quản lý Vùng<br>AVP / SDM / DM]
        A1 --> A2[2. Quản lý Phòng<br>SUM / UM]
        A2 --> A3[3. Quản lý Nhóm<br>SBM / BM]
        A3 --> A4[4. Tư vấn Tài chính trực tiếp]
        A4 --> FC[FC / ProFC / MDRT]
    end

    %% ================= KHỐI CHỨC NĂNG =================
    subgraph Khối Hỗ trợ & Vận hành
        BackOffice --> CS[Bộ phận Dịch vụ Khách hàng<br>CS - Quầy giao dịch]
        BackOffice --> AD[Phát triển Kinh doanh Vùng<br>AD - Định biên thi đua]
        BackOffice --> Academy[Bộ phận Đào tạo<br>Academy - Lớp MIT]
        BackOffice --> Tech[TechLounge / IT Support<br>Hỗ trợ ứng dụng ePOS]
    end

    %% ================= HỘI ĐỒNG THỦ LĨNH =================
    subgraph Khối Hội đồng Tự quản
        Council --> Event[Ban Phong trào / Sự kiện]
        Council --> Training[Ban Đào tạo Nội bộ]
        Council --> Compliance[Ban Kỷ luật & Tuân thủ]
    end

    %% Style cho các khối chính để dễ nhìn
    style MClass fill:#1b5e20,color:#fff,stroke:#161310,stroke-width:2px
    style Agency fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style BackOffice fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    style Council fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
```

### Hình 4.1: Sơ đồ phân cấp chức năng hệ thống MCONIC Redesign

```mermaid
mindmap
  root((Hệ thống
  MCONIC))
    Frontend Website
      Trang Chủ
        Giới thiệu Dịch vụ
        Case Study & Feedback
        Form Liên hệ
        Yêu cầu Tài liệu
      Trang Bảo hiểm
        Tính phí tự động
        Form Đăng ký
    Backend API
      Xử lý Lead
        Validate Dữ liệu
        Lưu SQLite
      Tích hợp Cloud
        Đồng bộ Google Sheets
        Gửi Email Nodemailer
      Quản trị Admin
        API truy xuất Lead
```

### Hình 4.1b: Sơ đồ phân cấp chức năng Landing Page 2 (Làng Xanh Fest)

```mermaid
mindmap
  root((Landing Page
  Làng Xanh Fest))
    Giao diện Hiển thị
      Hero Banner
        Hiệu ứng Parallax
        Nút Call-to-Action
      Thông tin Sự kiện
        Giới thiệu Lễ hội
        Thông tin Tổ chức
      Hoạt động Nổi bật
        Trạm trải nghiệm
      Bản đồ & Lịch trình
        Sơ đồ khu vực
        Timeline chi tiết
    Tương tác Người dùng
      Đăng ký Tham gia
        Biểu mẫu thông tin
        Kiểm tra hợp lệ (Validate)
        Thông báo kết quả
      Điều hướng
        Mobile Menu Toggle
        Cuộn trang Smooth Scroll
```

### Hình 4.2: Sơ đồ luồng dữ liệu (DFD) mức ngữ cảnh (Context Diagram)

```mermaid
graph LR
    %% Các thực thể bên ngoài (External Entities)
    User[Khách hàng / Người tham gia]
    Admin[Quản trị viên MClass]
    Google[Google Sheets API]
    MailServer[SMTP Email Server]

    %% Hệ thống chính (Process 0)
    Sys((Hệ thống<br>MCONIC Redesign<br>& Làng Xanh Fest))

    %% Luồng dữ liệu (Data Flows)
    User -- "1. Form liên hệ / Đăng ký sự kiện / Yêu cầu tài liệu" --> Sys
    Sys -- "2. Thông báo thành công / Kết quả hạng thẻ" --> User
    
    Sys -- "3. Payload Dữ liệu Leads" --> Google
    Google -- "4. Trạng thái đồng bộ (Success/Fail)" --> Sys

    Sys -- "5. Yêu cầu gửi Email (Nội dung, File PDF đính kèm)" --> MailServer
    MailServer -- "6. Email xác nhận" --> User
    MailServer -- "7. Email thông báo Lead mới" --> Admin
    
    Admin -- "8. Gửi Request API (Kèm Token)" --> Sys
    Sys -- "9. Trả về danh sách Leads (JSON)" --> Admin
```

### Hình 4.3: Sơ đồ luồng dữ liệu (DFD) mức 1

```mermaid
graph TD
    %% Khai báo các thực thể ngoài (vuông)
    User[Khách hàng]
    Admin[Quản trị viên]
    GS[Google Sheets API]
    SMTP[Email Server]

    %% Khai báo Kho dữ liệu (Data Store)
    DB[(D1: Database SQLite - Bảng Leads)]

    %% Khai báo các Tiến trình (Processes - oval)
    P1((1.0<br>Tiếp nhận<br>Yêu cầu Tư vấn))
    P2((2.0<br>Cấp phát<br>Tài liệu PDF))
    P3((3.0<br>Tính toán<br>Phí & Hạng thẻ))
    P4((4.0<br>Ghi nhận<br>Đăng ký Sự kiện))
    P5((5.0<br>Đồng bộ Cloud<br>& Gửi Email))
    P6((6.0<br>Truy xuất<br>Dữ liệu Admin))

    %% Luồng dữ liệu từ User
    User -->|Thông tin liên hệ| P1
    User -->|Email nhận tài liệu| P2
    User -->|Số tuổi tính phí| P3
    User -->|Thông tin gia đình| P4

    %% Luồng ghi Data Store
    P1 -->|Dữ liệu Contact| DB
    P2 -->|Dữ liệu Document| DB
    P3 -->|Dữ liệu Quote| DB
    P4 -->|Dữ liệu Event| DB

    %% Luồng phản hồi trực tiếp
    P3 -.->|Kết quả Hạng thẻ| User

    %% Luồng truyền sang tiến trình xử lý nền (Background Task)
    P1 -->|Kích hoạt đồng bộ| P5
    P2 -->|Kích hoạt đồng bộ| P5
    P3 -->|Kích hoạt đồng bộ| P5
    P4 -->|Kích hoạt đồng bộ| P5

    %% Luồng ra bên ngoài từ tiến trình 5.0
    P5 -->|API Payload| GS
    P5 -->|Lệnh gửi thư| SMTP
    SMTP -.->|Email đính kèm PDF| User
    SMTP -.->|Email báo cáo| Admin

    %% Luồng của Admin
    Admin -->|Token xác thực| P6
    DB -->|Danh sách Leads| P6
    P6 -.->|JSON Response| Admin
```

### Hình 4.4: Sơ đồ quan hệ thực thể (ERD)

```mermaid
erDiagram
    LEADS {
        int id PK "Mã tự tăng"
        string type "Phân loại: contact/document/quote"
        string name "Họ và tên"
        string phone "Số điện thoại"
        string email "Email"
        int age "Tuổi"
        string details "Chi tiết bổ sung"
        datetime created_at "Thời gian tạo"
    }
```

### Hình 4.5 đến Hình 4.8: Ảnh chụp giao diện thực tế
*Lưu ý: Đối với báo cáo Word, bạn cần chạy website lên trình duyệt và dùng công cụ Snipping Tool/Screenshot để chụp lại các giao diện sau:*

- **Hình 4.5: Giao diện Trang chủ (Landing Page 1 - MCONIC Redesign)**: Chụp màn hình trang `index.html` (phần banner Hero và các dịch vụ).
- **Hình 4.6: Giao diện Form liên hệ và Công cụ tính phí bảo hiểm sự kiện**: Chụp màn hình trang `insurance.html` lúc người dùng nhập tuổi và hiện ra kết quả hạng thẻ.
- **Hình 4.7: Giao diện Trang đích chiến dịch vệ tinh (Landing Page 2 - Làng Xanh Fest)**: Chụp màn hình trang sự kiện Làng Xanh (chỗ có đồng hồ đếm ngược).
- **Hình 4.8: Hiển thị kết quả đồng bộ dữ liệu khách hàng (Lead) lên Google Sheets**: Mở file Google Sheets chứa dữ liệu test, chụp màn hình các dòng dữ liệu đã được đẩy lên tự động.
