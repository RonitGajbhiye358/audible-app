// src/components/PrivateRoute.jsx
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { selectCurrentUserRole, selectIsAuthenticated } from '../app/authSlice';

export const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" />;
};


// PublicRoute.jsx (for non-authenticated users)
export const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/" replace />;
}; 


export const AdminRoute = ({ children }) => {
  const userRole = useSelector(selectCurrentUserRole);
  return userRole === 'ADMIN' ? children : <Navigate to="/" replace />;
};

