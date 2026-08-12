import { useParams, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { BookOpen, NotebookPen } from "lucide-react";
import { useClickOutside } from "@/customHooks/useClickOutside.jsx";
import ClassForm from "@/components/ClassForm.jsx";
import { Link } from "react-router-dom";
import { usePeriod } from "@/context/PeriodContext";
import { notify } from "@/utils";
import { apiFetch } from "@/services/apiFetch";
import ColorPicker from "@/components/ColorPicker";
import SectionLoader from "@/components/SectionLoader";
import { areSameDay } from "@/utils/date.utils.js";

export default function SubjectsForm() {
  
  const navigate = useNavigate();
  const location = useLocation();

  //Get period from context
  const { selectedPeriod } = usePeriod();

  if (!selectedPeriod) {
    return <Navigate to="/app/periods" replace />;
  }

  //Detect if it is a Creation Form or an Edition Form
  const { id } = useParams();
  const isEditMode = Boolean(id);

  //States
  const [subject, setSubject] = useState({ 
    periodId: selectedPeriod.id, 
    name: '', 
    teacher: '', 
    color: '#EF4444',
    startDate: '',
    endDate: '',
    classes: [],
  });

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingSubject, setIsLoadingSubject] = useState(isEditMode);
  const [isManualDate, setIsManualDate] = useState(null);
  const [serverError, setServerError] = useState("");

  const [externalConflicts, setExternalConflicts] = useState([]);
  const [internalConflicts, setInternalConflicts] = useState([]);

  console.log("Estos son los cruces con otra materias: ", externalConflicts);
  console.log("Estos son los cruces con esta materia: ", internalConflicts);

  const [deletedClassIds, setDeletedClassIds] = useState([]); // Mark to delete
  const [deletingClassIds, setDeletingClassIds] = useState([]); // // Mark to animate deletion
  const [addingClassIds, setAddingClassIds] = useState([]); // Set class to animate entrance

  const classesEndRef = useRef(null);

  // Set the document title
  useEffect(() => {
    document.title = isEditMode ? "Editar materia" : "Nueva materia";
  }, [isEditMode]); 

  // Get the information of the subject if user is editing
  useEffect(() => {
    if (!isEditMode) return;

    const getSubject = async () => {
      try {
        const resSubject = await apiFetch(`/api/subjects/${id}/with-classes`, {
          method: "GET",
        });

        const subjectData = await resSubject.json();

        if (!resSubject.ok) {
          notify("error", "No se pudo obtener la materia");
          navigate("/app/subjects");
          return;
        }

        const classes = subjectData.data.classes.map((cls) => ({
          id: cls.id,
          tempId: crypto.randomUUID(),
          days: cls.days,
          type: cls.type,
          mode: cls.mode,
          classroom: cls.classroom,
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

        const conflictsRes = await apiFetch(
          `/api/subjects/${subjectData.data.id}/classes/check-conflicts`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              classes,
            }),
          }
        );

        const conflictsData = await conflictsRes.json();

        if (!conflictsRes.ok) {
          setServerError(conflictsData.message);
          return;
        }

        setExternalConflicts(conflictsData.externalConflicts);
        setInternalConflicts(conflictsData.internalConflicts);

      } catch (error) {
        console.error("Error fetching subject:", error);
        notify("error", "Error de conexión");
        navigate("/app/subjects");
      } finally {
        setIsLoadingSubject(false);
      }
    }
    getSubject();
  }, [isEditMode, id, navigate]);

  //Validate if all clases have complete information
  const areClassesValid =
  subject.classes.length === 0 ||
  subject.classes.every((c) =>
    c.days?.length > 0 &&
    c.type &&
    c.mode &&
    c.startTime &&
    c.endTime
  );

  // Validate errors right after opening page
  const isSubmitDisabled =
    !subject.periodId ||
    !subject.name.trim() ||
    !subject.color ||
    !subject.startDate ||
    !subject.endDate||
    isSending ||
    !areClassesValid;

  function addClass() {
    const tempId = crypto.randomUUID();

    setAddingClassIds((prev) => [...prev, tempId]);

    setSubject((prev) => ({
      ...prev,
      classes: [
        ...prev.classes,
        {
          tempId,
          days: [],
          type: "theory",
          mode: "onsite",
          classroom: "",
          startTime: "",
          endTime: ""
        },
      ],
    }));

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAddingClassIds((prev) =>
          prev.filter((id) => id !== tempId)
        );
      });
    });

    setTimeout(() => {
      classesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 101);
  }

  const colorPickerRef = useRef(null);
  useClickOutside(colorPickerRef, () => setIsColorPickerOpen(false));

  // If user is creating a subject set setIsManualDate to false
  useEffect(() => {
    if (!isEditMode && selectedPeriod) {
      setSubject((prev) => ({
        ...prev,
        startDate: selectedPeriod.startDate,
        endDate: selectedPeriod.endDate,
      }));
      setIsManualDate(false);
    }
  }, [isEditMode, selectedPeriod])

  // If user is editing a subject check if period dates and subject dates are the same
  useEffect(() => {
    if (
      isEditMode &&
      selectedPeriod &&
      subject.startDate &&
      subject.endDate
    ) {
      const usePeriodDates =
        areSameDay(selectedPeriod.startDate, subject.startDate) &&
        areSameDay(selectedPeriod.endDate, subject.endDate);

      setIsManualDate(!usePeriodDates);
    }
  }, [isEditMode, subject, selectedPeriod]);


  const handleUsePeriodDates = () => {
    if (!selectedPeriod) {
      notify("error", "No hay un periodo seleccionado");
      return;
    }

    setIsManualDate(false);
    setSubject((prev) => ({
      ...prev,
      startDate: selectedPeriod.startDate,
      endDate: selectedPeriod.endDate,
    }));
  };

  const handleManualDate = () => {
    if (!selectedPeriod) {
      notify("error", "Primero selecciona un periodo");
      return;
    }
    setIsManualDate(true);
  };

  function handleClassChange(tempId, field, value) {
    setSubject((prev) => ({
      ...prev,
      classes: prev.classes.map((classItem) => {
        if (classItem.tempId !== tempId) {
          return classItem;
        }

        if (field === "mode" && value === "online") {
          return {
            ...classItem,
            mode: value,
            classroom: null,
          };
        }

        return {
          ...classItem,
          [field]: value,
        };
      }),
    }));
  }

  function handleDeleteClass(tempId) {
     // Buscar la clase a eliminar
    const classToDelete = subject.classes.find(
      c => c.tempId === tempId
    );
    
    if (!classToDelete) return;

    // Si la clase tiene ID (está en la BD), marcarla para eliminar
    if (classToDelete.id) {
      setDeletedClassIds(prev => [...prev, classToDelete.id]);
    }

    // Iniciar animación
    setDeletingClassIds(prev => [...prev, tempId]);

    // Esperar a que termine la animación
    setTimeout(() => {
      setSubject(prev => ({
        ...prev,
        classes: prev.classes.filter(
          classItem => classItem.tempId !== tempId
        ),
      }));

      setDeletingClassIds(prev =>
        prev.filter(id => id !== tempId)
      );
    }, 300);
  }

   // Función para obtener las clases que serán enviadas al backend
  const getClassesForSubmit = () => {
    return subject.classes.map(({
      id,
      days,
      type,
      mode,
      classroom,
      startTime,
      endTime,
    }) => ({
      ...(id && { id }),
      days,
      type: type?.trim(),
      mode: mode?.trim(),
      classroom: classroom?.trim() || null,
      startTime: startTime?.trim(),
      endTime: endTime?.trim(),
    }));
  };

  // Base function to clean subject's data
  const prepareBaseSubjectData = () => {
    return {
      name: subject.name.trim(),
      teacher: subject.teacher.trim(),
      color: subject.color,
      startDate: subject.startDate,
      endDate: subject.endDate,
      classes: getClassesForSubmit(),
    };
  };

  // Function to clean data sent for creation
  const prepareCreateData = () => {
    return prepareBaseSubjectData();
  };

  // Function to clean data sent for update
  const prepareUpdateData = () => {
    return {
      ...prepareBaseSubjectData(),
      deletedClassIds,
    };
  };

  const handleSubjectChange = (e) => {
    setServerError("");

    let { name, value } = e.target;

    //Only letters allowed in teacher name field
    if (name === "teacher") {
      value = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    }
    
    setSubject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleColorChange = (color) => {
    setServerError("");
    setSubject(prev => ({
      ...prev,
      color
    }));
  };

  // handleSubmit actualizado
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPeriod) {
      notify("error", "No hay un periodo seleccionado");
      return;
    }

    // Preparar datos con eliminación
    const cleanSubjectData = isEditMode
      ? prepareUpdateData()
      : prepareCreateData();

    setIsSending(true);
    setServerError("");

    try {
      let url, method;

      if (isEditMode) {
        url = `/api/subjects/${subject.id}`;
        method = "PUT";
      } else {
        url = `/api/periods/${selectedPeriod.id}/subjects`;
        method = "POST";
      }

      const res = await apiFetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanSubjectData),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message);
        return;
      }

      notify("success", isEditMode 
        ? "Materia actualizada correctamente" 
        : "Materia creada correctamente"
      );
      
      navigate("/app/subjects");

    } catch (err) {
      console.error("Error al guardar:", err);
      notify("error", "No fue posible conectar con el servidor.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            {isEditMode ? "Editar Materia" : "Nueva materia"}
          </h1>
        </div>

        <div className="flex-1">
          {isLoadingSubject ? (
            <SectionLoader />
          ) : (
            <div className="flex flex-col rounded-lg border border-gray-800 bg-gray-800 p-8 gap-8">
              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
                autoComplete="off"
              >
                {/** Subject Information */}
                <div>
                  {/* Subject header*/}
                  <div className="flex items-center gap-3 mb-8">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-900/40">
                      <BookOpen size={24} />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Información de la materia
                      </h2>

                      <p className="text-sm text-gray-400">
                        Completa los datos de la materia.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Subject Name */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-300"
                      >
                        Nombre de la materia
                      </label>

                      <input
                        onChange={handleSubjectChange}
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Geomática"
                        maxLength={40}
                        value={subject.name}
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

                    {/* Teacher Name */}
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="teacher"
                        className="text-sm font-medium text-gray-300"
                      >
                        Nombre del profesor{" "}
                        <span className="font-normal text-gray-500">
                          (opcional)
                        </span>
                      </label>

                      <input
                        onChange={handleSubjectChange}
                        id="teacher"
                        name="teacher"
                        type="text"
                        placeholder="José Hernández"
                        maxLength={50}
                        value={subject.teacher}
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

                    {/* Color */}
                    <div className="flex flex-col gap-2" >
                      <ColorPicker
                        value={subject.color}
                        onChange={handleColorChange}
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
                          onClick={handleUsePeriodDates}
                          className={`
                            px-3 py-2
                            rounded-lg
                            text-sm font-semibold
                            transition-colors
                            cursor-pointer

                            ${
                              isManualDate === false
                                ? "bg-cyan-600 text-white"
                                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                            }
                          `}
                        >
                          {"Periodo académico"}
                        </button>

                        <button
                          type="button"
                          onClick={handleManualDate}
                          className={`
                            px-3 py-2
                            rounded-lg
                            text-sm font-semibold
                            transition-colors
                            cursor-pointer

                            ${
                              isManualDate === true
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
                </div>

                <div className="grid gap-6 md:grid-cols-2">

                  {/* Start Date */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-300">
                      Fecha de inicio
                    </label>

                    <input
                      name="startDate"
                      type="date"
                      disabled={isManualDate !== true} 
                      value={subject.startDate}
                      min={selectedPeriod.startDate}
                      max={isManualDate === true  ? subject.endDate : selectedPeriod.endDate}
                      onChange={handleSubjectChange}
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
                      name="endDate"
                      disabled={isManualDate !== true} 
                      value={subject.endDate}
                      min={isManualDate === true ? subject.startDate : selectedPeriod.startDate}
                      max={selectedPeriod.endDate}
                      onChange={handleSubjectChange}
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

                {/* Classes information */}
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-cyan-900/40">
                      <NotebookPen size={24} />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        Información de las clases
                      </h2>

                      <p className="text-sm text-gray-400">
                        Completa los datos de las clases.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    {subject.classes.map((classItem) => {
                      const isDeleting = deletingClassIds.includes(classItem.tempId);
                      const isAdding = addingClassIds.includes(classItem.tempId);

                      const classExternalConflicts = externalConflicts.filter(
                        (conflict) => conflict.tempId === classItem.tempId
                      );

                      const classInternalConflicts = internalConflicts.filter(
                        (conflict) =>
                          conflict.classA === classItem.tempId ||
                          conflict.classB === classItem.tempId
                      );

                      const conflictCount =
                        classExternalConflicts.length +
                        classInternalConflicts.length;

                      return (
                        <div
                          key={classItem.tempId}
                          className={`
                            grid
                            transition-all
                            ease-in-out
                            ${
                              isDeleting
                                ? "grid-rows-[0fr] opacity-0 mb-0 duration-300"
                                : isAdding
                                  ? "grid-rows-[0fr] opacity-0 mb-0 duration-100"
                                  : "grid-rows-[1fr] opacity-100 mb-4 duration-100"
                            }
                          `}
                        >
                          <div className="min-h-0 overflow-hidden">
                            <ClassForm
                              classData={classItem}
                              isEditMode={isEditMode}
                              isNew={!classItem.id}
                              conflicts={{
                                external: classExternalConflicts,
                                internal: classInternalConflicts,
                              }}
                              conflictCount={conflictCount}
                              onChange={(field, value) =>
                                handleClassChange(classItem.tempId, field, value)
                              }
                              onDelete={() => handleDeleteClass(classItem.tempId)}
                            />
                          </div>
                        </div>
                      );
                    })}

                    <div ref={classesEndRef} />
                  </div>

                  {/* "Add class" button */}
                  <div className="flex ">
                    <button
                      type="button"
                      onClick={addClass}
                      className={`
                        rounded-lg
                        bg-amber-700 hover:bg-amber-600
                        px-4
                        py-2
                        font-semibold
                        text-sm
                        text-white
                        cursor-pointer
                        transition-colors
                        mt-6
                      `}
                    >
                      Añadir clase
                    </button>
                  </div>
                </div>

                {serverError && (
                  <div className="bg-red-500/10 border border-red-500 text-red-400 p-2 rounded text-sm">
                    {serverError}
                  </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <Link 
                    to={location.state?.from || "/app/subjects"}
                    className="
                      rounded-lg
                      border
                      border-gray-700
                      px-4
                      py-2
                      text-gray-300
                      hover:bg-gray-800
                      cursor-pointer
                      text-sm
                      transition-colors
                    "
                  >
                    Cancelar
                  </Link>

                  <button
                    disabled={isSubmitDisabled}
                    type="submit"
                    className="
                      rounded-lg
                      bg-sky-600
                      px-4
                      py-2
                      font-semibold
                      text-sm
                      text-white
                      hover:bg-sky-500
                      cursor-pointer
                      transition-colors

                      disabled:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-50
                    "
                  >
                    {isSending
                      ? <div className="loader"></div>
                      : isEditMode
                        ? "Guardar cambios"
                        : "Crear materia"
                    }
                  </button>
                </div>
              </form>
            </div>
          )}
          
        </div>
      
    </div>  
  )
}