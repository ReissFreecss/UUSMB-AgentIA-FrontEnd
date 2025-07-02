import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../../services/auth/authService';

/**
 * RedirectIfAuthenticated component to prevent authenticated users from accessing login page
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if not authenticated
 * @returns {React.ReactNode} - Rendered component or redirect
 */
const RedirectIfAuthenticated = ({ children }) => {
  useEffect(() => {
    // Log authentication status for debugging
    if (isAuthenticated()) {
      //    console.log('User is already authenticated, redirecting to appropriate page');
    }
  }, []);

  // If user is authenticated, redirect to the appropriate page based on role
  if (isAuthenticated()) {
    const userRole = getUserRole();

    switch (userRole) {
      case 'ADMIN':
        return <Navigate to='/home' replace />;
      case 'EXTERNO':
        return <Navigate to='/homeExtern' replace />;
      case 'INTERNO':
        return <Navigate to='/homeIntern' replace />;
      default:
        return <Navigate to='/home' replace />;
    }
  }

  // If not authenticated, render the login page
  return children;
};

export default RedirectIfAuthenticated;
