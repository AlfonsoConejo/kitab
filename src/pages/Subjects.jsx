import NoActivePeriodMessage from "@/components/NoActivePeriodMessage";
import EmptySection from "@/components/EmptySection";
import { apiFetch } from "@/services/apiFetch";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { notify } from "@/utils";
import { usePeriod } from "@/context/PeriodContext";
import { BookOpen, CalendarDays, User, Trash2 } from "lucide-react";
import { formatDate, getClassDays } from "@/functions";
import ConfirmModal from "@/components/ConfirmModal";

export default function Subjects() {
  const { selectedPeriod } = usePeriod();
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  console.log("Materias: ", subjects);
  console.log("Clases: ", classes);

  // Fetch all subjects and classes of the period
  useEffect(() => {
    // Show nothing if there is no selected period
    if (!selectedPeriod) {
      setSubjects([]);
      setClasses([]);
      setIsLoading(false);
      return;
    }

    // Fetch subjects information
    async function fetchData() {
      try {
        setIsLoading(true);

        // Fetch subjects
        const subjectsRes = await apiFetch(
          `/api/periods/${selectedPeriod.id}/subjects`
        );

        if (!subjectsRes.ok) {
          throw new Error("SUBJECTS_ERROR");
        }

        const subjectsData = await subjectsRes.json();

        // Fetch classes
        const classesRes = await apiFetch(
          `/api/periods/${selectedPeriod.id}/classes`
        );

        if (!classesRes.ok) {
          throw new Error("CLASSES_ERROR");
        }

        const classesData = await classesRes.json();

        setSubjects(subjectsData.data || []);
        setClasses(classesData.data || []);

      } catch (error) {
        if (error.message === "SUBJECTS_ERROR") {
          notify("error", "No se pudieron cargar las materias.");
        } else if (error.message === "CLASSES_ERROR") {
          notify("error", "No se pudieron cargar las clases.");
        } else if (error.message !== "SESSION_EXPIRED") {
          notify("error", "Error de conexión.");
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [selectedPeriod?.id]);

  const subjectsWithClasses = useMemo(() => {
    const classesBySubject = classes.reduce((acc, cls) => {
      if (!acc[cls.subjectId]) {
        acc[cls.subjectId] = [];
      }

      acc[cls.subjectId].push(cls);

      return acc;
    }, {});

    return subjects.map((subject) => ({
      ...subject,
      classes: classesBySubject[subject.id] ?? [],
    }));
  }, [subjects, classes]);

  let content;

  async function handleDeletedSubject(subject) {
    try {
      const res = await apiFetch(`/api/subjects/${subject.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        notify("error", "No se pudo eliminar la materia");
        return;
      }

      setSubjects((prev) =>
        prev.filter((s) => s.id !== subject.id)
      );

      setClasses((prev) =>
        prev.filter((c) => c.subjectId !== subject.id)
      );
    } catch {
      notify("error", "Error de conexión");
    }
  }

  if (isLoading) {
    content = <div className="text-center p-6">Cargando materias...</div>;
  } else if (!selectedPeriod) {
    content = <NoActivePeriodMessage />;
  } else if (subjects.length === 0) {
    content = (
      <EmptySection
        icon={BookOpen}
        title="Aún no tienes materias"
        description="Crea tu primera materia para comenzar a organizar este periodo."
        buttonText="Crear materia"
        buttonLink="/app/subjects/new"
      />
    );
  } else {
    content = <SubjectsList subjects={subjectsWithClasses} setSubjectToDelete={setSubjectToDelete}/>;
  }
  return(
    <div className="flex flex-col flex-1 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">
          Materias
        </h1>
        {
          selectedPeriod && 
          <Link to="/app/subjects/new" className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors">
            Agregar materia
          </Link>
        } 
      </div>

      <div className="flex-1">
        {content}
      </div>

      {subjectToDelete && (
        <ConfirmModal
          title="Eliminar materia"
          message={`¿Seguro que deseas eliminar "${subjectToDelete.name}"?`}
          variant="danger"
          onClose={() => setSubjectToDelete(null)}
          onConfirm={() => {
            handleDeletedSubject(subjectToDelete);
            setSubjectToDelete(null);
          }}
        />
      )}

    </div>
  );
}

function SubjectsList({subjects, setSubjectToDelete}) {
  return(
    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
      {
        subjects.map((subject) => (
          <SubjectCard 
            key={subject.id}
            subject={subject}
            onDelete={setSubjectToDelete}/>
        ))
      }
    </div>
  )
}

function SubjectCard({ subject, onDelete }) {
  return (
    <div className="rounded-xl border border-gray-700 bg-gray-800 p-6">
      {/* Header */}
      <div className="flex gap-3 justify-between">
        <div className="flex items-center gap-3">
          <div
            className="h-5 w-5 rounded-full"
            style={{ backgroundColor: subject.color }}
          />

          <h3 className="text-xl font-semibold text-white">
            {subject.name}
          </h3>
        </div>

        <button
          onClick={() => onDelete?.(subject)}
          className="
            p-2
            rounded-lg
          text-red-400
          hover:bg-red-500/10
            transition-colors
            cursor-pointer
          "
        >
          <Trash2 size={16} />
        </button>
        
      </div>

      {/* Body */}
      <div className="mt-3 inline-flex items-center justify-center text-xs bg-gray-700 px-3 py-1 rounded-lg text-gray-300">
        <span>
          {getClassDays(subject.classes)}
        </span>    
      </div>

      <div className="mt-3 flex items-center gap-2 text-gray-300">
        <CalendarDays size={18} />
        <span>
          {formatDate(subject.startDate, subject.endDate)} - {formatDate(subject.endDate)}
        </span>
      </div>

      <div className="mt-2 flex items-center gap-2 text-gray-300">
        <User size={18} />
        <span>
          {subject.teacher || "Sin profesor asignado"}
        </span>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-end">

        <Link to={`/app/subjects/${subject.id}`} className="rounded-lg font-semibold text-white bg-sky-600 hover:bg-sky-500 px-4 py-2 text-sm transition cursor-pointer">
          Ver materia
        </Link>
      </div>
    </div>
  );
}