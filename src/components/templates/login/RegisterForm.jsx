import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Alert from '../../ui/Alert';
import { BotMessageSquare } from 'lucide-react';
import { API_URL } from '../../../../constants.js';
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateFullName,
  validateLastName,
} from '../../../services/utils/validations.js';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [firstLastName, setFirstLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    switch (id) {
      case 'firstName':
        setFullName(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'lastNameMother':
        setFirstLastName(value);
        break;
      case 'lastNameFather':
        setSecondLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'confirmEmail':
        setConfirmEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (
      email === '' ||
      password === '' ||
      fullName === '' ||
      firstLastName === '' ||
      secondLastName === '' ||
      phone === ''
    ) {
      setError(true);
      setErrorMessage('Por favor, completa todos los campos');
      setSuccess(false);
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      setError(true);
      setErrorMessage('Por favor, introduce un correo electrónico válido');
      setSuccess(false);
      setIsSubmitting(false);
      return;
    }

    if (!validatePassword(password)) {
      setError(true);
      setErrorMessage('La contraseña debe tener al menos 8 caracteres');
      setSuccess(false);
      setIsSubmitting(false);
      return;
    }

    if (!validatePhone(phone)) {
      setError(true);
      setErrorMessage(
        'Por favor, introduce un número de teléfono válido, al menos 10 dígitos'
      );
      setSuccess(false);
      setIsSubmitting(false);
      return;
    }
    if (!validateFullName(fullName)) {
      setError(true);
      setErrorMessage('El nombre solo puede contener letras y espacios');
      setSuccess(false);
      setIsSubmitting(false);
      return;
    }

    if (!validateLastName(firstLastName)) {
      setError(true);
      setErrorMessage(
        'El apellido materno solo puede contener letras y espacios'
      );
      setSuccess(false);
      setIsSubmitting(false);
      return;
    }

    if (!validateLastName(secondLastName)) {
      setError(true);
      setErrorMessage(
        'El apellido paterno solo puede contener letras y espacios'
      );
      setSuccess(false);
      setIsSubmitting(false);
      return;
    }

    if (email !== confirmEmail) {
      setError(true);
      setErrorMessage('Los correos no coinciden');
      setSuccess(false);
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(true);
      setErrorMessage('Las contraseñas no coinciden');
      setSuccess(false);
      setIsSubmitting(false);
      return;
    }

    try {
      const promise = toast.promise(
        fetch(`${API_URL}/users/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          credentials: 'include',
          mode: 'cors',
          body: JSON.stringify({
            fullName,
            firstLastName,
            secondLastName,
            password,
            email,
            phone,
          }),
        }).then(async (response) => {
          if (!response.ok) {
            const errorData = await response.text();
            console.error('Register error response:', errorData);
            setError(true);
            setErrorMessage(
              'Verifica tus datos e inténtalo de nuevo. Si sigues teniendo problemas, contacta a soporte.'
            );
            setSuccess(false);
            throw new Error('Error en el registro');
          }

          const token = await response.text();
          if (!token) {
            setError(true);
            setErrorMessage('Token no recibido del servidor');
            setSuccess(false);
            throw new Error('Token no recibido');
          }

          const formattedToken = token.trim();
          const tokenWithBearer = formattedToken.startsWith('Bearer ')
            ? formattedToken
            : `Bearer ${formattedToken}`;

          localStorage.setItem('token', tokenWithBearer);
          navigate('/');
        }),
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
      setErrorMessage('Error de conexión con el servidor');
      setSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => {
    navigate('/');
  };

  return (
    <div className='flex h-screen flex-col md:flex-row register-mode'>
      {/* Panel Derecho (ahora a la izquierda) */}
      <div className='image-panel md:w-1/2 bg-greyPrimary flex items-center justify-center p-8 rounded-3xl drop-shadow-xl order-2 md:order-1'>
        <img
          src='loginImage.png'
          alt='Chatbot Ilustración'
          className='max-w-xs md:max-w-full'
        />
      </div>

      {/* Panel Izquierdo (ahora a la derecha) */}
      <div className='w-full md:w-1/2 flex flex-col justify-center items-center p-8 order-1 md:order-2'>
        <div className='flex justify-between w-full px-4 mb-6'>
          <img src='/uusmb.png' alt='Logo Izquierdo' className='h-20' />
          <img src='/unamlogo.png' alt='Logo Derecho' className='h-20' />
        </div>

        <h1 className='text-3xl font-bold flex items-center gap-2'>
          CHATBOT
          <BotMessageSquare color='#CB842E' size={40} />
        </h1>
        <p className='mt-2 text-lg font-semibold'>Registrarse</p>
        <p className='font-semibold mb-6'>Regístrate para continuar</p>

        {error && (
          <Alert
            message={errorMessage || 'Error al iniciar sesión.'}
            bgColor='bg-alert'
            textColor='text-white'
            imageSrc='/alertFail.png'
          />
        )}

        <form
          className='w-full max-w-md grid grid-cols-1 gap-4'
          onSubmit={handleSubmit}
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label htmlFor='firstName' className='text-sm text-gray-600'>
                Nombre(s)
              </label>
              <input
                id='firstName'
                value={fullName}
                onChange={handleChange}
                className='styled-input w-full'
              />
            </div>

            <div>
              <label htmlFor='lastNameMother' className='text-sm text-gray-600'>
                Apellido Materno
              </label>
              <input
                id='lastNameMother'
                value={firstLastName}
                onChange={handleChange}
                className='styled-input w-full'
              />
            </div>
            <div>
              <label htmlFor='lastNameFather' className='text-sm text-gray-600'>
                Apellido Paterno
              </label>
              <input
                id='lastNameFather'
                value={secondLastName}
                onChange={handleChange}
                className='styled-input w-full'
              />
            </div>
            <div>
              <label htmlFor='phone' className='text-sm text-gray-600'>
                Teléfono
              </label>
              <input
                id='phone'
                value={phone}
                onChange={handleChange}
                className='styled-input w-full'
              />
            </div>
            <div>
              <label htmlFor='email' className='text-sm text-gray-600'>
                Correo Electrónico
              </label>
              <input
                id='email'
                type='email'
                placeholder='ejemplo@ejemplo.com'
                value={email}
                onChange={handleChange}
                className='styled-input w-full'
              />
            </div>
            <div>
              <label htmlFor='confirmEmail' className='text-sm text-gray-600'>
                Confirmar Correo
              </label>
              <input
                id='confirmEmail'
                type='email'
                value={confirmEmail}
                onChange={handleChange}
                className='styled-input w-full'
              />
            </div>
            <div>
              <label htmlFor='password' className='text-sm text-gray-600'>
                Contraseña
              </label>
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Contraseña'
                value={password}
                onChange={handleChange}
                className='styled-input w-full'
              />
            </div>
            <div>
              <label
                htmlFor='confirmPassword'
                className='text-sm text-gray-600'
              >
                Confirmar Contraseña
              </label>
              <input
                id='confirmPassword'
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={handleChange}
                className='styled-input w-full'
              />
            </div>
          </div>
          <div className='text-center col-span-2'>
            <button
              type='button'
              className='text-orange-600'
              onClick={handleLogin}
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </button>
          </div>

          <button
            type='submit'
            className='bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded col-span-2 mt-2'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registrando...' : 'Registrarme'}
          </button>
        </form>
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

export default RegisterForm;
