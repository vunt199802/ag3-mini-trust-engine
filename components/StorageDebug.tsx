'use client';

import { useState, useEffect } from 'react';
import { getAllStoredData, getVisitStats, clearAllStoredData } from '../lib/storage';

export default function StorageDebug() {
  const [storedData, setStoredData] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  const refreshData = () => {
    setStoredData(getAllStoredData());
  };

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all stored data?')) {
      clearAllStoredData();
      refreshData();
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 left-4 z-50 px-3 py-2 bg-blue-600 text-white text-xs rounded-md shadow-lg hover:bg-blue-700 transition-colors"
      >
        Show Storage Data
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Storage Data</h3>
        <div className="flex gap-2">
          <button
            onClick={refreshData}
            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
          >
            Refresh
          </button>
          <button
            onClick={handleClearData}
            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            Clear All
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>

      <div className="space-y-3 text-xs">
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">Visit Stats:</h4>
          <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(getVisitStats(), null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">Theme Data:</h4>
          <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(storedData?.themeData, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">User Preferences:</h4>
          <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(storedData?.userPreferences, null, 2)}
          </pre>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">Raw Storage:</h4>
          <pre className="bg-gray-100 dark:bg-gray-700 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(storedData?.rawStorage, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}
