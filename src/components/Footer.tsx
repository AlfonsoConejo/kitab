import { Link } from "react-router-dom"

export default function Footer(){
   return(
    <footer className="w-full bg-slate-950 border-t border-slate-900 py-8 text-slate-400 text-sm px-4 lg:px-6">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-6">  
        {/* Izquierda: Nombre y Copyright */}
        <div>
          <p className="font-semibold text-white text-center md:text-left">Kitab</p>
          <p className="text-xs mt-1">© {new Date().getFullYear()} Alfonso Conejo. Proyecto de portafolio.</p>
        </div>

        {/* Centro: Enlaces simulados del producto */}
        <div className="flex gap-6 text-xs">
          <Link to="features" className="hover:text-white transition">Funciones</Link>
          <Link to="about" className="hover:text-white transition">Acerca de</Link>
          <a href="https://github.com/AlfonsoConejo/kitab" target="_blank" rel="noreferrer" className="hover:text-white transition font-medium text-blue-400">
            Ver código en GitHub
          </a>
        </div>

        {/* Derecha: Redes/Contacto */}
        <div className="flex gap-4">
          <a href="https://www.linkedin.com/in/alfonso-conejo/" target="_blank" rel="noreferrer" className="hover:text-white transition">
            LinkedIn
          </a>
          <a href="https://github.com/AlfonsoConejo/" target="_blank" rel="noreferrer" className="hover:text-white transition">
            Portafolio
          </a>
        </div>

      </div>
    </footer>
   ) 
};