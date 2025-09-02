'use client';

import { useEffect } from 'react';

export default function ThemeScript() {
  useEffect(() => {
    // Check for comprehensive theme data first
    const savedThemeData = localStorage.getItem('themeData');
    let shouldUseDarkMode = true; // Default to dark mode
    
    if (savedThemeData) {
      try {
        const themeData = JSON.parse(savedThemeData);
        shouldUseDarkMode = themeData.isDarkMode;
        console.log('Theme script: Loading from themeData:', themeData.theme);
      } catch (error) {
        console.warn('Theme script: Error parsing themeData, falling back to individual keys');
      }
    } else {
      // Fallback to individual localStorage items
      const savedDarkMode = localStorage.getItem('darkMode');
      if (savedDarkMode !== null) {
        shouldUseDarkMode = savedDarkMode === 'true';
        console.log('Theme script: Loading from darkMode:', savedDarkMode);
      } else {
        console.log('Theme script: No saved theme, using default dark mode');
      }
    }
    
    // Apply the theme
    if (shouldUseDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return null;
}
