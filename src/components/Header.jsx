import React from 'react';

export default function Header({
  sidebarOpen,
  toggleSidebar,
  currentBoardName,
  darkMode,
  toggleDarkMode
}) {
  return (
    <header
      className="fixed top-0 right-0 flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-40"
      style={{ width: `calc(100% - ${sidebarOpen ? '16rem' : '0rem'})` }}
    >
      {!sidebarOpen && (
        <button
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
          onClick={toggleSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-500 dark:text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      <div className="ml-4 flex-1">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Welcome back, John
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Measure your advertising ROI and report website traffic.
        </p>
      </div>

      <div className="flex items-center space-x-4 px-6">
        <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Export data</span>
        </button>

        <button
          onClick={toggleDarkMode}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors duration-300 ${
            darkMode ? 'bg-gray-700' : 'bg-gray-200'
          } hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}