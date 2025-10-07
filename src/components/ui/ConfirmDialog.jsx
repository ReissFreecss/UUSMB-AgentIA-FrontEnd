import { TriangleAlert } from "lucide-react";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, fileName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity px-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="flex items-start gap-4">
          {/* Icono de alerta */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
            <TriangleAlert className="h-6 w-6 text-yellow-600" />
          </div>

          {/* Contenido del modal */}
          <div className="flex-1 text-left">
            <h3 className="text-lg font-bold text-gray-900">
              Confirmar carga de archivo
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              ¿Estás seguro de subir el archivo{" "}
              <span className="font-semibold text-gray-800 break-all">
                “{fileName}”
              </span>
              ?
            </p>
          </div>
        </div>

        {/* Botones */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Subir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
