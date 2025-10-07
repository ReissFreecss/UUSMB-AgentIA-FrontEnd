import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { verifyRecoveryCode } from "../../../services/users/userServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TriangleAlert, CircleCheck } from "lucide-react";

const ConfirmCode = ({ setFromConfirmCode }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("recoveryEmail");

  const inputs = Array.from({ length: 6 }, () => useRef(null));

  const handleInputChange = (e, index) => {
    const value = e.target.value;
    if (/^\d$/.test(value)) {
      if (index < 5) {
        inputs[index + 1].current.focus();
      }
    } else {
      e.target.value = "";
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs[index - 1].current.focus();
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Obtener el código de los inputs
    const code = inputs.map((ref) => ref.current.value).join("");

    // Validar que todos los campos estén llenos
    if (code.length !== 6 || inputs.some((input) => !input.current.value)) {
      toast.error(
        <span>
          <TriangleAlert className="inline mr-2" size={18} />
          Por favor, completa todos los campos del código de verificación.
        </span>
      );
      setLoading(false);
      return;
    }

    try {
      await verifyRecoveryCode(email, code);
      toast.success(
        <span>
          <CircleCheck className="inline mr-2" size={18} />
          Código de verificación correcto. Puedes establecer una nueva
          contraseña.
        </span>
      );
      setTimeout(() => {
        setFromConfirmCode(true);
        navigate("/newPassword");
      }, 1500);
    } catch (error) {
      toast.error(
        <span>
          <TriangleAlert className="inline mr-2" size={18} />
          Error al verificar el código de verificación.
        </span>
      );
    }
    setLoading(false);
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
            INGRESE EL CÓDIGO
          </h1>
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-8 w-full">
            DE VERIFICACIÓN
          </h1>
          <p className="text-lg mb-4 text-center w-full">
            Se ha enviado un código de verificación a tu correo electrónico.
          </p>

          <div className="flex gap-3 justify-center mb-8">
            {inputs.map((ref, index) => (
              <input
                key={index}
                ref={ref}
                type="text"
                maxLength="1"
                className="w-12 h-14 text-2xl text-center border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                onChange={(e) => handleInputChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <button
            className="w-3/5 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md text-base mt-2"
            onClick={handleContinue}
            disabled={loading}
          >
            Continuar
          </button>
        </div>
      </div>
      {/* Botón Regresar */}
      <button
        className="absolute bottom-4 left-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded md:py-2 md:px-4 md:text-base text-sm hidden sm:block"
        onClick={handleBack}
      >
        Regresar
      </button>
    </div>
  );
};

export default ConfirmCode;
