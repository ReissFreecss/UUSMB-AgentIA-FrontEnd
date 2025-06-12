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
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center w-full max-w-2xl mx-auto px-4 py-3 rounded-2xl"
    >
      <div className="relative flex-1">
        <textarea
          ref={textareaRef}
          disabled={isLoading}
          className="w-full px-5 py-3 pr-12 max-h-40 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-gray-800 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed overflow-y-auto resize-none"
          placeholder={isLoading ? "Esperando respuesta..." : "Escribe tu mensaje..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ minHeight: '56px' }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
            isLoading ? "text-gray-400 cursor-not-allowed" : "text-yellow-500 hover:text-yellow-600"
          }`}
        >
          <Send className="w-5 h-5" style={{ transform: 'rotate(45deg)' }} />
        </button>
      </div>
    </form>
  );
};

export default ChatInput;
