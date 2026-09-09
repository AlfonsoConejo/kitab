import NoActivePeriodMessage from "@/components/NoActivePeriodMessage";
import SectionLoader from "@/components/SectionLoader";
import { usePeriod } from "@/context/PeriodContext";
import { formatTime } from "@/functions";
import { notify } from "@/notify";
import { apiFetch } from "@/services/apiFetch";
import type { Class, GetClassesByPeriodResponse } from "@/types/class";
import type { GetSubjectsByPeriodResponse } from "@/types/subject";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type CalendarView = "week" | "month";
type CalendarClass = Class & { color: string };

type NavigationButtonProps = {
  label: string;
  children: ReactNode;
  onClick: () => void;
};

type ViewButtonProps = {
  active: boolean;
  children: string;
  onClick: () => void;
};

type WeekCalendarProps = {
  currentDate: Date;
  classes: CalendarClass[];
  now: Date;
};

type DayColumnProps = {
  date: Date;
  classes: CalendarClass[];
  isToday: boolean;
  now: Date;
};

type ClassEventProps = {
  classItem: CalendarClass;
};

type MonthCalendarProps = {
  currentDate: Date;
  classes: CalendarClass[];
};

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const START_HOUR = 0;
const END_HOUR = 24;
const HOUR_HEIGHT = 64;

export default function Calendar() {
  const { selectedPeriod } = usePeriod();
  const [view, setView] = useState<CalendarView>("week");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [now, setNow] = useState(() => new Date());
  const [classes, setClasses] = useState<CalendarClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Calendario";
  }, []);

  useEffect(() => {
    const updateCurrentTime = () => setNow(new Date());
    const intervalId = window.setInterval(updateCurrentTime, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!selectedPeriod) {
      setClasses([]);
      setIsLoading(false);
      return;
    }

    const periodId = selectedPeriod.id;

    async function fetchCalendarData() {
      try {
        setIsLoading(true);

        const [classesResponse, subjectsResponse] = await Promise.all([
          apiFetch(`/api/periods/${periodId}/classes`),
          apiFetch(`/api/periods/${periodId}/subjects`),
        ]);

        if (!classesResponse.ok || !subjectsResponse.ok) {
          throw new Error("CALENDAR_ERROR");
        }

        const classesData: GetClassesByPeriodResponse =
          await classesResponse.json();
        const subjectsData: GetSubjectsByPeriodResponse =
          await subjectsResponse.json();

        if (!classesData.success || !subjectsData.success) {
          throw new Error("CALENDAR_ERROR");
        }

        const colorsBySubject = new Map(
          subjectsData.data.map((subject) => [subject.id, subject.color]),
        );

        setClasses(
          classesData.data.map((classItem) => ({
            ...classItem,
            color: colorsBySubject.get(classItem.subjectId) ?? "#0ea5e9",
          })),
        );
      } catch (error) {
        if (error instanceof Error && error.message === "SESSION_EXPIRED") {
          return;
        }

        notify("error", "No se pudo cargar el calendario.");
      } finally {
        setIsLoading(false);
      }
    }

    void fetchCalendarData();
  }, [selectedPeriod?.id]);

  const monthLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("es-MX", {
        month: "long",
        year: "numeric",
      }).format(currentDate),
    [currentDate],
  );

  function moveCalendar(direction: number) {
    setCurrentDate((date) => {
      const nextDate = new Date(date);

      if (view === "week") {
        nextDate.setDate(nextDate.getDate() + direction * 7);
      } else {
        nextDate.setMonth(nextDate.getMonth() + direction);
      }

      return nextDate;
    });
  }

  if (!selectedPeriod) {
    return (
      <div className="flex min-h-0 flex-1 flex-col gap-6">
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">
          Calendario
        </h1>
        <div className="flex-1">
          <NoActivePeriodMessage />
        </div>
      </div>
    );
  }

  return (
    <div className="-mb-6 flex min-h-0 flex-1 flex-col gap-6">
      <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="flex items-center gap-2">
          <NavigationButton
            label="Periodo anterior"
            onClick={() => moveCalendar(-1)}
          >
            <ChevronLeft size={20} />
          </NavigationButton>
          <NavigationButton
            label="Periodo siguiente"
            onClick={() => moveCalendar(1)}
          >
            <ChevronRight size={20} />
          </NavigationButton>
        </div>

        <h1 className="capitalize text-xl font-semibold text-white sm:text-2xl">
          {monthLabel}
        </h1>

        <div className="flex justify-self-end rounded-lg bg-gray-800 p-1 text-sm font-medium">
          <ViewButton
            active={view === "month"}
            onClick={() => setView("month")}
          >
            Mensual
          </ViewButton>
          <ViewButton
            active={view === "week"}
            onClick={() => setView("week")}
          >
            Semanal
          </ViewButton>
        </div>
      </header>

      <div className="min-h-0 flex-1">
        {isLoading ? (
          <SectionLoader />
        ) : view === "week" ? (
          <WeekCalendar currentDate={currentDate} classes={classes} now={now} />
        ) : (
          <MonthCalendar currentDate={currentDate} classes={classes} />
        )}
      </div>
    </div>
  );
}

function NavigationButton({
  label,
  children,
  onClick,
}: NavigationButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="cursor-pointer rounded-lg p-2 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
    >
      {children}
    </button>
  );
}

function ViewButton({ active, children, onClick }: ViewButtonProps) {
  const colorClasses = active
    ? "bg-gray-700 text-white shadow-sm"
    : "text-gray-400 hover:text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-md px-4 py-2 transition-colors ${colorClasses}`}
    >
      {children}
    </button>
  );
}

function WeekCalendar({ currentDate, classes, now }: WeekCalendarProps) {
  const weekDays = getWeekDays(currentDate);
  const today = toDateKey(new Date());
  const hours = Array.from(
    { length: END_HOUR - START_HOUR },
    (_, index) => START_HOUR + index,
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-auto rounded-xs border border-gray-700 bg-gray-800">
      <div className="min-w-[850px]">
        <div className="sticky top-0 z-20 grid grid-cols-[68px_repeat(7,minmax(110px,1fr))] bg-gray-800">
          <div />
          {weekDays.map((date, index) => {
            const isToday = toDateKey(date) === today;

            return (
              <div
                key={date.toISOString()}
                className={`border-b border-l border-gray-700 px-3 py-3 ${
                  isToday ? "bg-sky-500/10" : ""
                }`}
              >
                <p
                  className={`text-xs font-semibold uppercase ${
                    isToday ? "text-sky-300" : "text-gray-400"
                  }`}
                >
                  {WEEK_DAYS[index]}
                </p>
                <p
                  className={`mt-1 text-xl font-semibold ${
                    isToday ? "text-sky-300" : "text-white"
                  }`}
                >
                  {date.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        <div
          className="grid grid-cols-[68px_repeat(7,minmax(110px,1fr))]"
          style={{ height: `${hours.length * HOUR_HEIGHT}px` }}
        >
          <div className="relative">
            {hours.map((hour) =>
              hour === START_HOUR ? null : (
                <span
                  key={hour}
                  className="absolute right-3 -translate-y-2 text-xs text-gray-500"
                  style={{ top: `${(hour - START_HOUR) * HOUR_HEIGHT}px` }}
                >
                  {formatHour(hour)}
                </span>
              ),
            )}
          </div>

          {weekDays.map((date) => (
            <DayColumn
              key={date.toISOString()}
              date={date}
              classes={classes}
              isToday={toDateKey(date) === today}
              now={now}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DayColumn({ date, classes, isToday, now }: DayColumnProps) {
  const dayNumber = date.getDay() || 7;
  const scheduledClasses = classes.filter((classItem) =>
    classItem.days.includes(dayNumber),
  );
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isCurrentTimeVisible =
    currentMinutes >= START_HOUR * 60 && currentMinutes <= END_HOUR * 60;
  const currentTimeTop =
    ((currentMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT;

  return (
    <div
      className={`relative border-l border-gray-700 ${
        isToday ? "bg-sky-500/10" : ""
      }`}
    >
      {Array.from({ length: END_HOUR - START_HOUR }, (_, index) => (
        <div
          key={index}
          className="border-b border-gray-700/70"
          style={{ height: `${HOUR_HEIGHT}px` }}
        />
      ))}

      {isToday && isCurrentTimeVisible && (
        <div
          aria-label="Hora actual"
          className="pointer-events-none absolute inset-x-0 z-10 border-t-2 border-red-400"
          style={{ top: `${currentTimeTop}px` }}
        >
          <span className="absolute -left-1 -top-1.5 h-2.5 w-2.5 rounded-full bg-red-400" />
        </div>
      )}

      {scheduledClasses.map((classItem) => (
        <ClassEvent key={classItem.id} classItem={classItem} />
      ))}
    </div>
  );
}

function ClassEvent({ classItem }: ClassEventProps) {
  const startMinutes = getMinutes(classItem.startTime);
  const endMinutes = getMinutes(classItem.endTime);
  const top = Math.max(
    0,
    ((startMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT,
  );
  const height = Math.max(
    30,
    ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT,
  );
  const timeRange = `${formatTime(classItem.startTime)} - ${formatTime(
    classItem.endTime,
  )}`;

  return (
    <div
      title={`${classItem.subjectName} · ${timeRange}`}
      className="absolute inset-x-0 overflow-hidden border-l-4 px-2 py-1 text-xs shadow-sm"
      style={{
        top: `${top}px`,
        height: `${height}px`,
        borderColor: classItem.color,
        backgroundColor: `${classItem.color}20`,
      }}
    >
      <p className="font-semibold" style={{ color: classItem.color }}>
        {formatTime(classItem.startTime)}
      </p>
      <p className="truncate font-medium text-white">{classItem.subjectName}</p>
      {classItem.classroom && (
        <p className="truncate text-gray-300">{classItem.classroom}</p>
      )}
    </div>
  );
}

function MonthCalendar({ currentDate, classes }: MonthCalendarProps) {
  const days = getMonthGridDays(currentDate);
  const today = toDateKey(new Date());
  const currentMonth = currentDate.getMonth();

  return (
    <div className="overflow-auto rounded-xl border border-gray-700 bg-gray-800">
      <div className="min-w-[700px]">
        <div className="grid grid-cols-7 border-b border-gray-700">
          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              className="px-3 py-3 text-xs font-semibold uppercase text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {days.map((date) => {
            const dayNumber = date.getDay() || 7;
            const isToday = toDateKey(date) === today;
            const isOutsideCurrentMonth = date.getMonth() !== currentMonth;
            const scheduledClasses = classes.filter((classItem) =>
              classItem.days.includes(dayNumber),
            );

            return (
              <div
                key={date.toISOString()}
                className={`min-h-32 border-b border-r border-gray-700 p-2 ${
                  isOutsideCurrentMonth ? "bg-gray-900/40 text-gray-600" : ""
                } ${isToday ? "bg-sky-500/10" : ""}`}
              >
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium ${
                    isToday ? "bg-sky-600 text-white" : ""
                  }`}
                >
                  {date.getDate()}
                </span>

                <div className="mt-2 space-y-1">
                  {scheduledClasses.slice(0, 3).map((classItem) => (
                    <div
                      key={classItem.id}
                      className="truncate rounded px-1.5 py-1 text-xs font-medium text-white"
                      style={{
                        borderLeft: `3px solid ${classItem.color}`,
                        backgroundColor: `${classItem.color}20`,
                      }}
                    >
                      {formatTime(classItem.startTime)} {classItem.subjectName}
                    </div>
                  ))}

                  {scheduledClasses.length > 3 && (
                    <p className="px-1 text-xs text-gray-400">
                      +{scheduledClasses.length - 3} más
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function getWeekDays(date: Date) {
  const weekStart = new Date(date);
  const day = weekStart.getDay() || 7;

  weekStart.setDate(weekStart.getDate() - day + 1);

  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

function getMonthGridDays(date: Date) {
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstDayNumber = firstDay.getDay() || 7;
  const gridStart = addDays(firstDay, -(firstDayNumber - 1));

  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);

  return result;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);

  return hours * 60 + minutes;
}

function formatHour(hour: number) {
  return `${hour % 12 || 12} ${hour < 12 ? "AM" : "PM"}`;
}
