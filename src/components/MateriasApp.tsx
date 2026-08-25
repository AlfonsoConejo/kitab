import React from 'react';

type Clase = {
  id: number;
  materia: string;
  hora: string;
  salon: string;
};

type IconName =
  | "search"
  | "home"
  | "calendar"
  | "book"
  | "check"
  | "plus";

type Stat = {
  label: string;
  value: number | string;
};

const stats: Stat[] = [
  { label: "Clases hoy", value: 3 },
  { label: "Tareas pendientes", value: 5 },
  { label: "Horas de estudio", value: "4h" },
];

type TaskPriority = "high" | "medium" | "low";

type Task = {
  text: string;
  done: boolean;
  priority: TaskPriority;
};

const tasks: Task[] = [
  { text: "Hacer ejercicio de cálculo", done: false, priority: "high" },
  { text: "Leer algoritmos", done: false, priority: "medium" },
  { text: "Entrega inglés", done: true, priority: "low" },
];

const priorityColors: Record<TaskPriority, string> = {
  high: "bg-red-500/20 text-red-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  low: "bg-green-500/20 text-green-400",
};

const MateriasApp = () => {
  const clasesDelDia: Clase[] = [
    { id: 1, materia: "Cálculo Diferencial", hora: "08:00 - 10:00", salon: "Aula 402" },
    { id: 2, materia: "Estructura de Datos", hora: "10:30 - 12:30", salon: "Lab B" },
    { id: 3, materia: "Inglés Técnico", hora: "14:00 - 15:30", salon: "Virtual" },
  ];

  const Icon = ({ name }: { name: IconName }) => {
    const icons = {
      search: <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
      home: <path d="M3 12l2-2 7-7 7 7M5 10v10h3m10-10v10h-3M9 21v-4h6v4" />,
      calendar: <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />,
      book: <path d="M12 6v13M3 6c2-1 4-1 6 0s4 1 6 0 4-1 6 0v13c-2-1-4-1-6 0s-4 1-6 0-4-1-6 0z" />,
      check: <path d="M9 12l2 2 4-4" />,
      plus: <path d="M12 4v16m8-8H4" />
    };
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {icons[name]}
      </svg>
    );
  };

  const NavItem = ({
    iconName,
    label,
    active = false,
  }: {
    iconName: IconName;
    label: string;
    active?: boolean;
  }) => (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
        active
          ? 'bg-blue-600 text-white'
          : 'text-gray-400 hover:text-white hover:bg-gray-700'
      }`}
    >
      <Icon name={iconName} />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto bg-gray-900">
        <div className="max-w-6xl mx-auto">

          {/* HEADER */}
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold">Tablero</h1>
            </div>

            <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold">
              + Nueva tarea
            </button>
          </header>

          {/* STATS */}
          <section className="grid sm:grid-cols-3 gap-6 mb-6">
            {[
              { label: "Clases hoy", value: 3 },
              { label: "Tareas pendientes", value: 5 },
              { label: "Horas de estudio", value: "4h" }
            ].map((stat) => (
              <div key={stat.label} className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <h3 className="text-xl font-bold">{stat.value}</h3>
              </div>
            ))}
          </section>

          {/* CONTENT */}
          <section className="grid lg:grid-cols-3 gap-8">
  
            {/* CLASES */}
            <div className="lg:col-span-2">
              <div className="flex justify-between mb-4">
                <h2 className="font-semibold text-lg">Próximas clases</h2>
                <button className="text-blue-400 text-sm">Ver todo</button>
              </div>

              <div className="space-y-3">
                {clasesDelDia.map((clase, i) => (
                  <div
                    key={clase.id}
                    className={`flex justify-between items-center bg-gray-800 border rounded-xl p-4 transition ${
                      i === 0
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    <div>
                      <p className="font-medium">{clase.materia}</p>
                      <p className="text-xs text-gray-400">{clase.hora}</p>
                    </div>

                    <span className="text-xs text-gray-400">{clase.salon}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TAREAS */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Tareas</h2>

              <div className="space-y-3">
                {tasks.map((task, i) => {
                  return (
                    <div
                      key={i}
                      className={`flex justify-between items-center bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 transition ${
                        task.done ? "opacity-60" : "hover:bg-gray-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            task.done
                              ? "bg-blue-600 border-blue-600"
                              : "border-gray-500"
                          }`}
                        >
                          {task.done && "✓"}
                        </div>

                        <span
                          className={`text-sm ${
                            task.done ? "line-through text-gray-400" : ""
                          }`}
                        >
                          {task.text}
                        </span>
                      </div>

                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          priorityColors[task.priority]
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default MateriasApp;