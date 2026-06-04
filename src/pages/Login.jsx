import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import {useAuth} from  '../customHooks/useAuth' 
import logo from '../assets/logo-azul.png'


export default function LoginForm() {

  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from?.pathname || "/app/home";

  const { setUser } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  // States
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: ''});
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: ""
  });
  const [serverError, setServerError] = useState("");

  // Validate errors right after opening page
  const isSubmitDisabled =
  !formData.email.trim() ||
  !formData.password ||
  Object.values(errors).some(error => error) ||
  isSending;

  //Validate empty fields
  const validateField = (name, value) => {
    const trimmed = value.trim();

    switch (name) {
      case "email":
        const normalized = trimmed.toLowerCase();
        if (!normalized) return "El correo es obligatorio";
        if (!/\S+@\S+\.\S+/.test(normalized)) return "Correo inválido";
        return "";

      case "password":
        if (!value) return "La contraseña es obligatoria";
        if (value.length < 6) return "Debe tener al menos 6 caracteres";
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    const error = validateField(name, value);

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Revalidate fields one last time before sending
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);

    // Prevent data from being sent if there are errors
    const hasErrors = Object.values(newErrors).some(error => error);
    if (hasErrors) return;

    //Set the form as sending
    setIsSending(true);

    //Clean data before sending
    const cleanedData = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    //Clean setServerError message
    setServerError("");

    //Connection to validate user
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
        credentials: "include"
      });

      const loginData = await res.json();

      if (!res.ok) {
        setServerError(loginData.message || "Usuario o contraseña incorrectos");
        return;
      }

      const meRes = await fetch(`${API_URL}/api/auth/me`, {
        credentials: "include"
      });

      const meData = await meRes.json();

      if (!meRes.ok) {
        setServerError(meData.message || "Usuario o contraseña incorrectos");
        return;
      }

      setUser(meData.user);
      navigate(from, { replace: true });

    } catch (error) {
      setServerError("Error en el servidor");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    document.title = "Inicio de sesión";
  }, []);


  return (
    <div className="min-h-dvh w-full bg-gray-900 flex items-center justify-center px-4 py-4">
      <div className="w-full max-w-md">

        <div className='w-full flex justify-center items-center'>
          <Link to="/">
            <img className='w-16 h-auto' src={logo} alt="site logo" />
          </Link>
        </div>
        
        <div className="w-full max-w-md mt-4 bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">
        
          {/* HEADER */}
          <h1 className="text-white text-2xl font-semibold text-center mb-6">
            Iniciar sesión
          </h1>

          {/* SOCIAL 
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="border border-gray-600 bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600 transition">
              GitHub
            </button>
            <button className="border border-gray-600 bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600 transition">
              Google
            </button>
          </div>*

          <div className="text-center text-gray-400 text-sm mb-6">o</div>/}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {serverError && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-4 text-sm">
                {serverError}
              </div>
            )}
          
            {/* EMAIL */}
            <div>
              <label htmlFor="email" className="block text-sm text-gray-400 mb-1">
                Correo
              </label>
              <input
                onChange={handleChange}
                id="email"
                type="email"
                name="email"
                value={formData.email}
                placeholder="correo@email.com"
                maxLength={254}
                autoComplete="email"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label htmlFor="password" className="block text-sm text-gray-400 mb-1">
                Contraseña
              </label>

              <div className="relative">
                <input
                  onChange={handleChange}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  placeholder="••••••••"
                  maxLength={72}
                  autoComplete="password"
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
            <div className="flex items-center justify-center text-sm">
              <a href="#" className="text-blue-400 hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            {/* SUBMIT */}
            <button
              disabled={ isSubmitDisabled }
              type="submit"
              className="flex justify-center w-full bg-blue-600 text-white py-2 rounded-md font-semibold transition
                hover:bg-blue-500 cursor-pointer
                disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
              {isSending ? <div className="loader "></div> : 'Iniciar sesión' }
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-gray-400 text-sm text-center mt-6">
            ¿No tienes cuenta?{" "}
            <Link to="/auth/signup" className="text-blue-400 hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
      
    </div>
  );
}