import { useState } from 'react';
import { changePassword } from '../../services/users/userServices.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import { validatePassword } from '../../services/utils/validations.js';
import { X, Save } from 'lucide-react';

const PasswordModal = ({ profileData, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    userId: profileData.id,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const { currentPassword, newPassword, confirmPassword } = formData;

    if (
      currentPassword === '' ||
      newPassword === '' ||
      confirmPassword === ''
    ) {
      toast.error('Los campos no pueden ir vacíos.');
      return false;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }

    if (!validatePassword(newPassword) || !validatePassword(confirmPassword)) {
      toast.error('Contraseña inválida');
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
      text: '¿Deseas cambiar la contraseña?',
      showCancelButton: true,
      confirmButtonText: 'Sí, cambiar',
      confirmButtonColor: '#12c222',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    });

    // Si el usuario confirma, proceder con la actualización
    if (result.isConfirmed) {
      setIsLoading(true);
      const loadingToastId = toast.info('Cargando...', { autoClose: false });

      const userData = {
        userId: formData.userId,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      };

      try {
        const response = await changePassword(userData);

        // Verificar si la respuesta es exitosa
        if (response && response.result === null) {
          toast.update(loadingToastId, {
            render: 'Contraseña actualizada con éxito',
            type: 'success',
            autoClose: 5000,
          });
          // Mostrar SweetAlert de éxito
          await Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Contraseña actualizada con éxito',
            showConfirmButton: false,
            timer: 1500,
          });
          onClose();
        } else {
          // Mostrar mensaje de error si la contraseña actual es incorrecta
          toast.update(loadingToastId, {
            render: 'Tu contraseña actual es incorrecta, inténtalo de nuevo',
            type: 'error',
            autoClose: 5000,
          });
          // Limpiar el campo de contraseña actual
          setFormData((prev) => ({
            ...prev,
            currentPassword: '',
          }));
        }
      } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        toast.update(loadingToastId, {
          render: 'Error al actualizar la contraseña',
          type: 'error',
          autoClose: 5000,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'>
      <div className='bg-white p-6 rounded-lg w-full max-w-md shadow-lg'>
        <h2 className='text-xl font-bold mb-4'>Cambiar Contraseña</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Contraseña actual
            </label>
            <input
              name='currentPassword'
              type='password'
              value={formData.currentPassword}
              onChange={handleChange}
              className='mt-1 p-2 w-full border rounded-md'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Contraseña nueva
            </label>
            <input
              name='newPassword'
              type='password'
              value={formData.newPassword}
              onChange={handleChange}
              className='mt-1 p-2 w-full border rounded-md'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>
              Confirmar contraseña
            </label>
            <input
              name='confirmPassword'
              type='password'
              value={formData.confirmPassword}
              onChange={handleChange}
              className='mt-1 p-2 w-full border rounded-md'
            />
          </div>
          <div className='flex justify-end space-x-2 mt-4'>
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
              className='bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200 flex items-center'
              disabled={isLoading}
            >
              <Save size={16} className='mr-2' />
              {isLoading ? 'Cargando...' : 'Guardar'}
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

export default PasswordModal;
