import { useState, useEffect } from 'react';

export default function TaskModal({ isOpen, onClose, onSave, editingTask, columns, defaultStatus, tasks, currentBoard, users }) {
  const [task, setTask] = useState({
    id: '',
    title: '',
    description: '',
    status: defaultStatus || columns[0]?.id || '',
    subtasks: [],
    priority: 'Low',
    assignedUsers: []
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (editingTask) {
      setTask(editingTask);
    } else {
      setTask({
        id: `task-${Date.now()}`,
        title: '',
        description: '',
        status: defaultStatus || columns[0]?.id || '',
        subtasks: [],
        priority: 'Low',
        assignedUsers: []
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

  const toggleUserAssignment = (email) => {
    setTask(prev => {
      if (prev.assignedUsers.includes(email)) {
        return { ...prev, assignedUsers: prev.assignedUsers.filter(u => u !== email) };
      } else {
        return { ...prev, assignedUsers: [...prev.assignedUsers, email] };
      }
    });
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-full max-w-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {editingTask ? 'Chỉnh Sửa Nhiệm Vụ' : 'Thêm Nhiệm Vụ Mới'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

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
            <div className="grid grid-cols-3 gap-4">
              {/* Left Column */}
              <div className="col-span-2">
                <div className="mb-3">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Tiêu Đề</label>
                  <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Mô Tả</label>
                  <textarea
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                    rows="2"
                  />
                </div>

                {/* Tab navigation for Subtasks/Users */}
                <div className="flex border-b border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    className={`py-2 px-4 text-sm font-medium ${activeTab === 'details' 
                      ? 'text-purple-600 border-b-2 border-purple-600' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    onClick={() => setActiveTab('details')}
                  >
                    Nhiệm Vụ Con
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 text-sm font-medium ${activeTab === 'users' 
                      ? 'text-purple-600 border-b-2 border-purple-600' 
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    onClick={() => setActiveTab('users')}
                  >
                    Thành Viên Phụ Trách
                  </button>
                </div>

                {/* Subtasks Tab */}
                {activeTab === 'details' && (
                  <div className="mt-3 mb-3">
                    <div className="max-h-24 overflow-y-auto mb-2">
                      {task.subtasks.length === 0 ? (
                        <div className="text-gray-500 text-sm text-center py-2">Nhấn "Thêm Nhiệm Vụ Con" để tạo nhiệm vụ phụ</div>
                      ) : (
                        task.subtasks.map((subtask, index) => (
                          <div key={subtask.id} className="flex mb-2 items-center relative">
                            <input
                              type="text"
                              value={subtask.title}
                              onChange={(e) => updateSubtask(index, 'title', e.target.value)}
                              className="flex-grow p-1.5 pr-8 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                              placeholder="Tiêu đề nhiệm vụ con"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => removeSubtask(index)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                              aria-label="Remove subtask"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      className="mt-1 w-full p-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors border border-gray-200 dark:border-gray-600 font-medium text-sm"
                    >
                      + Thêm Nhiệm Vụ Con
                    </button>
                  </div>
                )}
                
                {/* Users Tab */}
                {activeTab === 'users' && (
                  <div className="mt-3 mb-3">
                    <div className="max-h-24 overflow-y-auto grid grid-cols-2 gap-2">
                      {users.length === 0 ? (
                        <div className="text-gray-500 dark:text-gray-400 text-sm col-span-2 text-center py-4">
                          Chưa có thành viên nào trong bảng. Vui lòng thêm thành viên trước.
                        </div>
                      ) : (
                        users.map(user => (
                          <div 
                            key={user.id} 
                            onClick={() => toggleUserAssignment(user.email)}
                            className={`p-2 rounded-md border text-sm cursor-pointer transition-colors flex items-center justify-between
                              ${task.assignedUsers.includes(user.email) 
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300' 
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'}`}
                          >
                            <span className="truncate">{user.email}</span>
                            {task.assignedUsers.includes(user.email) && (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                                <polyline points="20 6 9 17 4 12"></polyline>
                              </svg>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="col-span-1 space-y-3">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Priority</label>
                  <div className="flex space-x-2">
                    {['Low', 'Medium', 'High'].map((priority) => (
                      <button
                        key={priority}
                        type="button"
                        onClick={() => setTask(prev => ({ ...prev, priority }))}
                        className={`flex-1 p-1.5 rounded-md text-center text-sm font-medium transition-colors
                          ${task.priority === priority
                            ? (priority === 'Low' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                               priority === 'Medium' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                               'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400')
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                          }`}
                      >
                        {priority}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Trạng Thái</label>
                  <select
                    name="status"
                    value={task.status}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                  >
                    {columns.map(column => (
                      <option key={column.id} value={column.id}>
                        {column.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Thành Viên Đã Chọn</label>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-md p-2 bg-gray-50 dark:bg-gray-800 min-h-12 max-h-24 overflow-y-auto">
                    {task.assignedUsers.length === 0 ? (
                      <div className="text-gray-500 dark:text-gray-400 text-xs text-center py-1">
                        Chưa có thành viên nào được chọn
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {task.assignedUsers.map(email => (
                          <div key={email} className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded text-xs flex items-center">
                            <span className="truncate max-w-28">{email}</span>
                            <button 
                              type="button" 
                              onClick={() => toggleUserAssignment(email)}
                              className="ml-1 text-purple-400 hover:text-purple-600 dark:hover:text-purple-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {errorMessage && <p className="text-red-500 text-xs mt-2">{errorMessage}</p>}

            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600 text-sm"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
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