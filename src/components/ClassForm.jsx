import {useState} from "react";

const ClassForm = ({ classData, onChange }) => {

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

  const [isManualDate, setIsManualDate] = useState(false);

  return (
    <div className="rounded-xl border border-gray-700 p-5 flex flex-col gap-6">
      <h3 className="text-lg font-semibold text-white">
        Clase
      </h3>

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

          <select
            value={classData.type}
            onChange={(e) => onChange("type", e.target.value)}
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
          >
            <option value="theory">Teoría</option>
            <option value="laboratory">Laboratorio</option>
            <option value="workpshop">Taller</option>
          </select>
        </div>
        
        {/* Mode */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">
            Modalidad
          </label>

          <select
            value={classData.mode}
            onChange={(e) => onChange("mode", e.target.value)}
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
          >
            <option value="onsite">Presencial</option>
            <option value="online">En línea</option>
          </select>
        </div>

        {/* Classroom */
          isClassOnsite && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300">
                Aula
              </label>

              <input
                type="text"
                maxLength={30}
                placeholder="Ej. B-204"
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

        {/* Hora de inicio */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">
            Hora de inicio
          </label>

          <input
            type="time"
            value={classData.startTime}
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

        {/* Hora de término */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">
            Hora de término
          </label>

          <input
            type="time"
            value={classData.endTime}
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

        {/* Switch for date selection */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">
            Fechas de inicio y término
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setIsManualDate(false)}
              className={`
                px-3 py-2
                rounded-lg
                text-sm font-semibold
                transition-colors
                cursor-pointer

                ${
                  !isManualDate
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }
              `}
            >
              {"Periodo académico"}
            </button>

            <button
              type="button"
              onClick={() => setIsManualDate(true)}
              className={`
                px-3 py-2
                rounded-lg
                text-sm font-semibold
                transition-colors
                cursor-pointer

                ${
                  isManualDate
                    ? "bg-cyan-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }
              `}
            >
              {"Manual"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Start Date */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">
            Fecha de inicio
          </label>

          <input
            type="date"
            disabled={!isManualDate} 
            value={classData.startDate}
            onChange={(e) => onChange("startDate", e.target.value)}
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

              disabled: disabled:cursor-not-allowed disabled:opacity-50
            "
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-300">
            Fecha de término
          </label>

          <input
            type="date"
            disabled={!isManualDate} 
            value={classData.endDate}
            onChange={(e) => onChange("endDate", e.target.value)}
            className={`
              rounded-lg
              border
              border-gray-700
              bg-gray-900
              px-4
              py-3
              text-white
              outline-none
              focus:border-cyan-600

              disabled: disabled:cursor-not-allowed disabled:opacity-50
            `}
          />
        </div>
      </div>
    </div>
  );
};

export default ClassForm;