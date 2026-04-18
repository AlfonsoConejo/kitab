import { Link } from 'react-router-dom';
import { useState } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">
        
        {/* HEADER */}
        <h1 className="text-white text-2xl font-semibold text-center mb-6">
          Iniciar sesión
        </h1>

        {/* SOCIAL */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button className="border border-gray-600 bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600 transition">
            GitHub
          </button>
          <button className="border border-gray-600 bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600 transition">
            Google
          </button>
        </div>

        <div className="text-center text-gray-400 text-sm mb-6">o</div>

        {/* FORM */}
        <form className="space-y-4">
          
          {/* EMAIL */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Correo
            </label>
            <input
              type="email"
              name="email"
              placeholder="correo@email.com"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Contraseña
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 pr-10 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              {/* TOGGLE */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-white text-sm"
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </div>

          {/* OPTIONS */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-400">
              <input type="checkbox" className="accent-blue-500" />
              Recordarme
            </label>

            <a href="#" className="text-blue-400 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md font-semibold transition"
          >
            Iniciar sesión
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-gray-400 text-sm text-center mt-6">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}