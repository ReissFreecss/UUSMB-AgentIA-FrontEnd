import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../../services/users/userServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TriangleAlert, RotateCcwKey } from "lucide-react";
import { validatePassword } from "../../../services/utils/validations";

const NewPassword = () => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const email = localStorage.getItem("recoveryEmail");

  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleCancel = () => {
    navigate("/");
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    validatePassword(password);

    if (password.trim() === "" || confirmPassword.trim() === "") {
      toast.error(
        <span>
          <TriangleAlert className="inline mr-2" size={18} />
          Por favor, completa todos los campos.
        </span>
      );
      setLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      toast.error(
        <span>
          <TriangleAlert className="inline mr-2" size={18} />
          Por favor, ingresa una contraseña válida.
        </span>
      );
      setLoading(false);
      return;
    }
    if (!validatePassword(confirmPassword)) {
      toast.error(
        <span>
          <TriangleAlert className="inline mr-2" size={18} />
          Por favor, ingresa una contraseña válida.
        </span>
      );
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast.error(
        <span>
          <TriangleAlert className="inline mr-2" size={18} />
          Las contraseñas no coinciden.
        </span>
      );
      setLoading(false);
      return;
    }

    try {
      await resetPassword(email, password);
      localStorage.setItem("recoveryEmail", email);
      toast.success(
        <span>
          <RotateCcwKey className="inline mr-2" size={18} />
          La contraseña se ha cambiado correctamente.
        </span>
      );
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      toast.error(
        <span>
          <TriangleAlert className="inline mr-2" size={18} />
          Error al cambiar la contraseña. Intenta de nuevo.
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Encabezado con logos */}
      <div className="w-full flex justify-between items-center px-4 py-2 max-w-6xl mx-auto">
        <img src="/uusmb.png" alt="Logo Izquierdo" className="h-20" />
        <img src="/unamlogo.png" alt="Logo Derecho" className="h-20" />
      </div>
      {/* Tarjeta principal */}
      <div className="flex-grow flex items-start justify-center w-full px-6 pt-20">
        <div className="bg-greyPrimary rounded-3xl shadow-lg p-8 w-full max-w-5xl flex flex-col items-center">
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-4 w-full">
            INGRESE SU NUEVA
          </h1>
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-8 w-f    ull">
            CONTRASEÑA
          </h1>
          <p className="text-lg mb-4 text-center w-full">
            Por favor, ingrese y confirme su nueva contraseña.
          </p>

          <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="styled-input"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmar Contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className="styled-input"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md text-base"
            >
              Cambiar Contraseña
            </button>
          </form>
        </div>
      </div>
      {/* Botón Regresar */}
      <button
        className="absolute bottom-4 left-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded md:py-2 md:px-4 md:text-base text-sm hidden sm:block"
        onClick={handleCancel}
      >
        Cancelar
      </button>
    </div>
  );
};

export default NewPassword;
