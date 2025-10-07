import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../../services/auth/authService.js';

/**
 * ProtectedRoute component to handle role-based access control
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string|string[]} props.allowedRoles - Roles that are allowed to access this route
 * @returns {React.ReactNode} - Rendered component or redirect
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();

  useEffect(() => {
    
    if (!isAuthenticated()) {
      console.warn('User is not authenticated, redirecting to login');
    } else if (allowedRoles && !hasRole(allowedRoles)) {
      console.warn(`User does not have required role(s): ${allowedRoles}`);
    }
  }, [location.pathname, allowedRoles]);

  
  if (!isAuthenticated()) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  
  if (allowedRoles && !hasRole(allowedRoles)) {
    
    const userRole = localStorage.getItem('token') ? 
      JSON.parse(atob(localStorage.getItem('token').split('.')[1])).role : null;
    
    if (userRole === 'ADMIN') {
      return <Navigate to="/home" replace />;
    } else if (userRole === 'INTERNO') {
      return <Navigate to="/homeIntern" replace />;
    } else if (userRole === 'EXTERNO') {
      return <Navigate to="/homeExtern" replace />;
    } 
    else {   
      return <Navigate to="/" replace />;
    }
  }
  return children;
};

export default ProtectedRoute;
