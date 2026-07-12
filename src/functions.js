export const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");

  const months = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic"
  ];

  return `${Number(day)} ${months[Number(month) - 1]} ${year}`;
};

export const getClassDays = (classes) => {
  const dayNames = {
    1: "Lun",
    2: "Mar",
    3: "Mié",
    4: "Jue",
    5: "Vie",
    6: "Sáb",
    7: "Dom",
  };

  const days = [
    ...new Set(
      classes.flatMap((classItem) => classItem.days)
    ),
  ].sort((a, b) => a - b);

  return days.map((day) => dayNames[day]).join(" • ");
};