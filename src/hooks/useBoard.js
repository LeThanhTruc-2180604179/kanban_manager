import { useState } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { initialBoards, initialTasks } from '../data/initialData';

export function useBoard() {
  const [boards, setBoards] = useLocalStorage('boards', initialBoards);
  const [tasks, setTasks] = useLocalStorage('tasks', initialTasks);
  const [currentBoard, setCurrentBoard] = useLocalStorage('currentBoard', '');

  const currentBoardData = boards.find(board => board.id === currentBoard) || { columns: [], users: [] };
  const currentColumns = currentBoardData.columns || [];
  const currentUsers = currentBoardData.users || [];

  const addBoard = (newBoard) => {
    const newColumns = [
      { id: `col-${newBoard.id}-todo`, name: 'To Do' },
      { id: `col-${newBoard.id}-progress`, name: 'Progress' },
      { id: `col-${newBoard.id}-done`, name: 'Done' },
    ];
    const updatedBoards = [...boards, { ...newBoard, columns: newColumns, users: [] }];
    setBoards(updatedBoards);
    setCurrentBoard(newBoard.id);
  };

  const updateBoard = (id, updatedBoard) => {
    setBoards(boards.map(board => board.id === id ? { ...board, ...updatedBoard } : board));
  };

  const deleteBoard = (id) => {
    setBoards(boards.filter(board => board.id !== id));
    if (currentBoard === id) {
      setCurrentBoard(boards[0]?.id || '');
    }
  };

  const addTask = (newTask) => {
    const columnTasks = tasks.filter(t => t.status === newTask.status && t.boardId === currentBoard);
    setTasks([...tasks, { 
      ...newTask, 
      position: columnTasks.length, 
      boardId: currentBoard,
      assignedUsers: newTask.assignedUsers || [] // Ensure assignedUsers is included
    }]);
  };

  const updateTask = (id, updatedTask) => {
    setTasks(tasks.map(task => task.id === id ? { 
      ...task, 
      ...updatedTask,
      assignedUsers: updatedTask.assignedUsers || [] // Ensure assignedUsers is preserved
    } : task));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const moveTask = (taskIdOrTasks, boardId) => {
    if (Array.isArray(taskIdOrTasks)) {
      const updatedTasks = [...taskIdOrTasks];
      const columnIds = currentColumns.map(col => col.id);
      columnIds.forEach(columnId => {
        const tasksInColumn = updatedTasks
          .filter(t => t.status === columnId && t.boardId === boardId)
          .sort((a, b) => (a.position || 0) - (b.position || 0));
        tasksInColumn.forEach((task, index) => {
          const taskIndex = updatedTasks.findIndex(t => t.id === task.id);
          if (taskIndex !== -1) {
            updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], position: index };
          }
        });
      });
      setTasks(updatedTasks);
    } else {
      const taskIndex = tasks.findIndex(t => t.id === taskIdOrTasks);
      if (taskIndex !== -1) {
        const updatedTasks = [...tasks];
        updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], position: 0 };
        setTasks(updatedTasks);
      }
    }
  };

  const addColumn = (newColumn) => {
    const existingColumn = currentColumns.find(col => col.name.toLowerCase() === newColumn.name.toLowerCase());
    if (existingColumn) {
      throw new Error('Tên cột đã tồn tại');
    }
    setBoards(boards.map(board =>
      board.id === currentBoard ? { ...board, columns: [...(board.columns || []), newColumn] } : board
    ));
  };

  const updateColumn = (idOrColumns, updatedColumn) => {
    if (Array.isArray(idOrColumns)) {
      setBoards(boards.map(board =>
        board.id === currentBoard ? { ...board, columns: idOrColumns } : board
      ));
    } else {
      const existingColumn = currentColumns.find(col => col.id !== idOrColumns && col.name.toLowerCase() === updatedColumn.name.toLowerCase());
      if (existingColumn) {
        throw new Error('Tên cột đã tồn tại');
      }
      setBoards(boards.map(board =>
        board.id === currentBoard
          ? { ...board, columns: board.columns.map(col => col.id === idOrColumns ? { ...col, ...updatedColumn } : col) }
          : board
      ));
    }
  };

  const deleteColumn = (columnToDelete, targetColumnId) => {
    if (currentColumns.length <= 1) return false;
    const updatedBoards = boards.map(board =>
      board.id === currentBoard
        ? { ...board, columns: board.columns.filter(col => col.id !== columnToDelete.id) }
        : board
    );
    setBoards(updatedBoards);
    if (targetColumnId) {
      const tasksInDeletedColumn = tasks.filter(task => task.status === columnToDelete.id && task.boardId === currentBoard);
      if (tasksInDeletedColumn.length > 0) {
        const tasksInTargetColumn = tasks.filter(task => task.status === targetColumnId && task.boardId === currentBoard);
        const updatedTasks = tasks.map(task =>
          tasksInDeletedColumn.includes(task) ? { ...task, status: targetColumnId, position: tasksInTargetColumn.length + tasksInDeletedColumn.indexOf(task) } : task
        );
        setTasks(updatedTasks);
      }
    }
    return true;
  };

  const addUserToBoard = (email) => {
    setBoards(boards.map(board =>
      board.id === currentBoard
        ? { ...board, users: [...(board.users || []), { id: `user-${Date.now()}`, email }] }
        : board
    ));
  };

  const boardTasks = tasks
    .filter(task => task.boardId === currentBoard)
    .sort((a, b) => (a.position || 0) - (b.position || 0));

  return {
    boards,
    currentBoard,
    setCurrentBoard,
    addBoard,
    updateBoard,
    deleteBoard,
    columns: currentColumns,
    tasks: boardTasks,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addColumn,
    updateColumn,
    deleteColumn,
    users: currentUsers,
    addUserToBoard
  };
}