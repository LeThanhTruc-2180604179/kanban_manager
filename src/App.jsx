import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Board from './components/Board';
import TaskModal from './components/TaskModal';
import DeleteTaskModal from './components/DeleteTaskModal';
import SubtaskCompletionModal from './components/SubtaskCompletionModal';
import UserList from './components/UserList';
import AddUserModal from './components/AddUserModal'; // Import AddUserModal
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
    deleteColumn,
    users,
    addUserToBoard
  } = useBoard();

  const [boards, setBoards] = useState(initialBoards);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskColumnId, setNewTaskColumnId] = useState(null);
  const [isDeleteTaskModalOpen, setIsDeleteTaskModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showUserList, setShowUserList] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false); // State for AddUserModal

  useEffect(() => {
    setBoards(initialBoards);
  }, [initialBoards]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openTaskModal = (columnId = null) => {
    if (boards.length === 0) {
      alert('Vui lòng tạo một bảng trước khi thêm nhiệm vụ.');
      return;
    }
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
        status: newTaskColumnId || columns[0]?.id,
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

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenSubtaskModal = (task) => {
    setSelectedTask(task);
    setIsSubtaskModalOpen(true);
  };

  const handleCloseSubtaskModal = () => {
    setIsSubtaskModalOpen(false);
    setSelectedTask(null);
  };

  const handleViewTeam = () => {
    setShowUserList(true);
  };

  const handleBackToBoard = () => {
    setShowUserList(false);
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
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <div className="mt-16">
          <main className="p-6 overflow-x-auto">
            {boards.length === 0 ? (
              <div className="text-center text-gray-600 dark:text-gray-300">
                <p className="text-lg mb-4">Chưa có bảng nào. Vui lòng tạo một bảng mới từ thanh bên.</p>
              </div>
            ) : showUserList ? (
              <UserList
                users={users}
                onBack={handleBackToBoard}
                onAddUser={addUserToBoard}
                setIsAddUserModalOpen={setIsAddUserModalOpen} // Pass modal control
              />
            ) : (
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
                  updateTask={updateTask}
                  onEditTask={handleEditTask}
                  onOpenSubtaskModal={handleOpenSubtaskModal}
                  users={users}
                  addUserToBoard={addUserToBoard}
                  onViewTeam={handleViewTeam}
                />
              </div>
            )}
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
          users={users}
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

      {isSubtaskModalOpen && (
        <SubtaskCompletionModal
          isOpen={isSubtaskModalOpen}
          onClose={handleCloseSubtaskModal}
          task={selectedTask}
          onUpdate={updateTask}
          columns={columns}
        />
      )}

      {isAddUserModalOpen && (
        <AddUserModal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          onAddUser={addUserToBoard}
        />
      )}
    </div>
 
  );
}