export const formatDate = (dateString, endDateString = null) => {
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

export function formatTime(time, hour12 = true) {
  const date = new Date(`1970-01-01T${time}`);

  return new Intl.DateTimeFormat("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    hour12,
  }).format(date);
}

export const DAY_NAMES = {
  1: "Lun",
  2: "Mar",
  3: "Mié",
  4: "Jue",
  5: "Vie",
  6: "Sáb",
  7: "Dom",
};

export const getClassDays = (classes) => {
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