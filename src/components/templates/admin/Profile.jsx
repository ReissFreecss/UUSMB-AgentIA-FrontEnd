import { useState, useEffect } from 'react';
import AsideBar from '../../ui/AsideBar';
import EditProfileModal from '../EditProfileModal.jsx';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  PencilIcon,
  ShieldUser,
  RotateCcwKey
} from 'lucide-react';
import { ToastContainer } from 'react-toastify';
import PasswordModal from '../PasswordModal.jsx';
import 'react-toastify/dist/ReactToastify.css';
import { getUserById } from '../../../services/users/userServices';
import { decodeAndDisplayToken } from '../../../services/auth/authService.js';

const Profile = () => {
  const [isAsideExpanded, setIsAsideExpanded] = useState(() => {
    const saved = localStorage.getItem('isExpanded');
    return saved ? JSON.parse(saved) : false;
  });

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAsideToggle = (expanded) => setIsAsideExpanded(expanded);

  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        const tokenData = decodeAndDisplayToken();

        if (tokenData?.id) {
          const response = await getUserById(tokenData.id);
          if (response?.result) {
            setProfileData(response.result);
            setLoading(false);
            return;
          }
        }

        // fallback to localStorage
        const savedUserId = localStorage.getItem('userId');
        if (savedUserId) {
          const response = await getUserById(savedUserId);
          if (response?.result) {
            setProfileData(response.result);
            setLoading(false);
            return;
          }
        }

        throw new Error('No se pudo obtener el perfil del usuario');
      } catch (err) {
        console.error(err);
        setError('Error al cargar el perfil del usuario');
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  return (
    <div className='flex min-h-screen w-full bg-greyPrimary'>
      <aside className='h-screen sticky top-0 z-20'>
        <AsideBar activePage='users' onToggle={handleAsideToggle} />
      </aside>

      <main
        className={`flex flex-col flex-1 bg-greyPrimary transition-all duration-300 ease-in-out ${
          isAsideExpanded ? 'ml-[16em]' : 'ml-[4em]'
        } overflow-hidden min-h-screen`}
      >
        <div className='max-w-4xl w-full mx-auto p-6 mt-44'>
          {/* Cargando */}
          {loading && (
            <div className='text-center text-lg text-gray-600 mt-32'>
              Cargando perfil...
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className='text-center text-red-500 text-lg mt-32'>
              {error}
            </div>
          )}

          {/* Contenido principal */}
          {!loading && !error && profileData && (
            <div className='bg-white rounded-2xl shadow-xl p-8'>
              <h1 className='text-3xl font-bold text-center text-gray-800 mb-8'>
                Mi Perfil
              </h1>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                <div className='flex items-start gap-4'>
                  <UserIcon className='text-primary mt-1' size={24} />
                  <div>
                    <p className='text-sm text-gray-500'>Nombre completo</p>
                    <p className='text-lg font-semibold text-gray-800'>
                      {profileData.fullName} {profileData.firstLastName}{' '}
                      {profileData.secondLastName}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <MailIcon className='text-primary mt-1' size={24} />
                  <div>
                    <p className='text-sm text-gray-500'>Correo electrónico</p>
                    <p className='text-lg font-semibold text-gray-800'>
                      {profileData.email}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <PhoneIcon className='text-primary mt-1' size={24} />
                  <div>
                    <p className='text-sm text-gray-500'>Teléfono</p>
                    <p className='text-lg font-semibold text-gray-800'>
                      {profileData.phone}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <ShieldUser className='text-primary mt-1' size={24} />
                  <div>
                    <p className='text-sm text-gray-500'>Rol</p>
                    <p className='text-lg font-semibold text-gray-800'>
                      {profileData.role}
                    </p>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <PencilIcon className='text-green-500 mt-1' size={24} />
                  <div className='flex flex-col'>
                    <p className='text-sm text-gray-500 mb-1'>Editar perfil</p>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className='bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm font-medium w-fit'
                    >
                      Editar mi perfil
                    </button>
                  </div>
                </div>

                <div className='flex items-start gap-4'>
                  <RotateCcwKey className='text-red-500 mt-1' size={24} />
                  <div className='flex flex-col'>
                    <p className='text-sm text-gray-500 mb-1'>
                      Cambiar mi contraseña
                    </p>
                    <button
                      onClick={() => setIsPasswordModalOpen(true)}
                      className='bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md text-sm font-medium w-fit'
                    >
                      Cambiar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {isModalOpen && (
          <EditProfileModal
            profileData={profileData}
            onClose={() => setIsModalOpen(false)}
            onSave={(updatedData) => {
              setProfileData(updatedData);
              setIsModalOpen(false);
            }}
          />
        )}

        {isPasswordModalOpen && (
          <PasswordModal
            profileData={profileData}
            onClose={() => setIsPasswordModalOpen(false)}
            onSave={(formData) => {
             // console.log('Nueva contraseña:', formData);
              setIsPasswordModalOpen(false);
            }}
          />
        )}
      </main>

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

export default Profile;
