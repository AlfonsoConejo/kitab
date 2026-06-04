import { Link, useNavigate } from "react-router-dom";
import { IoIosCloseCircleOutline } from "react-icons/io";
import React, { useState, useEffect } from 'react';
import { useAuth } from "../customHooks/useAuth";
import logo from '../assets/logo-azul.png'
import './../App.css';

export default function RegisterForm() {

  const navigate = useNavigate();
  const { setUser } = useAuth();
  const API_URL = import.meta.env.VITE_API_URL;

  // States
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: ''});
  const [errors, setErrors] = useState({ firstName: '', lastName: '', email: '', password: ''});
  const [touched, setTouched] = useState({ firstName: false, lastName: false, email: false, password: false});
  const [isSending, setIsSending] = useState(false);
  const [serverError, setServerError] = useState("");

  // Validate errors right after opening page
  const isSubmitDisabled =
  !formData.firstName ||
  !formData.lastName ||
  !formData.email.trim() ||
  !formData.password ||
  Object.values(errors).some(error => error) ||
  isSending;

  const handleChange = (e) => {
    let { name, value } = e.target;

    //Only letters allowed in name fields
    if (name === "firstName" || name === "lastName") {
      value = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    let { name, value } = e.target;

    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    const error = validateField(name, value);

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };


  const validateField = (name, value) => {
    const trimmed = value.trim();

    switch (name) {
      case "firstName":
        if (!trimmed) return "El nombre es obligatorio";
        return "";

      case "lastName":
        if (!trimmed) return "El apellido es obligatorio";
        if (trimmed.length < 2) return "Debe tener al menos 2 caracteres";
        return "";

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Revalidate fields one last time before sending
    const newErrors = {
      firstName: validateField("firstName", formData.firstName),
      lastName: validateField("lastName", formData.lastName),
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);

    // Prevent data from being sent if there are errors
    const hasErrors = Object.values(newErrors).some(error => error);
    if (hasErrors) return;

    //Set the form as sending
    setIsSending(true);

    //Clean setServerError message
    setServerError("");

    // Clean data for sending
    const cleanedData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
    };

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
        credentials: "include"
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Error en el registro");
        return;
      }

      // Automatic login after register
      const resLogin = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanedData.email,
          password: cleanedData.password
        }),
        credentials: "include"
      });

      const loginData = await resLogin.json();

      if (!resLogin.ok) {
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
      navigate("/app/home");

    } catch (error) {
      setServerError("Error en el servidor");
    } finally {
      setIsSending(false);
    }
  };


  useEffect(() => {
    document.title = "Registro";
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
            Crear cuenta
          </h1>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4" >

            {serverError && (
              <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded mb-4 text-sm">
                {serverError}
              </div>
            )}
            
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block text-sm text-gray-400 mb-1">
                Nombre
              </label>
              <input onChange={handleChange}
                onBlur={handleBlur}
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                placeholder="Juan"
                maxLength={50}
                className={`w-full bg-gray-700 border rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1
                ${
                  touched.firstName && errors.firstName
                    ? "border-red-400 focus:border-blue-500 focus:ring-blue-500"
                    : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                }`
              }
              />

              {touched.firstName && errors.firstName && (
                <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                  <IoIosCloseCircleOutline className="text-base"/>
                  {errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block text-sm text-gray-400 mb-1">
                Apellido
              </label>
              <input onChange={handleChange}
                onBlur={handleBlur}
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                placeholder="Pérez"
                maxLength={50}
                className={`w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1
                  ${
                    touched.lastName && errors.lastName
                      ? "border-red-400 focus:border-blue-500 focus:ring-blue-500"
                      : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  }`
                }
              />

              {touched.lastName && errors.lastName && (
                <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                  <IoIosCloseCircleOutline className="text-base"/>
                  {errors.lastName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email"  className="block text-sm text-gray-400 mb-1">
                Correo
              </label>
              <input onChange={handleChange}
                onBlur={handleBlur}
                id="email"
                type="email"
                name="email"
                value={formData.email}
                placeholder="correo@email.com"
                maxLength={254}
                autoComplete="email"
                className={`w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1
                  ${
                    touched.email && errors.email
                      ? "border-red-400 focus:border-blue-500 focus:ring-blue-500"
                      : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  }`
                }
              />
              {touched.email && errors.email && (
                <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                  <IoIosCloseCircleOutline className="text-base"/>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm text-gray-400 mb-1">
                Contraseña
              </label>
              <input onChange={handleChange}
                onBlur={handleBlur}
                id="password"
                type="password"
                name="password"
                value={formData.password}
                placeholder="••••••••"
                maxLength={72}
                autoComplete="new-password"
                className={`w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1
                  ${
                    touched.password && errors.password
                      ? "border-red-400 focus:border-blue-500 focus:ring-blue-500"
                      : "border-gray-600 focus:border-blue-500 focus:ring-blue-500"
                  }`
                }
              />

              {touched.password && errors.password && (
                <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                  <IoIosCloseCircleOutline className="text-base"/>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              disabled={ isSubmitDisabled }
              type="submit"
              className="flex justify-center w-full bg-blue-600 text-white py-2 rounded-md font-semibold transition
                hover:bg-blue-500 cursor-pointer
                disabled:bg-blue-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
              {isSending ? <div className="loader "></div> : 'Crear cuenta' }
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-gray-400 text-sm text-center mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/auth/login" className="text-blue-400 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}