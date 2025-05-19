import { useState, useEffect } from 'react';

export default function TaskModal({ isOpen, onClose, onSave, editingTask, columns, defaultStatus, tasks, currentBoard }) {
  const [task, setTask] = useState({
    id: '',
    title: '',
    description: '',
    status: defaultStatus || columns[0]?.id || '',
    subtasks: []
  });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (editingTask) {
      setTask(editingTask);
    } else {
      setTask({
        id: `task-${Date.now()}`,
        title: '',
        description: '',
        status: defaultStatus || columns[0]?.id || '',
        subtasks: []
      });
    }
  }, [editingTask, isOpen, columns, defaultStatus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
    if (name === 'title') setErrorMessage('');
  };

  const addSubtask = () => {
    setTask(prev => ({
      ...prev,
      subtasks: [
        ...prev.subtasks,
        { id: `sub-${Date.now()}`, title: '', completed: false }
      ]
    }));
  };

  const updateSubtask = (index, field, value) => {
    const newSubtasks = [...task.subtasks];
    newSubtasks[index][field] = value;
    setTask(prev => ({ ...prev, subtasks: newSubtasks }));
  };

  const removeSubtask = (index) => {
    const newSubtasks = [...task.subtasks];
    newSubtasks.splice(index, 1);
    setTask(prev => ({ ...prev, subtasks: newSubtasks }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (columns.length === 0) {
      setErrorMessage('Vui lòng tạo ít nhất một cột trước khi thêm task.');
      return;
    }

    if (!task.title.trim()) {
      setErrorMessage('Tiêu đề không được để trống');
      return;
    }

    const isDuplicateTitle = tasks.some(t =>
      t.boardId === currentBoard &&
      t.title.toLowerCase() === task.title.trim().toLowerCase() &&
      t.id !== (editingTask?.id || '')
    );
    if (isDuplicateTitle) {
      setErrorMessage('Tiêu đề task đã tồn tại');
      return;
    }

    onSave(task);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {editingTask ? 'Chỉnh Sửa Nhiệm Vụ' : 'Thêm Nhiệm Vụ Mới'}
        </h2>

        {columns.length === 0 ? (
          <div className="text-center">
            <p className="text-red-500 mb-4">Vui lòng tạo ít nhất một cột trước khi thêm task.</p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
            >
              Đóng
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Tiêu Đề
              </label>
              <input
                type="text"
                name="title"
                value={task.title}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Mô Tả
              </label>
              <textarea
                name="description"
                value={task.description}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                rows="3"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Nhiệm Vụ Con
              </label>
              <div className="max-h-32 overflow-y-auto mb-2">
                {task.subtasks.length === 0 ? (
                  <div className="text-gray-500 text-sm text-center py-2">
                    Nhấn "Thêm Nhiệm Vụ Con" để tạo nhiệm vụ phụ
                  </div>
                ) : (
                  task.subtasks.map((subtask, index) => (
                    <div key={subtask.id} className="flex mb-2 items-center relative">
                      <input
                        type="text"
                        value={subtask.title}
                        onChange={(e) => updateSubtask(index, 'title', e.target.value)}
                        className="flex-grow p-2 pr-8 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                        placeholder="Tiêu đề nhiệm vụ con"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => removeSubtask(index)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        aria-label="Remove subtask"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
              <button
                type="button"
                onClick={addSubtask}
                className="mt-1 w-full p-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 font-medium"
              >
                + Thêm Nhiệm Vụ Con
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Trạng Thái
              </label>
              <select
                name="status"
                value={task.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
              >
                {columns.map(column => (
                  <option key={column.id} value={column.id}>
                    {column.name}
                  </option>
                ))}
              </select>
            </div>

            {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                {editingTask ? 'Lưu Thay Đổi' : 'Tạo Nhiệm Vụ'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}