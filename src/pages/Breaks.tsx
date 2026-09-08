import EmptySection from "@/components/EmptySection";
import NoActivePeriodMessage from "@/components/NoActivePeriodMessage";
import SectionLoader from "@/components/SectionLoader";
import { usePeriod } from "@/context/PeriodContext";
import { formatDate } from "@/functions";
import { notify } from "@/notify";
import { apiFetch } from "@/services/apiFetch";
import type { DayOff, GetDaysOffByPeriodResponse } from "@/types/dayOff";
import { Parasol } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

export default function Breaks() {
  const { selectedPeriod } = usePeriod();
  const [daysOff, setDaysOff] = useState<DayOff[]>([]);
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
    content = <DaysOffTable daysOff={daysOff} />;
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
    </div>
  );
}

type DaysOffTableProps = {
  daysOff: DayOff[];
};

function DaysOffTable({ daysOff }: DaysOffTableProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[620px] overflow-hidden rounded-lg shadow-md">
        <table className="w-full bg-gray-800 text-left text-sm text-gray-400">
          <thead className="bg-gray-700 text-xs uppercase text-gray-400">
            <tr>
              <th scope="col" className="px-4 py-3">Nombre</th>
              <th scope="col" className="px-4 py-3">Inicio</th>
              <th scope="col" className="px-4 py-3">Fin</th>
              <th scope="col" className="px-4 py-3">Notas</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
