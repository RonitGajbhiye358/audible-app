// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

/**
 * Safely retrieves user data from localStorage
 * @returns {Object|null} Parsed user object or null if not found/invalid
 */
const getPersistedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    console.error('Failed to parse user data from localStorage:', error);
    return null;
  }
};

// Initial state for auth slice
const initialState = {
  user: getPersistedUser(),          // User object from localStorage
  token: localStorage.getItem('token'), // JWT token from localStorage
  userRole: localStorage.getItem('userRole'), // User role from localStorage
  isAuthenticated: !!localStorage.getItem('token'), // Auth status based on token presence
};

/**
 * Redux slice for authentication management
 * Handles user credentials, authentication state, and localStorage persistence
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Sets user credentials in state and localStorage
     * @param {Object} state - Current Redux state
     * @param {Object} action - Payload containing { token, user, userRole }
     */
    setCredentials: (state, action) => {
      const { token, user, userRole } = action.payload;
      
      // Update Redux state
      state.user = user;
      state.token = token;
      state.userRole = userRole;
      state.isAuthenticated = !!token;

      // Persist to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', userRole);
      
      console.log("Authentication credentials set for user:", user);
    },
    
    /**
     * Clears user credentials from state and localStorage
     * @param {Object} state - Current Redux state 
     */
    logout: (state) => {
      // Clear Redux state
      state.user = null;
      state.token = null;
      state.userRole = null;
      state.isAuthenticated = false;
      
      // Remove from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      
      console.log("User logged out, credentials cleared");
    },
  },
});

/**
 * Initializes authentication state from localStorage
 * @returns {Function} Redux thunk function
 */
export const initializeAuth = () => (dispatch) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const user = getPersistedUser();

  // If token exists, restore authentication state
  if (token) {
    dispatch(setCredentials({ token, user, userRole }));
    console.log("Auth state initialized from localStorage");
  }
};

// Action creators
export const { setCredentials, logout } = authSlice.actions;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentUserRole = (state) => state.auth.userRole;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;

export default authSlice.reducer;