import { useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { updateUser } from '../../services/users/userServices.js';
import {
  validateEmail,
  validatePhone,
  validateFullName,
  validateLastName,
  validateSecondLastName,
} from '../../services/utils/validations.js';
import { User, Mail, Phone, X, Save } from 'lucide-react';

const EditProfileModal = ({ profileData, onClose, onSave }) => {
  const [form, setForm] = useState({
    id: profileData.id,
    fullName: profileData.fullName,
    firstLastName: profileData.firstLastName,
    secondLastName: profileData.secondLastName,
    email: profileData.email,
    phone: profileData.phone,
    role: profileData.role,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    if (!validateFullName(form.fullName)) {
      toast.error('Nombre inválido. Solo se permiten letras y espacios.');
      return false;
    }
    if (!validateLastName(form.firstLastName)) {
      toast.error(
        'Apellido Paterno inválido. Solo se permiten letras y espacios.'
      );
      return false;
    }
    if (!validateSecondLastName(form.secondLastName)) {
      toast.error(
        'Apellido Materno inválido. Solo se permiten letras y espacios.'
      );
      return false;
    }
    if (!validateEmail(form.email)) {
      toast.error('Correo electrónico inválido.');
      return false;
    }
    if (!validatePhone(form.phone)) {
      toast.error('Teléfono inválido. Debe tener 10 dígitos.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // Mostrar SweetAlert de confirmación
    const result = await Swal.fire({
      icon: 'question',
      title: '¿Estás seguro?',
      text: '¿Deseas editar el perfil?',
      showCancelButton: true,
      confirmButtonText: 'Sí, editar',
      confirmButtonColor: '#12c222',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    });

    // Si el usuario confirma, proceder con la actualización
    if (result.isConfirmed) {
      setIsLoading(true);
      const loadingToastId = toast.info('Cargando...', { autoClose: false });

      try {
        const response = await updateUser({
          ...form,
        });

        if (response) {
          onSave(form);
          toast.update(loadingToastId, {
            render: 'Perfil actualizado con éxito',
            type: 'success',
            autoClose: 5000,
          });
          // Mostrar SweetAlert de éxito
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Has sido editado con exito',
            showConfirmButton: false,
            timer: 1500,
          });
          onClose();
        }
      } catch (error) {
        console.error('Error al actualizar el perfil:', error);
        toast.update(loadingToastId, {
          render: 'Error al actualizar el perfil',
          type: 'error',
          autoClose: 5000,
        });
        // Mostrar SweetAlert de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el perfil',
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4'>
      <div className='bg-white p-6 rounded-lg w-full max-w-md shadow-lg'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-gray-800'>Editar Perfil</h2>
          <button
            type='button'
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label className=' text-sm font-medium text-gray-700 mb-1 flex items-center'>
              <User size={16} className='mr-2' />
              Nombre
            </label>
            <input
              name='fullName'
              value={form.fullName}
              onChange={handleChange}
              className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring focus:ring-green-200 focus:border-green-500'
            />
          </div>
          <div>
            <label className=' text-sm font-medium text-gray-700 mb-1 flex items-center'>
              <User size={16} className='mr-2' />
              Apellido Paterno
            </label>
            <input
              name='firstLastName'
              value={form.firstLastName}
              onChange={handleChange}
              className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring focus:ring-green-200 focus:border-green-500'
            />
          </div>
          <div>
            <label className=' text-sm font-medium text-gray-700 mb-1 flex items-center'>
              <User size={16} className='mr-2' />
              Apellido Materno
            </label>
            <input
              name='secondLastName'
              value={form.secondLastName}
              onChange={handleChange}
              className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring focus:ring-green-200 focus:border-green-500'
            />
          </div>
          <div>
            <label className=' text-sm font-medium text-gray-700 mb-1 flex items-center'>
              <Mail size={16} className='mr-2' />
              Correo electrónico
            </label>
            <input
              name='email'
              value={form.email}
              onChange={handleChange}
              className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring focus:ring-green-200 focus:border-green-500'
            />
          </div>
          <div>
            <label className=' text-sm font-medium text-gray-700 mb-1 flex items-center'>
              <Phone size={16} className='mr-2' />
              Teléfono
            </label>
            <input
              name='phone'
              value={form.phone}
              onChange={handleChange}
              className='mt-1 p-3 w-full border border-gray-300 rounded-md focus:ring focus:ring-green-200 focus:border-green-500'
            />
          </div>
          <div className='flex justify-end space-x-4 mt-6'>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition duration-200 flex items-center'
            >
              <X size={16} className='mr-2' />
              Cancelar
            </button>
            <button
              type='submit'
              disabled={isLoading}
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 flex items-center'
            >
              <Save size={16} className='mr-2' />
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
