import React from 'react';

export default function DeleteUserModal({ isOpen, onClose, onDelete, userEmail, taskCount }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Xóa thành viên
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
            aria-label="Đóng modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Thành viên <span className="font-medium">{userEmail}</span> hiện đang được giao {taskCount} nhiệm vụ. 
          Bạn có chắc chắn muốn xóa thành viên này khỏi dự án không? 
          Thao tác này sẽ gỡ họ khỏi tất cả các nhiệm vụ.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            aria-label="Hủy xóa thành viên"
          >
            Hủy
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            aria-label="Xác nhận xóa thành viên"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}