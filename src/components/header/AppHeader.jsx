import Logo from '../../assets/logo-azul.png'
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"

export default function AppHeader({user, setUser, authLoading}) {

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL;
  
  const avatarRef = useRef(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // Array of colors for Avatar
  const colors = [
    "#4ADE80",
    "#60A5FA",
    "#F87171",
    "#FACC15",
    "#FB923C",
    "#A16207",
    "#A78BFA"
  ];

  // Create avatar icon
  const firstLetter = user.first_name[0].toUpperCase();
  const colorIndex = firstLetter.charCodeAt(0) % colors.length;
  const avatarColor = colors[colorIndex];

  const handleSettings = () => {
    navigate("app/settings");
  };


  const handleLogOut = async () => {
    try {
      const res = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const resData = await res.json();

      if (!res.ok) {
        toast.error("Error al cerrar sesión");
        return;
      }

      console.log("Antes:", user);
      setUser(null);
      toast.success("Sesión cerrada correctamente");
      
    } catch (error) {
      console.error(error);
      toast.error("Error al cerrar sesión");
    }
  };

  useEffect(()=>{
    const handleOutsideClick = (event) =>{
      if(avatarRef.current && !avatarRef.current.contains(event.target)){
        setIsProfileMenuOpen(false);
      }      
    }

    // Mount event listener when site is loaded
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    }
  },[]);

  //Array of Avatar button options
  const menuItems = [
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
          <a href="https://flowbite.com" className="flex items-center">
            <img src={Logo} className="mr-3 h-6 sm:h-9" alt="Site Logo" />
            <span className="self-center text-xl font-semibold whitespace-nowrap text-white">Organizador</span>
          </a>
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
                  <p className="text-sm font-medium">{ `${user.first_name} ${user.last_name} `}</p>
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