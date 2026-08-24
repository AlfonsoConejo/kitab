import { CalendarDays, LayoutDashboard, BookOpen, Users, Parasol, FileSpreadsheet, ClipboardList} from "lucide-react";
import { NavLink } from "react-router-dom";
import { usePeriod } from "@/context/PeriodContext";

export default function Sidebar() {

  const { selectedPeriod } = usePeriod();

  return (
    <aside className="w-56 min-h-full bg-gray-800">
      <div className="overflow-y-auto py-5 px-3 h-full bg-gray-800">
        
        <ul className=" space-y-2 ">
          <h3 className="text-xs text-white">PERIODO</h3>
          <li>
            {/* Antiguo color de fondo: #2272F5 */}
            <NavLink
              to="/app/periods"
              className="flex items-center p-2 text-base font-normal text-white rounded-lg bg-gray-700 group"
              style={{
                borderWidth: "1px",
                borderStyle: selectedPeriod?.id ? "solid" : "dashed",
                borderColor: selectedPeriod?.id ? selectedPeriod.color : "",
                backgroundColor: selectedPeriod?.id ? selectedPeriod.color : "",
              }}
            >
              <span className="ml-1 text-xs truncate">
                {selectedPeriod?.name || "Sin periodo seleccionado"}
              </span>
            </NavLink>
          </li>
        </ul>

        <ul className="pt-5 mt-5 space-y-2 border-t border-gray-700">
          <h3 className="hidden md:block text-xs text-white">GENERAL</h3>
          <li>
            <NavLink
              to="/app/dashboard"
              className={({ isActive }) =>
                `
                flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700 group
                ${isActive ? "bg-gray-700" : ""}
                `
              }
            >
              <LayoutDashboard className="6-7 h-6 md:w-5 md:h-5" />
              <span className="hidden md:block ml-3 text-sm">Tablero</span>
            </NavLink>
          </li>
          
          <li>
            <NavLink to="/app/calendar" className={({ isActive }) =>
              `
              flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700 group
              ${isActive ? "bg-gray-700" : ""}
              `
              }
            >
              <CalendarDays className="6-7 h-6 md:w-5 md:h-5"/>
              <span className="hidden md:block ml-3 text-sm">Calendario</span>
            </NavLink>
          </li>
        </ul>

        
        <ul className="pt-5 mt-5 space-y-2 border-t border-gray-700">
          <h3 className="text-xs text-white">ACTIVIDADES</h3>
          <li>
            <NavLink to="/app/tasks" className={({ isActive }) =>
              `
              flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700 group
              ${isActive ? "bg-gray-700" : ""}
              `
              }
            >
              <ClipboardList className="6-7 h-6 md:w-5 md:h-5"/>
              <span className="hidden md:block ml-3 text-sm">Tareas</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/app/tests" className={({ isActive }) =>
              `
              flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700 group
              ${isActive ? "bg-gray-700" : ""}
              `
              }
            >
              <FileSpreadsheet className="6-7 h-6 md:w-5 md:h-5"/>
              <span className="hidden md:block ml-3 text-sm">Exámenes</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/app/subjects" className={({ isActive }) =>
              `
              flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700 group
              ${isActive ? "bg-gray-700" : ""}
              `
              }
            >
              <BookOpen className="6-7 h-6 md:w-5 md:h-5"/>
              <span className="hidden md:block ml-3 text-sm">Materias</span>
            </NavLink>
          </li>

          <li>
            <NavLink to="/app/breaks" className={({ isActive }) =>
              `
              flex items-center p-2 text-base font-normal text-white rounded-lg hover:bg-gray-700 group
              ${isActive ? "bg-gray-700" : ""}
              `
              }
            >
              <Parasol className="6-7 h-6 md:w-5 md:h-5"/>
              <span className="hidden md:block ml-3 text-sm">Vacaciones</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </aside>
    );
};