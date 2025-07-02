import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

const ChatInput = ({ onSend, isLoading }) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed === "" || isLoading) return;
    onSend(trimmed);
    setInput("");
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
    <form
      onSubmit={handleSubmit}
      className="flex items-start w-full max-w-2xl mx-auto px-4 py-3" // Alineación al inicio para mejor consistencia vertical
    >
      <div className="relative flex-1">
        {/* Botón para adjuntar archivos */}

        {/* Área de texto principal */}
        <textarea
          ref={textareaRef}
          disabled={isLoading}
          className="
          w-full pl-12 pr-12 py-4 
          min-h-[60px] max-h-48    
          rounded-2xl border-2 border-gray-200 
          bg-gray-50               
          text-gray-800 placeholder-gray-400
          focus:outline-none focus:ring-2 focus:ring-parchment-300 focus:border-transparent 
          shadow-sm transition-all duration-200 ease-in-out 
          disabled:opacity-60 disabled:cursor-not-allowed
          resize-none overflow-y-auto
        "
          placeholder={
            isLoading ? "Generando respuesta..." : "Escribe tu mensaje aquí..."
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
          className="
          absolute right-3 bottom-4
          flex items-center justify-center h-9 w-9
          rounded-full transition-all duration-300
          // Estilos condicionales mejorados para el botón
          ${
            isLoading || !input.trim()
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-parchment-200 text-yellow-400- hover:bg-parchment-300 active:scale-95'
          }
        "
          aria-label="Enviar mensaje"
        >
          {isLoading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <Send className="w-5 h-5" style={{ transform: "rotate(45deg)" }} />
          )}
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
