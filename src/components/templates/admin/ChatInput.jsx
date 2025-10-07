import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, MailPlus } from "lucide-react";
import { uploadFile } from "../../../services/chat/chatServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDialog from "../../ui/ConfirmDialog";
import EmailModal from "../../ui/EmailModal";

// MODIFICADO: Añadimos 'onSend' y 'isLoading' desde las props
const ChatInput = ({ onSend, isLoading }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [fileLoading, setFileLoading] = useState(false);

  // Estados para controlar el diálogo de confirmación
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  // --- INICIO DE CAMBIOS ---

  // NUEVO: Estado para controlar el modo de envío por email
  const [isEmailModeOn, setEmailModeOn] = useState(false);

  // MODIFICADO: La prop 'onSend' ahora puede recibir un segundo argumento (isEmail)
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed === "" || isLoading) return;

    // Pasamos el mensaje y el estado del modo email al componente padre
    onSend(trimmed, isEmailModeOn);

    setInput(""); // Limpiamos el input

    // Opcional: Desactivar el modo email después de enviar.
    // Si quieres que se quede activo, comenta la siguiente línea.
    if (isEmailModeOn) {
      setEmailModeOn(false);
    }
  };

  // NUEVO: Función para activar/desactivar el modo email
  const handleEmailModeToggle = () => {
    setEmailModeOn((prev) => !prev);
    // Mostramos una notificación para que el usuario sepa qué modo está activo
    toast.info(
      !isEmailModeOn ? "Modo Email activado" : "Modo Email desactivado",
      { autoClose: 2000, position: "top-center" }
    );
  };

  // --- FIN DE CAMBIOS ---

  const handleFileButtonClick = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "text/plain"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Solo se permiten archivos .pdf y .txt", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setFileToUpload(file);
    setConfirmOpen(true);
  };

  const handleConfirmUpload = async () => {
    if (!fileToUpload) return;
    setFileLoading(true);
    const toastId = toast.loading("Subiendo archivo...", {
      position: "bottom-center",
    });
    try {
      await uploadFile(fileToUpload);
      toast.update(toastId, {
        render: "Archivo subido exitosamente",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Error al subir el archivo",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setFileLoading(false);
      setFileToUpload(null);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        160
      )}px`;
    }
  }, [input]);

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start w-full max-w-2xl mx-auto px-4 py-3"
      >
        {/* 👇 AQUÍ ESTÁ EL CAMBIO: de 'items-end' a 'items-center' */}
        <div className="flex items-center w-full gap-2">
          <div className="relative w-full">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".pdf,.txt"
              onChange={handleFileChange}
              disabled={isLoading || fileLoading}
            />
            <button
              type="button"
              className="absolute left-4 bottom-5 text-gray-400 hover:text-blue-500 transition-colors duration-200"
              onClick={handleFileButtonClick}
              aria-label="Adjuntar archivo"
              disabled={isLoading || fileLoading}
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <textarea
              ref={textareaRef}
              disabled={isLoading}
              className="w-full pl-12 pr-12 py-4 min-h-[60px] max-h-48 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-parchment-300 focus:border-transparent shadow-sm transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed resize-none overflow-y-auto"
              placeholder={
                isLoading
                  ? "Generando respuesta..."
                  : isEmailModeOn
                  ? "Escribe la instrucción para generar el email..."
                  : "Escribe tu mensaje aquí..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              rows="1"
            />

            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className={
                `absolute right-3 bottom-3 flex items-center justify-center h-9 w-9 rounded-full transition-all duration-300 ` +
                (isLoading || !input.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-yellow-400 text-white hover:bg-yellow-500 active:scale-95")
              }
              aria-label="Enviar mensaje"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <Send
                  className="w-5 h-5"
                  style={{ transform: "rotate(45deg)" }}
                />
              )}
            </button>
          </div>

          <button
            type="button"
            className={`flex-shrink-0 flex items-center justify-center h-9 w-9 rounded-full transition-all duration-300 active:scale-95 ${
              isEmailModeOn
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-400 hover:bg-blue-300 hover:text-blue-500"
            }`}
            aria-label={
              isEmailModeOn ? "Desactivar modo email" : "Activar modo email"
            }
            onClick={handleEmailModeToggle}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
            ) : (
              <MailPlus className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmUpload}
        fileName={fileToUpload ? fileToUpload.name : ""}
      />

      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default ChatInput;
