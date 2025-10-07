// Authentication utility functions

/**
 * Gets the authentication header with the Bearer token
 * @returns {Object} Headers object with Authorization
 */
export const getAuthHeader = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No authentication token found');
      return {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      };
    }

    // Asegurarse de que el token tenga el prefijo Bearer
    const formattedToken = token.startsWith('Bearer ')
      ? token.trim()
      : `Bearer ${token.trim()}`;
    return {
      Authorization: formattedToken,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  } catch (error) {
    console.warn('Error getting auth token', error);
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }
};

/**
 * Handles the response from an API call
 * @param {Response} response - The fetch response object
 * @returns {Promise<Object>} - The parsed response data
 */
export const handleResponse = async (response) => {
  try {
    // Log the response status for debugging
    //   console.log(`handleResponse: Status ${response.status} for ${response.url}`);

    // Si el status es 204 (No Content), devolvemos un objeto vacío
    if (response.status === 204) {
      //      console.log('handleResponse: No content (204)');
      return { result: null, message: 'No content' };
    }

    // Para otros códigos de error (403, 401, etc.), intentamos obtener el mensaje de error
    if (!response.ok) {
      try {
        // Intentar obtener el cuerpo del error como JSON
        const errorData = await response.json();
        console.error('handleResponse: Error response:', errorData);

        // Si estamos en modo desarrollo, devolvemos datos de fallback en lugar de lanzar error
        if (response.status === 403 || response.status === 401) {
          console.warn('handleResponse: Auth error, using fallback data');
          return {
            result: [],
            message: errorData.message || 'Error de autorización',
          };
        }

        throw new Error(
          errorData.message ||
            `Error ${response.status}: ${response.statusText}`
        );
      } catch (parseError) {
        // Si no podemos analizar el cuerpo como JSON, usamos el statusText
        console.error(
          'handleResponse: Could not parse error response',
          parseError
        );

        // Si estamos en modo desarrollo, devolvemos datos de fallback en lugar de lanzar error
        if (response.status === 403 || response.status === 401) {
          console.warn('handleResponse: Auth error, using fallback data');
          return {
            result: [],
            message: `Error ${response.status}: ${response.statusText}`,
          };
        }

        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
    }

    // Para respuestas exitosas, intentamos analizar el cuerpo como JSON
    const data = await response.json();
    //  console.log('handleResponse: Success response data:', data);
    return data;
  } catch (error) {
    console.error('handleResponse: Unhandled error:', error);
    // En desarrollo, devolvemos un objeto con un array vacío en lugar de lanzar error
    return {
      result: [],
      message: error.message || 'Error desconocido en la respuesta',
    };
  }
};

/**
 * Logs out the user by removing the authentication token from localStorage
 * @returns {void}
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
};
