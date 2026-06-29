CHƯƠNG 4: KẾT QUẢ THỰC TẬP

Trong khuôn khổ đợt thực tập, sinh viên xây dựng hai sản phẩm Landing Page riêng biệt phục vụ các mục tiêu chuyển đổi khác nhau của đơn vị. Báo cáo chương này tập trung vào Landing Page 1 — sản phẩm đã hoàn thiện và đưa vào vận hành trong giai đoạn thực tập.

Landing Page 1 (MCONIC Redesign — Trang đích tổ chức sự kiện và bảo hiểm B2B): Giao diện Front-end thu thập thông tin khách hàng doanh nghiệp có nhu cầu tổ chức sự kiện và đăng ký bảo hiểm sự kiện. Chức năng bao gồm: biểu mẫu tư vấn sự kiện thu thập họ tên, số điện thoại và email; hệ thống modal yêu cầu và nhận tài liệu chuyên môn (Company Profile, Event Checklist, Báo cáo Ngành) qua email đính kèm; tích hợp bộ thuật toán JavaScript tự động phân loại hạng thẻ bảo hiểm sự kiện (Bạc, Titan, Vàng, Bạch Kim, Kim Cương) dựa trên tuổi đầu vào; và toàn bộ dữ liệu đầu vào được xử lý tự động qua backend Node.js — lưu vào cơ sở dữ liệu SQLite, đồng bộ Google Sheets và kích hoạt gửi email xác nhận không cần thao tác thủ công.

4.1 Đặc tả yêu cầu bài toán

4.1.1 Nhiệm vụ của hệ thống

Trong quá trình thực tập tại Bộ phận Phát triển năng lực đại lý — Văn phòng MClass Sài Gòn, Manulife Việt Nam, sinh viên được giao nhiệm vụ thiết kế và xây dựng Landing Page 1 mang tên MCONIC Redesign. Đây là một hybrid landing page phục vụ hoạt động tư vấn sự kiện và bảo hiểm sự kiện B2B, với các nhiệm vụ trọng tâm như sau:

Một là, trình bày đầy đủ thông tin thương hiệu, danh mục dịch vụ và năng lực của đơn vị thông qua giao diện web hiện đại, nhằm hỗ trợ đội ngũ tư vấn viên tiếp cận và thuyết phục khách hàng doanh nghiệp (B2B).

Hai là, thu thập thông tin khách hàng tiềm năng (lead) thông qua ba luồng chuyển đổi riêng biệt: yêu cầu tư vấn trực tiếp, yêu cầu nhận tài liệu chuyên môn qua email, và tra cứu/đăng ký gói bảo hiểm sự kiện dựa trên tuổi.

Ba là, tự động hóa quy trình xử lý dữ liệu đầu vào: lưu trữ vào cơ sở dữ liệu nội bộ, đồng bộ lên Google Sheets và gửi email thông báo về cho quản lý cũng như email xác nhận tới khách hàng — tất cả không cần thao tác thủ công.

4.1.2 Chức năng của hệ thống

Hệ thống bao gồm hai nhóm chức năng chính:

Nhóm chức năng giao diện người dùng (Frontend):
- Điều hướng (Navigation): menu desktop chuẩn và mobile drawer slide-in có hỗ trợ thao tác cảm ứng, phím Escape và điều hướng đa trang.
- Hiển thị nội dung: section Hero, About, Dịch vụ (6 nhóm), Case Study, Testimonials, Advantages, FAQ dạng accordion.
- Thu thập dữ liệu: form liên hệ tư vấn với validation hai lớp (client + server); popup modal yêu cầu tài liệu PDF.
- Công cụ tính phí bảo hiểm: tra cứu hạng thẻ theo độ tuổi, highlight gói phù hợp, đăng ký báo giá.
- Hiệu ứng cuộn trang (Scroll Reveal) dùng IntersectionObserver API; marquee banner giới thiệu loại hình sự kiện.

Nhóm chức năng xử lý phía máy chủ (Backend):
- REST API (Node.js/Express): 4 endpoint bao gồm POST /api/leads/contact, POST /api/leads/document, POST /api/leads/quote và GET /api/admin/leads.
- Lưu trữ dữ liệu: cơ sở dữ liệu SQLite với bảng leads và 3 index tối ưu truy vấn.
- Gửi email tự động: Nodemailer qua Gmail SMTP, hỗ trợ gửi email kèm tệp đính kèm PDF.
- Đồng bộ Google Sheets: tích hợp Google Sheets API v4 với xác thực Service Account.
- Bảo mật: rate limiting 5 request/phút/IP, validation server-side, logging bằng Winston và Morgan.

4.1.3 Phạm vi của hệ thống

Hệ thống MCONIC Redesign nằm trong phạm vi xây dựng một hybrid landing page gồm 2 trang web (index.html và insurance.html) cùng với một backend Node.js chạy độc lập. Hệ thống không bao gồm: hệ thống CRM đầy đủ, cổng thanh toán trực tuyến thực, hệ thống xác thực người dùng đa tầng, hay các tính năng quản lý hợp đồng bảo hiểm chuyên sâu.

---

4.2 Phân tích hệ thống

4.2.1 Sơ đồ phân cấp chức năng

Hệ thống MCONIC được phân chia thành 4 nhóm chức năng cấp cao:

(1) Hiển thị thông tin: Hero Banner → About/Thống kê → Danh sách dịch vụ (6 nhóm) → Case Study (3 dự án) → Testimonials → Advantages → FAQ.

(2) Thu thập Lead:
  - Luồng 1 — Tư vấn: Form liên hệ → Validate client → POST /api/leads/contact → SQLite + Sheets + Email.
  - Luồng 2 — Tài liệu: Chọn tài liệu → Modal popup → POST /api/leads/document → SQLite + Sheets + Gửi PDF qua email.
  - Luồng 3 — Bảo hiểm: Nhập tuổi → Tính hạng thẻ (JS local) → POST /api/leads/quote → SQLite + Sheets + Email admin.

(3) Quản trị: GET /api/admin/leads (xác thực token) → Trả về danh sách lead JSON.

(4) Hạ tầng & Hỗ trợ: Rate Limiting → Logging → Compression → CORS → Static File Serving.

4.2.2 Sơ đồ luồng dữ liệu (DFD)

Mức 0 (Context Diagram):
Khách hàng (trình duyệt) tương tác với hệ thống MCONIC Website System. Hệ thống xử lý và xuất dữ liệu ra ba đầu ra ngoài: Admin (nhận email thông báo lead mới), Khách hàng (nhận email xác nhận hoặc tài liệu PDF đính kèm), và Google Sheets (lưu trữ dữ liệu lead trên cloud).

Mức 1 (Level 1 DFD):
- Tiến trình P1 — Xử lý form liên hệ: nhận thông tin họ tên, số điện thoại, email từ khách hàng; thực hiện validate; ghi vào kho dữ liệu D1 (SQLite leads) và D2 (Google Sheets); kích hoạt gửi email thông báo tới admin và email xác nhận tới khách hàng.
- Tiến trình P2 — Xử lý yêu cầu tài liệu: nhận tên, email và ID tài liệu; kiểm tra sự tồn tại của file PDF trên máy chủ; ghi vào D1 và D2; gửi file PDF đính kèm qua email.
- Tiến trình P3 — Tính phí và quản lý báo giá bảo hiểm: nhận họ tên, số điện thoại, tuổi; thực hiện tính toán hạng thẻ ngay phía client (không cần server); ghi kết quả vào D1 và D2; gửi email thông báo tới admin.

4.2.3 Sơ đồ liên kết dữ liệu

Do quy mô dự án tập trung vào mục tiêu thu thập lead, hệ thống sử dụng một bảng dữ liệu duy nhất là leads trong SQLite. Bảng này liên kết logic với ba loại thực thể khác nhau thông qua cột phân loại type:
- Khi type = 'contact': bản ghi liên quan đến khách hàng yêu cầu tư vấn, sử dụng các cột name, phone, email.
- Khi type = 'document': bản ghi liên quan đến khách hàng yêu cầu tài liệu, sử dụng các cột name, email, details (lưu ID tài liệu).
- Khi type = 'quote': bản ghi liên quan đến khách hàng tra cứu bảo hiểm, sử dụng các cột name, phone, age, details (lưu hạng thẻ đề xuất).

Ngoài ra, dữ liệu lead được đồng bộ (mirror) sang Google Sheets như một kho dữ liệu phụ trên cloud, phục vụ mục đích báo cáo và theo dõi nhanh của bộ phận quản lý.

4.2.4 Sơ đồ quan hệ dữ liệu

Hệ thống có các quan hệ phụ thuộc giữa các thành phần kỹ thuật như sau:
- index.html và insurance.html là hai trang frontend độc lập, cùng sử dụng chung hệ thống CSS (base.css, layout.css, components.css) và gọi đến backend qua các API endpoint.
- js/script.js điều khiển toàn bộ logic tương tác của trang chủ (menu, accordion, modal, form liên hệ, form tài liệu).
- js/insurance.js điều khiển logic trang bảo hiểm (menu, công cụ tính phí, form báo giá, highlight hạng thẻ).
- api/server.js là trung tâm xử lý: nhận request từ frontend, truy cập SQLite (leads.db), gọi Google Sheets API, và kích hoạt Nodemailer gửi email.
- Biến môi trường trong tệp .env kiểm soát toàn bộ thông tin nhạy cảm: SMTP, Google Sheets ID, Admin Token.

---

4.3 Xây dựng chương trình

a. Các chức năng dự kiến xây dựng

Dự án dự kiến xây dựng 12 chức năng chính gồm: (1) Trang chủ landing page giới thiệu dịch vụ; (2) Form liên hệ tư vấn có validation và gửi email; (3) Modal yêu cầu và nhận tài liệu PDF qua email; (4) Trang bảo hiểm và công cụ tính phí; (5) Lưu lead vào SQLite; (6) Đồng bộ lead lên Google Sheets; (7) Gửi email thông báo admin và xác nhận người dùng; (8) Rate limiting chống spam; (9) Admin API xem danh sách lead; (10) Responsive design trên mọi thiết bị; (11) Scroll reveal animation khi cuộn trang; (12) Mobile navigation drawer.

b. Các chức năng đã xây dựng được

Chức năng 1 — Trang chủ Landing Page (index.html):
Website trang chủ được xây dựng hoàn chỉnh với phong cách thiết kế Pop-art Bold, sử dụng font Archivo và Public Sans từ Google Fonts, bảng màu đen nền cream (#FBF6EE) với điểm nhấn đỏ (#D32F2F). Bố cục gồm các section: Hero với hình ảnh sự kiện và hai nút CTA; Marquee chạy tên loại hình sự kiện; About với 4 chỉ số thống kê; 6 thẻ dịch vụ dạng grid; 3 Case Study với badge kết quả ROI; 3 testimonial từ khách hàng; 3 ưu điểm cạnh tranh; FAQ 5 câu dạng accordion; section tài liệu; form liên hệ; và footer đầy đủ thông tin pháp lý, cổng thanh toán, mạng xã hội.

Chức năng 2 — Form Liên hệ Tư vấn:
Khi người dùng điền đầy đủ họ tên, số điện thoại (10 chữ số, bắt đầu bằng 0) và email hợp lệ, hệ thống thực hiện tuần tự: validate client-side bằng JavaScript regex → gửi POST request lên /api/leads/contact → server validate lại → ghi vào SQLite → đồng bộ Google Sheets → gửi email HTML template thông báo cho admin (tiêu đề "[LEAD MỚI]") → gửi email xác nhận cho người dùng với cam kết phản hồi trong 24 giờ làm việc. Frontend thay thế form bằng màn hình thành công có hiệu ứng icon checkmark animation.

Chức năng 3 — Modal Yêu cầu Tài liệu PDF:
Hệ thống cung cấp 3 tài liệu: Company Profile 2026, Event Master Checklist và Báo cáo Ngành 2026. Khi người dùng nhấn nút "Yêu cầu qua email", popup modal xuất hiện (có hỗ trợ phím Escape và click overlay để đóng). Sau khi điền tên và email, hệ thống gọi API, server kiểm tra file PDF tồn tại trên ổ đĩa, ghi lead vào SQLite và Sheets, rồi gửi email kèm tệp PDF đính kèm. Modal chuyển sang màn hình thành công với animation.

Chức năng 4 — Trang Bảo hiểm và Công cụ Tính Phí (insurance.html):
Công cụ tính phí bảo hiểm phân loại hạng thẻ dựa vào tuổi đầu vào theo bảng: dưới 18 tuổi chưa đủ điều kiện; 18–30 tuổi là Thẻ Bạc (500.000đ/năm); 31–40 là Thẻ Titan (800.000đ/năm); 41–50 là Thẻ Vàng (1.200.000đ/năm); 51–60 là Thẻ Bạch Kim (1.800.000đ/năm); 61–75 là Thẻ Kim Cương (3.000.000đ/năm); trên 75 tuổi không đủ điều kiện. Sau khi tính toán, giao diện tự động highlight hạng thẻ phù hợp, ẩn các hạng không phù hợp, và xuất hiện nút "Xem thêm các gói khác". Dữ liệu lead được gửi ngầm về backend không chặn giao diện.

Chức năng 5 — SQLite Database:
Cơ sở dữ liệu SQLite được khởi tạo tự động khi server khởi động. Bảng leads gồm các cột: id (INTEGER PRIMARY KEY AUTOINCREMENT), type (TEXT NOT NULL), name (TEXT NOT NULL), phone (TEXT), email (TEXT), age (INTEGER), details (TEXT), created_at (DATETIME DEFAULT CURRENT_TIMESTAMP). Ba index được tạo trên các cột email, created_at và type để tối ưu tốc độ truy vấn.

Chức năng 6 — Google Sheets Integration:
Sử dụng thư viện googleapis với xác thực Service Account JSON. Hệ thống tự động phát hiện tên tab (hỗ trợ tên tiếng Việt như "Trang tính 1"), tự động tạo hàng tiêu đề nếu sheet còn trống, và ghi mỗi lead thành một hàng mới với 7 cột: Thời gian, Phân loại, Họ và tên, Số điện thoại, Email, Tuổi, Chi tiết khác.

Chức năng 7 — Email Service (Nodemailer):
Hệ thống gửi 4 loại email: email thông báo admin khi có lead tư vấn mới, email xác nhận cho người dùng sau khi đăng ký tư vấn (HTML template với thông tin chi tiết và cam kết 24 giờ), email gửi file PDF đính kèm cho người dùng yêu cầu tài liệu, và email thông báo admin khi có lead tra cứu bảo hiểm.

Chức năng 8 đến 12 — Rate Limiting, Admin API, Responsive Design, Animations, Mobile Menu:
Rate limiting giới hạn 5 request/phút/IP cho tất cả route /api/*. Admin API tại GET /api/admin/leads?token=xxx trả về danh sách lead dạng JSON sau khi xác thực token. Giao diện responsive hỗ trợ từ màn hình di động đến desktop với breakpoint tại 768px và 1024px. Scroll reveal dùng IntersectionObserver API với graceful fallback cho prefers-reduced-motion. Mobile menu là slide-in drawer với overlay và xử lý điều hướng đa trang đúng cách.

c. Các chức năng dự kiến nhưng chưa xây dựng được

Trong quá trình thực tập, một số chức năng dự kiến chưa được hoàn thiện do giới hạn về thời gian và phạm vi của đợt thực tập:

Thứ nhất, các trang chi tiết riêng lẻ cho từng dịch vụ chưa được xây dựng. Hiện tại 6 thẻ dịch vụ trên trang chủ đều dẫn đến form liên hệ thay vì trang mô tả chi tiết.

Thứ hai, giao diện dashboard quản trị trực quan cho admin chưa có. Endpoint GET /api/admin/leads chỉ trả về dữ liệu JSON thô, chưa có giao diện bảng biểu hay biểu đồ thống kê.

Thứ ba, các trang chính sách pháp lý (chính sách bảo mật, điều khoản dịch vụ) chưa được tạo nội dung; các liên kết tương ứng trong footer hiện dẫn đến dấu thăng (#).

Thứ tư, tích hợp cổng thanh toán thực (VNPAY, MoMo) chưa được thực hiện; footer chỉ hiển thị logo các cổng thanh toán mang tính minh họa.

Thứ năm, hệ thống theo dõi hành vi người dùng (Google Analytics 4 hoặc Facebook Pixel) và tối ưu SEO kỹ thuật (sitemap.xml, robots.txt, structured data JSON-LD) chưa được tích hợp.

d. Các sản phẩm khác

Ngoài mã nguồn chính, quá trình thực tập còn tạo ra các sản phẩm phụ trợ gồm: tệp .env.example làm mẫu cấu hình môi trường cho thành viên mới tiếp nhận dự án; tệp vercel.json cấu hình triển khai serverless lên nền tảng Vercel; tệp leads.db là cơ sở dữ liệu SQLite chứa dữ liệu lead thực tế thu thập được trong quá trình thử nghiệm; thư mục assets/documents/ là nơi lưu trữ các file PDF để gửi qua email; và thư mục logs/ lưu file log lỗi được Winston ghi lại trong môi trường local.

---

4.4 Tạo lập bảng CSDL

Hệ thống MCONIC Redesign sử dụng SQLite làm cơ sở dữ liệu quan hệ nhúng (embedded relational database), với một bảng duy nhất là leads. Cấu trúc bảng như sau:

Bảng leads:
- Cột id: kiểu INTEGER, ràng buộc PRIMARY KEY AUTOINCREMENT, là khóa chính tự tăng.
- Cột type: kiểu TEXT, ràng buộc NOT NULL, nhận một trong ba giá trị 'contact', 'document' hoặc 'quote' để phân loại lead.
- Cột name: kiểu TEXT, ràng buộc NOT NULL, lưu họ và tên khách hàng.
- Cột phone: kiểu TEXT, cho phép NULL, lưu số điện thoại 10 chữ số bắt đầu bằng 0.
- Cột email: kiểu TEXT, cho phép NULL, lưu địa chỉ email khách hàng.
- Cột age: kiểu INTEGER, cho phép NULL, chỉ được dùng cho lead loại 'quote'.
- Cột details: kiểu TEXT, cho phép NULL, lưu thông tin bổ sung như ID tài liệu hoặc tên hạng thẻ bảo hiểm được đề xuất.
- Cột created_at: kiểu DATETIME, giá trị mặc định CURRENT_TIMESTAMP, tự động ghi nhận thời điểm tạo bản ghi.

Ba chỉ mục (index) được thiết lập để tối ưu hiệu năng truy vấn: idx_leads_email trên cột email phục vụ tìm kiếm theo email; idx_leads_created_at trên cột created_at phục vụ sắp xếp theo thời gian; idx_leads_type trên cột type phục vụ lọc theo loại lead.

Ngoài SQLite, hệ thống còn sử dụng Google Sheets như một kho dữ liệu phụ trên cloud. Mỗi bản ghi lead được ghi thành một hàng trong sheet với 7 cột: Thời gian, Phân loại, Họ và tên, Số điện thoại, Email, Tuổi, Chi tiết khác. Cấu hình kết nối Google Sheets bao gồm các biến môi trường GOOGLE_SHEET_ID và GOOGLE_SHEET_TAB_NAME, cùng file xác thực Service Account google-credentials.json.

Các biến môi trường cấu hình hệ thống được quản lý qua tệp .env gồm: PORT (cổng server, mặc định 3000), SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS (thông tin xác thực Gmail SMTP), ADMIN_EMAIL (email nhận thông báo lead), SENDER_NAME (tên hiển thị khi gửi email), GOOGLE_SHEET_ID, GOOGLE_SHEET_TAB_NAME, ADMIN_TOKEN (token bảo vệ endpoint admin), và DATABASE_PATH (đường dẫn file SQLite).

---

4.5 Nhận xét, đánh giá: so sánh giữa lý thuyết và thực tiễn

Trong quá trình xây dựng hệ thống, sinh viên nhận thấy có sự tương đồng đáng kể giữa kiến thức lý thuyết được học và yêu cầu thực tế tại đơn vị, đồng thời cũng phát hiện nhiều khoảng cách quan trọng cần bổ sung.

Về những điểm phù hợp với lý thuyết: Kiến trúc Client-Server được áp dụng đúng nguyên tắc, frontend HTML/JS và backend Node.js tách biệt hoàn toàn và giao tiếp qua REST API. Thiết kế API tuân thủ ngữ nghĩa HTTP chuẩn với POST để tạo tài nguyên và GET để đọc, response trả về đồng nhất theo cấu trúc { success, message, data }. Validation được thực hiện hai lớp như lý thuyết yêu cầu: validate phía client bằng JavaScript regex trước khi gửi lên server, và server validate lại một lần nữa trước khi ghi vào cơ sở dữ liệu. Việc đánh index cơ sở dữ liệu trên các cột hay được truy vấn cũng được áp dụng đúng như giảng dạy. Separation of Concerns thể hiện rõ qua việc CSS được phân tách thành các file chức năng riêng biệt (base, layout, components, style, insurance).

Về những khoảng cách so với lý thuyết: Thiết kế cơ sở dữ liệu trong thực tế đôi khi phải ưu tiên tốc độ triển khai hơn tính chuẩn mực. Thay vì tạo ba bảng riêng biệt (contacts, document_requests, insurance_quotes) như lý thuyết đề xuất, dự án dùng một bảng leads duy nhất với cột type phân biệt — quyết định này phù hợp cho MVP nhưng sẽ gây khó khăn khi mở rộng. Bảo mật API cũng là một khoảng cách: token admin được truyền qua query parameter (?token=xxx) thay vì HTTP Authorization header như chuẩn Bearer token — cách hiện tại tiện dụng nhưng có rủi ro token bị lộ qua browser history. Ngoài ra, dự án hoàn toàn không có automated test, trong khi lý thuyết luôn nhấn mạnh tầm quan trọng của unit test và integration test trước khi triển khai. Cuối cùng, hệ thống logging chỉ ghi error log (Winston) và request log (Morgan) mà thiếu info/debug log hỗ trợ chẩn đoán vấn đề trong môi trường production.

---

4.6 Đề xuất các giải pháp cải thiện tình hình thực tế

Dựa trên những khoảng cách và hạn chế phát hiện trong quá trình thực tập, sinh viên đề xuất các giải pháp cải thiện theo ba nhóm ưu tiên:

Nhóm giải pháp ngắn hạn có thể thực hiện ngay:
Thứ nhất, xây dựng các trang chi tiết cho từng dịch vụ (MICE, Gala, Booth...) với nội dung đầy đủ, ảnh thực tế và nút CTA rõ ràng để cải thiện trải nghiệm người dùng và SEO. Thứ hai, bổ sung tệp sitemap.xml và robots.txt cùng với các thẻ meta Open Graph để tối ưu khả năng hiện thị trên công cụ tìm kiếm và mạng xã hội. Thứ ba, hoàn thiện nội dung các trang chính sách bảo mật và điều khoản dịch vụ vì đây là yêu cầu pháp lý cơ bản của bất kỳ website thương mại nào. Thứ tư, chuyển cơ chế xác thực admin sang HTTP Authorization header với Bearer token thay vì query parameter để tăng cường bảo mật.

Nhóm giải pháp trung hạn cần lập kế hoạch:
Thứ nhất, tách bảng cơ sở dữ liệu thành ba bảng riêng (contacts, document_requests, insurance_quotes) để dữ liệu có cấu trúc rõ ràng hơn, dễ báo cáo và mở rộng tính năng. Thứ hai, xây dựng dashboard quản trị nội bộ với biểu đồ thống kê lead theo ngày/tuần/tháng, bộ lọc theo loại, và chức năng xuất CSV — thay thế endpoint JSON thô hiện tại. Thứ ba, viết bộ automated test (unit test với Jest và integration test với Supertest) để đảm bảo chất lượng khi có thay đổi code trong tương lai. Thứ tư, bổ sung input sanitization ở cả frontend (DOMPurify) và backend (sanitize-html) để ngăn chặn tấn công XSS qua dữ liệu người dùng nhập vào.

Nhóm giải pháp dài hạn mang tính chiến lược:
Thứ nhất, tích hợp hệ thống CRM (HubSpot hoặc Salesforce) để quản lý pipeline bán hàng chuyên nghiệp hơn, thay thế Google Sheets thủ công. Thứ hai, xây dựng hệ thống đặt lịch tư vấn trực tuyến (tích hợp Calendly hoặc xây dựng riêng) để tự động hóa quy trình từ khi khách hàng quan tâm đến khi gặp chuyên viên. Thứ ba, nâng cấp frontend lên framework Next.js để hỗ trợ Server-Side Rendering (SSR) và Incremental Static Regeneration (ISR), giúp cải thiện đáng kể hiệu suất SEO và tốc độ tải trang.

---

4.7 Những khó khăn trong quá trình thực tập

Trong suốt quá trình thực tập và xây dựng hệ thống, sinh viên gặp phải một số khó khăn đáng kể.

Khó khăn đầu tiên là về môi trường phát triển và tích hợp bên ngoài. Việc cấu hình Google Sheets API với Service Account mất nhiều thời gian hơn dự kiến do phải xử lý các trường hợp đặc biệt như tên tab tiếng Việt (ví dụ "Trang tính 1" thay vì "Sheet1") và vấn đề định dạng private key khi đưa lên biến môi trường Vercel.

Khó khăn thứ hai là sự khác biệt giữa môi trường phát triển cục bộ và môi trường serverless. Trên Vercel, hệ thống tệp là read-only, nên các chức năng như ghi log ra file và lưu file PDF tạm thời cần xử lý khác biệt so với chạy trên máy local, đòi hỏi phải viết code có điều kiện (graceful fallback) cho cả hai môi trường.

Khó khăn thứ ba là về thiết kế giao diện người dùng đạt chuẩn thẩm mỹ chuyên nghiệp. Việc xây dựng một hybrid landing page vừa có nội dung thuyết phục vừa có giao diện hiện đại (pop-art bold, responsive, animated) chỉ bằng HTML/CSS/JS thuần không dùng framework đòi hỏi nhiều công sức tối ưu hóa và kiểm thử trên nhiều thiết bị.

Khó khăn thứ tư là giới hạn thời gian khiến một số chức năng như automated test, dashboard admin và trang chi tiết dịch vụ chưa kịp hoàn thiện trong khuôn khổ đợt thực tập.
