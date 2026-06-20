import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useRef } from 'react';
import logo from '../../assets/logo-azul.png'
import { useClickOutside } from '@/customHooks/useClickOutside';

export default function LandingHeader() {

  const menuButtonRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  useClickOutside(menuButtonRef, () => setIsMenuOpen(false));
  
  return (
    <header className="relative px-4 lg:px-6 py-2.5 bg-gray-800">
      <div ref={menuButtonRef}>
        <nav className="flex flex-wrap justify-between items-center mx-auto max-w-7xl">
        
          {/* Left container */}
          <div className="flex items-center order-1 gap-1 " ref={menuButtonRef}>
            {/* Hamburger menu */}
            <button 
              type="button"
              className="inline-flex items-center p-1.5 text-sm lg:hidden text-gray-400 rounded-lg hover:bg-gray-700 cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span className="sr-only">Open main menu</span>
                {
                  isMenuOpen ? <X size={24} /> : <Menu size={24} />
                }
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img src={logo} className="mr-3 h-7 sm:h-8" alt="Site logo" />
              <span className="self-center text-xl font-semibold whitespace-nowrap text-white logo translate-y-[2px]">Kitab</span>
            </Link>
          </div>

          {/* Right container */}
          <div className="flex items-center order-2 lg:order-3">
            <Link 
              to="/auth/login" 
              className=" bg-white/5 hover:bg-white/10 text-gray-200 font-medium rounded-md text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 transition-all duration-200">
              Iniciar Sesión
            </Link>
            
            <Link
              to="/auth/signup"
              className="hidden sm:inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-md text-sm px-4 lg:px-5 py-2 lg:py-2.5 transition-all  duration-200 shadow-md shadow-blue-900/30"
            >
              Registrarse
            </Link>  
          </div>

          {/* Links */}
          <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-2">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 border-b border-gray-700
                    hover:text-white hover:bg-gray-700
                    lg:hover:bg-transparent lg:border-0 lg:p-0
                    ${isActive ? "text-white" : "text-gray-400"}`
                  }
                >
                  Inicio
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/features"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 border-b border-gray-700
                    hover:text-white hover:bg-gray-700
                    lg:hover:bg-transparent lg:border-0 lg:p-0
                    ${isActive ? "text-white" : "text-gray-400"}`
                  }
                >
                  Funciones
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `block py-2 pr-4 pl-3 border-b border-gray-700
                    hover:text-white hover:bg-gray-700
                    lg:hover:bg-transparent lg:border-0 lg:p-0
                    ${isActive ? "text-white" : "text-gray-400"}`
                  }
                >
                  Acerca de
                </NavLink>
              </li>       
            </ul>
          </div>
        </nav>

        {/* Mobile links*/}
        <div className={`
          absolute top-full left-0 w-full bg-gray-800 border-t border-gray-700 lg:hidden
          overflow-hidden transition-all duration-300 ease-in-out z-50
          ${isMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0"}
        `}>
          <ul className="flex flex-col">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-6 pr-4 py-4 text-md md:text-lg
                  hover:text-white hover:bg-gray-700
                  lg:hover:bg-transparent lg:border-0 lg:p-0
                  ${isActive ? "text-white" : "text-gray-400"}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/features"
                className={({ isActive }) =>
                  `block px-6 pr-4 py-4 text-md md:text-lg
                  hover:text-white hover:bg-gray-700
                  lg:hover:bg-transparent lg:border-0 lg:p-0
                  ${isActive ? "text-white" : "text-gray-400"}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Funciones
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `block px-6 pr-4 py-4 text-md md:text-lg
                  hover:text-white hover:bg-gray-700
                  lg:hover:bg-transparent lg:border-0 lg:p-0
                  ${isActive ? "text-white" : "text-gray-400"}`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                Acerca de
              </NavLink>
            </li>  
          </ul>
        </div>
      </div>
    </header>
  );
};