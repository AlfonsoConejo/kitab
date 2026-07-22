import {useState} from "react";
import { Minus, ChevronDown } from "lucide-react";

const ClassForm = ({ classData, onChange, onDelete }) => {

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
    <div className="rounded-xl border border-gray-700 p-5 flex flex-col gap-6">

      {/* Class Header*/}
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-white">
          Clase
        </h3>
        <button
          onClick={onDelete}
          className="
            p-2
            rounded-lg
            active:bg-red-500/30
            bg-gray-700 
            text-gray-300
            hover:bg-gray-600
            transition-colors
            duration-200
            cursor-pointer
          "
        >
          <Minus size={16} />
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Days selector */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">
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
          <label className="text-sm font-medium text-gray-300">
            Tipo de clase
          </label>

          <div className="relative">
            <select
              value={classData.type}
              onChange={(e) => onChange("type", e.target.value)}
              className="
                appearance-none
                w-full
                rounded-lg
                border
                border-gray-700
                bg-gray-900
                px-4
                pr-9
                py-3
                text-white
                focus:border-cyan-600
                outline-none
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
          <label className="text-sm font-medium text-gray-300">
            Modalidad
          </label>

          <div className="relative">
            <select
              value={classData.mode}
              onChange={(e) => onChange("mode", e.target.value)}
              className="
                appearance-none
                w-full
                rounded-lg
                border
                border-gray-700
                bg-gray-900
                px-4
                pr-9
                py-3
                text-white
                focus:border-cyan-600
                outline-none
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
              <label className="text-sm font-medium text-gray-300">
                Aula{" "}
                <span className="font-normal text-gray-500">
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
                  rounded-lg
                  border
                  border-gray-700
                  bg-gray-900
                  px-4
                  py-3
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  focus:border-cyan-600
                "
              />
            </div>
          )
        }
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Start time */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">
            Hora de inicio
          </label>

          <input
            type="time"
            value={classData.startTime}
            max={classData.endTime || undefined}
            onChange={(e) => onChange("startTime", e.target.value)}
            className="
              rounded-lg
              border
              border-gray-700
              bg-gray-900
              px-4
              py-3
              text-white
              outline-none
              focus:border-cyan-600
            "
          />
        </div>

        {/* End time */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">
            Hora de término
          </label>

          <input
            type="time"
            value={classData.endTime}
            min={classData.startTime || undefined}
            onChange={(e) => onChange("endTime", e.target.value)}
            className="
              rounded-lg
              border
              border-gray-700
              bg-gray-900
              px-4
              py-3
              text-white
              outline-none
              focus:border-cyan-600
            "
          />
        </div>
      </div>
    </div>
  );
};

export default ClassForm;