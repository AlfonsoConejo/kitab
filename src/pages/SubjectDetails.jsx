import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiFetch } from "../services/apiFetch.js";
import { notify } from "@/utils.jsx";
import { User, CalendarDays, Clock3, MapPin, Laptop, Building2, FlaskConical, Wrench, Notebook, Paintbrush} from "lucide-react"
import { DAY_NAMES, formatDate, formatTime } from "@/functions.js";
import SectionLoader from "@/components/SectionLoader.jsx";

const typeMap = {
  theory: {
    label: "Teoría",
    icon: <Notebook size={18} />,
    color: "bg-[#162456] text-[#4589dd]"
  },
  laboratory: {
    label: "Laboratorio",
    icon: <FlaskConical size={18} />,
    color: "bg-[#002c22] text-[#59dead]"
  },
  workshop: {
    label: "Taller",
    icon: <Wrench size={18} />,
    color: "bg-[#441306] text-[#ffb86a]"
  }
};

export default function SubjectDetails() {

  const { id } = useParams();
  const [subject, setSubject] = useState(null);
  const [isLoadingSubject, setIsLoadingSubject] = useState(true);
  const navigate = useNavigate();

  const [externalConflicts, setExternalConflicts] = useState([]);
  const [internalConflicts, setInternalConflicts] = useState([]);
  
  console.log("Información de la materia: ", subject);
  
  // Fetch subject details with scheduled classes
  useEffect(() => {

    const getSubjectWithClasses = async () => {
      try{
        setIsLoadingSubject(true);

        const resSubject = await apiFetch(`/api/subjects/${id}/with-classes`);

        const subjectData = await resSubject.json();

        if (!resSubject.ok) {
          notify("error", "No se pudo encontrar la materia");
          navigate("/app/subjects");
          return;
        }

        const classes = subjectData.data.classes.map((cls) => ({
          id: cls.id,
          days: cls.days,
          type: cls.type,
          mode: cls.mode,
          classroom: cls.classroom ?? "",
          startTime: cls.startTime,
          endTime: cls.endTime,
        }));

        setSubject({
          id: subjectData.data.id,
          periodId: subjectData.data.periodId,
          name: subjectData.data.name,
          teacher: subjectData.data.teacher ?? "",
          color: subjectData.data.color,
          startDate: subjectData.data.startDate,
          endDate: subjectData.data.endDate,
          classes,
        });

        const [externalRes, internalRes] = await Promise.all([
          apiFetch(
            `/api/subjects/classes/check-external-conflicts`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                periodId: subjectData.data.periodId,
                subjectId: subjectData.data.id,
                classes,
              }),
            }
          ),

          apiFetch(
            `/api/subjects/classes/check-internal-conflicts`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                classes,
              }),
            }
          ),
        ]);

        const [externalData, internalData] = await Promise.all([
          externalRes.json(),
          internalRes.json(),
        ]);

         if (!externalRes.ok) {
          notify(externalData.message);
          return;
        }

        if (!internalRes.ok) {
          notify(internalData.message);
          return;
        }

        setExternalConflicts(externalData.externalConflicts);
        setInternalConflicts(internalData.internalConflicts);

      } catch (error) {
        notify("error", "Error de conexión");
        navigate("/app/subjects");
      } finally {
        setIsLoadingSubject(false);
      }
    }

    getSubjectWithClasses();

  }, [id, navigate]);

  // Set the document title
  useEffect(() => {
    document.title =  subject ? `${subject.name}` : "Materia";
  }, [subject]);

  if (isLoadingSubject) {
    return (
      <SectionLoader />
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

        <div className="flex items-center gap-2">
          <Link to={`/app/subjects`} className="rounded-lg font-semibold text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 text-sm transition cursor-pointer">
            Regresar
          </Link>
          <Link 
            to={`/app/subjects/${id}/edit`}
            state={{ from: `/app/subjects/${id}` }}
            className="rounded-lg font-semibold text-white bg-yellow-700 hover:bg-yellow-600 px-4 py-2 text-sm transition cursor-pointer">
            Editar
          </Link>
        </div>
      </div>

      {/* Subject header cards */}
      <div className="">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-lg border-gray-700 bg-gray-800 shadow">
            <Paintbrush className="text-gray-400" size={22} />
            <div className="flex flex-col gap-1">
              <p className="text-xs uppercase tracking-wide text-gray-400">
                Color
              </p>
              <div
                className="h-4 w-15 rounded-full border border-gray-600"
                style={{ backgroundColor: subject.color }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-lg border-gray-700 bg-gray-800 shadow">
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

          <div className="flex items-center gap-4 p-4 sm:p-5 rounded-lg border-gray-700 bg-gray-800 shadow">
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

      {/* Subject classes cards */}
      <h2 className="text-xl font-semibold">
        Clases
      </h2>
      {subject.classes.length === 0 ? (
        <div className="flex items-center justify-center gap-4 rounded-lg bg-gray-800 border-gray-700 p-4 text-center">
          <p className="text-gray-400">Sin clases. Edita la materia para agregar clases.</p>
        </div>
      ) : (
        subject.classes.map((classItem) => (
          <ClassCard key={classItem.id} classData={{...classItem}} />
        ))
      )}
    </div>    
  );
}

function ClassCard({ classData }) {
  const type = typeMap[classData.type];

  return (
    <div className="rounded-lg border-gray-700 bg-gray-800 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      
      {/* Columna Izquierda: Tipo, Horario y Aula */}
      <div className="flex flex-col gap-3">
        
        {/* Type and mode labels */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium ${type.color}`}>
            {type.icon}
            <span>{type.label}</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            {classData.mode === "online" ? <Laptop size={14} /> : <Building2 size={14} />}
            <span>{classData.mode === "online" ? "En línea" : "Presencial"}</span>
          </div>
        </div>

        {/* Time and classroom */}
        <div className="flex items-baseline gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-white">
            <Clock3 className="text-gray-400" size={16} />
            <span className="text-lg font-semibold tracking-tight">
              {formatTime(classData.startTime)}
            </span>
            <span className="text-gray-600">—</span>
            <span className="text-lg font-semibold tracking-tight">
              {formatTime(classData.endTime)}
            </span>
          </div>

          {classData.mode === 'onsite' && classData.classroom && (
            <div className="flex items-center gap-1 text-xs font-semibold text-gray-300 bg-gray-700 px-2 py-0.5 rounded-md">
              <MapPin size={12} className="text-gray-300" />
              <span>{classData.classroom}</span>
            </div>
          )}
        </div>
      </div>

      {/* Columna Derecha: Días de la semana */}
      <div className="flex flex-col md:items-end gap-1.5 border-t border-gray-800/50 pt-3 md:border-none md:pt-0">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1 md:pl-0">Días</span>
        <div className="flex gap-1">
          {classData.days.map(day => (
            <span
              key={day}
              className="rounded-md px-2 py-0.5 text-xs font-semibold bg-gray-700 text-gray-300"
            >
              {DAY_NAMES[day]}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}