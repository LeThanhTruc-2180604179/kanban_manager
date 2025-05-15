import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import DeleteTaskModal from './components/DeleteTaskModal';
import { useTheme } from './hooks/useTheme';
import { useBoard } from './hooks/useBoard';

export default function App() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { 
    boards: initialBoards, 
    currentBoard, 
    setCurrentBoard, 
    addBoard,
    updateBoard,
    deleteBoard: deleteBoardFromHook,
    columns, 
    tasks, 
    addTask, 
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    updateColumn,
    deleteColumn
  } = useBoard();
  
  const [boards, setBoards] = useState(initialBoards);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskColumnId, setNewTaskColumnId] = useState(null);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    setBoards(initialBoards);
  }, [initialBoards]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const openTaskModal = (columnId = null) => {
    setNewTaskColumnId(columnId);
    setIsTaskModalOpen(true);
  };
  
  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setNewTaskColumnId(null);
  };
  
  const handleSaveTask = (task) => {
    if (columns.length === 0) {
      alert('Vui lòng tạo ít nhất một cột trước khi thêm task.');
      return;
    }

    if (editingTask) {
      updateTask(task.id, task);
    } else {
      addTask({
        ...task,
        boardId: currentBoard,
        status: newTaskColumnId || columns[0]?.id, // Bỏ 'todo' để đảm bảo status là id hợp lệ
        position: tasks.filter(t => t.status === (newTaskColumnId || columns[0]?.id) && t.boardId === currentBoard).length
      });
    }
    closeTaskModal();
  };
  
  const handleDeleteBoard = (boardId) => {
    deleteBoardFromHook(boardId);
    setBoards(prevBoards => prevBoards.filter(board => board.id !== boardId));
    if (currentBoard === boardId) setCurrentBoard(boards[0]?.id || '');
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteTaskModalOpen(true);
  };

  const handleConfirmDeleteTask = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
    }
    setIsDeleteTaskModalOpen(false);
    setTaskToDelete(null);
  };
  
  const currentBoardName = boards.find(b => b.id === currentBoard)?.name || '';
  
  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <Sidebar 
        sidebarOpen={sidebarOpen}
        toggleSidebar={toggleSidebar}
        boards={boards}
        currentBoard={currentBoard}
        setCurrentBoard={setCurrentBoard}
        addBoard={addBoard}
        updateBoard={updateBoard}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onDeleteBoard={handleDeleteBoard}
      />
      
      <div 
        className="transition-all duration-300 bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col"
        style={{ 
          marginLeft: sidebarOpen ? '16rem' : '0'
        }}
      >
        <Header 
          className="fixed top-0 right-0 w-full z-10"
          style={{
            width: `calc(100% - ${sidebarOpen ? '16rem' : '0rem'})`
          }}
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          currentBoardName={currentBoardName}
          openTaskModal={openTaskModal}
        />
        
        <div className="mt-16">
          <main className="p-6 overflow-x-auto">
            <div className="inline-flex space-x-6 min-w-max">
              <Board 
                tasks={tasks}
                columns={columns}
                moveTask={moveTask}
                openTaskModal={openTaskModal}
                setEditingTask={setEditingTask}
                addColumn={addColumn}
                updateColumn={updateColumn}
                currentBoard={currentBoard}
                onDeleteTask={handleDeleteTask}
                deleteColumn={deleteColumn}
              />
            </div>
          </main>
        </div>
      </div>
      
      {isTaskModalOpen && (
        <TaskModal 
          isOpen={isTaskModalOpen}
          onClose={closeTaskModal}
          onSave={handleSaveTask}
          editingTask={editingTask}
          columns={columns}
          defaultStatus={newTaskColumnId}
          tasks={tasks}
          currentBoard={currentBoard}
        />
      )}

      {isDeleteTaskModalOpen && (
        <DeleteTaskModal
          isOpen={isDeleteTaskModalOpen}
          onClose={() => {
            setIsDeleteTaskModalOpen(false);
            setTaskToDelete(null);
          }}
          onDelete={handleConfirmDeleteTask}
          taskTitle={taskToDelete?.title || ''}
        />
      )}
    </div>
  );
}