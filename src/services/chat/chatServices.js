import { API_URL } from '../../../constants';
import { handleResponse, getAuthHeader } from '../utils/authUtils';

// Function to get a ia chat
export const responseChat = async (message, id) => {
  try {
    if (!message) throw new Error('Message cannot be empty');
    if (!id) throw new Error('Session ID cannot be null');
    const response = await fetch(`${API_URL}/n8n/message`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        chatInput: message,
        sessionId: String(id),
      })
    });

    return await handleResponse(response);
  } catch (error) {
    console.error('Error al obtener la respuesta del chat:', error);
    throw error; 
  }
};

