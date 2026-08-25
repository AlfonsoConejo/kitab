import { formatTime, getDaysLabel } from "@/functions";
import type { ConflictColorVariants, ExternalConflict } from "@/types/conflicts";

type ExternalConflictsProps = {
  conflicts: ExternalConflict[];
  variant: ConflictColorVariants;
};

export default function ExternalConflicts({ conflicts, variant }: ExternalConflictsProps) {
  if (conflicts.length === 0) {
    return null;
  }

  const borderColor = {
    cream: "border-[#ffb769]",
    yellow: "border-[#f9d404]",
  }[variant];

  return (
    <div className="flex flex-col gap-3">
      {conflicts.map((conflict, index) => (
        <div
          key={`external-${index}`}
          className={`border-l-2 ${borderColor} pl-3`}
        >
          <p className="text-sm font-medium text-gray-200">
            {conflict.subject}
          </p>

          <p className="mt-1 text-sm text-gray-400">
            {getDaysLabel(conflict.conflictDays)}{" "}
            de {formatTime(conflict.startTime)} a{" "}
            {formatTime(conflict.endTime)}
          </p>
        </div>
      ))}
    </div>
  );
}