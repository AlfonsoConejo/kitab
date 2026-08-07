import NoActivePeriodMessage from "@/components/NoActivePeriodMessage";
import EmptySection from "@/components/EmptySection";
import { apiFetch } from "@/services/apiFetch";
import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { notify } from "@/utils";
import { usePeriod } from "@/context/PeriodContext";
import { BookOpen, CalendarDays, User, Trash2, Pencil } from "lucide-react";
import { formatDate, getClassDays } from "@/functions";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "@/components/ConfirmModal";
import SectionLoader from "@/components/SectionLoader";

export default function Subjects() {
  const navigate = useNavigate();

  const { selectedPeriod } = usePeriod();
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set the document title
  useEffect(() => {
    document.title =  "Materias";
  }, []);

  // Fetch all subjects and classes of the period
  useEffect(() => {
    if (!selectedPeriod) {
      setSubjects([]);
      setClasses([]);
      setIsLoading(false);
      return;
    }

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

  // Combine subjects with their classes
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

  const handleEdit = (subject) => {
    navigate(`/app/subjects/${subject.id}/edit`);
  };

  async function handleDeletedSubject(subject) {
    try {
      const res = await apiFetch(`/api/subjects/${subject.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        notify("error", "No se pudo eliminar la materia");
        return;
      }

      setSubjects((prev) => prev.filter((s) => s.id !== subject.id));
      setClasses((prev) => prev.filter((c) => c.subjectId !== subject.id));
      notify("success", `"${subject.name}" eliminada correctamente`);
    } catch {
      notify("error", "Error de conexión");
    }
  }

  // Render content based on state
  let content;
  if (isLoading) {
    content = <SectionLoader />;
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
    content = (
      <SubjectsGrid 
        subjects={subjectsWithClasses} 
        onDelete={setSubjectToDelete}
        onEdit={handleEdit}
      />
    );
  }

  return (
    <div className="flex flex-col flex-1 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold text-white">Materias</h1>
        {selectedPeriod && (
          <Link
            to="/app/subjects/new"
            className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors"
          >
            Agregar materia
          </Link>
        )}
      </div>

      <div className="flex-1">{content}</div>

      {/* Delete Confirmation Modal */}
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

/** Grid of subject cards */
function SubjectsGrid({ subjects, onDelete, onEdit }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

/* Class card */
function SubjectCard({ subject, onDelete, onEdit }) {
  const classDays = getClassDays(subject.classes);
  
  return (
    <div className="group rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 transition-all duration-200 p-6">
      {/* Header with name and color */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="h-5 w-5 rounded-full shrink-0"
            style={{ backgroundColor: subject.color }}
          />
          <h3 className="text-lg font-semibold text-white truncate">
            {subject.name}
          </h3>
        </div>

        {/* Actions*/}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit?.(subject)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors cursor-pointer"
            title="Editar materia"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete?.(subject)}
            className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            title="Eliminar materia"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Days of class */}
      {classDays && (
        <div className="mt-3 inline-flex items-center bg-gray-700/50 px-3 py-1 rounded-lg text-xs text-gray-300">
          <span>{classDays}</span>
        </div>
      )}

      {/* Dates */}
      <div className="mt-3 flex items-center gap-2 text-sm text-gray-300">
        <CalendarDays size={16} className="shrink-0" />
        <span>
          {formatDate(subject.startDate)} — {formatDate(subject.endDate)}
        </span>
      </div>

      {/* Teacher */}
      <div className="mt-2 flex items-center gap-2 text-sm text-gray-300">
        <User size={16} className="shrink-0" />
        <span className="truncate">
          {subject.teacher || "Sin profesor asignado"}
        </span>
      </div>

      {/* Footer with action button */}
      <div className="mt-6 flex items-center justify-end">
        <Link
          to={`/app/subjects/${subject.id}`}
          className="rounded-lg font-semibold text-white bg-sky-600 hover:bg-sky-500 px-4 py-2 text-sm transition-colors cursor-pointer"
        >
          Ver materia
        </Link>
      </div>
    </div>
  );
}

