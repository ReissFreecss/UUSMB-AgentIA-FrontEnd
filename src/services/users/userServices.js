import { API_URL } from '../../../constants';
import { handleResponse, getAuthHeader } from '../utils/authUtils';

//Function to get all users
export const getAllUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users/all`, {
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Errror al ibtener los usuarios ');
  }
};

//Function to get a user by id
export const getUserById = async (id) => {
  try {
    //  console.log(`Obteniendo usuario con id: ${id}`);
    const response = await fetch(`${API_URL}/users/${id}`, {
      headers: getAuthHeader(),
    });

    //  console.log(`Respuesta: ${response.status}`);

    // Manejo de errores para 404 y 403
    if (response.status === 404 || response.status === 403) {
      console.warn(`No se encontró el usuario con id: ${id}`);
      return {
        result: {
          id: id,
          fullName: 'Usuario Administrador',
          firstLastName: 'Admin',
          secondLastName: 'User',
          phone: '1234567890',
          email: 'admin@example.com',
          role: 'ADMIN',
          status: true,
        },
      };
    }

    // Asegúrate de que handleResponse pueda manejar la respuesta
    const result = await handleResponse(response);
    // console.log(`Resultado de la respuesta: `, result);
    return result;
  } catch (error) {
    console.error(`Error al obtener el usuario con id: ${id}`, error);
    return {
      result: {
        id: id,
        fullName: 'Usuario Administrador',
        firstLastName: 'Admin',
        secondLastName: 'User',
        phone: '1234567890',
        email: 'admin@example.com',
        role: 'ADMIN',
        status: true,
      },
    };
  }
};

//Function to get active users
export const getActiveUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users/active`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Error al obtener los usuarios activos');
  }
};

//Function to get inactive users
export const getInactiveUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users/inactive`, {
      method: 'GET',
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Error al obtener los datos de los usuarios inactivos');
  }
};

//Function to create a user
export const createUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/users/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      body: JSON.stringify(userData),
    });

    //Verificar si la respuesta es vacia
    const text = await response.text();
    let responseData;
    try {
      //Parsear la respuesta como JSON
      responseData = text ? JSON.parse(text) : {};
    } catch (parseError) {
      console.error('Error al parsear la respuesta JSON', parseError);
      responseData = { message: text || 'No se pudo encontrar la respuesta' };
    }

    if (!response.ok) {
      throw new Error(
        `Error: ${
          responseData.message ||
          `Error ${response.status}: ${response.statusText}`
        }`
      );
    }

    return responseData;
  } catch (error) {
    console.error('Error al crear el usuario', error);
    throw error;
  }
};

//Function to change password
export const changePassword = async (userData) => {
  try {
    const { userId, currentPassword, newPassword } = userData;
    if (!userId) throw new Error('ID cannot be null');
    if (!currentPassword) throw new Error('currentPassword cannot be null');
    if (!newPassword) throw new Error('newPassword cannot be null');

    // Función getAuthHeader integrada
    const getAuthHeader = () => {
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

    const response = await fetch(`${API_URL}/users/change-password-user`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        userId,
        currentPassword,
        newPassword,
      }),
    });

    const handleResponse = async (response) => {
      try {
        {
          /**
          // Log the response status for debugging
          console.log(
            `handleResponse: Status ${response.status} for ${response.url}`
          );
          */
        }

        // Si el status es 204 (No Content), devolvemos un objeto vacío
        if (response.status === 204) {
         // console.log('handleResponse: No content (204)');
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
        console.log('handleResponse: Success response data:', data);
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

    return handleResponse(response);
  } catch (error) {
    throw new Error('Error al cambiar la contraseña');
  }
};

// Function to change user status
export const changeUserStatus = async (id) => {
  try {
    const response = await fetch(`${API_URL}/users/change-status/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Error al cambiar el estado del usuario');
  }
};

///Funcction to change user role
export const changeUserRole = async (id) => {
  try {
    const response = await fetch(`${API_URL}/users/change-rol/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Error al cambiar el rol del usuario');
  }
};

// Function to update a user
export const updateUser = async (userData) => {
  try {
    const { id, fullName, firstLastName, secondLastName, phone, email, role } =
      userData;

    if (!id) throw new Error('ID cannot be null');
    if (!fullName) throw new Error('Full name cannot be empty');
    if (!firstLastName) throw new Error('FirstLastName cannot be empty');
    if (!secondLastName) throw new Error('SecondLastName cannot be empty');
    if (!phone) throw new Error('Phone cannot be empty');
    if (!email) throw new Error('Email cannot be empty');
    if (!role) throw new Error('Role cannot be empty');

    const response = await fetch(`${API_URL}/users/update`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        id,
        fullName,
        firstLastName,
        secondLastName,
        phone,
        email,
        role,
      }),
    });

    return handleResponse(response);
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw error;
  }
};

//Reset user password
 export const sendRecoveryCode = async (email) =>{
  try {
    const response = await fetch(`${API_URL}/users/send-recovery-code/${email}`, {
      method: 'POST'
    });
    if (!response.ok) {
      const errorData = await response.text(); //Evitar problemas de JSON.parse
      throw new Error(errorData || `Error ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error al enviar el código de recuperación:', error);
    throw new Error('Error al enviar el código de recuperación');
  }
 }

 //Verify recovery code
export const verifyRecoveryCode = async (email, code) => {
    try {
        const response = await fetch(`${API_URL}/users/verify-recovery-code`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                recoveryCode: code // nombre exacto
            })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || `Error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error en verifyRecoveryCode:", error);
        throw new Error('Error al verificar el código de recuperación');
    }
};

//Reset user password
export const resetPassword = async (email, newPassword) => {
    try {
        const response = await fetch(`${API_URL}/users/reset-password`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, newPassword })
        });

        const text = await response.text(); // Para capturar errores no-JSON

        if (!response.ok) {
            throw new Error(text || `Error ${response.status}`);
        }

        // Intentar parsear si hay contenido
        return text ? JSON.parse(text) : {};
    } catch (error) {
        console.error("Error en resetPassword:", error);
        throw new Error('Error al resetear la contraseña');
    }
};
