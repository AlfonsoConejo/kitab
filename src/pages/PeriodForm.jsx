import { CalendarDays } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/apiFetch.js";
import { useParams } from "react-router-dom";
import { notify } from "@/utils.jsx";
import { usePeriod } from "@/context/PeriodContext.jsx";
import ColorPicker from "@/components/ColorPicker.jsx";

export default function PeriodForm() {

  const { selectedPeriod, setSelectedPeriod } = usePeriod();
  const navigate = useNavigate();

  // States
  const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '', color: '#EF4444'});
  const [isSending, setIsSending] = useState(false);
  const [serverError, setServerError] = useState("");

  //Detect if it is a Creation Form or an Edition Form
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [isLoadingPeriod, setIsLoadingPeriod] = useState(isEditMode);

  // Get the information of the period if user is editing one
  useEffect(() => {
    if (!isEditMode) return;

    const getPeriod = async () => {
      try {
        const res = await apiFetch(`/api/periods/${id}`, {
          method: "GET",
        });

        const data = await res.json();

        if (!res.ok) {
          notify("error", "No se pudo obtener el periodo");
          navigate("/app/periods");
          return;
        }

        setFormData({
          name: data.data.name,
          startDate: data.data.startDate,
          endDate: data.data.endDate,
          color: data.data.color,
        });

      } catch (error) {
        notify("error", "Error de conexión");
        navigate("/app/periods");
      } finally {
        setIsLoadingPeriod(false);
      }
    };

    getPeriod();
  }, [id, isEditMode, navigate]);
    
  // Validate errors right after opening page
  const isSubmitDisabled =
  !formData.name.trim() ||
  !formData.startDate ||
  !formData.endDate ||
  !formData.color ||
  isSending;

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

    const endpoint = isEditMode
      ? `/api/periods/${id}`
      : "/api/periods";

    const method = isEditMode ? "PUT" : "POST";

    try {
      const res = await apiFetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(
          data.message ||
          (isEditMode
            ? "No se pudo actualizar el periodo"
            : "No se pudo crear el periodo")
        );   
        return;
      }

      if (isEditMode && Number(selectedPeriod?.id) === Number(id)) {
        setSelectedPeriod(data.data);
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

  if (isLoadingPeriod) {
    return (
      <div className="flex justify-center p-8">
        Cargando periodo...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">
          {isEditMode ? "Editar Periodo" : "Nuevo periodo"}
        </h1>
      </div>

      <div className="max-w-2xl rounded-lg border border-gray-800 bg-gray-800 p-8">
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
          
          <ColorPicker
            value={formData.color}
            onChange={handleColorChange}
          />

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
              {isSending
                ? <div className="loader"></div>
                : isEditMode
                  ? "Guardar cambios"
                  : "Crear periodo"
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}