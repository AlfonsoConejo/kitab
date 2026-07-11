import NoActivePeriodMessage from "@/components/NoActivePeriodMessage";
import EmptySection from "@/components/EmptySection";
import { apiFetch } from "@/services/apiFetch";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { notify } from "@/utils";
import { usePeriod } from "@/context/PeriodContext";
import { BookOpen } from "lucide-react";

export default function Subjects() {
  const { selectedPeriod } = usePeriod();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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


  let content;

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
    content = <SubjectsList subjects={subjects} />;
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
    </div>
  );
}