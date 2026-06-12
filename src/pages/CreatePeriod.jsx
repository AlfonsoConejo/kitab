import { CalendarDays } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { apiFetch } from "../services/apiFetch.js";

export default function CreatePeriod() {

  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // States
  const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '', color: '#EF4444'});
  const [isSending, setIsSending] = useState(false);
  const [serverError, setServerError] = useState("");

  // Validate errors right after opening page
  const isSubmitDisabled =
  !formData.name.trim() ||
  !formData.startDate ||
  !formData.endDate ||
  !formData.color ||
  isSending;

  const PERIOD_COLORS = [
    "#EF4444", // Red
    "#F97316", // Orange
    "#F59E0B", // Amber
    "#EAB308", // Yellow
    "#84CC16", // Lime
    "#22C55E", // Green
    "#10B981", // Emerald
    "#14B8A6", // Teal
    "#06B6D4", // Cyan
    "#0EA5E9", // Sky
    "#3B82F6", // Blue
    "#6366F1", // Indigo
    "#8B5CF6", // Violet
    "#A855F7", // Purple
    "#D946EF", // Fuchsia
    "#EC4899", // Pink

    "#DC2626",
    "#EA580C",
    "#CA8A04",
    "#65A30D",
    "#16A34A",
    "#059669",
    "#0F766E",
    "#0891B2",
    "#2563EB",
    "#4338CA",
    "#7C3AED",
    "#9333EA",
    "#C026D3",
    "#DB2777",
  ];

  const handleChange = (e) => {
    setServerError("");

    const { name, value } = e.target;

    if (name === "startDate") {
      setFormData(prev => ({
        ...prev,
        startDate: value,
        endDate: prev.endDate && prev.endDate < value ? "" : prev.endDate
      }));

      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color) => {
    setServerError("");
    setFormData(prev => ({
      ...prev,
      color
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Clean data before sending
    const cleanedData = {
      name: formData.name.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      color: formData.color
    };

    setIsSending(true);

    //Clean setServerError message
    setServerError("");

    try {
      const res = await apiFetch("/api/periods", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "No se pudo crear el periodo");    
        return;
      }
      navigate('/app/periods');
    } catch (error) {
      if (error.message === "SESSION_EXPIRED") {
        return;
      }
      setServerError("Error en el servidor");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">
          Nuevo periodo
        </h1>
      </div>

      <div className="max-w-2xl rounded-3xl border border-gray-800 bg-gray-800 p-8">
        {/* Header*/}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-900/40">
            <CalendarDays size={24} />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Información del periodo
            </h2>

            <p className="text-sm text-gray-400">
              Completa los datos básicos del periodo académico.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6" autoComplete="off">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-300"
            >
              Nombre del periodo
            </label>

            <input
              onChange={handleChange}
              id="name"
              name="name"
              type="text"
              placeholder="Ej. Agosto - Diciembre 2026"
              maxLength={30}
              value={formData.name}
              className="
                rounded-lg
                border
                border-gray-700
                bg-gray-900
                px-4
                py-3
                text-white
                placeholder:text-gray-500
                outline-none
                focus:border-cyan-600
              "
            />
          </div>

          {/* Dates */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="startDate"
                className="text-sm font-medium text-gray-300"
              >
                Fecha de inicio
              </label>

              <input
                onChange={handleChange}
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                max={formData.endDate || undefined}
                className="
                  rounded-lg
                  border
                  border-gray-700
                  bg-gray-900
                  px-4
                  py-3
                  text-white
                  outline-none
                  focus:border-cyan-600
                "
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="endDate"
                className="text-sm font-medium text-gray-300"
              >
                Fecha de finalización
              </label>

              <input
                disabled={!formData.startDate} 
                onChange={handleChange}
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                min={formData.startDate}
                className="
                  rounded-lg
                  border
                  border-gray-700
                  bg-gray-900
                  px-4
                  py-3
                  text-white
                  outline-none
                  focus:border-cyan-600

                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
              />
            </div>
          </div>
          
          <div className="w-full flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-300" >
              Color
            </label>
            <div
              className="
                grid grid-flow-col
                grid-rows-3 justify-between
                gap-y-6 w-full
              "
            >

              {PERIOD_COLORS.map((color) => (
                <button
                  onClick={() => handleColorChange(color)}
                  key={color}
                  type="button"
                  className={`
                    h-11
                    w-11
                    rounded-lg
                    transition-transform
                    cursor-pointer

                    ${
                      formData.color === color
                        ? 'ring-2 ring-white'
                        : 'border-2 border-gray-700'
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
            <h3 className="font-medium text-white">
              Recomendaciones
            </h3>

            <ul className="mt-2 space-y-1 text-sm text-gray-400">
              <li>
                • Utiliza nombres fáciles de identificar.
              </li>

              <li>
                • Podrás editar el periodo posteriormente.
              </li>
            </ul>
          </div>

          {serverError && (
            <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded text-sm">
              {serverError}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Link to="/app/periods"
              className="
                rounded-lg
                border
                border-gray-700
                px-4
                py-2
                text-gray-300
                hover:bg-gray-800
                cursor-pointer
                text-sm
                transition-colors
              "
            >
              Cancelar
            </Link>

            <button
              disabled={isSubmitDisabled}
              type="submit"
              className="
                rounded-lg
                bg-sky-600
                px-4
                py-2
                font-semibold
                text-sm
                text-white
                hover:bg-sky-500
                cursor-pointer
                transition-colors

                disabled:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              {isSending ? <div className="loader "></div> : 'Crear periodo' }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}