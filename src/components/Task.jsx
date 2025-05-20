import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useEffect, useRef } from 'react';

export default function Task({ task, onClick, columnId, isOverlay, index, totalTasks, onDelete, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    over,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
      index,
      columnId,
    },
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const style = {
    transform: CSS.Transform.toString(
      isOverlay
        ? { ...transform, scaleX: 1.05, scaleY: 1.05 }
        : transform
    ),
    transition: transition || 'transform 200ms ease, opacity 200ms ease',
    zIndex: isDragging || isOverlay ? 100 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  const completedSubtasks = task.subtasks?.filter(subtask => subtask.completed)?.length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  const isFirstTask = index === 0;
  const isLastTask = index === totalTasks - 1;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuButtonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 5,
        left: rect.right - 96,
      });
    }
  }, [isMenuOpen]);

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

  const visibleAvatars = task.assignedUsers?.slice(0, 3) || [];
  const extraMembers = Math.max(0, (task.assignedUsers?.length || 0) - 3);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative bg-white dark:bg-gray-700 p-3 rounded-md shadow-sm
        hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200
        ${isDragging ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : ''}
        ${isOverlay ? 'shadow-xl ring-2 ring-blue-500 cursor-grabbing' : 'cursor-grab'}
        active:cursor-grabbing
        touch-manipulation
        min-h-[80px] max-h-40 overflow-hidden
      `}
      data-column-id={columnId}
      role="button"
      aria-label={`Task ${task.title}, ${completedSubtasks} trên ${totalSubtasks} subtasks hoàn thành`}
    >
      {!isOverlay && !isDragging && (
        <>
          <div
            className={`absolute -top-3 left-0 right-0 h-4 bg-blue-500 rounded opacity-0 transition-opacity
              ${over && over.id !== task.id && isFirstTask ? 'opacity-100' : ''}`}
          />
          <div
            className={`absolute -bottom-3 left-0 right-0 h-4 bg-blue-500 rounded opacity-0 transition-opacity
              ${over && over.id !== task.id && isLastTask ? 'opacity-100' : ''}`}
          />
        </>
      )}
      <div
        className="task-content"
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <div className="relative">
          <h3
            className="text-sm font-medium text-gray-800 dark:text-white mb-2 pr-6 break-words line-clamp-3"
            title={task.title}
          >
            {task.title}
          </h3>
        </div>
        <div className="mt-2">
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full"
              style={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
            <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
            <div className="flex -space-x-2">
              {visibleAvatars.map((email, idx) => (
                <div
                  key={idx}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-medium"
                  style={{ backgroundColor: getAvatarColor(email), zIndex: visibleAvatars.length - idx }}
                >
                  {getAvatarInitial(email)}
                </div>
              ))}
              {extraMembers > 0 && (
                <div className="w-5 h-5 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium">
                  +{extraMembers}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-2 right-2">
        <div className="relative">
          <button
            ref={menuButtonRef}
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="w-5 h-5 flex flex-col items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-200"
          >
            <div className="w-3 h-0.5 bg-gray-500 mb-0.5"></div>
            <div className="w-3 h-0.5 bg-gray-500 mb-0.5"></div>
            <div className="w-3 h-0.5 bg-gray-500"></div>
          </button>
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="w-24 bg-gray-900 rounded shadow-lg z-50"
              style={{
                position: 'fixed',
                top: `${menuPosition.top}px`,
                left: `${menuPosition.left}px`,
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onEdit(task);
                }}
                className="w-full text-left px-3 py-1 text-sm text-blue-400 hover:bg-gray-800 rounded"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onDelete(task);
                }}
                className="w-full text-left px-3 py-1 text-sm text-red-400 hover:bg-gray-800 rounded"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}