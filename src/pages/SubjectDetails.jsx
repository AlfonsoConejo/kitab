import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/apiFetch.js";
import { notify } from "@/utils.jsx";
import { User, CalendarDays} from "lucide-react"
import { formatDate } from "@/functions.js";

export default function SubjectDetails() {

  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [isLoadingSubject, setIsLoadingSubject] = useState(true);
  const navigate = useNavigate();
  
  console.log("Información de la materia", subject);
  
  // Fetch subject details with scheduled classes
  useEffect(() => {

    const getSubjectWithClasses = async () => {
      try{
        setIsLoadingSubject(true);

        const res = await apiFetch(`/api/subjects/${id}/with-classes`);

        const data = await res.json();

        if (!res.ok) {
          notify("error", "No se pudo encontrar la materia");
          navigate("/app/subjects");
          return;
        }

        setSubject({
          id: data.data.id,
          periodId: data.data.periodId,
          name: data.data.name,
          teacher: data.data.teacher,
          color: data.data.color,
          startDate: data.data.startDate,
          endDate: data.data.endDate,
          classes: data.data.classes
        });
      } catch (error) {
        notify("error", "Error de conexión");
        navigate("/app/subjects");
      } finally {
        setIsLoadingSubject(false);
      }
    }

    getSubjectWithClasses();

  }, [id, navigate]);

  if (isLoadingSubject) {
    return (
      <div className="flex justify-center p-8">
        Cargando materia...
      </div>
    );
  }

  if (!subject) {
    return null;
  }

  return (
    <div className="flex flex-col flex-1 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">
          {subject.name}
        </h1>

        <Link to={`/app/subjects`} className="rounded-lg font-semibold text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 text-sm transition cursor-pointer">
          Regresar
        </Link>
      </div>

      {/* Subject cards */}
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 rounded-lg bg-gray-800 border border-gray-700 p-4">
            <div
              className="h-5 w-5 rounded-full border border-gray-600"
              style={{ backgroundColor: subject.color }}
            />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Color
              </p>
              <p className="text-sm text-gray-100">
                Materia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg bg-gray-800 border border-gray-700 p-4">
            <CalendarDays className="text-gray-400" size={22} />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Período
              </p>
              <p className="text-sm text-gray-100">
                {formatDate(subject.startDate, subject.endDate)} -{" "}
                {formatDate(subject.endDate)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-lg bg-gray-800 border border-gray-700 p-4">
            <User className="text-gray-400" size={22} />
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Profesor
              </p>
              <p className="text-sm text-gray-100">
                {subject.teacher || "Sin profesor asignado"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold">
        Clases
      </h2>
    </div>    
  );
}