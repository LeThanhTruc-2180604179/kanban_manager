export default function SubtaskCompletionModal({ isOpen, onClose, task, onUpdate, columns }) {
  if (!isOpen || !task) return null;

  const handleToggleSubtask = (index) => {
    const newSubtasks = [...task.subtasks];
    newSubtasks[index].completed = !newSubtasks[index].completed;
    onUpdate(task.id, { ...task, subtasks: newSubtasks });
  };

  const currentColumn = columns.find(col => col.id === task.status);
  const statusText = currentColumn ? currentColumn.name : 'Unknown';

  // Generate avatar color and initial based on email
  const getAvatarInitial = (email) => email ? email.charAt(0).toUpperCase() : '?';
  const getAvatarColor = (email) => {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = ['#F28C82', '#FBBC04', '#34A853', '#4285F4', '#AB47BC', '#7CB342'];
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {task.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {task.description || 'No description provided.'}
        </p>
        <div className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Trạng Thái</label>
            <div className="p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 text-gray-800 dark:text-white">
              {statusText}
            </div>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Thành Viên</label>
            <div className="flex -space-x-2">
              {task.assignedUsers?.slice(0, 3).map((email, idx) => (
                <div
                  key={idx}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: getAvatarColor(email), zIndex: task.assignedUsers.length - idx }}
                >
                  {getAvatarInitial(email)}
                </div>
              ))}
              {task.assignedUsers && task.assignedUsers.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white text-sm font-medium">
                  +{task.assignedUsers.length - 3}
                </div>
              )}
              {(!task.assignedUsers || task.assignedUsers.length === 0) && (
                <p className="text-gray-500 dark:text-gray-400 text-sm">Chưa có thành viên</p>
              )}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Nhiệm Vụ Con</label>
          <div className="max-h-60 overflow-y-auto p-2 space-y-2">
            {task.subtasks.length > 0 ? (
              task.subtasks.map((subtask, index) => (
                <div
                  key={subtask.id}
                  className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => handleToggleSubtask(index)}
                    className="mr-2"
                  />
                  <span className={`flex-grow text-gray-800 dark:text-white ${subtask.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                    {subtask.title}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">No subtasks available.</p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}