import { Link, useNavigate } from "react-router-dom";
import NoActivePeriodMessage from "@/components/NoActivePeriodMessage";
import { apiFetch } from "@/services/apiFetch";
import { useState, useEffect, useMemo } from "react";
import { notify } from "@/utils";
import { Pencil, Trash2, CheckCircle, Circle } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import { usePeriod } from "@/context/PeriodContext";
import SectionLoader from "@/components/SectionLoader";
import { formatDate } from "@/functions";

export default function Period() {
  const navigate = useNavigate();
  const { selectedPeriod, setSelectedPeriod } = usePeriod();

  const [periods, setPeriods] = useState([]);
  const [periodToDelete, setPeriodToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const upcomingPeriods = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return periods.filter((period) => {
      const start = new Date(period.startDate);
      start.setHours(0, 0, 0, 0);
      return start > today;
    });
  }, [periods]);

  const currentPeriods = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return periods.filter((period) => {
      const start = new Date(period.startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(period.endDate);
      end.setHours(0, 0, 0, 0);
      return start <= today && end >= today;
    });
  }, [periods]);

  const previousPeriods = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return periods.filter((period) => {
      const end = new Date(period.endDate);
      end.setHours(0, 0, 0, 0);
      return end < today;
    });
  }, [periods]);
  
  // Set the document title
  useEffect(() => {
    document.title =  "Periodos";
  }, []); 

  useEffect(() => {
    async function fetchPeriods() {
      try {
        const res = await apiFetch("/api/periods", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          notify("error", "Hubo un error en el servidor.");
          return;
        }

        const data = await res.json();
        setPeriods(data.data || []);
      } catch (error) {
        if (error.message !== "SESSION_EXPIRED") {
          notify("error", "Error de conexión.");
        }
      } finally {
        setIsLoading(false);
      }
    }
    fetchPeriods();
  }, []);

  async function handleSelectPeriod(periodId) {
    const clickedPeriod = periods.find((p) => p.id === periodId);
    if (!clickedPeriod) {
      notify("error", "No se encontró el periodo");
      return;
    }
    setSelectedPeriod(clickedPeriod);
  }

  async function handleEditPeriod(period) {
    navigate(`/app/periods/${period.id}/edit`);
  }

  async function handleDeletedPeriod(period) {
    try {
      const res = await apiFetch(`/api/periods/${period.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        notify("error", "No se pudo eliminar el periodo");
        return;
      }

      setPeriods((prev) => prev.filter((p) => p.id !== period.id));

      if (selectedPeriod?.id === period.id) {
        setSelectedPeriod(null);
      }
    } catch {
      notify("error", "Error de conexión");
    }
  }

  return (
    <div className="flex flex-col flex-1 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-white">Periodos</h1>
        <Link
          to="/app/periods/new"
          className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
        >
          Nuevo periodo
        </Link>
      </div>

      <div className="flex-1">
        {isLoading ? (
          <SectionLoader />
        ) : periods.length === 0 ? (
          <NoActivePeriodMessage />
        ) : (
          <div className="w-full flex flex-col gap-6">
            {/* Próximamente */}
            {upcomingPeriods.length > 0 && (
              <PeriodSection
                title="Próximamente"
                periods={upcomingPeriods}
                selectedPeriod={selectedPeriod}
                onSelect={handleSelectPeriod}
                onEdit={handleEditPeriod}
                onDelete={setPeriodToDelete}
              />
            )}

            {/* En curso */}
            {currentPeriods.length > 0 && (
              <PeriodSection
                title="En curso"
                periods={currentPeriods}
                selectedPeriod={selectedPeriod}
                onSelect={handleSelectPeriod}
                onEdit={handleEditPeriod}
                onDelete={setPeriodToDelete}
              />
            )}

            {/* Finalizados */}
            {previousPeriods.length > 0 && (
              <PeriodSection
                title="Finalizados"
                periods={previousPeriods}
                selectedPeriod={selectedPeriod}
                onSelect={handleSelectPeriod}
                onEdit={handleEditPeriod}
                onDelete={setPeriodToDelete}
              />
            )}
          </div>
        )}

        {periodToDelete && (
          <ConfirmModal
            title="Eliminar periodo"
            message={`¿Seguro que deseas eliminar "${periodToDelete.name}"?`}
            variant="danger"
            onClose={() => setPeriodToDelete(null)}
            onConfirm={() => {
              handleDeletedPeriod(periodToDelete);
              setPeriodToDelete(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================
// COMPONENTE: Sección de periodos (tabla con estilo tarjeta)
// ============================================================
function PeriodSection({
  title,
  periods,
  selectedPeriod,
  onSelect,
  onEdit,
  onDelete,
}) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-3">
        <h2 className="text-lg font-semibold text-white -translate-y-0.5">{title}</h2>
        <span className="inline-flex items-center justify-center bg-gray-700 text-gray-300 text-xs font-medium px-3 min-h-[1.5rem] rounded-full">
          {periods.length}
        </span>
      </div>

      {/* Table with card-style */}
      <div className="overflow-x-auto">
        <div className="w-full min-w-[540px] overflow-hidden rounded-lg shadow-md">
          <table className="w-full text-sm text-left text-gray-400 bg-gray-800">
            <thead className="bg-gray-700 text-xs uppercase text-gray-400">
              <tr>
                <th scope="col" className="text-left px-4 py-3">
                  Periodo
                </th>
                <th scope="col" className="text-left px-4 py-3">
                  Inicio
                </th>
                <th scope="col" className="text-left px-4 py-3">
                  Fin
                </th>
                <th  scope="col" className="text-right px-4 py-3">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {periods.map((period, index) => {
                const isSelected = period.id === selectedPeriod?.id;
                return (
                  <tr
                    key={period.id}
                    className={`
                      border-b border-gray-700
                      ${index === periods.length - 1 ? "border-b-0" : ""}
                    `}
                  >
                    {/* Columna: Nombre + color */}
                    <th 
                      scope="row" 
                      className="px-4 py-3 font-medium text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: period.color }}
                          />
                          <span className="font-medium text-white truncate">
                            {period.name}
                          </span>
                        </div>
                    </th>

                    {/* Columna: Fechas de inicio */}
                    <td scope="row" className="px-4 py-3">
                      <span className="text-sm text-gray-300 whitespace-nowrap">
                        {formatDate(period.startDate)}
                      </span>
                    </td>

                    {/* Columna: Fechas de finalización*/}
                    <td scope="row" className="px-4 py-3">
                      <span className="text-sm text-gray-300 whitespace-nowrap">
                        {formatDate(period.endDate)}
                      </span>
                    </td>

                    {/* Columna: Acciones */}
                    <td scope="row" className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {/* Estado / Botón seleccionar */}
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-900 text-blue-300 px-3 py-1.5 rounded">
                            <CheckCircle size={14} />
                            Seleccionado
                          </span>
                        ) : (
                          <button
                            onClick={() => onSelect?.(period.id)}
                            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded transition-colors cursor-pointer"
                          >
                            <Circle size={14} />
                            Seleccionar
                          </button>
                        )}

                        {/* Botones editar/eliminar */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEdit?.(period)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer"
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => onDelete?.(period)}
                            className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}