import { useState, useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { uploadFileSisbi } from "../../../services/chat/chatServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmDialog from "../../ui/ConfirmDialog"; 

const InputSisbi = ({ onSend, isLoading }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const [fileLoading, setFileLoading] = useState(false);

  // Estados para controlar el diálogo de confirmación
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed === "" || isLoading) return;
    onSend(trimmed);
    setInput("");
  };

  const handleFileButtonClick = () => {
    if (!isLoading && fileInputRef.current) {
      fileInputRef.current.value = null;
      fileInputRef.current.click();
    }
  };

  // 1. Modificado: Valida el archivo y abre el diálogo de confirmación
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

    // Si el archivo es válido, guárdalo y abre el modal para confirmar
    setFileToUpload(file);
    setConfirmOpen(true);
  };

  // 2. Nuevo: Esta función se ejecuta cuando el usuario confirma en el diálogo
  const handleConfirmUpload = async () => {
    if (!fileToUpload) return;

    setFileLoading(true);
    const toastId = toast.loading("Subiendo archivo...", {
      position: "bottom-center",
    });

    try {
      await uploadFileSisbi(fileToUpload);
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
      setFileToUpload(null); // Limpia el archivo después de la subida
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
        className="flex items-start w-full max-w-2xl mx-auto px-4 py-3"
      >
        <div className="relative flex-1">
          {/* Input file oculto */}
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".pdf,.txt"
            onChange={handleFileChange}
            disabled={isLoading || fileLoading}
          />
          {/* Botón para adjuntar archivos */}
          <button
            type="button"
            className="absolute left-4 bottom-5 text-gray-400 hover:text-blue-500 transition-colors duration-200"
            onClick={handleFileButtonClick}
            aria-label="Adjuntar archivo"
            disabled={isLoading || fileLoading}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          {/* Área de texto principal */}
          <textarea
            ref={textareaRef}
            disabled={isLoading}
            className="w-full pl-12 pr-12 py-4 min-h-[60px] max-h-48 rounded-2xl border-2 border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-parchment-300 focus:border-transparent shadow-sm transition-all duration-200 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed resize-none overflow-y-auto"
            placeholder={
              isLoading
                ? "Generando respuesta..."
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

          {/* Botón de envío */}
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={
              `absolute right-3 bottom-3 flex items-center justify-center h-9 w-9 rounded-full transition-all duration-300 ` +
              (isLoading || !input.trim()
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-parchment-200 text-yellow-400- hover:bg-parchment-300 active:scale-95")
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
      </form>

      {/* 3. Renderiza el diálogo de confirmación aquí */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmUpload}
        fileName={fileToUpload ? fileToUpload.name : ""}
      />

      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default InputSisbi;
