import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import demo_periodos from "../assets/demo_periodos.png"
import { ChevronDown, ChevronRight } from "lucide-react";

export default function Inicio() {

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    document.title = "Organizador";
  }, []);

  // Questions
  const faqs = [
    {
      question: "¿Kitab es realmente gratuito?",
      answer: "Sí. Kitab sigue una filosofía de código abierto (Open Source). Está siendo desarrollado activamente como parte de mi portafolio profesional y puedes utilizarlo sin costo."
    },
    {
      question: "¿Cómo se guardan mis datos?",
      answer: "Las contraseñas se almacenan de forma segura utilizando bcrypt. Ningún dato sensible es expuesto al frontend y todas las consultas a la base de datos están protegidas mediante consultas parametrizadas para prevenir inyecciones SQL."
    },
    {
      question: "¿Qué son los periodos?",
      answer: "Los periodos representan ciclos escolares, como semestres o cuatrimestres. Te permiten organizar materias, tareas, exámenes y calificaciones sin mezclar información de distintos ciclos académicos."
    },
    {
      question: "¿Puedo acceder a mi información desde distintos dispositivos?",
      answer: "Sí. Al iniciar sesión con tu cuenta, tu información estará disponible en cualquier dispositivo."
    }
  ];

  return(
    <div className="h-auto w-full bg-slate-950 bg-linear-to-b from-blue-900/30 via-slate-950 to-slate-950  text-white">
      {/* CENTER WRAPPER */}
      <div className="mx-auto flex flex-col w-full max-w-7xl justify-center">
        {/* Hero section */}
        <section className="w-full pl-6 lg:pl-14 pr-0 pt-16 sm:pt-22 pb-6 overflow-hidden">
          <div className="z-10 mx-auto w-full flex flex-col md:flex-row gap-3 items-start">
            {/* Text */}
            <div className="w-full flex-1 text-left pr-4 md:pr-0">

              <Link 
                to="features/" 
                className="
                  group
                  inline-flex 
                  items-center 
                  gap-2 
                  rounded-full 
                  border 
                  border-slate-600 
                  bg-slate-900/40 
                  px-3 
                  py-1 
                  text-sm 
                  font-medium 
                  text-slate-300 
                  transition-all 
                  duration-300 
                  hover:border-white
                  hover:text-white
                  mb-6
                  cursor-pointer
                "
              >
                <span className="translate-y-[-1.5px]">Descubre las funciones</span>
                
                <ChevronRight 
                  className="
                    w-3.5 
                    h-3.5 
                    text-slate-300
                    transition-transform 
                    duration-300 
                    group-hover:text-white
                  " 
                />
              </Link>

              <h1 className=" text-5xl font-bold tracking-tight text-white md:text-5xl">
                Todo tu semestre
                <br />
                en un solo lugar.
              </h1>

              <p className="mt-6 max-w-xl text-lg text-slate-300">
                Organiza tu caos universitario. Todo tu semestre, a un clic. Totalmente gratuito.
              </p>

              <div className="mt-5 lg:mt-10 flex justify-start gap-4">
                <NavLink to="/auth/signup" className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500 cursor-pointer">
                Comenzar gratis
                </NavLink>

                {/* 
                  <NavLink to="features" className="
                    rounded-xl
                    border border-slate-700
                    px-6 py-3
                    font-medium
                    text-white
                    transition
                    hover:border-blue-500/50
                    hover:bg-blue-500/10
                    cursor-pointer
                  ">
                    Ver funciones
                  </NavLink>
                */}
                
              </div>
            </div>

            {/* Screenshot */}
            <div className="flex flex-col md:flex-row justify-end items-end md:items-start flex-1 md:self-start mt-6 lg:mt-0 w-full">
              <div className="w-full max-w-5xl flex flex-col items-end md:flex-row md:justify-end">
                <img
                  src={demo_periodos}
                  alt="Vista previa de Organizador"
                  className="
                    w-full 
                    md:w-[calc(50vw-3.5rem)]
                    h-[300px] 
                    sm:h-[400px]
                    object-cover
                    object-left-top
                    rounded-sm
                    lg:rounded-sm
                    [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1)_85%,rgba(0,0,0,0)_100%),linear-gradient(to_right,rgba(0,0,0,1)_85%,rgba(0,0,0,0)_100%)]
                    [mask-composite:intersect]
                  "
                />
              </div>
            </div>

          </div>
        </section>

        {/* Progress Section */}
        <section className="flex flex-col md:flex-row w-full px-6 pt-16 sm:pt-18 pb-6 overflow-hidden">
          <h2>Demostración del progreso</h2>
          <p>Última actualización: 19 de junio de 2026</p>
          <p>Nuevo video cada 2 semanas - Así evoluciona Kitab</p>
        </section>

        {/* Frequently asked questions */}
        <section className="flex flex-col md:flex-row w-full px-6 pt-16 sm:pt-18 pb-6 overflow-hidden">
          {/* Title */}
          <div className="flex flex-1 text-3xl font-light">Preguntas Frecuentes</div>

          {/* Questions Container */}
          <div className="flex flex-1 flex-col pt-6 md:pt-0">
            {/* Questions accordeon */
            faqs.map((faq, index) =>{
              const isOpen = openIndex === index;
              return(
                <div key={index} 
                className="border border-slate-900 bg-white/7 overflow-hidden transition-colors duration-300">

                  {/* Botón de la Pregunta */}
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center p-5 text-left text-white font-medium hover:bg-slate-900/40 transition-colors gap-2 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown 
                      className={`w-5 h-5 min-w-5 min-h-5 text-slate-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-blue-500" : ""
                      }`}
                    />
                  </button>

                  {/* Contenedor del Acordeón Animado (El truco de Grid) */}
                  <div 
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >

                    {/* Contenedor interno con overflow-hidden obligatorio */}
                    <div className="overflow-hidden">
                      <p className="p-5 pt-0 text-slate-400 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })
            }

          </div>
        </section>
      </div>
    </div>
  )
}