import { formatTime, getDaysLabel } from "@/functions";

export default function InternalConflicts({ conflicts, classId, variant }) {
  if (conflicts.length === 0) {
    return null;
  }

  const borderColor = {
    cream: "border-[#ffb769]",
    yellow: "border-[#f9d404]",
  }[variant];

  return (
    <div className="flex flex-col gap-3">
      {conflicts.map((conflict, index) => {
        const isClassA = conflict.classA === classId;

        return (
          <div
            key={`internal-${index}`}
            className={`border-l-2 ${borderColor} pl-3`}
          >
            <p className="text-sm font-medium text-gray-200">
              Otra clase de esta materia
            </p>

            <p className="mt-1 text-sm text-gray-400">
              {getDaysLabel(conflict.conflictDays)}{" "}
              de{" "}
              {formatTime(
                isClassA
                  ? conflict.classBStartTime
                  : conflict.classAStartTime
              )}{" "}
              a{" "}
              {formatTime(
                isClassA
                  ? conflict.classBEndTime
                  : conflict.classAEndTime
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}