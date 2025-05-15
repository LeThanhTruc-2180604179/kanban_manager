export const initialBoards = [
  {
    id: 'main',
    name: 'Bảng Chính',
    columns: [
      { id: 'todo', name: 'Cần Làm' },
      { id: 'doing', name: 'Đang Thực Hiện' },
      { id: 'done', name: 'Hoàn Thành' }
    ]
  },
  {
    id: 'platform-launch',
    name: 'Khởi Chạy Nền Tảng',
    columns: [
      { id: 'todo', name: 'Cần Làm' },
      { id: 'doing', name: 'Đang Thực Hiện' },
      { id: 'done', name: 'Hoàn Thành' }
    ]
  },
  {
    id: 'plan-marketing',
    name: 'Lập Kế Hoạch Tiếp Thị',
    columns: [
      { id: 'todo', name: 'Cần Làm' },
      { id: 'doing', name: 'Đang Thực Hiện' },
      { id: 'done', name: 'Hoàn Thành' }
    ]
  },
  {
    id: 'board-2',
    name: 'Bảng 2',
    columns: [
      { id: 'todo', name: 'Cần Làm' },
      { id: 'doing', name: 'Đang Thực Hiện' },
      { id: 'done', name: 'Hoàn Thành' }
    ]
  },
  {
    id: 'board-3',
    name: 'Bảng 3',
    columns: [
      { id: 'todo', name: 'Cần Làm' },
      { id: 'doing', name: 'Đang Thực Hiện' },
      { id: 'done', name: 'Hoàn Thành' }
    ]
  }
];

export const initialTasks = [
  {
    id: 'task-1',
    title: 'Nghiên cứu giá cạnh tranh',
    description: 'Xem xét mô hình giá của đối thủ',
    status: 'todo',
    boardId: 'main',
    position: 0,
    subtasks: [
      { id: 'sub-1', title: 'Tìm 5 đối thủ hàng đầu', completed: false },
      { id: 'sub-2', title: 'Phân tích mô hình giá', completed: false },
      { id: 'sub-3', title: 'Chuẩn bị báo cáo', completed: false }
    ]
  },
  {
    id: 'task-2',
    title: 'Xem lại phân tích trang web',
    description: 'Kiểm tra hiệu suất hàng tháng và nguồn lưu lượng truy cập',
    status: 'todo',
    boardId: 'main',
    position: 1,
    subtasks: [
      { id: 'sub-4', title: 'Kiểm tra tỷ lệ thoát', completed: true },
      { id: 'sub-5', title: 'Phân tích nguồn lưu lượng', completed: true },
      { id: 'sub-6', title: 'Xem lại phễu chuyển đổi', completed: false },
      { id: 'sub-7', title: 'Kiểm tra hành trình người dùng', completed: false },
      { id: 'sub-8', title: 'Đưa ra khuyến nghị', completed: false }
    ]
  },
  {
    id: 'task-3',
    title: 'Thiết kế wireframe trang chủ',
    description: 'Tạo wireframe ban đầu cho trang chủ mới',
    status: 'doing',
    boardId: 'main',
    position: 0,
    subtasks: [
      { id: 'sub-9', title: 'Tạo thiết kế di động', completed: true },
      { id: 'sub-10', title: 'Tạo thiết kế máy tính', completed: false }
    ]
  },
  {
    id: 'task-4',
    title: 'Xác định nhân vật người dùng',
    description: 'Tạo nhân vật người dùng dựa trên nghiên cứu',
    status: 'done',
    boardId: 'main',
    position: 0,
    subtasks: [
      { id: 'sub-11', title: 'Thu thập dữ liệu nghiên cứu', completed: true },
      { id: 'sub-12', title: 'Tạo hồ sơ nhân vật', completed: true },
      { id: 'sub-13', title: 'Chia sẻ với đội ngũ', completed: true }
    ]
  },
  {
    id: 'task-5',
    title: 'Cài đặt công cụ phân tích',
    description: 'Cài đặt công cụ phân tích và theo dõi',
    status: 'done',
    boardId: 'main',
    position: 1,
    subtasks: [
      { id: 'sub-14', title: 'Cài đặt Google Analytics', completed: true },
      { id: 'sub-15', title: 'Thiết lập theo dõi sự kiện', completed: true }
    ]
  }
];