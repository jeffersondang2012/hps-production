# YÊU CẦU HỆ THỐNG QUẢN LÝ SẢN XUẤT & KINH DOANH HPS

## TỔNG QUAN DỰ ÁN
Tên dự án: Hệ thống Quản lý Sản xuất & Kinh doanh HPS
Mô tả: Quản lý hoạt động sản xuất cát nhân tạo và kinh doanh vật liệu xây dựng

## 1. ĐẶC THÙ HOẠT ĐỘNG
A. Cơ cấu công ty:
- 2 dây chuyền sản xuất:
  + Dây chuyền 1: 50% cổ đông góp vốn
  + Dây chuyền 2: 100% vốn công ty

B. Sản phẩm & Hàng hóa:
- Sản xuất: Cát nghiền (cát nhân tạo)
- Thương mại: Cát xây trát
- Nguyên liệu: Đá cát, dầu

C. Hình thức thanh toán:
- Tiền mặt, chuyển khoản
- Đối trừ hàng hóa (cát nghiền, cát xây trát, dầu)

## 2. YÊU CẦU CHỨC NĂNG
A. Quản lý Dây chuyền:
- Theo dõi riêng từng dây chuyền
- Quản lý nhập xuất
- Tính toán chi phí sản xuất
- Báo cáo doanh thu, lợi nhuận
- Quản lý công nợ

B. Quản lý Hàng hóa:
1. Hàng nhập:
   - Đá cát (nguyên liệu)
   - Dầu
   - Cát xây trát
   - Ghi nhận theo chuyến xe

2. Hàng xuất:
   - Cát nghiền
   - Cát xây trát
   - Ghi nhận theo chuyến xe

C. Quản lý Chi phí:
1. Chi phí Nhân công:
   - Lương cơ bản
   - Phụ cấp
   - Tăng ca
   - Thưởng
   - Theo dõi ngày công

2. Chi phí Điện:
   - Ghi nhận chỉ số theo dây chuyền
   - Tính toán tiền điện
  

3. Chi phí Sửa chữa:
   - Sửa chữa đột xuất
   - Thay thế thiết bị
   - Đính kèm chứng từ

D. Quản lý Công nợ:
- Theo dõi công nợ theo đối tác
- Tính toán giá trị đối trừ
- Theo dõi thanh toán
- Nhắc nợ tự động

## 3. PHÂN QUYỀN NGƯỜI DÙNG
A. Admin/Giám đốc:
- Toàn quyền quản lý
- Thiết lập giá mua/bán
- Phê duyệt chi phí

B. Cổ đông:
- Xem thông tin dây chuyền góp vốn
- Xem báo cáo doanh thu, lợi nhuận
- Xem công nợ và chi phí dây chuyền
- Không thể thay đổi dữ liệu

C. Nhân viên bán hàng:
- Nhập liệu hàng nhập/xuất
- Xem danh sách nhập/xuất
- Không thấy giá mua/bán
- Sửa/xóa dữ liệu đã nhập

## 4. BÁO CÁO YÊU CẦU
A. Báo cáo Sản xuất & Kinh doanh:
- Báo cáo doanh thu theo dây chuyền
- Báo cáo doanh thu hợp nhất
- Báo cáo lợi nhuận
- Báo cáo lợi nhuận hợp nhất
- Báo cáo công nợ
- Báo cáo tồn kho
- Báo cáo nhập xuất

B. Báo cáo Chi phí:
- Chi phí sản xuất/đơn vị
- Chi phí nhân công
- Chi phí điện
- Chi phí sửa chữa
- So sánh chi phí giữa các kỳ

C. Báo cáo Công nợ:
- Công nợ theo đối tác
- Công nợ theo dây chuyền
- Công nợ theo đơn vị
- Lịch sử thanh toán theo đối tác

## 5. THÔNG BÁO
A. Thông báo Giao dịch:
- Thông báo nhập/xuất hàng
- Thông báo thanh toán
- Thông báo công nợ

C. Kênh thông báo:
- Zalo
- Telegram

## YÊU CẦU KỸ THUẬT
1. Sử dụng Firebase:
   - Authentication
   - Firestore Database
   - Cloud Functions
   - Storage

2. Giao diện:
   - Responsive design
   - Dễ sử dụng trên mobile
   - Tối ưu cho nhập liệu nhanh

3. Hiệu năng:
   - Load nhanh
   - Realtime update
   - Offline capability

4. Bảo mật:
   - Phân quyền chặt chẽ
   - Audit log
   - Backup dữ liệu


---
Ghi chú:
- Tài liệu này được tạo ngày: 2024-03-19
- Version: 1.0
- Contact: [Thông tin liên hệ] 