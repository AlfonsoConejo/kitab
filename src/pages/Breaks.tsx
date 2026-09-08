import EmptySection from "@/components/EmptySection";
import ConfirmModal from "@/components/ConfirmModal";
import NoActivePeriodMessage from "@/components/NoActivePeriodMessage";
import SectionLoader from "@/components/SectionLoader";
import { usePeriod } from "@/context/PeriodContext";
import { formatDate } from "@/functions";
import { notify } from "@/notify";
import { apiFetch } from "@/services/apiFetch";
import type { DayOff, GetDaysOffByPeriodResponse } from "@/types/dayOff";
import { Parasol, Pencil, Trash2 } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Breaks() {
  const navigate = useNavigate();
  const { selectedPeriod } = usePeriod();
  const [daysOff, setDaysOff] = useState<DayOff[]>([]);
  const [dayOffToDelete, setDayOffToDelete] = useState<DayOff | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Descansos";
  }, []);

  useEffect(() => {
    if (!selectedPeriod) {
      setDaysOff([]);
      setIsLoading(false);
      return;
    }

    const periodId = selectedPeriod.id;

    async function fetchDaysOff() {
      try {
        setIsLoading(true);

        const response = await apiFetch(`/api/periods/${periodId}/days-off`);

        if (!response.ok) {
          throw new Error("DAYS_OFF_ERROR");
        }

        const data: GetDaysOffByPeriodResponse = await response.json();

        if (!data.success) {
          throw new Error("DAYS_OFF_ERROR");
        }

        setDaysOff(data.data);
      } catch (error) {
        if (error instanceof Error && error.message === "SESSION_EXPIRED") {
          return;
        }

        notify("error", "No se pudieron cargar los días libres.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDaysOff();
  }, [selectedPeriod?.id]);

  function handleEditDayOff(dayOff: DayOff) {
    navigate(`/app/breaks/${dayOff.id}/edit`);
  }

  async function handleDeleteDayOff(dayOff: DayOff) {
    if (!selectedPeriod) {
      return;
    }

    try {
      const response = await apiFetch(
        `/api/periods/${selectedPeriod.id}/days-off/${dayOff.id}`,
        { method: "DELETE" },
      );

      if (!response.ok) {
        notify("error", "No se pudo eliminar el descanso.");
        return;
      }

      setDaysOff((currentDaysOff) =>
        currentDaysOff.filter((currentDayOff) => currentDayOff.id !== dayOff.id),
      );
    } catch (error) {
      if (error instanceof Error && error.message === "SESSION_EXPIRED") {
        return;
      }

      notify("error", "Error de conexión.");
    }
  }

  let content: ReactNode;
  if (isLoading) {
    content = <SectionLoader />;
  } else if (!selectedPeriod) {
    content = <NoActivePeriodMessage />;
  } else if (daysOff.length === 0) {
    content = (
      <EmptySection
        icon={Parasol}
        title="Aún no tienes días libres"
        description="Agrega días libres o vacaciones para mantener tu calendario al día."
        buttonText="Agregar días libres"
        buttonLink="/app/breaks/new"
      />
    );
  } else {
    content = (
      <DaysOffTable
        daysOff={daysOff}
        onEdit={handleEditDayOff}
        onDelete={setDayOffToDelete}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">Descansos</h1>
        {selectedPeriod && (
          <Link
            to="/app/breaks/new"
            className="shrink-0 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold transition-colors hover:bg-sky-500 cursor-pointer"
          >
            Agregar días libres
          </Link>
        )}
      </div>

      <div className="flex-1">{content}</div>

      {dayOffToDelete && (
        <ConfirmModal
          title="Eliminar descanso"
          message={`¿Seguro que deseas eliminar "${dayOffToDelete.name}"?`}
          variant="danger"
          onClose={() => setDayOffToDelete(null)}
          onConfirm={() => {
            void handleDeleteDayOff(dayOffToDelete);
            setDayOffToDelete(null);
          }}
        />
      )}
    </div>
  );
}

type DaysOffTableProps = {
  daysOff: DayOff[];
  onEdit: (dayOff: DayOff) => void;
  onDelete: (dayOff: DayOff) => void;
};

function DaysOffTable({ daysOff, onEdit, onDelete }: DaysOffTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[720px] overflow-hidden rounded-lg shadow-md">
        <table className="w-full bg-gray-800 text-left text-sm text-gray-400">
          <thead className="bg-gray-700 text-xs uppercase text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">Nombre</th>
              <th scope="col" className="px-4 py-3">Inicio</th>
              <th scope="col" className="px-4 py-3">Fin</th>
              <th scope="col" className="px-4 py-3">Notas</th>
              <th scope="col" className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {daysOff.map((dayOff, index) => (
              <tr
                key={dayOff.id}
                className={`border-b border-gray-700 ${
                  index === daysOff.length - 1 ? "border-b-0" : ""
                }`}
              >
                <th scope="row" className="px-4 py-3 font-medium text-white">
                  {dayOff.name || "Día libre"}
                </th>
                <td className="whitespace-nowrap px-4 py-3 text-gray-300">
                  {formatDate(dayOff.startDate)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-300">
                  {formatDate(dayOff.endDate)}
                </td>
                <td className="max-w-xs px-4 py-3 text-gray-300">
                  <span className="line-clamp-2">{dayOff.notes || "—"}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(dayOff)}
                      className="cursor-pointer rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                      title="Editar"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(dayOff)}
                      className="cursor-pointer rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/10"
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
