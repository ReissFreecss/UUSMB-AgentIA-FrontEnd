import { API_URL } from "../../../constants";
import { handleResponse, getAuthHeader } from "../utils/authUtils";

// Function to get a ia chat
export const responseChat = async (message, id) => {
  try {
    if (!message) throw new Error("Message cannot be empty");
    if (!id) throw new Error("Session ID cannot be null");
    const response = await fetch(`${API_URL}/n8n/message`, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify({
        chatInput: message,
        sessionId: String(id),
      }),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Error al obtener la respuesta del chat:", error);
    throw error;
  }
};

// Function to upload a file (only allowed .pdf, .docx, .txt)
export const uploadFile = async (file) => {
  if (!file) throw new Error("El archivo no puede ser nulo");

  const formData = new FormData();
  formData.append("file", file);

  const authHeader = getAuthHeader(); 
  delete authHeader["Content-Type"];

  try {
    const response = await fetch(`${API_URL}/n8n/file`, {
      method: "POST",
      headers: authHeader,
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error al subir el archivo: ${response.status} ${response.statusText} - ${errorText}`
      );
    }
    return handleResponse(response);
  } catch (error) {
    console.error("Error al subir el archivo:", error);
    // Vuelve a lanzar el error para que el bloque catch en handleFileChange lo reciba
    throw error;
  }
};
