*******************************
*        KANBAN MANAGER       *
*******************************

Ứng dụng quản lý công việc theo phương pháp Kanban  
Xây dựng bằng React, Tailwind CSS và DND Kit  

*******************************
*        BẮT ĐẦU SỬ DỤNG       *
*******************************

* Yêu cầu hệ thống:
  - Node.js >= 14
  - npm
* Cài đặt và run:
  1. Di chuyển vào thư mục: cd kanban-manager
  2. Cài đặt: npm install 
  3. Chạy: npm start 

*******************************
*   TÍNH NĂNG & HƯỚNG DẪN     *
*******************************

* 1. Quản lý Bảng làm việc (Board)

  - Tạo Bảng mới:
    + Nhấn "Thêm bảng mới" ở thanh bên
    + Nhập tên bảng (VD: Dự án thiết kế website)
    + Nhấn "Tạo"
    + Ghi chú: Tự động có 3 cột: To Do, Progress, Done

  - Quản lý Bảng:
    + Đổi tên: Menu (⋮) → Chọn "Đổi tên"
    + Xóa bảng: Menu (⋮) → Chọn "Xóa" → Gõ "delete" để xác nhận
    + Chuyển đổi bảng: Nhấn vào tên bảng ở thanh bên

* 2. Quản lý Thành viên

  - Thêm thành viên:
    + Nhấn nút Teams (👥)
    + Nhấn "Thêm người"
    + Nhập email thành viên (VD: nguyen@company.com)
    + Nhấn "Thêm"

  - Xem danh sách thành viên:
    + Nhấn nút Teams (👥)
    + Chọn "Xem thành viên"
    + Dùng thanh tìm kiếm để lọc

* 3. Quản lý Cột công việc

  - Thêm cột mới:
    + Nhấn "+" ở cuối danh sách cột
    + Nhập tên cột
    + Nhấn ✓ để xác nhận

  - Chỉnh sửa cột:
    + Đổi tên: Click vào tên cột → sửa → ✓
    + Xóa: Menu (⋮) → Xóa → Phải chọn cột đích
    + Không thể xóa cột cuối cùng

  - Sắp xếp cột:
    + Kéo thả để sắp xếp
    + Cột cuối bên phải = trạng thái Hoàn thành

* 4. Quản lý Công việc

  - Tạo công việc mới:
    + Nhấn "+ Tạo công việc"
    + Nhập:
      • Tiêu đề (bắt buộc)
      • Mô tả
      • Hạn chót
      • Độ ưu tiên (Gấp/Cao/Trung bình/Thấp)
      • Gán người
      • Thêm công việc con (nếu cần)

  - Quản lý công việc:
    + Sửa: Menu (⋮) → Sửa
    + Xóa: Menu (⋮) → Xóa → Gõ "delete" để xác nhận

  - Di chuyển công việc:
    + Kéo thả giữa các cột
    + Vào cột "Done" sẽ tự đánh dấu hoàn thành

  - Theo dõi tiến độ:
    + Xem thanh tiến độ công việc con
    + Click công việc để cập nhật

* 5. Tính năng khác

  - Chế độ tối: Gạt công tắc trên header
  - Giao diện responsive:
    + Thanh bên thu gọn trên thiết bị di động
    + Cuộn ngang cột trên màn hình nhỏ

*******************************
*     QUY TRÌNH ĐỀ XUẤT       *
*******************************

1. Tạo bảng mới cho dự án  
2. Thêm thành viên vào bảng  
3. Tùy chỉnh cột theo quy trình làm việc  
4. Tạo và phân công công việc  
5. Kéo thả công việc khi tiến độ thay đổi  
