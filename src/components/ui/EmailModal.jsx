import {
  Mail,
  SendHorizonal,
  User,
  X,
  Type,
  MessageSquare,
  Loader2,
} from "lucide-react";
import { sendEmail } from "../../services/chat/chatServices";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { time } from "framer-motion";

const EmailModal = ({ open, onClose, body }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [bodyContent, setBodyContent] = useState(body || "");

  useEffect(() => {
    if (body) {
      setBodyContent(body);
    }
  }, [body]);

  const handleSendEmail = async () => {
    console.log("Iniciando handleSendEmail");
    if (!to || !subject || !bodyContent) {
      console.log("Campos incompletos");
      toast.warn("Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);

    try {
      await sendEmail(to, subject, bodyContent);
      console.log("Correo enviado exitosamente");
      toast.success("Correo enviado exitosamente", {
        autoClose: 2000,
        position: "top-right",
      });

      timeout(() => {
        onClose();
      }, 2000); // Cierra el modal después de 2 segundos
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      toast.error("Error al enviar el correo. Por favor, inténtalo de nuevo.", {
        autoClose: 3000,
        position: "top-right",
      });
    } finally {
      setIsLoading(false);
      // Opcional: Resetear los campos solo si el modal no se cierra
      if (open) {
        setTo("");
        setSubject("");
        setBodyContent("");
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-parchment-950/70 backdrop-blur-sm px-4">
      <ToastContainer theme="colored" position="top-right" autoClose={3000} />
      <div className="bg-parchment-50 dark:bg-parchment-950 w-full max-w-lg rounded-2xl shadow-2xl border border-parchment-200 dark:border-parchment-800 p-6 animate-scale-in">
        <div className="flex items-center justify-between pb-4 border-b border-parchment-200 dark:border-parchment-800">
          <h2 className="flex items-center gap-2.5 text-xl font-bold text-parchment-800 dark:text-parchment-100">
            <Mail className="w-6 h-6 text-primary" />
            Nuevo Mensaje
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 rounded-full text-parchment-500 dark:text-parchment-400 hover:bg-parchment-100 dark:hover:bg-parchment-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-parchment-950 disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-4">
          <div className="relative">
            <User className="w-5 h-5 text-parchment-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="email"
              placeholder="Para"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              disabled={isLoading}
              className="w-full bg-greyPrimary dark:bg-parchment-900 border border-parchment-200 dark:border-parchment-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-parchment-700 dark:text-parchment-200 focus:outline-none focus:ring-2 focus:ring-primary transition disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>
          <div className="relative">
            <Type className="w-5 h-5 text-parchment-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Asunto"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isLoading}
              className="w-full bg-greyPrimary dark:bg-parchment-900 border border-parchment-200 dark:border-parchment-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-parchment-700 dark:text-parchment-200 focus:outline-none focus:ring-2 focus:ring-primary transition disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-parchment-400 absolute top-4 left-3" />
            <textarea
              placeholder="Escribe tu mensaje aquí..."
              value={bodyContent}
              onChange={(e) => setBodyContent(e.target.value)}
              disabled={isLoading}
              rows={8}
              className="w-full bg-greyPrimary dark:bg-parchment-900 border border-parchment-200 dark:border-parchment-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-parchment-700 dark:text-parchment-200 resize-none focus:outline-none focus:ring-2 focus:ring-primary transition disabled:cursor-not-allowed disabled:opacity-70"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-parchment-200 dark:border-parchment-800">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2 rounded-lg text-sm font-medium text-parchment-600 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-parchment-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-parchment-400 dark:focus:ring-offset-parchment-950 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancelar
          </button>
          <button
            onClick={handleSendEmail}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-brandy-punch-600 text-white font-medium px-5 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-parchment-950 disabled:bg-primary/70 disabled:cursor-not-allowed w-28"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <SendHorizonal className="w-4 h-4" />
                <span>Enviar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailModal;
