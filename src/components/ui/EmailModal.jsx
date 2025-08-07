import { Mail, SendHorizonal, User, X, Type, MessageSquare } from "lucide-react";

const EmailModal = ({ open, onClose, body }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-parchment-950/70 backdrop-blur-sm px-4">
      <div className="bg-parchment-50 dark:bg-parchment-950 w-full max-w-lg rounded-2xl shadow-2xl border border-parchment-200 dark:border-parchment-800 p-6 animate-scale-in">
        
        <div className="flex items-center justify-between pb-4 border-b border-parchment-200 dark:border-parchment-800">
          <h2 className="flex items-center gap-2.5 text-xl font-bold text-parchment-800 dark:text-parchment-100">
            <Mail className="w-6 h-6 text-primary" />
            Nuevo Mensaje
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-parchment-500 dark:text-parchment-400 hover:bg-parchment-100 dark:hover:bg-parchment-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-parchment-950"
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
              className="w-full bg-greyPrimary dark:bg-parchment-900 border border-parchment-200 dark:border-parchment-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-parchment-700 dark:text-parchment-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          <div className="relative">
            <Type className="w-5 h-5 text-parchment-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Asunto"
              className="w-full bg-greyPrimary dark:bg-parchment-900 border border-parchment-200 dark:border-parchment-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-parchment-700 dark:text-parchment-200 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
          <div className="relative">
             <MessageSquare className="w-5 h-5 text-parchment-400 absolute top-5 left-3" />
            <textarea
              defaultValue={body}
              rows={8}
              className="w-full bg-greyPrimary dark:bg-parchment-900 border border-parchment-200 dark:border-parchment-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-parchment-700 dark:text-parchment-200 resize-none focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-parchment-200 dark:border-parchment-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm font-medium text-parchment-600 dark:text-parchment-300 hover:bg-parchment-100 dark:hover:bg-parchment-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-parchment-400 dark:focus:ring-offset-parchment-950"
          >
            Cancelar
          </button>
          <button
            className="flex items-center gap-2 bg-primary hover:bg-brandy-punch-600 text-white font-medium px-5 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-parchment-950"
          >
            <SendHorizonal className="w-4 h-4" />
            Enviar
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmailModal;