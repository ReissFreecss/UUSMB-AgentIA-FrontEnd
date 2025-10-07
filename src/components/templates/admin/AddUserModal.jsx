import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import { createUser } from '../../../services/users/userServices';
import {
  validateEmail,
  validatePhone,
  validatePassword,
  validateFullName,
  validateLastName,
} from '../../../services/utils/validations.js';
import { X, User, Mail, Phone, Save } from 'lucide-react';

const AddUserModal = ({ onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [firstLastName, setFirstLastName] = useState('');
  const [secondLastName, setSecondLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'fullName':
        setFullName(value);
        break;
      case 'firstLastName':
        setFirstLastName(value);
        break;
      case 'secondLastName':
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
      case 'phone':
        setPhone(value);
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
      confirmEmail === '' ||
      password === '' ||
      confirmPassword === '' ||
      fullName === '' ||
      firstLastName === '' ||
      secondLastName === '' ||
      phone === ''
    ) {
      toast.error('Por favor, completa todos los campos');
      setIsSubmitting(false);
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Correo electrónico no válido');
      setIsSubmitting(false);
      return;
    }

    if (!validatePassword(password)) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      setIsSubmitting(false);
      return;
    }

    if (!validatePhone(phone)) {
      toast.error('Número de teléfono no válido');
      setIsSubmitting(false);
      return;
    }

    if (!validateFullName(fullName)) {
      toast.error('El nombre solo puede contener letras y espacios');
      setIsSubmitting(false);
      return;
    }

    if (!validateLastName(firstLastName)) {
      toast.error('El apellido paterno solo puede contener letras');
      setIsSubmitting(false);
      return;
    }

    if (!validateLastName(secondLastName)) {
      toast.error('El apellido materno solo puede contener letras');
      setIsSubmitting(false);
      return;
    }

    if (email !== confirmEmail) {
      toast.error('Los correos no coinciden');
      setIsSubmitting(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      setIsSubmitting(false);
      return;
    }

    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres crear este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      try {
        await createUser({
          email,
          password,
          fullName,
          firstLastName,
          secondLastName,
          phone,
        });
        toast.success('Usuario creado con éxito');
        onClose();
      } catch (error) {
        toast.error('Error al crear el usuario');
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className='bg-white p-6 rounded-lg w-full max-w-4xl mx-auto shadow-lg'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Crear Usuario</h2>
          <button
            type='button'
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 flex items-center'>
                <User size={16} className='mr-2' />
                Nombre
              </label>
              <input
                name='fullName'
                value={fullName}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring focus:ring-green-200'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700 flex items-center'>
                <User size={16} className='mr-2' />
                Apellido Paterno
              </label>
              <input
                name='firstLastName'
                value={firstLastName}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring focus:ring-green-200'
              />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 flex items-center'>
                <User size={16} className='mr-2' />
                Apellido Materno
              </label>
              <input
                name='secondLastName'
                value={secondLastName}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring focus:ring-green-200'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700 flex items-center'>
                <Phone size={16} className='mr-2' />
                Teléfono
              </label>
              <input
                name='phone'
                value={phone}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring focus:ring-green-200'
              />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700 flex items-center'>
                <Mail size={16} className='mr-2' />
                Correo Electrónico
              </label>
              <input
                name='email'
                value={email}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring focus:ring-green-200'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700 flex items-center'>
                <Mail size={16} className='mr-2' />
                Confirmar Correo
              </label>
              <input
                name='confirmEmail'
                value={confirmEmail}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring focus:ring-green-200'
              />
            </div>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm font-medium text-gray-700'>
                Contraseña
              </label>
              <input
                type='password'
                name='password'
                value={password}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring focus:ring-green-200'
              />
            </div>
            <div>
              <label className='text-sm font-medium text-gray-700'>
                Confirmar Contraseña
              </label>
              <input
                type='password'
                name='confirmPassword'
                value={confirmPassword}
                onChange={handleChange}
                className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring focus:ring-green-200'
              />
            </div>
          </div>
          <div className='flex justify-end space-x-4 mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 flex items-center transition duration-200'
            >
              <X size={16} className='mr-2' />
              Cancelar
            </button>
            <button
              type='submit'
              disabled={isSubmitting}
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center disabled:opacity-50 transition duration-200'
            >
              <Save size={16} className='mr-2' />
              Guardar
            </button>
          </div>
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

export default AddUserModal;
