import { X, ChevronDown, TriangleAlert } from "lucide-react";
import { formatTime, getDaysLabel } from "@/functions";
import { useState } from "react";

const ClassForm = ({ classData, isEditMode, isNew, conflicts, conflictCount, isRecalculatingConflicts, onChange, onDelete }) => {

  const { externalConflicts, internalConflicts } = conflicts;

  const [showConflicts, setShowConflicts] = useState(false);
  
  const isClassOnsite = classData.mode === "onsite";

   const daysMap = [
    { label: "Lun", value: 1 },
    { label: "Mar", value: 2 },
    { label: "Mié", value: 3 },
    { label: "Jue", value: 4 },
    { label: "Vie", value: 5 },
    { label: "Sáb", value: 6 },
    { label: "Dom", value: 7 },
  ];

  function toggleDay(dayValue) {
    const currentDays = classData.days || [];

    const exists = currentDays.includes(dayValue);

    const newDays = exists
      ? currentDays.filter((d) => d !== dayValue)
      : [...currentDays, dayValue];

    onChange("days", newDays);
  }

  return (
    <div
      className={`
        overflow-hidden
        rounded-sm
        py-4
        px-5
        border
        bg-gray-800
        shadow-sm
        mt-4
        ${
          isNew && isEditMode
            ? "border-dashed border-gray-600"
            : "border-gray-600"
        }
      `}
    >

      {/* Header */}
      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">
              Clase
            </h3>
          </div>

          {isNew && isEditMode && (
            <span
              className="
                rounded-full
                bg-gray-700
                px-2.5
                py-1
                text-xs
                font-medium
                text-gray-300
              "
            >
              Nueva
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onDelete}
          aria-label="Eliminar clase"
          className="
            inline-flex
            items-center
            justify-center
            rounded-lg
            p-1.5
            bg-transparent
            hover:text-white
            text-gray-400
            hover:bg-gray-600
            cursor-pointer
          "
        >
          <X size={20} />
        </button>
      </div>

      {/* Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Days selector */}
        <div className="flex flex-col gap-2">
          <label className="mb-2 text-sm font-medium text-white">
            Días
          </label>

          <div className="flex flex-wrap gap-2">
            {daysMap.map((day) => (
              <button
                key={day.value}
                type="button"
                onClick={() => toggleDay(day.value)}
                className={`
                  px-3 py-2
                  rounded-lg
                  text-sm font-semibold
                  transition-colors
                  cursor-pointer

                  ${
                    classData.days?.includes(day.value)
                      ? "bg-cyan-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }
                `}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* class type */}
        <div className="flex flex-col gap-2">
          <label className="mb-2 text-sm font-medium text-white">
            Tipo de clase
          </label>

          <div className="relative">
            <select
              value={classData.type}
              onChange={(e) => onChange("type", e.target.value)}
              className="
                block 
              bg-gray-700
                w-full
                rounded-lg
                border border-gray-600
                p-2.5
                text-sm text-white
              placeholder-gray-400
                outline-none
                transition
                focus:border-blue-500
                focus:ring-1
              focus:ring-blue-500
                appearance-none
              "
            >
              <option value="theory">Teoría</option>
              <option value="laboratory">Laboratorio</option>
              <option value="workshop">Taller</option>
            </select>

            <ChevronDown
              className="
                pointer-events-none
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                h-5
                w-5
                text-gray-400
                focus:rotate-180
              "
            />
          </div>
        </div>
        
        {/* Mode */}
        <div className="flex flex-col gap-2">
          <label className="mb-2 text-sm font-medium text-white">
            Modalidad
          </label>

          <div className="relative">
            <select
              value={classData.mode}
              onChange={(e) => onChange("mode", e.target.value)}
              className="
              block 
              bg-gray-700
                w-full
                rounded-lg
                border border-gray-600
                p-2.5
                text-sm text-white
              placeholder-gray-400
                outline-none
                transition
                focus:border-blue-500
                focus:ring-1
              focus:ring-blue-500
                appearance-none
                
              "
            >
              <option value="onsite">Presencial</option>
              <option value="online">En línea</option>
            </select>

            <ChevronDown
              className="
                pointer-events-none
                absolute
                right-4
                top-1/2
                -translate-y-1/2
                h-5
                w-5
                text-gray-400
              "
            />
          </div>
          
        </div>

        {/* Classroom */
          isClassOnsite && (
            <div className="flex flex-col gap-2">
              <label className="mb-2 text-sm font-medium text-white">
                Aula{" "}
                <span className="font-normal text-gray-400">
                  (opcional)
                </span>
              </label>

              <input
                type="text"
                maxLength={10}
                placeholder="B-204"
                value={classData.classroom}
                onChange={(e) => onChange("classroom", e.target.value)}
                className="
                  block 
                bg-gray-700
                  w-full
                  rounded-lg
                  border border-gray-600
                  p-2.5
                  text-sm text-white
                placeholder-gray-400
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-1
                focus:ring-blue-500
                "
              />
            </div>
          )
        }

        {/* Start time */}
        <div className="flex flex-col gap-2">
          <label className="mb-2 text-sm font-medium text-white">
            Hora de inicio
          </label>

          <input
            type="time"
            value={classData.startTime}
            max={classData.endTime || undefined}
            onChange={(e) => onChange("startTime", e.target.value)}
            className="
              block 
            bg-gray-700
              w-full
              rounded-lg
              border border-gray-600
              p-2.5
              text-sm text-white
            placeholder-gray-400
              outline-none
              transition
              focus:border-primary-500
              focus:ring-2
            focus:ring-blue-500
            "
          />
        </div>

        {/* End time */}
        <div className="flex flex-col gap-2">
          <label className="mb-2 text-sm font-medium text-white">
            Hora de término
          </label>

          <input
            type="time"
            value={classData.endTime}
            min={classData.startTime || undefined}
            onChange={(e) => onChange("endTime", e.target.value)}
            className="
              block 
            bg-gray-700
              w-full
              rounded-lg
              border border-gray-600
              p-2.5
              text-sm text-white
            placeholder-gray-400
              outline-none
              transition
              focus:border-primary-500
              focus:ring-2
            focus:ring-blue-500
            "
          />
        </div>

        

      </div>

      { // Accordeon with schedule conflicts
        isRecalculatingConflicts ? (
          <div className="overflow-hidden rounded-lg border border-[#441306] mt-4">
            <div
              className="
                flex w-full items-center gap-2
                px-4 py-3
                text-sm font-medium text-[#ffb769]
                bg-[#441306]
              "
            >
              <div className="yellow-loader" />
              Calculando conflictos...
            </div>
          </div>
        ) : (
          conflictCount > 0 && (
            <div className="overflow-hidden rounded-lg border border-[#441306] mt-4">
              <button
                type="button"
                onClick={() => setShowConflicts((prev) => !prev)}
                className="
                  flex
                  w-full
                  items-center
                  justify-between
                  bg-[#441306]
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-[#ffb769]
                  cursor-pointer
                "
              >
                <span className="inline-flex items-center gap-2">
                  <TriangleAlert size={18} />

                  {conflictCount}{" "}
                  {conflictCount === 1
                    ? "conflicto de horario"
                    : "conflictos de horario"}
                </span>

                <ChevronDown
                  size={18}
                  className={`
                    transition-transform
                    duration-200
                    ${showConflicts ? "rotate-180" : ""}
                  `}
                />
              </button>

              {showConflicts && (
                <div className="border-t border-yellow-800/70 bg-gray-900/40 px-4 py-4">
                  <div className="flex flex-col gap-4">
                    {externalConflicts.map((conflict, index) => (
                      <div
                        key={`external-${index}`}
                        className="border-l-2 border-[#ffb769] pl-3"
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

                    {internalConflicts.map((conflict, index) => {
                      const isClassA = conflict.classA === classData.tempId;

                      return (
                        <div
                          key={`internal-${index}`}
                          className="border-l-2 border-[#ffb769] pl-3"
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
                </div>
              )}
            </div>
          )
        )
      } 
    </div>
  );
};

export default ClassForm;