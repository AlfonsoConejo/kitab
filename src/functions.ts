export const formatDate = (
  dateString: string,
  endDateString: string | null = null
): string => {
  const [year, month, day] = dateString.split("-");

  const months = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic"
  ];

  if (endDateString) {
    const [endYear] = endDateString.split("-");

    if (year === endYear) {
      return `${Number(day)} ${months[Number(month) - 1]}`;
    }
  }

  return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
};

export const formatTime = (
  time: string,
  hour12: boolean = true
): string => {
  const date = new Date(`1970-01-01T${time}`);

  return new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    hour12,
  }).format(date);
};

export const DAY_NAMES: Record<number, string> = {
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
  7: "Dom",
};

export const DAY_NAMES_COMPLETE: Record<number, string> = {
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
  7: "Domingo",
};

type ClassWithDays = {
  days: number[];
};

export const getClassDays = (classes: ClassWithDays[]): string => {
  if (!classes || classes.length === 0) {
    return "Sin clases";
  }

  const days = [
    ...new Set(classes.flatMap((classItem) => classItem.days)),
  ].sort((a, b) => a - b);

  if (days.length === 7) {
    return "Todos los días";
  }

  return days.map((day) => DAY_NAMES[day]).join(" • ");
};

export const getDaysLabel = (days: number[]): string => {
  if (!days || days.length === 0) {
    return "Sin días";
  }

  const uniqueDays = [...new Set(days)].sort((a, b) => a - b);

  if (uniqueDays.length === 7) {
    return "Todos los días";
  }

  const dayNames = uniqueDays.map((day) => DAY_NAMES_COMPLETE[day]);

  if (dayNames.length === 1) {
    return dayNames[0];
  }

  if (dayNames.length === 2) {
    return `${dayNames[0]} y ${dayNames[1]}`;
  }

  return `${dayNames.slice(0, -1).join(", ")} y ${dayNames[dayNames.length - 1]}`;
};