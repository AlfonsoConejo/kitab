import {
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileSpreadsheet,
  LayoutDashboard,
  Parasol,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { usePeriod } from "@/context/PeriodContext";

interface SidebarProps {
  isDesktopCollapsed: boolean;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onToggleDesktopCollapsed: () => void;
}

interface NavigationItem {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
}

const generalItems: NavigationItem[] = [
  { label: "Tablero", to: "/app/dashboard", icon: LayoutDashboard },
  { label: "Calendario", to: "/app/calendar", icon: CalendarDays },
];

const activityItems: NavigationItem[] = [
  { label: "Tareas", to: "/app/tasks", icon: ClipboardList },
  { label: "Exámenes", to: "/app/tests", icon: FileSpreadsheet },
  { label: "Materias", to: "/app/subjects", icon: BookOpen },
  { label: "Vacaciones", to: "/app/breaks", icon: Parasol },
];

interface SidebarContentProps {
  compact: boolean;
  mobile: boolean;
  onNavigate: () => void;
  onCloseMobile: () => void;
  onToggleDesktopCollapsed: () => void;
}

function SidebarContent({
  compact,
  mobile,
  onNavigate,
  onCloseMobile,
  onToggleDesktopCollapsed,
}: SidebarContentProps) {
  const { selectedPeriod } = usePeriod();

  const sectionTitleClasses = mobile
    ? "text-xs text-white"
    : compact
      ? "sr-only"
      : "hidden text-xs text-white lg:block";
  const itemAlignment = mobile
    ? ""
    : compact
      ? "justify-center"
      : "justify-center lg:justify-start";
  const labelClasses = mobile
    ? "ml-3 text-sm"
    : compact
      ? "hidden"
      : "hidden ml-3 text-sm lg:block";
  const itemClasses = (isActive: boolean) => `
    flex items-center rounded-lg p-2 text-base font-normal text-white hover:bg-gray-700 group
    ${itemAlignment}
    ${isActive ? "bg-gray-700" : ""}
  `;

  const renderItems = (items: NavigationItem[]) =>
    items.map(({ label, to, icon: Icon }) => (
      <li key={to}>
        <NavLink
          to={to}
          title={!mobile ? label : undefined}
          onClick={onNavigate}
          className={({ isActive }) => itemClasses(isActive)}
        >
          <Icon className="h-6 w-6 md:h-5 md:w-5" aria-hidden="true" />
          <span className={labelClasses}>{label}</span>
        </NavLink>
      </li>
    ));

  return (
    <div className="flex h-full flex-col bg-gray-800">
      {mobile && (
        <div className="flex justify-end px-3 pt-3">
          <button
            type="button"
            onClick={onCloseMobile}
            className="rounded-lg p-2 text-white hover:bg-gray-700 cursor-pointer"
            aria-label="Cerrar menú de navegación"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="space-y-2">
          <h3 className={sectionTitleClasses}>PERIODO</h3>
          <li>
            <NavLink
              to="/app/periods"
              title={!mobile ? selectedPeriod?.name || "Sin periodo seleccionado" : undefined}
              onClick={onNavigate}
              className={`flex items-center rounded-lg bg-gray-700 p-2 text-base font-normal text-white group ${itemAlignment}`}
              style={{
                borderWidth: "1px",
                borderStyle: selectedPeriod?.id ? "solid" : "dashed",
                borderColor: selectedPeriod?.id ? selectedPeriod.color : "",
                backgroundColor: selectedPeriod?.id ? selectedPeriod.color : "",
              }}
            >
              {!mobile && <CalendarDays className="h-5 w-5" aria-hidden="true" />}
              <span className={mobile ? "ml-1 truncate text-xs" : compact ? "hidden" : "hidden ml-3 truncate text-xs lg:block"}>
                {selectedPeriod?.name || "Sin periodo seleccionado"}
              </span>
            </NavLink>
          </li>
        </ul>

        <ul className="mt-5 space-y-2 border-t border-gray-700 pt-5">
          <h3 className={sectionTitleClasses}>GENERAL</h3>
          {renderItems(generalItems)}
        </ul>

        <ul className="mt-5 space-y-2 border-t border-gray-700 pt-5">
          <h3 className={sectionTitleClasses}>ACTIVIDADES</h3>
          {renderItems(activityItems)}
        </ul>
      </div>

      {!mobile && (
        <div className="hidden border-t border-gray-700 p-3 lg:block">
          <button
            type="button"
            onClick={onToggleDesktopCollapsed}
            className={`flex w-full items-center rounded-lg p-2 text-sm text-white hover:bg-gray-700 cursor-pointer ${compact ? "justify-center" : ""}`}
            aria-label={compact ? "Expandir barra lateral" : "Contraer barra lateral"}
            title={compact ? "Expandir barra lateral" : "Contraer barra lateral"}
          >
            {compact ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            {!compact && <span className="ml-3">Contraer</span>}
          </button>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({
  isDesktopCollapsed,
  isMobileOpen,
  onCloseMobile,
  onToggleDesktopCollapsed,
}: SidebarProps) {
  const desktopWidth = isDesktopCollapsed ? "lg:w-16" : "lg:w-56";

  return (
    <>
      <aside className={`hidden min-h-0 shrink-0 bg-gray-800 transition-[width] duration-300 md:block md:w-16 ${desktopWidth}`}>
        <SidebarContent
          compact={isDesktopCollapsed}
          mobile={false}
          onNavigate={() => undefined}
          onCloseMobile={onCloseMobile}
          onToggleDesktopCollapsed={onToggleDesktopCollapsed}
        />
      </aside>

      {isMobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-label="Cerrar menú de navegación"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-gray-800 shadow-lg transition-transform duration-300 md:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!isMobileOpen}
      >
        <SidebarContent
          compact={false}
          mobile
          onNavigate={onCloseMobile}
          onCloseMobile={onCloseMobile}
          onToggleDesktopCollapsed={onToggleDesktopCollapsed}
        />
      </aside>
    </>
  );
}
