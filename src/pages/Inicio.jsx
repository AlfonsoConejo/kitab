import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import demo_periodos from "../assets/demo_periodos.png"

export default function Inicio() {

  useEffect(() => {
    document.title = "Organizador";
  }, []);

  return(
    <div className="min-h-dvh w-full bg-slate-950 bg-gradient-to-b from-blue-900/30 via-slate-950 to-slate-950">
      {/* CENTER WRAPPER */}
      <div className="mx-auto flex min-h-dvh max-w-7xl justify-center ">
        <section className=" w-full px-6 pt-18 sm:pt-32 pb-20">
          <div className=" z-10 mx-auto w-full">
            {/* Texto */}
            <div className="mx-auto max-w-4xl text-center">
              <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">
                Organiza materias, tareas y exámenes
              </span>

              <h1 className="mt-6 text-5xl font-bold tracking-tight text-white md:text-7xl">
                Todo tu semestre
                <br />
                en un solo lugar.
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
                Gestiona periodos escolares, materias, tareas y fechas
                importantes desde una plataforma diseñada para estudiantes.
              </p>

              <div className="mt-10 flex justify-center gap-4">
                <NavLink to="/auth/signup" className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500 cursor-pointer">
                Comenzar gratis
                </NavLink>

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
              </div>
            </div>

            {/* Screenshot */}
            <div className="mt-20 flex justify-center">
              <div className="w-full max-w-5xl">
                <img
                  src={demo_periodos}
                  alt="Vista previa de Organizador"
                  className="
                  w-full
                  rounded-sm
                  lg:rounded-3xl
                  border border-slate-700
                  shadow-2xl
                  "
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}