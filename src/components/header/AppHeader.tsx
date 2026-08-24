import { useState, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { notify } from '@/notify';
import { useClickOutside } from '@/customHooks/useClickOutside';
import avatarColors from '@/data/avatarColors';
import type { User } from '@/types/user';
import { useAuth } from '@/customHooks/useAuth';

interface MenuItem {
  label: string;
  action: () => void | Promise<void>;
}
interface AppHeaderProps {
  user: User;
}

export default function AppHeader({user}: AppHeaderProps) {

  const { logoutUser } = useAuth();
  const navigate = useNavigate();
  
  const avatarRef = useRef<HTMLDivElement | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  useClickOutside(avatarRef, () => setIsProfileMenuOpen(false));

  // Create avatar icon
  const firstLetter = user.firstName[0].toUpperCase();
  const colorIndex = firstLetter.charCodeAt(0) % avatarColors.length;
  const avatarColor = avatarColors[colorIndex];

  const handleSettings = () => {
    navigate("/app/settings");
  };


  const handleLogOut = async () => {
    await logoutUser();
    notify("success", "Sesión cerrada.");
  };

  //Array of Avatar button options
  const menuItems: MenuItem[] = [
  {
    label: "Configuración",
    action: handleSettings,
  },
  {
    label: "Cerrar sesión",
    action: handleLogOut,
  },
];

  return(
    <header>
      <nav className=" border-gray-200 px-4 lg:px-6 py-2.5 bg-gray-800">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-7x1">
          {/* Logo */}
          <Link to="/app/dashboard" className="flex items-center">
            <img src="/logo-azul.png" className="mr-3 h-7 sm:h-8" alt="Kitab logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white logo translate-y-0.5">Kitab</span>
          </Link>
          
          <div className='relative text-white' ref={avatarRef}>
            <div
              style={{ backgroundColor: avatarColor }}
              className={
                `flex items-center justify-center
                h-7 w-7 rounded-md
                text-white font-medium
                transition-all duration-300
                cursor-pointer select-none
                ${isProfileMenuOpen ? "ring-3 ring-gray-300/30" : "hover:ring-3 hover:ring-gray-300/30"}
                `
              }
              onClick={() => setIsProfileMenuOpen(prev => !prev)}
            >
              {firstLetter}
            </div>

            {
              // Drop down menu
              isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-lg bg-gray-700 shadow-lg overflow-hidden">
          
                <div className="p-4 cursor-default">
                  <p className="text-sm font-medium">{ `${user.firstName} ${user.lastName} `}</p>
                  <p className="text-sm text-gray-400">{user.email}</p>
                </div>

                <div className="border-t border-gray-600 my-1" />

                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full text-left text-sm px-4 py-2 hover:bg-slate-600 cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
              </div>)
            }
          </div>
        </div>
      </nav>
    </header>
  )
}