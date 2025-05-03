// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
// Helper function to safely get user from localStorage
const getPersistedUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    return null;
  }
};

const initialState = {
  user: getPersistedUser(),
  token: localStorage.getItem('token'),
  userRole: localStorage.getItem('userRole'),
  isAuthenticated: !!localStorage.getItem('token'),
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { token, user, userRole } = action.payload;
      state.user = user;
      state.token = token;
      state.userRole = userRole;
      state.isAuthenticated = !!token;

      // Persist all auth data
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('userRole', userRole);
      
      localStorage.setItem('token', token);
      console.log("User set in auth:", user);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userRole = null
      state.isAuthenticated = false;
      // Clear all auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
    },
  },
});


// Enhanced initializeAuth
export const initializeAuth = () => (dispatch) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');
  const user = getPersistedUser();


  if (token) {
    dispatch(setCredentials({ token, user, userRole }));
  }
};

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentUserRole = (state) => state.auth.userRole;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
