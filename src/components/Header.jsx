export default function Header({ 
  sidebarOpen, 
  toggleSidebar, 
  currentBoardName,
  openTaskModal
}) {
  return (
    <header className="fixed top-0 right-0 flex items-center justify-between h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 z-40"
      style={{ width: `calc(100% - ${sidebarOpen ? '16rem' : '0rem'})` }}
    >
      {!sidebarOpen && (
        <button 
          className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
          onClick={toggleSidebar}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      
      <div className="ml-4 flex-1">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Welcome back, John</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Measure your advertising ROI and report website traffic.</p>
      </div>
      
      <div className="flex items-center space-x-4 px-6">
        <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span>Export data</span>
        </button>
        
        <button 
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          onClick={openTaskModal}
        >
          Add new task
        </button>
      </div>
    </header>
  );
}