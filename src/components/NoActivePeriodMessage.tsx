import { CalendarPlus } from "lucide-react";
import { Link } from "react-router-dom";

export default function NoActivePeriodMessage() {
  return(
    <div className="flex flex-col justify-center items-center w-full h-full p-6 border border-dashed border-zinc-700 rounded-xl">
      <CalendarPlus
        size={48}
        className="text-zinc-400 mb-4"
      />

      <p className="text-xl font-medium text-center">
        Sin periodos disponibles
      </p>

      <p className="mt-2 max-w-md text-center text-zinc-400">
        Crea tu primer periodo para comenzar a organizar
        materias, tareas y exámenes.
      </p>

      <Link to="/app/periods/new" className="mt-6 bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer">
        Crear primer periodo
      </Link>
    </div>
  );
}; 