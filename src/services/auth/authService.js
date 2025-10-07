import { API_URL } from '../../../constants.js';

/**
 * Login function to authenticate user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - Response from the server
 */

export const login = async (email, password) => {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Error en el inicio de sesión');
        }

        // Get the token directly from the response text
        const token = await response.text();
        if (!token) {
            throw new Error('Token no recibido del servidor');
        }

        // Format token and store it
        const formattedToken = token.trim();
        const tokenWithBearer = formattedToken.startsWith('Bearer ') ? formattedToken : `Bearer ${formattedToken}`;
        localStorage.setItem('token', tokenWithBearer);
        
        return decodeAndDisplayToken();
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

//Logout function to clear token and redirect
export const logout = () => {
    localStorage.removeItem('token');
    // Redirect to login page
    window.location.href = '/';
};

/**
 * Function to check if user is authenticated
 * @returns {boolean} - True if user is authenticated
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        return false;
    }
    
    // Verificar que el token sea válido y no haya expirado
    if (!checkTokenExpiry(token)) {
        return false;
    }
    
    // Verificar que el usuario tenga estado activo
    try {
        const tokenPayload = decodeAndDisplayToken();
        if (tokenPayload && tokenPayload.status === false) {
            console.warn('User account is inactive');
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error checking user status:', error);
        return false;
    }
};

/**
 * Function to get user role from token
 * @returns {string|null} - User role or null if not authenticated
 */
export const getUserRole = () => {
    const tokenPayload = decodeAndDisplayToken();
    return tokenPayload ? tokenPayload.role : null;
};

/**
 * Function to check if user has specific role
 * @param {string|string[]} roles - Role or array of roles to check
 * @returns {boolean} - True if user has the role
 */
export const hasRole = (roles) => {
    const userRole = getUserRole();
    if (!userRole) return false;
    
    if (Array.isArray(roles)) {
        return roles.includes(userRole);
    }
    return roles === userRole;
};

/**
 * Function to check if token exists and is valid
 * @returns {boolean} - True if token is valid
 */
export const checkToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('No token found in localStorage');
        return false;
    }
    
    // Basic check - verify the expiration of the token
    return checkTokenExpiry(token);
};

/**
 * Function to check if the token has expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is valid
 */
export const checkTokenExpiry = (token) => {
    if (!token) return false;
    
    try {
        // Decode the token (basic check without signature verification)
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const payload = JSON.parse(jsonPayload);
        const expiration = payload.exp * 1000;  // Convert exp to milliseconds
        const currentTime = new Date().getTime();
        return currentTime < expiration;  // If current time is less than expiration time
    } catch (error) {
        console.error('Error checking token expiry:', error);
        return false;
    }
};

/**
 * Function to get Authorization header with token
 * @returns {Object} - Headers object with Authorization
 */
export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('No authentication token found');
    }
    // Ensure the token has the 'Bearer ' prefix
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    return {
        'Authorization': formattedToken,
        'Content-Type': 'application/json',
    };
};


/**
 * Function to handle API request with token and expiration check
 * @param {string} url - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise} - Response from the server
 */
export const apiRequestWithToken = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    
    if (!checkTokenExpiry(token)) {
        alert('El token ha expirado. Por favor, inicia sesión nuevamente.');
        window.location.href = '/';
        return;
    }

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': token.startsWith('Bearer ') ? token : `Bearer ${token}`,  // Ensure proper Bearer format
        },
        credentials: 'include',
        mode: 'cors',
    });

    if (response.status === 401) {
        alert('El token ha expirado. Por favor, inicia sesión nuevamente.');
        window.location.href = '/';
    }

    return response;
};

/**
 * Function to decode and display token information
 * @returns {Object|null} - Decoded token payload or null if error
 */
export const decodeAndDisplayToken = () => {
    // Intentar obtener el token del localStorage
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('No token found in localStorage');
        return null;
    }
    
    try {
        // Remove 'Bearer ' prefix if present
        const tokenWithoutBearer = token.startsWith('Bearer ') ? token.slice(7) : token;
        
        // Decode the token
        return decodeToken(tokenWithoutBearer);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

/**
 * Helper function to decode a JWT token
 * @param {string} token - JWT token to decode
 * @returns {Object} - Decoded token payload
 */
const decodeToken = (token) => {
  try {
    const tokenWithoutBearer = token.startsWith('Bearer ')
      ? token.slice(7)
      : token;
    const base64Url = tokenWithoutBearer.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

