import { Bot, User } from "lucide-react";

const ChatMessage = ({ content, isUser }) => {
  return (
    <div className={`flex items-start gap-3 mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="p-2 bg-brandy-punch-100 rounded-full">
          <Bot className="w-5 h-5 text-brandy-punch-600" />
        </div>
      )}

      <div
        className={`p-4 rounded-2xl max-w-md shadow-md text-sm leading-relaxed ${
          isUser
            ? "bg-yellow-100 text-gray-900 rounded-br-none"
            : "bg-white text-gray-800 rounded-bl-none"
        }`}
      >
        {content}
      </div>

      {isUser && (
        <div className="p-2 bg-yellow-200 rounded-full">
          <User className="w-5 h-5 text-yellow-600" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
