// src/utils/storage.ts

interface UserData {
  userId: string;
  fullName: string;
  mobileNumber: string | null;
  email: string;
}

interface AuthData {
  user: UserData;
  token: string;
}

const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  USER_ID: 'userId',
  USER_NAME: 'userName',
  USER_EMAIL: 'userEmail',
  USER_MOBILE: 'userMobile',
  AUTH_DATA: 'authData',
} as const;

// Generic get/set/remove functions
export const storage = {
  // Generic methods
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  },

  get: <T>(key: string, defaultValue?: T): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue || null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage key "${key}":`, error);
      return defaultValue || null;
    }
  },

  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage key "${key}":`, error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  // Auth specific methods
  setAuthData: (authData: AuthData): void => {
    const { user, token } = authData;
    
    // Store token
    storage.set(STORAGE_KEYS.TOKEN, token);
    
    // Store full user object
    storage.set(STORAGE_KEYS.USER, user);
    
    // Store individual user fields for easy access
    storage.set(STORAGE_KEYS.USER_ID, user.userId);
    storage.set(STORAGE_KEYS.USER_NAME, user.fullName);
    storage.set(STORAGE_KEYS.USER_EMAIL, user.email);
    storage.set(STORAGE_KEYS.USER_MOBILE, user.mobileNumber);
    
    // Store complete auth data
    storage.set(STORAGE_KEYS.AUTH_DATA, authData);
  },

  getAuthData: (): AuthData | null => {
    return storage.get<AuthData>(STORAGE_KEYS.AUTH_DATA);
  },

  getToken: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.TOKEN);
  },

  getUser: (): UserData | null => {
    return storage.get<UserData>(STORAGE_KEYS.USER);
  },

  getUserId: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.USER_ID);
  },

  getUserName: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.USER_NAME);
  },

  getUserEmail: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.USER_EMAIL);
  },

  getUserMobile: (): string | null => {
    return storage.get<string>(STORAGE_KEYS.USER_MOBILE);
  },

  isAuthenticated: (): boolean => {
    const token = storage.getToken();
    return !!token && token.length > 0;
  },

  clearAuthData: (): void => {
    // Remove all auth-related data
    Object.values(STORAGE_KEYS).forEach(key => {
      storage.remove(key);
    });
  },

  // Utility to check if token is expired
  isTokenExpired: (): boolean => {
    try {
      const token = storage.getToken();
      if (!token) return true;

      // Decode JWT token to check expiration
      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      
      if (decoded.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
      }
      return false;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  },

  // Get token expiry time
  getTokenExpiry: (): Date | null => {
    try {
      const token = storage.getToken();
      if (!token) return null;

      const payload = token.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      
      if (decoded.exp) {
        return new Date(decoded.exp * 1000);
      }
      return null;
    } catch (error) {
      console.error('Error getting token expiry:', error);
      return null;
    }
  },
};

// Export individual functions for convenience
export const {
  set: setStorageItem,
  get: getStorageItem,
  remove: removeStorageItem,
  clear: clearStorage,
  setAuthData,
  getAuthData,
  getToken,
  getUser,
  getUserId,
  getUserName,
  getUserEmail,
  getUserMobile,
  isAuthenticated,
  clearAuthData,
  isTokenExpired,
  getTokenExpiry,
} = storage;

// Default export for convenience
export default storage;