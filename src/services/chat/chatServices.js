import { API_URL } from '../../../constants';
import { handleResponse, getAuthHeader } from '../utils/authUtils';

// Function to get a ia chat
export const responseChat = async (message) => {
  try {
    if (!message) throw new Error('Message cannot be empty');

    const response = await fetch(`${API_URL}/n8n/message`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        chatInput: message,
      })
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error al obtener la respuesta del chat:', error);
    throw error; // Opcional: relanza el error si quieres manejarlo fuera de esta función
  }
};

