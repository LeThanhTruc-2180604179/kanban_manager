import { useState, useEffect, useRef } from 'react';
import DeleteBoardModal from './DeleteBoardModal';

export default function Sidebar({ 
  sidebarOpen, 
  toggleSidebar, 
  boards, 
  currentBoard, 
  setCurrentBoard, 
  addBoard,
  updateBoard,
  onDeleteBoard
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(null);
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);
  const [isRenameBoardModalOpen, setIsRenameBoardModalOpen] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [boardToRename, setBoardToRename] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isBoardsExpanded, setIsBoardsExpanded] = useState(true);
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  const handleDeleteClick = (board) => {
    setBoardToDelete(board);
    setIsDeleteModalOpen(true);
    setIsMenuOpen(null);
  };

  const handleDeleteConfirm = () => {
    if (boardToDelete) {
      onDeleteBoard(boardToDelete.id);
    }
    setIsDeleteModalOpen(false);
  };

  const toggleMenu = (boardId) => {
    setIsMenuOpen(isMenuOpen === boardId ? null : boardId);
  };

  const handleRenameClick = (board) => {
    setBoardToRename(board);
    setNewBoardName(board.name);
    setIsRenameBoardModalOpen(true);
    setIsMenuOpen(null);
  };

  const handleAddBoard = () => {
    if (!newBoardName.trim()) {
      setErrorMessage('Tên bảng không được để trống');
      return;
    }
    if (boards.some(board => board.name.toLowerCase() === newBoardName.trim().toLowerCase())) {
      setErrorMessage('Tên bảng đã tồn tại');
      return;
    }
    addBoard({ id: `board-${Date.now()}`, name: newBoardName.trim() });
    setNewBoardName('');
    setIsAddBoardModalOpen(false);
    setErrorMessage('');
  };

  const handleUpdateBoardName = () => {
    if (!newBoardName.trim()) {
      setErrorMessage('Tên bảng không được để trống');
      return;
    }
    if (boardToRename && boardToRename.name.toLowerCase() !== newBoardName.trim().toLowerCase()) {
      if (boards.some(board => board.id !== boardToRename.id && board.name.toLowerCase() === newBoardName.trim().toLowerCase())) {
        setErrorMessage('Tên bảng đã tồn tại');
        return;
      }
      updateBoard(boardToRename.id, { name: newBoardName.trim() });
    }
    setNewBoardName('');
    setBoardToRename(null);
    setIsRenameBoardModalOpen(false);
    setErrorMessage('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen !== null &&
          menuRef.current &&
          !menuRef.current.contains(event.target) &&
          !menuButtonRef.current.contains(event.target)) {
        setIsMenuOpen(null);
      }
    };

    if (isMenuOpen !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-0'} fixed left-0 top-0 h-screen transition-all duration-300 overflow-hidden bg-gray-900 dark:bg-gray-900 text-white flex flex-col z-50`}>
      <div className="p-4 flex items-center">
        <div className="h-8 w-8 flex items-center justify-center rounded bg-gradient-to-br from-blue-400 to-purple-600">
          <span className="font-bold text-white">D</span>
        </div>
        <span className="ml-2 font-bold text-white">Dashdark X</span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setIsBoardsExpanded(!isBoardsExpanded)}>
          <span className="text-sm font-medium uppercase text-gray-400">ALL BOARD</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400 transition-transform duration-200"
            style={{ transform: isBoardsExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {isBoardsExpanded && (
          <nav>
            {boards.map((board) => (
              <div key={board.id} className="relative mb-1">
                <div
                  onClick={() => setCurrentBoard(board.id)}
                  className={`flex items-center py-2 px-3 rounded cursor-pointer w-full ${currentBoard === board.id ? 'bg-purple-600' : 'hover:bg-gray-800'}`}
                >
                  <span className="flex-1">{board.name}</span>
                  <button
                    ref={menuButtonRef}
                    onClick={(e) => { e.stopPropagation(); toggleMenu(board.id); }}
                    className="ml-2 p-1 rounded hover:bg-gray-700"
                  >
                    <svg className="w-4 h-4 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01" />
                    </svg>
                  </button>
                </div>
                {isMenuOpen === board.id && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-1 w-24 bg-gray-800 rounded shadow-lg z-10"
                  >
                    <button
                      onClick={() => handleRenameClick(board)}
                      className="w-full text-left px-3 py-1 text-sm text-blue-400 hover:bg-gray-700 rounded"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => handleDeleteClick(board)}
                      className="w-full text-left px-3 py-1 text-sm text-red-400 hover:bg-gray-700 rounded"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </nav>
        )}
        
        <button 
          className="w-full mt-4 py-3 flex items-center justify-center rounded bg-purple-600 hover:bg-purple-700 text-white"
          onClick={() => {
            setNewBoardName('');
            setErrorMessage('');
            setIsAddBoardModalOpen(true);
          }}
        >
          Add new board
        </button>
      </div>
      
      <div className="p-4 border-t border-gray-800">
        <button 
          className="w-full mt-4 py-2 flex items-center justify-center rounded hover:bg-gray-700 text-gray-400"
          onClick={toggleSidebar}
        >
          Hide Sidebar
        </button>
      </div>

      {isDeleteModalOpen && (
        <DeleteBoardModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={handleDeleteConfirm}
          boardName={boardToDelete?.name || ''}
        />
      )}

    {isAddBoardModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Add New Board
        </h2>
        <button
          onClick={() => {
            setIsAddBoardModalOpen(false);
            setNewBoardName('');
            setErrorMessage('');
          }}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => {
            setNewBoardName(e.target.value);
            setErrorMessage('');
          }}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white text-gray-800 dark:bg-gray-700 dark:text-white"
          placeholder="Enter board name..."
          autoFocus
        />
        {errorMessage && (
          <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
        )}
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            setIsAddBoardModalOpen(false);
            setNewBoardName('');
            setErrorMessage('');
          }}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleAddBoard}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Create
        </button>
      </div>
    </div>
  </div>
)}

     {isRenameBoardModalOpen && boardToRename && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Rename Board
        </h2>
        <button
          onClick={() => {
            setIsRenameBoardModalOpen(false);
            setNewBoardName('');
            setBoardToRename(null);
            setErrorMessage('');
          }}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => {
            setNewBoardName(e.target.value);
            setErrorMessage('');
          }}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white text-gray-800 dark:bg-gray-700 dark:text-white"
          placeholder="Enter new board name..."
          autoFocus
        />
        {errorMessage && <p className="text-red-500 text-xs mt-1">{errorMessage}</p>}
      </div>
      <div className="flex justify-end space-x-3">
        <button
          onClick={() => {
            setIsRenameBoardModalOpen(false);
            setNewBoardName('');
            setBoardToRename(null);
            setErrorMessage('');
          }}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdateBoardName}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}