import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/utils/authUtils.js';
import Swal from 'sweetalert2';
import {
  LogOut,
  CircleUserRound,
  SquarePen,
  BotMessageSquare,
} from 'lucide-react';

const AsideBarExtern = ({ onToggle }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(() => {
    const saved = localStorage.getItem('isExpanded');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('isExpanded', JSON.stringify(isExpanded));
  }, [isExpanded]);

  const textClasses = `transition-all duration-200 ease-in-out ${
    isExpanded ? 'opacity-100 delay-200' : 'opacity-0 w-0 overflow-hidden'
  }`;

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    });

    if (result.isConfirmed) {
      logout();
      navigate('/');
    }
  };

  return (
    <>
      <div
        className={`fixed left-0 top-0 z-50 ${
          isExpanded ? 'w-[16em]' : 'w-[4em]'
        } transition-all duration-300 ease-in-out`}
      >
        <div
          className='flex flex-col h-screen bg-primary transition-all duration-300 ease-in-out rounded-r-2xl'
          onMouseEnter={() => {
            setIsExpanded(true);
            onToggle?.(true);
          }}
          onMouseLeave={() => {
            setIsExpanded(false);
            onToggle?.(false);
          }}
        >
          <div
            className='flex flex-col flex-grow justify-between'
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <div className='mt-32 flex flex-col items-center space-y-2'>
              <div
                className={`flex items-center ${
                  isExpanded
                    ? 'justify-start gap-4 h-10 w-[90%] px-4 rounded-2xl'
                    : 'justify-center w-[2.5em] h-[2.5em] rounded-full'
                } cursor-pointer   transition-all duration-300 ease-in-out hover:scale-105`}
              >
               {/**  <span className={`${textClasses} text-white`}>Historial</span> */}
              </div>
            </div>
          </div>

          <div className='flex flex-col items-center space-y-2 w-full pb-3 pt-3'>
            <div
              className={`flex items-center ${
                isExpanded
                  ? 'justify-start gap-4 h-10 w-[90%] px-4 rounded-2xl'
                  : 'justify-center w-[2.5em] h-[2.5em] rounded-full'
              } cursor-pointer bg-white hover:bg-slate-100 transition-all duration-300 ease-in-out hover:scale-105`}
              onClick={() => handleNavigation('/profileExtern')}
            >
              <CircleUserRound color='#CB842E' />

              <span className={`${textClasses} text-primary`}>Mi Perfil</span>
            </div>
            <div
              className={`flex items-center ${
                isExpanded
                  ? 'justify-start gap-4 h-10 w-[90%] px-4 rounded-2xl'
                  : 'justify-center w-[2.5em] h-[2.5em] rounded-full'
              } cursor-pointer bg-white hover:bg-red-200 transition-all duration-300 ease-in-out hover:scale-105`}
              onClick={handleLogout}
            >
              <LogOut color='#ef4444' />
              <span className={`${textClasses} text-red-500`}>
                Cerrar Sesion
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed top-4 left-4 z-50 flex items-center space-x-2 transition-all duration-300 ease-in-out ${
          isExpanded ? 'left-[17em]' : 'left-[5em]'
        }`}
      >
        <div className='flex items-center space-x-2 p-2 rounded-lg '>
          <SquarePen
            color='#CB842E'
            onClick={() => handleNavigation('/homeExtern')}
            className='cursor-pointer hover:scale-110 transition-transform duration-200'
            size={30}
          />
          <BotMessageSquare
            color='#CB842E'
            onClick={() => handleNavigation('/homeExtern')}
            className='cursor-pointer hover:scale-110 transition-transform duration-200'
            size={30}
          />
          <h1 className='text-lg font-semibold text-gray-800 hidden sm:block'>
            ChatBot
          </h1>
        </div>
      </div>
    </>
  );
};

export default AsideBarExtern;
