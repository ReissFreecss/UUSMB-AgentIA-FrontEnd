import { useNavigate } from "react-router-dom";
import { sendRecoveryCode } from "../../../services/users/userServices";
import {validateEmail} from '../../../services/utils/validations'
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MailWarning, MailCheck  } from "lucide-react";

const CheckEmail = ({ setFromCheckEmail }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  const handleCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    validateEmail(email);

    //Validacion del correo electrónico
    if (!validateEmail(email)) {
      toast.error(
        <span>
          <MailWarning className="inline mr-2" size={18} />
          Por favor, ingresa un correo electrónico válido.
        </span>
      );
      setLoading(false);
      return;
    }

    //Validar que no venga vacio el correo 
    if (!email || email.trim() === "") {
      toast.error(
        <span>
          <MailWarning className="inline mr-2" size={18} />
          Por favor, ingresa un correo electrónico válido.
        </span>
      );
      setLoading(false);
      return;
    }
  
    try {
      await sendRecoveryCode(email);
      localStorage.setItem("recoveryEmail", email);
      toast.success(
        <span>
          <MailCheck  className="inline mr-2" size={18} />
          Se ha enviado un código de verificación a tu correo electrónico.
        </span>
      );
      setTimeout(() => {
        setFromCheckEmail(true);
        navigate("/confirmCode");
      }, 2000);
    } catch (error) {
      toast.error(
        <span>
          <MailWarning className="inline mr-2" size={18} />
          Error al enviar el código. Intenta de nuevo.
        </span>
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Encabezado con logos */}
      <div className="w-full flex justify-between items-center px-4 py-4 max-w-6xl">
        <img src="/uusmb.png" alt="Logo Izquierdo" className="h-20" />
        <img src="/unamlogo.png" alt="Logo Derecho" className="h-20" />
      </div>

      {/* Tarjeta principal */}
      <div className="flex-grow flex items-start justify-center w-full px-6 pt-20">
        <div className="bg-greyPrimary rounded-3xl shadow-lg p-8 w-full max-w-5xl flex flex-col items-center">
          {/* Título centrado sobre ambas secciones */}
          <h1 className="text-2xl md:text-4xl font-bold text-center mb-8 w-full">
            RECUPERACIÓN DE CONTRASEÑA
          </h1>

          {/* Contenido dividido */}
          <div className="flex flex-col md:flex-row w-full items-center">
            {/* Sección de formulario */}
            <div className="md:w-1/2 w-full mb-6 md:mb-0 md:pr-8">
              <p className="text-lg mb-4 text-center md:text-left font-semibold">
                Verifica tu correo electrónico
              </p>
              <label
                htmlFor="email"
                className="block text-sm text-gray-600 mb-1"
              >
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                className="styled-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Imagen decorativa */}
            <div className="md:w-1/2 w-full flex justify-center">
              <img
                src="/email.png"
                alt="Email"
                className="h-48 md:h-64 object-contain"
              />
            </div>
          </div>
          <button
            className="w-3/5 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-xl shadow-md text-base mt-10"
            onClick={handleCode}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Continuar"}
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

export default CheckEmail;
