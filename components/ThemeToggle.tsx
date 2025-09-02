'use client';

import { useEffect, useState } from 'react';
import { ThemeData, saveUserPreferences, getVisitStats } from '../lib/storage';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [isInitialized, setIsInitialized] = useState(false);

  // Generate a unique session ID
  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  // Save comprehensive theme data to localStorage
  const saveThemeData = (isDark: boolean, isToggle: boolean = false) => {
    const currentToggleCount = parseInt(localStorage.getItem('toggleCount') || '0');
    
    const themeData: ThemeData = {
      isDarkMode: isDark,
      theme: isDark ? 'dark' : 'light',
      lastUpdated: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      sessionId: localStorage.getItem('sessionId') || generateSessionId(),
      toggleCount: isToggle ? currentToggleCount + 1 : currentToggleCount
    };

    // Save session ID if it doesn't exist
    if (!localStorage.getItem('sessionId')) {
      localStorage.setItem('sessionId', themeData.sessionId);
    }

    // Save toggle count only if it's a toggle action
    if (isToggle) {
      localStorage.setItem('toggleCount', themeData.toggleCount.toString());
    }

    // Save comprehensive theme data
    localStorage.setItem('themeData', JSON.stringify(themeData));
    
    // Also save individual values for backward compatibility
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    localStorage.setItem('lastThemeUpdate', themeData.lastUpdated);

    // Save user preferences
    saveUserPreferences({
      theme: isDark ? 'dark' : 'light',
      preferredLanguage: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });

    // Log visit stats for debugging
    console.log('Theme data saved:', themeData);
    console.log('Visit stats:', getVisitStats());
  };

  // Load theme data from localStorage
  const loadThemeData = () => {
    try {
      const savedThemeData = localStorage.getItem('themeData');
      if (savedThemeData) {
        const parsedData: ThemeData = JSON.parse(savedThemeData);
        return parsedData;
      }
    } catch (error) {
      console.warn('Error parsing theme data from localStorage:', error);
    }
    return null;
  };

  useEffect(() => {
    // On component mount, set the theme based on the state
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Only save theme data if component is initialized and it's a user action
    if (isInitialized) {
      saveThemeData(darkMode, true); // true indicates this is a toggle action
    }
  }, [darkMode, isInitialized]);

  useEffect(() => {
    // On initial load, check localStorage or use default (dark)
    const savedThemeData = loadThemeData();
    if (savedThemeData) {
      console.log('Loading saved theme:', savedThemeData.theme);
      setDarkMode(savedThemeData.isDarkMode);
    } else {
      // Fallback to individual localStorage items
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode !== null) {
        console.log('Loading from individual localStorage:', savedDarkMode);
        setDarkMode(savedDarkMode === 'true');
      } else {
        // First time user - save initial data
        console.log('First time user - setting default dark mode');
        saveThemeData(true, false); // false indicates this is initial setup
      }
    }
    
    // Mark as initialized after loading
    setIsInitialized(true);
  }, []);

  return (
    <button
      aria-label="Toggle Dark Mode"
      type="button"
      className="fixed top-4 right-6 z-50 w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none"
      onClick={() => setDarkMode(!darkMode)}
    >
      {darkMode ? (
        <svg
          className="w-6 h-6 text-yellow-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-6 h-6 text-gray-900"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}
