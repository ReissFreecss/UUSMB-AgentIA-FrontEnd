import { useState, useEffect, useRef } from "react";
import AsideBar from "../../ui/AsideBar";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
// NUEVO: Importa el componente del modal de email
import EmailModal from "../../ui/EmailModal"; 
import { responseChat } from "../../../services/chat/chatServices";
import { decodeAndDisplayToken } from "../../../services/auth/authService.js";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [isAsideExpanded, setIsAsideExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- INICIO DE CAMBIOS ---

  // NUEVO: Estados para controlar el modal y su contenido
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  const [emailModalContent, setEmailModalContent] = useState("");

  // --- FIN DE CAMBIOS ---

  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      });
    }
  }, [messages]);

  // MODIFICADO: La función ahora acepta 'isEmailMode'
  const handleSend = async (text, isEmailMode = false) => {
    if (!text.trim()) return;

    // Esto se hace en ambos casos: mostrar el mensaje del usuario en el chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { content: text, isUser: true },
    ]);
    setIsLoading(true);

    try {
      const tokenData = decodeAndDisplayToken();
      const sessionId = tokenData?.id || localStorage.getItem("userId");

      if (!sessionId) throw new Error("No session ID available");

      // La llamada a la API se hace en ambos casos
      const chatResponse = await responseChat(text, sessionId);

      // --- INICIO DE LÓGICA CONDICIONAL ---
      if (chatResponse?.text) {
        if (isEmailMode) {
          // MODO EMAIL: No se añade al chat. Se guarda el contenido y se abre el modal.
          setEmailModalContent(chatResponse.text);
          setEmailModalOpen(true);
        } else {
          // MODO CHAT NORMAL: Se añade la respuesta de la IA al historial del chat.
          setMessages((prevMessages) => [
            ...prevMessages,
            { content: chatResponse.text, isUser: false },
          ]);
        }
      }
      // --- FIN DE LÓGICA CONDICIONAL ---

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          content: "Lo siento, hubo un error al procesar tu mensaje.",
          isUser: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen w-full bg-greyPrimary">
      <aside className="h-screen sticky top-0 z-20">
        <AsideBar />
      </aside>

      <main
        className={`flex flex-col flex-1 bg-greyPrimary transition-all duration-300 ease-in-out ${
          isAsideExpanded ? "ml-[16em]" : "ml-[4em]"
        } overflow-hidden h-screen relative`}
      >
        <div
          className={`flex-1 flex flex-col overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 ${
            messages.length === 0
              ? "items-center justify-center"
              : "items-start justify-start"
          }`}
        >
          {messages.length === 0 ? (
            <div className="flex flex-col items-center text-center w-full max-w-2xl">
              <h1 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-8">
                ¿En qué te puedo ayudar hoy?
              </h1>
              <div className="w-full px-2">
                {/* El componente ChatInput ya está listo para funcionar con handleSend */}
                <ChatInput onSend={handleSend} isLoading={isLoading} />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-4xl space-y-4 pb-4 mt-4 md:mt-10 mx-auto">
              {messages.map((msg, index) => (
                <ChatMessage
                  key={index}
                  content={msg.content}
                  isUser={msg.isUser}
                />
              ))}
              {isLoading && <ChatMessage content=". . ." isUser={false} />}
              <div ref={messagesEndRef} className="h-0" />
            </div>
          )}
        </div>

        {messages.length > 0 && (
          <div className="p-4 bg-greyPrimary sticky bottom-0 w-full z-10 ">
            <div className="max-w-4xl mx-auto">
              {/* El componente ChatInput ya está listo para funcionar con handleSend */}
              <ChatInput onSend={handleSend} isLoading={isLoading} />
            </div>
          </div>
        )}
      </main>

      {/* NUEVO: Renderiza el modal aquí. Estará oculto por defecto. */}
      <EmailModal
        open={isEmailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        body={emailModalContent}
      />
    </div>
  );
};

export default Home;