import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import SectionLoader from "@/components/SectionLoader";
import { usePeriod } from "@/context/PeriodContext";
import { notify } from "@/notify";
import { apiFetch } from "@/services/apiFetch";
import type {
  DayOffFormData,
  GetDayOffResponse,
  SaveDayOffResponse,
} from "@/types/dayOff";

const initialFormData: DayOffFormData = {
  name: "",
  startDate: "",
  endDate: "",
  notes: "",
};

function formatLocalUpdatedAt(updatedAt: string): string {
  const date = new Date(updatedAt);

  if (Number.isNaN(date.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function BreaksForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { selectedPeriod, isLoadingPeriod } = usePeriod();

  const [formData, setFormData] = useState<DayOffFormData>(initialFormData);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [isLoadingDayOff, setIsLoadingDayOff] = useState(isEditMode);
  const [isSending, setIsSending] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    document.title = isEditMode ? "Editar descanso" : "Nuevo descanso";
  }, [isEditMode]);

  useEffect(() => {
    if (!isEditMode || !selectedPeriod) {
      return;
    }

    const periodId = selectedPeriod.id;

    async function fetchDayOff() {
      try {
        const response = await apiFetch(
          `/api/periods/${periodId}/days-off/${id}`,
        );
        const data: GetDayOffResponse = await response.json();

        if (!response.ok || !data.success) {
          notify("error", data.success ? "No se pudo obtener el descanso." : data.message);
          navigate("/app/breaks");
          return;
        }

        setFormData({
          name: data.data.name,
          startDate: data.data.startDate,
          endDate: data.data.endDate,
          notes: data.data.notes ?? "",
        });
        setUpdatedAt(data.data.updatedAt);
      } catch (error) {
        if (error instanceof Error && error.message === "SESSION_EXPIRED") {
          return;
        }

        notify("error", "Error de conexión.");
        navigate("/app/breaks");
      } finally {
        setIsLoadingDayOff(false);
      }
    }

    void fetchDayOff();
  }, [id, isEditMode, navigate, selectedPeriod]);

  const isSubmitDisabled =
    !formData.name.trim() ||
    !formData.startDate ||
    !formData.endDate ||
    isSending;

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setServerError("");

    const { name, value } = event.target;

    if (name === "startDate") {
      setFormData((currentFormData) => ({
        ...currentFormData,
        startDate: value,
        endDate:
          currentFormData.endDate && currentFormData.endDate < value
            ? ""
            : currentFormData.endDate,
      }));
      return;
    }

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedPeriod) {
      return;
    }

    const payload = {
      name: formData.name.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      notes: formData.notes.trim() || null,
    };

    const endpoint = isEditMode
      ? `/api/periods/${selectedPeriod.id}/days-off/${id}`
      : `/api/periods/${selectedPeriod.id}/days-off`;
    const method = isEditMode ? "PUT" : "POST";

    setIsSending(true);
    setServerError("");

    try {
      const response = await apiFetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data: SaveDayOffResponse = await response.json();

      if (!response.ok || !data.success) {
        setServerError(
          data.success
            ? "No se pudo guardar el descanso."
            : data.message,
        );
        return;
      }

      navigate("/app/breaks");
    } catch (error) {
      if (error instanceof Error && error.message === "SESSION_EXPIRED") {
        return;
      }

      setServerError("Error de conexión.");
    } finally {
      setIsSending(false);
    }
  }

  if (isLoadingPeriod) {
    return <SectionLoader />;
  }

  if (!selectedPeriod) {
    return <Navigate to="/app/periods" replace />;
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-white">
          {isEditMode ? "Editar descanso" : "Nuevo descanso"}
        </h1>
      </div>

      <div className="flex-1">
        {isLoadingDayOff ? (
          <SectionLoader />
        ) : (
          <>
            <div className="max-w-2xl rounded-lg border border-gray-800 bg-gray-800 p-8">
              <div className="mb-4 flex items-center gap-4 rounded-t border-b border-gray-600 pb-4 sm:mb-5">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Información del descanso
                  </h2>
                  <p className="text-sm text-gray-400">
                    Agrega un día libre o un intervalo sin clases para {selectedPeriod.name}.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6" autoComplete="off">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="mb-2 text-sm font-medium text-white">
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Ej. Día libre"
                  maxLength={60}
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="startDate" className="mb-2 text-sm font-medium text-white">
                    Fecha de inicio
                  </label>
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    min={selectedPeriod.startDate}
                    max={formData.endDate || selectedPeriod.endDate}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="endDate" className="mb-2 text-sm font-medium text-white">
                    Fecha de término
                  </label>
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    min={formData.startDate || selectedPeriod.startDate}
                    max={selectedPeriod.endDate}
                    disabled={!formData.startDate}
                    onChange={handleChange}
                    className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="notes" className="mb-2 text-sm font-medium text-white">
                  Notas <span className="text-gray-400">(opcional)</span>
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="Agrega información adicional si la necesitas."
                  maxLength={150}
                  value={formData.notes}
                  onChange={handleChange}
                  className="block w-full resize-y rounded-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {serverError && (
                <div className="rounded border border-red-500 bg-red-500/10 p-2 text-sm text-red-400">
                  {serverError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Link
                  to="/app/breaks"
                  className="cursor-pointer rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800"
                >
                  Cancelar
                </Link>
                <button
                  disabled={isSubmitDisabled}
                  type="submit"
                  className="cursor-pointer rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300 disabled:opacity-50"
                >
                  {isSending ? (
                    <div className="loader" />
                  ) : isEditMode ? (
                    "Guardar cambios"
                  ) : (
                    "Crear descanso"
                  )}
                </button>
              </div>
              </form>
            </div>

            {isEditMode && updatedAt && (
              <p className="mt-4 text-sm text-gray-400">
                Actualizado por última vez: {formatLocalUpdatedAt(updatedAt)}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
