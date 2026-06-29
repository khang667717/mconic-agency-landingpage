# LỜI CẢM ƠN

Để hoàn thành đợt thực tập và cuốn báo cáo này, em xin gửi lời cảm ơn chân thành và sâu sắc nhất đến:

Ban Giám hiệu Trường Đại học Văn Lang và quý Thầy Cô Khoa Công nghệ Thông tin đã tận tình giảng dạy, truyền đạt những kiến thức quý báu cho em trong suốt thời gian học tập tại trường. Những nền tảng kiến thức này chính là hành trang vững chắc giúp em có thể áp dụng vào thực tế công việc.

Đặc biệt, em xin gửi lời cảm ơn sâu sắc đến Thầy/Cô [Tên Giảng viên hướng dẫn] đã dành nhiều thời gian, công sức để tận tình hướng dẫn, góp ý và định hướng cho em trong suốt quá trình thực hiện Đồ án thực tập này.

Em cũng xin trân trọng cảm ơn Ban Lãnh đạo và các anh chị đồng nghiệp tại Manulife Việt Nam – Văn phòng MClass Sài Gòn, đặc biệt là Bộ phận Phát triển năng lực đại lý, đã tạo điều kiện thuận lợi, hỗ trợ nhiệt tình và chia sẻ nhiều kinh nghiệm thực tiễn quý báu. Môi trường làm việc chuyên nghiệp tại công ty đã giúp em rèn luyện kỹ năng, thái độ làm việc và hoàn thành tốt nhiệm vụ được giao.

Dù đã nỗ lực hết sức, nhưng do giới hạn về thời gian và kinh nghiệm thực tiễn, báo cáo chắc chắn không tránh khỏi những thiếu sót. Em rất mong nhận được sự góp ý, chỉ bảo thêm của quý Thầy Cô và các anh chị tại đơn vị để em có thể hoàn thiện hơn nữa.

Em xin chân thành cảm ơn!

Tp. Hồ Chí Minh, ngày ... tháng ... năm 2026
Sinh viên thực hiện
(Ký và ghi rõ họ tên)


---

# MỤC LỤC

LỜI CẢM ƠN
MỤC LỤC
DANH SÁCH CÁC BẢNG BIỂU
DANH SÁCH CÁC HÌNH VẼ, BIỂU ĐỒ
DANH MỤC CÁC TỪ VIẾT TẮT

CHƯƠNG 1: MỞ ĐẦU
1.1 Lý do chọn chủ đề nghiên cứu
1.2 Đối tượng, phạm vi nghiên cứu
1.3 Phương pháp nghiên cứu
1.4 Kết cấu của báo cáo thực tập

CHƯƠNG 2: TÌM HIỂU TỔNG QUÁT VỀ ĐƠN VỊ
2.1 Lịch sử hình thành và phát triển
2.2 Chức năng và nhiệm vụ
2.3 Cơ cấu tổ chức văn phòng thực tập

CHƯƠNG 3: THỰC TRẠNG CHỦ ĐỀ NGHIÊN CỨU
3.1 Khái quát một số nội dung lý thuyết căn bản về chủ đề nghiên cứu
3.2 Trình bày và phân tích các dữ liệu, quy trình mà sinh viên thu thập được

CHƯƠNG 4: KẾT QUẢ THỰC TẬP
4.1 Đặc tả yêu cầu bài toán
4.2 Phân tích hệ thống
4.3 Xây dựng chương trình
4.4 Tạo lập bảng CSDL (nếu có)
4.5 Nhận xét, đánh giá: so sánh giữa lý thuyết và thực tiễn
4.6 Đề xuất các giải pháp cải thiện tình hình thực tế
4.7 Những khó khăn trong quá trình thực tập

CHƯƠNG 5: KẾT LUẬN VÀ ĐỀ XUẤT
5.1 Tóm tắt kết quả của quá trình thực tập
5.2 Các kiến nghị rút ra từ kết quả của đợt thực tập

KẾ HOẠCH THỰC TẬP


---

# DANH SÁCH CÁC BẢNG BIỂU

Bảng 4.1: Bảng mô tả chi tiết các luồng chức năng của hệ thống
Bảng 4.2: Cấu trúc từ điển dữ liệu bảng Leads (SQLite)
Bảng 4.3: So sánh đánh giá giữa lý thuyết và thực tiễn áp dụng


---

# DANH SÁCH CÁC HÌNH VẼ, BIỂU ĐỒ

Hình 2.1: Sơ đồ cơ cấu tổ chức Văn phòng MClass Sài Gòn
Hình 4.1: Sơ đồ phân cấp chức năng hệ thống MCONIC Redesign
Hình 4.2: Sơ đồ luồng dữ liệu (DFD) mức ngữ cảnh (Context Diagram)
Hình 4.3: Sơ đồ luồng dữ liệu (DFD) mức 1
Hình 4.4: Sơ đồ quan hệ thực thể (ERD)
Hình 4.5: Giao diện Trang chủ (Landing Page 1 - MCONIC Redesign)
Hình 4.6: Giao diện Form liên hệ và Công cụ tính phí bảo hiểm sự kiện
Hình 4.7: Giao diện Trang đích chiến dịch vệ tinh (Landing Page 2 - Làng Xanh Fest)
Hình 4.8: Hiển thị kết quả đồng bộ dữ liệu khách hàng (Lead) lên Google Sheets


---

# CHÚ THÍCH CÁC TỪ VIẾT TẮT VÀ THUẬT NGỮ

| Từ viết tắt | Thuật ngữ đầy đủ (Tiếng Anh) | Giải nghĩa tiếng Việt |
|---|---|---|
| **API** | Application Programming Interface | Giao diện lập trình ứng dụng |
| **B2B** | Business to Business | Mô hình giao dịch thương mại giữa các doanh nghiệp |
| **B2C** | Business to Consumer | Mô hình giao dịch thương mại giữa doanh nghiệp và người tiêu dùng |
| **CRM** | Customer Relationship Management | Quản trị quan hệ khách hàng |
| **CSS** | Cascading Style Sheets | Ngôn ngữ định dạng giao diện trang web |
| **DFD** | Data Flow Diagram | Sơ đồ luồng dữ liệu |
| **HTML** | HyperText Markup Language | Ngôn ngữ đánh dấu siêu văn bản |
| **JS** | JavaScript | Ngôn ngữ lập trình xử lý logic trên trình duyệt |
| **SEO** | Search Engine Optimization | Tối ưu hóa công cụ tìm kiếm |
| **UI/UX** | User Interface / User Experience | Giao diện người dùng / Trải nghiệm người dùng |
| **XSS** | Cross-Site Scripting | Lỗ hổng bảo mật tiêm nhiễm mã độc trên web |
