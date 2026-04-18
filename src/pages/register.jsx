import { Link } from "react-router-dom";

export default function RegisterForm() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">
        
        {/* HEADER */}
        <h1 className="text-white text-2xl font-semibold text-center mb-6">
          Crear cuenta
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
          
          {/* First Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="first_name"
              placeholder="Juan"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Apellido
            </label>
            <input
              type="text"
              name="last_name"
              placeholder="Pérez"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              name="password_hash"
              placeholder="••••••••"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md font-semibold transition"
          >
            Crear cuenta
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-gray-400 text-sm text-center mt-6">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}