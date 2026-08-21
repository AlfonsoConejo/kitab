import { Zap, Palette, Lock } from "lucide-react"
import personal_photo from "@/assets/personal_photo.jpg"
import { useEffect } from "react"

export default function About() {

  useEffect(() => {
    document.title = "Acerca de - Kitab";
  }, []);

  return(
    <div className="h-auto w-full text-white">
      {/* CENTER WRAPPER */}
      <div className="mx-auto flex flex-col w-full max-w-7xl justify-center">

        {/* About Kitab */}
        <section className="flex flex-col w-full max-w-4xl mx-auto px-6 pt-10 sm:pt-12 pb-6 overflow-hidden gap-6">

          {/* Title */}
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Kitab: simplicidad con propósito.
          </h1>

          {/* Text */}
          <p className="text-slate-300 text-left">
            Kitab es una agenda escolar en desarrollo cuyo objetivo es combinar diseño, 
            rendimiento y funcionalidades útiles para los estudiantes. El proyecto surge 
            de la idea de ofrecer una experiencia más moderna y cuidada, sin perder de 
            vista la simplicidad y la facilidad de uso.
          </p>

          <p className="text-slate-300 leading-relaxed">
            Actualmente, Kitab se encuentra en desarrollo activo. Cada nueva función es 
            diseñada, implementada y probada antes de formar parte de la aplicación, con 
            especial atención a la confiabilidad, la experiencia de usuario y el rendimiento.
          </p>

          {/* Cards Div */}
          <div>
            {/* Features ⚡🎨🔓 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl shadow-sm border border-slate-900 bg-slate-800">
                <div className="text-2xl text-[#fb8948] mb-2"><Zap size={24} /></div>
                <h4 className="font-semibold text-white text-sm">Rendimiento</h4>
                <p className="text-slate-400 text-xs">Carga rápida, sin sacrificar calidad.</p>
              </div>
              <div className="p-4 rounded-xl shadow-sm border border-slate-900 bg-slate-800">
                <div className="text-2xl text-[#ffb7a7] mb-2"><Palette size={24} /></div>
                <h4 className="font-semibold text-white text-sm">Diseño adaptable</h4>
                <p className="text-slate-400 text-xs">Se verá bien en cualquier pantalla.</p>
              </div>
              <div className="p-4 rounded-xl shadow-sm border border-slate-900 bg-slate-800">
                <div className="text-2xl text-[#fdb44e] mb-2"><Lock size={24} /></div>
                <h4 className="font-semibold text-white text-sm">Código abierto</h4>
                <p className="text-slate-400 text-xs">Disponible en GitHub.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-col w-full max-w-4xl mx-auto px-6 pt-10 sm:pt-12 pb-6 overflow-hidden gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Photo column */}
            <div className="flex justify-center order-2 lg:order-1">
              <div className="">
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gray-600 flex items-center justify-center shadow-xl">
                  <img src={personal_photo} alt="Alfonso Conejo" className="w-full h-full rounded-full object-cover" />
                </div>
              </div>
            </div>

            {/* Descripción column */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                Detrás del código: <span className="text-orange-600">Alfonso Conejo</span>
              </h2>
              <p className="text-slate-200 text-left mb-4">Desarrollador Full-Stack con enfoque en UX</p>

              <p className="text-slate-300 leading-relaxed mb-4">
                Disfruto diseñar interfaces claras, desarrollar backend escalables y convertir ideas 
                en aplicaciones funcionales. A través de Kitab pongo en práctica conceptos de 
                arquitectura, experiencia de usuario, autenticación, bases de datos y desarrollo de 
                software en un entorno similar al de un producto real.
              </p>

              {/* Social media */}
              <div className="flex flex-wrap gap-3 mt-6">
                <a 
                  href="https://github.com/AlfonsoConejo"
                  target="_blank" rel="noreferrer" 
                  className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-full hover:bg-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  GitHub
                </a>
                <a 
                  href="https://www.linkedin.com/in/alfonso-conejo/" 
                  target="_blank" rel="noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  LinkedIn
                </a>
                { /*
                  <a 
                    href="#" 
                    className="inline-flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 text-sm font-medium rounded-full hover:bg-indigo-200 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9"/></svg>
                    Portafolio
                  </a>
                */ }
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}