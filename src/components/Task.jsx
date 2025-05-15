import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useEffect, useRef } from 'react';

export default function Task({ task, onClick, columnId, isOverlay, index, totalTasks, onDelete }) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        relative bg-white dark:bg-gray-700 p-4 rounded-md shadow-sm
        hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200
        ${isDragging ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50' : ''}
        ${isOverlay ? 'shadow-xl ring-2 ring-blue-500 cursor-grabbing' : 'cursor-grab'}
        active:cursor-grabbing
        touch-manipulation
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
        <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-2">
          {task.title}
        </h3>
        <div className="flex items-center mt-2">
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
            <div
              className="bg-blue-500 h-1.5 rounded-full"
              style={{ width: `${totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0}%` }}
            ></div>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
            {completedSubtasks}/{totalSubtasks}
          </span>
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
              className="absolute top-6 right-0 w-24 bg-gray-800 rounded shadow-lg z-10 opacity-100"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMenuOpen(false);
                  onDelete(task);
                }}
                className="w-full text-left px-3 py-1 text-sm text-red-400 hover:bg-gray-700 rounded"
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