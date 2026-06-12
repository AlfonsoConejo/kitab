import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/logo-azul.png'

export default function LandingHeader() {
  return (
    <header className="px-4 lg:px-6 py-2.5 bg-gray-800">
      <nav className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
        
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} className="mr-3 h-6 sm:h-9" alt="Site logo" />
          <span className="self-center text-xl font-semibold whitespace-nowrap text-white">Organizador</span>
        </Link>

        <div className="flex items-center lg:order-2">
          <Link 
            to="/auth/login" 
            className=" bg-white/5 hover:bg-white/10 text-gray-200 focus:ring-4 focus:ring-gray-800 font-medium rounded-md text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none transition-all duration-200">
            Iniciar Sesión
          </Link>
          
          <Link
            to="/auth/signup"
            className="bg-blue-600 hover:bg-blue-500 text-white focus:ring-4 focus:ring-primary-300 font-semibold rounded-md text-sm px-4 lg:px-5 py-2 lg:py-2.5 mr-2 focus:outline-none transition-all  duration-200 shadow-md shadow-blue-900/30"
          >
            Registrarse
          </Link>
          
          <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="mobile-menu-2" aria-expanded="false">
            <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
              <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </button>
        </div>

        {/* Links */}
        <div className="hidden justify-between items-center w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
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
    </header>
  );
}