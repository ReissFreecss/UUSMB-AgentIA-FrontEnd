import { useState, useEffect, useRef } from 'react';
import AsideBarExtern from '../../ui/AsideBarExtern';
import ChatInput from './ChatInput';
import ChatMessage from './Chatmessage';
import { responseChat } from '../../../services/chat/chatServices';
import { decodeAndDisplayToken } from "../../../services/auth/authService.js";



const HomeExtern = () => {
  const [messages, setMessages] = useState([]);
  const [isAsideExpanded, setIsAsideExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
        });
      });
    }
  }, [messages]);

  const handleSend = async (text) => {
  if (!text.trim()) return;

  setMessages((prevMessages) => [
    ...prevMessages,
    { content: text, isUser: true },
  ]);
  setIsLoading(true);

  try {
    const tokenData = decodeAndDisplayToken();
    const sessionId = tokenData?.id || localStorage.getItem("userId");

    if (!sessionId) throw new Error("No session ID available");

    const chatResponse = await responseChat(text, sessionId);

    if (chatResponse?.text) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: chatResponse.text, isUser: false },
      ]);
    }
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
  <div className='flex min-h-screen w-full bg-greyPrimary'>
    <aside className='h-screen sticky top-0 z-20'>
      <AsideBarExtern />
    </aside>

    <main
      className={`flex flex-col flex-1 bg-greyPrimary transition-all duration-300 ease-in-out ${
        isAsideExpanded ? 'ml-[16em]' : 'ml-[4em]'
      } overflow-hidden h-screen relative`}
    >
      <div
        className={`flex-1 flex flex-col overflow-y-auto p-4 md:p-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 ${
          messages.length === 0 ? 'items-center justify-center' : 'items-start justify-start'
        }`}
      >
        {messages.length === 0 ? (
          <div className='flex flex-col items-center text-center w-full max-w-2xl'>
            <h1 className='text-2xl md:text-3xl font-semibold text-gray-700 mb-8'>
              ¿En qué te puedo ayudar hoy?
            </h1>
            <div className='w-full px-2'>
              <ChatInput onSend={handleSend} isLoading={isLoading} />
            </div>
          </div>
        ) : (
          <div className='w-full max-w-4xl space-y-4 pb-4 mt-4 md:mt-10 mx-auto'>
            {messages.map((msg, index) => (
              <ChatMessage
                key={index}
                content={msg.content}
                isUser={msg.isUser}
              />
            ))}
            {isLoading && <ChatMessage content='. . .' isUser={false} />}
            <div ref={messagesEndRef} className='h-0' />
          </div>
        )}
      </div>

      {messages.length > 0 && (
        <div className='p-4 bg-greyPrimary sticky bottom-0 w-full z-10 '>
          <div className='max-w-4xl mx-auto'>
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </div>
      )}
    </main>
  </div>
);
};


export default HomeExtern;