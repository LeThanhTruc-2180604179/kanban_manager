export default function SubtaskCompletionModal({ isOpen, onClose, task, onUpdate, columns }) {
  if (!isOpen || !task) return null;

  const handleToggleSubtask = (index) => {
    const newSubtasks = [...task.subtasks];
    newSubtasks[index].completed = !newSubtasks[index].completed;
    onUpdate(task.id, { ...task, subtasks: newSubtasks });
  };

  // Find the current column name based on task.status
  const currentColumn = columns.find(col => col.id === task.status);
  const statusText = currentColumn ? currentColumn.name : 'Unknown';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          {task.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          {task.description || 'No description provided.'}
        </p>
        <div className="mb-6">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Nhiệm Vụ Con
          </label>
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
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
            Trạng Thái
          </label>
          <p className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white">
            {statusText}
          </p>
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