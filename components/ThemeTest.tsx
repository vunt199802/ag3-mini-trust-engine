'use client';

import { useState, useEffect } from 'react';

export default function ThemeTest() {
  const [currentTheme, setCurrentTheme] = useState<string>('loading...');
  const [storedData, setStoredData] = useState<any>(null);

  const refreshData = () => {
    // Get current theme from DOM
    const isDark = document.documentElement.classList.contains('dark');
    setCurrentTheme(isDark ? 'dark' : 'light');
    
    // Get stored data
    const themeData = localStorage.getItem('themeData');
    const darkMode = localStorage.getItem('darkMode');
    const theme = localStorage.getItem('theme');
    
    setStoredData({
      themeData: themeData ? JSON.parse(themeData) : null,
      darkMode,
      theme,
      timestamp: new Date().toISOString()
    });
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 1000);
    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-3 max-w-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Theme Test</h3>
        <button
          onClick={refreshData}
          className="px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div>
          <span className="font-medium text-gray-900 dark:text-white">Current Theme:</span>
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            currentTheme === 'dark' 
              ? 'bg-gray-800 text-white' 
              : 'bg-yellow-200 text-gray-900'
          }`}>
            {currentTheme}
          </span>
        </div>
        
        <div>
          <span className="font-medium text-gray-900 dark:text-white">Stored darkMode:</span>
          <span className="ml-2 text-gray-600 dark:text-gray-400">{storedData?.darkMode || 'null'}</span>
        </div>
        
        <div>
          <span className="font-medium text-gray-900 dark:text-white">Stored theme:</span>
          <span className="ml-2 text-gray-600 dark:text-gray-400">{storedData?.theme || 'null'}</span>
        </div>
        
        {storedData?.themeData && (
          <div>
            <span className="font-medium text-gray-900 dark:text-white">Theme Data:</span>
            <div className="mt-1 p-2 bg-gray-100 dark:bg-gray-700 rounded text-xs">
              <div>isDarkMode: {storedData.themeData.isDarkMode ? 'true' : 'false'}</div>
              <div>theme: {storedData.themeData.theme}</div>
              <div>toggleCount: {storedData.themeData.toggleCount}</div>
              <div>lastUpdated: {new Date(storedData.themeData.lastUpdated).toLocaleTimeString()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
