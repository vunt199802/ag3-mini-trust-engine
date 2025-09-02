// Storage utility functions for theme and user data management

export interface ThemeData {
  isDarkMode: boolean;
  theme: 'light' | 'dark';
  lastUpdated: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  sessionId: string;
  toggleCount: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  lastVisit: string;
  visitCount: number;
  preferredLanguage: string;
  timezone: string;
}

// Storage keys
export const STORAGE_KEYS = {
  THEME_DATA: 'themeData',
  DARK_MODE: 'darkMode',
  THEME: 'theme',
  LAST_THEME_UPDATE: 'lastThemeUpdate',
  SESSION_ID: 'sessionId',
  TOGGLE_COUNT: 'toggleCount',
  USER_PREFERENCES: 'userPreferences',
  VISIT_COUNT: 'visitCount',
  LAST_VISIT: 'lastVisit'
} as const;

// Get theme data from localStorage
export const getThemeData = (): ThemeData | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.THEME_DATA);
    if (savedData) {
      return JSON.parse(savedData) as ThemeData;
    }
  } catch (error) {
    console.warn('Error parsing theme data from localStorage:', error);
  }
  return null;
};

// Get user preferences from localStorage
export const getUserPreferences = (): UserPreferences | null => {
  try {
    const savedData = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (savedData) {
      return JSON.parse(savedData) as UserPreferences;
    }
  } catch (error) {
    console.warn('Error parsing user preferences from localStorage:', error);
  }
  return null;
};

// Save user preferences to localStorage
export const saveUserPreferences = (preferences: Partial<UserPreferences>): void => {
  try {
    const existingPrefs = getUserPreferences() || {
      theme: 'dark',
      lastVisit: new Date().toISOString(),
      visitCount: 0,
      preferredLanguage: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    const updatedPrefs: UserPreferences = {
      ...existingPrefs,
      ...preferences,
      lastVisit: new Date().toISOString(),
      visitCount: existingPrefs.visitCount + 1
    };

    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedPrefs));
  } catch (error) {
    console.warn('Error saving user preferences to localStorage:', error);
  }
};

// Get all stored data for debugging/analytics
export const getAllStoredData = () => {
  const themeData = getThemeData();
  const userPreferences = getUserPreferences();
  
  return {
    themeData,
    userPreferences,
    rawStorage: {
      darkMode: localStorage.getItem(STORAGE_KEYS.DARK_MODE),
      theme: localStorage.getItem(STORAGE_KEYS.THEME),
      lastThemeUpdate: localStorage.getItem(STORAGE_KEYS.LAST_THEME_UPDATE),
      sessionId: localStorage.getItem(STORAGE_KEYS.SESSION_ID),
      toggleCount: localStorage.getItem(STORAGE_KEYS.TOGGLE_COUNT),
      visitCount: localStorage.getItem(STORAGE_KEYS.VISIT_COUNT),
      lastVisit: localStorage.getItem(STORAGE_KEYS.LAST_VISIT)
    }
  };
};

// Clear all stored data (useful for testing or reset)
export const clearAllStoredData = (): void => {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
};

// Check if user is first-time visitor
export const isFirstTimeVisitor = (): boolean => {
  return !localStorage.getItem(STORAGE_KEYS.SESSION_ID);
};

// Get visit statistics
export const getVisitStats = () => {
  const userPrefs = getUserPreferences();
  const themeData = getThemeData();
  
  return {
    visitCount: userPrefs?.visitCount || 0,
    lastVisit: userPrefs?.lastVisit || null,
    themeToggleCount: themeData?.toggleCount || 0,
    currentTheme: themeData?.theme || 'dark',
    sessionId: themeData?.sessionId || null,
    isFirstTime: isFirstTimeVisitor()
  };
};
