import { Link, useNavigate } from "react-router-dom";
import NoActivePeriodMessage from "@/components/NoActivePeriodMessage";
import { apiFetch } from "@/services/apiFetch";
import { useState, useEffect, useMemo } from "react"; // Añadido useMemo
import { notify } from "@/utils";
import { Pencil, Trash2 } from "lucide-react";
import ConfirmModal from "@/components/ConfirmModal";
import { usePeriod } from "@/context/PeriodContext";
import { formatDate } from "@/functions";

export default function Period() {

  const navigate = useNavigate();
  const { selectedPeriod, setSelectedPeriod } = usePeriod();

  const [periods, setPeriods] = useState([]);
  const [periodToDelete, setPeriodToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("Periods", periods)

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
    // 1. Creamos el día de hoy y le borramos las horas, minutos y segundos
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

  // Fetch all periods of the user
  useEffect(() => {
    async function fetchPeriods() {
      try {
        const res = await apiFetch("/api/periods", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
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

  // Mark period as selected
  async function handleSelectPeriod(periodId) {
    const clickedPeriod = periods.find(
      (p) => p.id === periodId
    );

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

      setPeriods((prev) =>
        prev.filter((p) => p.id !== period.id)
      );

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
        <h1 className="text-3xl font-semibold">Periodos</h1>
        <Link to="/app/periods/new" className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors">
          Nuevo periodo
        </Link>
      </div>

      <div className="flex-1">
        {/* 3. Control de carga para evitar que parpadee el mensaje de "No hay periodos" */}
        {isLoading ? (
          <div className="text-center p-6">Cargando periodos...</div>
        ) : periods.length === 0 ? (
          <NoActivePeriodMessage />
        ) : (
          <div className="w-full rounded-lg border border-gray-800 bg-gray-800 p-6 flex flex-col gap-3">
            
            {upcomingPeriods.length > 0 && (
              <div className="w-full flex flex-col gap-2">
                 <h2 className="text-xl font-semibold">
                    Próximamente ({upcomingPeriods.length})
                  </h2>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                  {upcomingPeriods.map((period) => (
                    <PeriodCard
                      key={period.id}
                      isSelected={period.id === selectedPeriod?.id}
                      period={period}
                      onSelect={handleSelectPeriod} 
                      onEdit={handleEditPeriod}
                      onDelete={setPeriodToDelete} />
                  ))}
                </div>
              </div>
            )}
            
            
            {currentPeriods.length > 0 && (
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-xl font-semibold">En curso ({currentPeriods.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                  {currentPeriods.map((period) => (
                    <PeriodCard 
                      key={period.id}
                      isSelected={period.id === selectedPeriod?.id}
                      period={period}
                      onSelect={handleSelectPeriod}
                      onEdit={handleEditPeriod} 
                      onDelete={setPeriodToDelete} />
                  ))}
                </div>
              </div>
            )}
            
            {previousPeriods.length > 0 && (
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-xl font-semibold">Finalizados ({previousPeriods.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
                  {previousPeriods.map((period) => (
                    <PeriodCard 
                      key={period.id}
                      isSelected={period.id === selectedPeriod?.id}
                      period={period}
                      onSelect={handleSelectPeriod}
                      onEdit={handleEditPeriod}
                      onDelete={setPeriodToDelete}  />
                  ))}
                </div>
              </div>
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

function PeriodCard({
  period,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}) {

  return (
    <div
      className={`
        group
        overflow-hidden
        rounded-xl
        border
        bg-gray-800
        transition-all

        ${
          isSelected
            ? "border-sky-500 ring-1 ring-sky-500/30"
            : "border-gray-700"
        }
      `}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-[1fr_auto] items-center gap-2 min-w-0">
              <h3 className="truncate text-lg font-bold text-white -translate-y-0.5">
                {period.name}
              </h3>

              <div
                className="h-5 w-5 rounded-sm"
                style={{ backgroundColor: period.color }}
              />
            </div>
            
            <p className="text-sm text-gray-400 mt-1">
              {formatDate(period.startDate)}
              {" → "}
              {formatDate(period.endDate)}
            </p>

            <div className="mt-4">
              {isSelected ? (
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-lg
                    bg-sky-500/10
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-sky-400
                  "
                >
                  ✓ Periodo seleccionado
                </div>
              ) : (
                <button
                  onClick={() => onSelect?.(period.id)}
                  className="
                    rounded-lg
                    bg-gray-700
                    px-3
                    py-2
                    text-sm
                    font-medium
                    text-gray-200
                    transition-colors
                    hover:bg-gray-600
                    cursor-pointer
                  "
                >
                  Seleccionar periodo
                </button>
              )}
            </div>

          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => onEdit?.(period)}
              className="
                p-2
                rounded-lg
                text-gray-400
                hover:text-white
                hover:bg-gray-700
                transition-colors
                cursor-pointer
              "
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={() => onDelete?.(period)}
              className="
                p-2
                rounded-lg
                text-red-400
                hover:bg-red-500/10
                transition-colors
                cursor-pointer
              "
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}