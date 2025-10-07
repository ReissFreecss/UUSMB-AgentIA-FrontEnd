import { useState, useEffect } from 'react';
import AsideBar from '../../ui/AsideBar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';
import {
  getAllUsers,
  changeUserStatus,
} from '../../../services/users/userServices';
import AddUserModal from './AddUserModal';
import EditUserProfile from './EditUserProfie';
import { UserPen, Shield, CircleUserRound } from 'lucide-react';

const USERS_PER_PAGE = 8;

const Users = ({ user }) => {
  const [isAsideExpanded, setIsAsideExpanded] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editError, setEditError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers();
      if (response || response.result || Array.isArray(response.result)) {
        setUsers(response.result);
        setFilteredUsers(response.result);
        setError(null);
      } else {
        setUsers([]);
        setFilteredUsers([]);
        setError(
          'No se pudieron cargar los datos de los usuarios. Formato de datos inesperados'
        );
      }
      setLoading(false);
    } catch (error) {
      console.error('Error en el fetching', error);
      setError('Error al cargar los usuarios');
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const changeStatus = async (userId, currentStatus) => {
    const result = await Swal.fire({
      icon: 'question',
      title: '¿Estás seguro?',
      text: '¿Deseas editar el status del usuario?',
      showCancelButton: true,
      confirmButtonText: 'Sí, editar',
      confirmButtonColor: '#12c222',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
    });

    // Si el usuario confirma, proceder con la actualización
    if (result.isConfirmed) {
      setLoading(true);
      Swal.fire({
        title: 'Cargando...',
        text: 'Por favor, espera',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await changeUserStatus(userId, !currentStatus);

        if (response) {
          Swal.close();
          // Mostrar SweetAlert de éxito
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Estado actualizado con éxito',
            showConfirmButton: false,
            timer: 1500,
          });
          fetchUsers(); // Actualizar la lista de usuarios
          setEditError(null);
        }
      } catch (error) {
        console.error('Error al actualizar el estado perfil:', error);
        Swal.close();
        // Mostrar SweetAlert de error
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al actualizar el estado del perfil',
        });
        setEditError('Error al actualizar el estado del perfil');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (Array.isArray(users)) {
      const results = users.filter((user) =>
        `${user.fullName} ${user.firstLastName} ${user.secondLastName} ${user.email}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
      setFilteredUsers(results);
      setCurrentPage(1);
    }
  }, [search, users]);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = Array.isArray(filteredUsers)
    ? filteredUsers.slice(
        (currentPage - 1) * USERS_PER_PAGE,
        currentPage * USERS_PER_PAGE
      )
    : [];

  const handleAsideToggle = (expanded) => setIsAsideExpanded(expanded);

  return (
    <div className='flex min-h-screen w-full bg-greyPrimary'>
      <aside className='h-screen sticky top-0 z-20'>
        <AsideBar activePage='users' onToggle={handleAsideToggle} />
      </aside>

      <main
        className={`flex flex-col flex-1 bg-greyPrimary transition-all duration-300 ease-in-out ${
          isAsideExpanded ? 'ml-[16em]' : 'ml-[4em]'
        } overflow-hidden h-screen relative`}
      >
        <div className='flex-1 flex flex-col overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'>
          {/* Loading o Error */}
          {loading && (
            <div className='flex justify-center items-center h-full text-lg font-medium text-gray-600'>
              Cargando...
            </div>
          )}
          {error && !loading && (
            <div className='flex justify-center items-center h-full text-lg font-medium text-red-600'>
              Error: {error}
            </div>
          )}
          {/* Encabezado */}
          {!loading && !error && (
            <>
              <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 mt-14'>
                <div className='flex gap-2 flex-wrap'>
                  <input
                    type='text'
                    placeholder='Buscar...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='border rounded-full px-4 py-2 text-sm w-full sm:w-auto'
                  />
                  
                </div>
                <button
                  className='bg-gradient-to-r from-brandy-punch-500 to-brandy-punch-600 hover:from-brandy-punch-600 hover:to-brandy-punch-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center'
                  onClick={() => setIsAddUserModalOpen(true)}
                >
                  + Agregar Usuario
                </button>
              </div>

              {/* Tabla */}
              <div className='overflow-x-auto bg-white shadow-md rounded-lg'>
                {editError && (
                  <div style={{ color: 'red' }}>Error: {editError}</div>
                )}
                {error && <div style={{ color: 'red' }}>Error: {error}</div>}
                {paginatedUsers.length > 0 ? (
                  <table className='min-w-full text-sm text-left'>
                    <thead className='bg-gray-100 text-gray-600'>
                      <tr>
                        <th className='p-3'></th>
                        <th className='p-3'>Nombre</th>
                        <th className='p-3'>Apellidos</th>
                        <th className='p-3'>Correo</th>
                        <th className='p-3'>Teléfono</th>
                        <th className='p-3'>Rol</th>
                        <th className='p-3'>Estado</th>
                        <th className='p-3'>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user) => (
                        <tr key={user.id} className='border-t hover:bg-gray-50'>
                          <td className='p-3'></td>
                          <td className='p-3'>{user.fullName}</td>
                          <td className='p-3'>{`${user.firstLastName} ${user.secondLastName}`}</td>
                          <td className='p-3'>{user.email}</td>
                          <td className='p-3'>{user.phone}</td>
                          <td className='p-3'>
                            <div className=''>
                              <span
                                className={`px-2 py-1 rounded-full text-white text-xs flex items-center ${
                                  user.role === 'ADMIN'
                                    ? 'bg-brandy-punch-700'
                                    : user.role === 'INTERNO'
                                    ? 'bg-brandy-punch-600'
                                    : 'bg-brandy-punch-300'
                                }`}
                              >
                                {user.role === 'ADMIN' && (
                                  <Shield className='mr-1' />
                                )}
                                {user.role === 'INTERNO' && (
                                  <CircleUserRound className='mr-1' />
                                )}
                                {user.role === 'EXTERNO' && (
                                  <CircleUserRound className='mr-1' />
                                )}
                                {user.role}
                              </span>
                            </div>
                          </td>
                          <td className='p-3'>
                            <input
                              type='checkbox'
                              className='ios8-switch'
                              checked={user.status}
                              onChange={() =>
                                changeStatus(user.id, user.status)
                              }
                            />
                          </td>

                          <td className='p-2'>
                            <button
                              className='bg-gradient-to-r from-brandy-punch-500 to-brandy-punch-600 hover:from-brandy-punch-600 hover:to-brandy-punch-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center'
                              onClick={() => {
                                setProfileData(user);
                                setIsEditProfileModalOpen(true);
                              }}
                            >
                              <UserPen className='mr-2' />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  !loading && (
                    <div style={{ color: 'red' }}>
                      Error al cargar los usuarios
                    </div>
                  )
                )}
              </div>

              {/* Paginación */}
              <div className='flex flex-col sm:flex-row justify-between items-center mt-4 text-sm text-gray-600 gap-2'>
                <p>
                  {Math.min(
                    (currentPage - 1) * USERS_PER_PAGE + 1,
                    filteredUsers.length
                  )}
                  -
                  {Math.min(currentPage * USERS_PER_PAGE, filteredUsers.length)}{' '}
                  de {filteredUsers.length}
                </p>
                <div className='flex items-center gap-2'>
                  <span>Filas por página: {USERS_PER_PAGE}</span>
                  <button
                    className='px-2 py-1 disabled:text-gray-400'
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  <span>
                    {currentPage}/{totalPages}
                  </span>
                  <button
                    className='px-2 py-1 disabled:text-gray-400'
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      {isAddUserModalOpen && (
        <AddUserModal
          onClose={() => {
            setIsAddUserModalOpen(false), fetchUsers();
          }}
        />
      )}
      {isEditProfileModalOpen && (
        <EditUserProfile
          profileData={profileData}
          onClose={() => setIsEditProfileModalOpen(false)}
          onSave={(updatedData) => {
            setProfileData(updatedData);
            setIsEditProfileModalOpen(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};

export default Users;
