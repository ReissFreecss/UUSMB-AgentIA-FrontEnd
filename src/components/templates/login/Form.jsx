import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../../../constants.js';
import { BotMessageSquare } from 'lucide-react';
import Alert from '../../ui/Alert.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Form = ({ setUser }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (email === '' || password === '') {
      setError(true);
      setErrorMessage('Por favor, completa todos los campos');
      setSuccess(false);
      setIsSubmitting(false);
      return;
    }

    try {
      const promise = toast.promise(
        async () => {
          const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            credentials: 'include',
            mode: 'cors',
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const errorData = await response.text();
            console.error('Login error response:', errorData);
            setError(true);
            setErrorMessage(
              'Usuario o contraseña incorrectos. Por favor, verifica tus datos e inténtalo de nuevo. Si sigues teniendo problemas, contacta a soporte.'
            );
            setSuccess(false);
            return;
          }

          const token = await response.text();
          if (!token) {
            setError(true);
            setErrorMessage('Token no recibido del servidor');
            setSuccess(false);
            setIsSubmitting(false);

            return;
          }

          const formattedToken = token.trim();
          const tokenWithBearer = formattedToken.startsWith('Bearer ')
            ? formattedToken
            : `Bearer ${formattedToken}`;

          localStorage.setItem('token', tokenWithBearer);

          const tokenPayload = decodeToken(tokenWithBearer);
          if (tokenPayload) {
            // Verificar si el usuario está activo
            if (tokenPayload.status === false) {
              // Eliminar el token ya que el usuario está inactivo
              localStorage.removeItem('token');
              setError(true);
              setErrorMessage(
                'Tu cuenta está inactiva. Contacta al administrador.'
              );
              setSuccess(false);
              setIsSubmitting(false);

              return;
            }

            setUser([tokenPayload.email, tokenPayload.role]);
            setError(false);
            setSuccess(true);
            setIsSubmitting(false);

            setTimeout(() => {
              switch (tokenPayload.role) {
                case 'ADMIN':
                  navigate('/home');
                  break;
                case 'INERNO':
                  navigate('/homeIntern');
                  break;
                case 'EXTERNO':
                  navigate('/homeExtern');
                  break;
                default:
                  navigate('/home');
              }
            }, 2000);
          }
        },
        {
          position: 'bottom-right',
          pending: 'Enviando datos...',
          success: 'Registro completado con éxito',
          error: 'Error en el registro',
        }
      );
      await promise;
    } catch (error) {
      console.error('Error details:', error);
      setError(true);
      setErrorMessage('Error de conexión con el servidor, contacta a soporte.');
      setSuccess(false);
      setIsSubmitting(false);
    }
  };

  const decodeToken = (token) => {
  try {
    const tokenWithoutBearer = token.startsWith('Bearer ')
      ? token.slice(7)
      : token;
    const base64Url = tokenWithoutBearer.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};


  const handleChangeEmailPasswordRecovery = () => {
    navigate('/checkEmail');
  };

  const handleChangeRegister = () => {
    navigate('/register');
  };

  return (
    <div className={`flex h-screen flex-col md:flex-row`}>
      {/* Panel Izquierdo */}
      <div className='form-panel w-full md:w-1/2 flex flex-col justify-center items-center p-8'>
        <div className='flex justify-between w-full px-4 mb-6'>
          <img src='/uusmb.png' alt='Logo Izquierdo' className='h-20' />
          <img src='/unamlogo.png' alt='Logo Derecho' className='h-20' />
        </div>

        <h1 className='text-3xl font-bold flex items-center gap-2'>
          CHATBOT
          <BotMessageSquare color='#CB842E' size={40} />
        </h1>
        <p className='mt-2 text-lg font-semibold'>Bienvenido</p>
        <p className='font-semibold mb-6'>Inicia sesión para poder continuar</p>

        {error && (
          <Alert
            message={errorMessage || 'Error al iniciar sesión.'}
            bgColor='bg-alert'
            textColor='text-white'
            imageSrc='/alertFail.png'
          />
        )}

        {success && (
          <Alert
            message='Iniciando sesión...'
            bgColor='bg-blue-200'
            textColor='text-black'
            showSpinner={true}
          />
        )}

        {/* Formulario de Login */}
        <form
          className='w-full max-w-md grid grid-cols-1 gap-4'
          onSubmit={handleSubmit}
        >
          <div>
            <label htmlFor='emailLogin' className='text-sm text-gray-600'>
              Correo Electrónico
            </label>
            <input
              id='emailLogin'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='styled-input'
            />
          </div>
          <div>
            <label htmlFor='passwordLogin' className='text-sm text-gray-600'>
              Contraseña
            </label>
            <div className='relative'>
              <input
                id='passwordLogin'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='styled-input pr-10'
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500'
              >
                {showPassword ? (
                  <EyeOffIcon size={24} color='#CB842E' />
                ) : (
                  <EyeIcon size={24} color='#CB842E' />
                )}
              </button>
            </div>
          </div>

          <div className='col-span-2 mt-2 text-sm text-center'>
            <div className='mb-2'>
              <button
                type='button'
                className='text-orange-600'
                onClick={handleChangeEmailPasswordRecovery}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            ¿Aún no tienes una cuenta?{' '}
            <button
              type='button'
              className='text-orange-600'
              onClick={handleChangeRegister}
            >
              Registrarme
            </button>
          </div>

          <button
            type='submit'
            className='bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded col-span-2'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Iniciando sesion' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>

      {/* Panel Derecho */}
      <div className='image-panel md:w-1/2 bg-greyPrimary flex items-center justify-center p-8 rounded-3xl drop-shadow-xl'>
        <img
          src='loginImage.png'
          alt='Chatbot Ilustración'
          className='max-w-xs md:max-w-full'
        />
      </div>
      <ToastContainer
        position='bottom-center'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </div>
  );
};

export default Form;
