import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import demo_periodos from "../assets/demo_periodos.png"
import subjectsView from "../assets/subjects_view.png";
import calendarView from "../assets/calendar_view.png";
import breaksView from "../assets/breaks_view.png";
import { BookOpen, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Coffee, Play } from "lucide-react";
import allSprints from '../data/sprints';
import faqs from "@/data/faqs";

const productFeatures = [
  {
    title: "Tus materias y clases, bien organizadas",
    description: "Registra cada materia, sus horarios y detalles para tener tu carga académica clara desde el inicio del semestre.",
    image: subjectsView,
    alt: "Vista de materias y clases en Kitab",
    icon: BookOpen,
  },
  {
    title: "Visualiza toda tu semana",
    description: "Consulta tus clases en un calendario semanal o mensual y entiende tu horario en un vistazo.",
    image: calendarView,
    alt: "Vista de calendario semanal en Kitab",
    icon: CalendarDays,
  },
  {
    title: "Planea también tus descansos",
    description: "Aparta tiempo para desconectarte y mantén un semestre más equilibrado con tus días libres y vacaciones siempre a la vista.",
    image: breaksView,
    alt: "Vista de descansos en Kitab",
    icon: Coffee,
  },
];

export default function Inicio() {

  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const showPreviousFeature = () => {
    setActiveFeatureIndex((currentIndex) =>
      currentIndex === 0 ? productFeatures.length - 1 : currentIndex - 1
    );
  };

  const showNextFeature = () => {
    setActiveFeatureIndex((currentIndex) =>
      currentIndex === productFeatures.length - 1 ? 0 : currentIndex + 1
    );
  };

  useEffect(() => {
    document.title = "Inicio - Kitab";
  }, []);

  //Sprints data
  const latestSprint = allSprints[0];
  const recentSprints = allSprints.slice(0, 3);

  return(
    <div className="h-auto w-full text-white">
      {/* CENTER WRAPPER */}
      <div className="mx-auto flex flex-col w-full max-w-7xl justify-center">
        {/* Hero section */}
        <section className="w-full pl-6 lg:pl-14 pr-0 pt-16 sm:pt-22 pb-6 overflow-hidden">
          <div className="z-10 mx-auto w-full flex flex-col md:flex-row gap-3 items-start">
            {/* Text */}
            <div className="w-full flex-1 text-left pr-4 md:pr-0">

              <Link 
                to="features" 
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

              <h1 className="text-5xl font-bold tracking-tight text-white">
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
                    h-75 
                    sm:h-100
                    object-cover
                    object-top-left
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

        {/* New product features carousel */}
        <section className="w-full px-6 pt-16 sm:pt-18 pb-6 overflow-hidden">
          {(() => {
            const activeFeature = productFeatures[activeFeatureIndex];
            const previousFeature = productFeatures[
              activeFeatureIndex === 0 ? productFeatures.length - 1 : activeFeatureIndex - 1
            ];
            const nextFeature = productFeatures[
              activeFeatureIndex === productFeatures.length - 1 ? 0 : activeFeatureIndex + 1
            ];

            return (
              <div className="mx-auto max-w-6xl">
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-4xl">
                    Nuevas funcionalidades
                  </h2>
                </div>

                <div className="relative mt-10 overflow-hidden pb-2 sm:mt-12">
                  <div className="pointer-events-none absolute left-0 top-4 z-10 hidden h-[calc(100%-1rem)] w-[22%] overflow-hidden rounded-r-xl opacity-70 lg:block">
                    <img src={previousFeature.image} alt="" className="h-full w-full object-cover object-left" />
                  </div>

                  <div className="pointer-events-none absolute right-0 top-4 z-10 hidden h-[calc(100%-1rem)] w-[22%] overflow-hidden rounded-l-xl opacity-70 lg:block">
                    <img src={nextFeature.image} alt="" className="h-full w-full object-cover object-right" />
                  </div>

                  <div className="relative z-20 mx-auto w-full overflow-hidden border border-white/10 bg-slate-950 shadow-xl shadow-black/30 lg:w-[64%]">
                    <img
                      key={activeFeature.image}
                      src={activeFeature.image}
                      alt={activeFeature.alt}
                      className="h-auto w-full"
                    />

                    <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                      {productFeatures.map((feature, index) => (
                        <button
                          key={feature.title}
                          type="button"
                          onClick={() => setActiveFeatureIndex(index)}
                          className={`h-2.5 rounded-full border border-white/40 transition-all cursor-pointer ${
                            index === activeFeatureIndex
                              ? "w-7 bg-white"
                              : "w-2.5 bg-white/50 hover:bg-white/80"
                            }`}
                            aria-label={`Mostrar: ${feature.title}`}
                            aria-current={index === activeFeatureIndex ? "true" : undefined}
                          />
                        ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={showPreviousFeature}
                    className="absolute left-1 top-1/2 z-30 hidden -translate-y-1/2 rounded-lg border border-white/15 bg-slate-800/90 p-2 text-white shadow-sm transition hover:bg-slate-700 lg:block cursor-pointer"
                    aria-label="Ver funcionalidad anterior"
                  >
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={showNextFeature}
                    className="absolute right-1 top-1/2 z-30 hidden -translate-y-1/2 rounded-lg border border-white/15 bg-slate-800/90 p-2 text-white shadow-sm transition hover:bg-slate-700 lg:block cursor-pointer"
                    aria-label="Ver siguiente funcionalidad"
                  >
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="mx-auto mt-6 max-w-2xl text-center">
                  <h3 className="text-xl font-semibold text-white md:text-2xl">
                    {activeFeature.title}
                  </h3>
                  <p className="mt-3 text-slate-300">
                    {activeFeature.description}
                  </p>
                </div>

                <div className="mt-6 flex justify-center gap-3 lg:hidden">
                  <button
                    type="button"
                    onClick={showPreviousFeature}
                    className="rounded-lg border border-white/15 bg-slate-800 p-2 text-white transition hover:bg-slate-700 cursor-pointer"
                    aria-label="Ver funcionalidad anterior"
                  >
                    <ChevronLeft className="size-5" aria-hidden="true" />
                  </button>
                    
                  <button
                    type="button"
                    onClick={showNextFeature}
                    className="rounded-lg border border-white/15 bg-slate-800 p-2 text-white transition hover:bg-slate-700 cursor-pointer"
                    aria-label="Ver siguiente funcionalidad"
                  >
                    <ChevronRight className="size-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            );
          })()}
        </section>

        {/* Demo Section */}
        <section className="flex flex-col w-full px-6 pt-16 sm:pt-18 pb-6 overflow-hidden">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Demo del Progreso
          </h2>
          <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
            {/*Cada dos semanas, una nueva versión. Este es el recorrido real de Kitab,
            desde el primer commit hasta hoy.*/}
            Sigue la evolución de Kitab versión por versión. Cada sprint documenta nuevas 
            funcionalidades, decisiones técnicas y avances del producto desde el primer 
            commit hasta hoy.
          </p>
          
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">  
              {/* Last sprint column*/}
              <div className="rounded-xl overflow-hidden shadow-lg border border-white/10 bg-black/20">
                <div className="aspect-video w-full bg-black/50 flex items-center justify-center">
                  {/* Reemplaza este iframe con tu video de YouTube */}
                  <iframe 
                    className="w-full h-full"
                    src={latestSprint.videoUrl}
                    title="Demo Kitab"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    referrerPolicy="strict-origin-when-cross-origin" 
                    allowFullScreen></iframe>
                </div>
                <div className="p-4 bg-white/5">
                  <p className="text-sm text-gray-400">
                    Última versión:{" "}
                    <span className="text-white font-semibold">
                      {latestSprint.version} · {latestSprint.date}
                    </span>
                  </p>
                </div>
              </div>

              {/* Sprints table*/}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span>Actualizaciones recientes</span>
                </h3>

                <div className="space-y-4">
                  {recentSprints.map((sprint) => (
                    <div
                      key={sprint.version}
                      className="border-b border-white/10 pb-4 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-sm font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                              {sprint.version}
                            </span>
                            <span className="text-sm text-gray-400">
                              {sprint.date}
                            </span>
                          </div>
                          <p className="text-sm text-gray-300 mt-1">
                            {sprint.description}
                          </p>
                        </div>
                        <a
                          href={sprint.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium whitespace-nowrap ml-4 flex items-center gap-1"
                        >
                          <Play size={14} className="translate-y-px" /> Ver
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botones de acción */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link to="sprints" className="inline-flex items-center text-sm font-medium rounded-xl bg-blue-600 text-white hover:bg-blue-500 border border-blue-400/30 hover:border-blue-400/60 px-4 py-2 transition-colors">
                    Ver más sprints 
                  </Link>

                  <a
                    href="https://github.com/AlfonsoConejo/kitab"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-white transition-colors border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-700/50 px-4 py-2 rounded-xl"
                  >
                    Ver en GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
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

                      {/* Question button */}
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
