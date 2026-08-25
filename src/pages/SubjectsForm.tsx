import { useParams, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { useClickOutside } from "@/customHooks/useClickOutside";
import ClassForm from "@/components/ClassForm";
import { Link } from "react-router-dom";
import { usePeriod } from "@/context/PeriodContext";
import { notify } from "@/notify";
import { apiFetch } from "@/services/apiFetch";
import ColorPicker from "@/components/ColorPicker";
import SectionLoader from "@/components/SectionLoader";
import { areSameDay } from "@/utils/date.utils";
import ConfirmModal from "@/components/ConfirmModal";
import type { FormClass, ClassSubmitData, FormClassField } from "@/types/class";
import type { SubjectForm, GetSubjectWithClassesResponse } from "@/types/subject";
import type { InternalConflict, ExternalConflict, CheckExternalConflictsResponse, CheckInternalConflictsResponse } from "@/types/conflicts";

type SubjectSubmitData = {
  name: string;
  teacher: string | null;
  color: string;
  startDate: string;
  endDate: string;
  classes: ClassSubmitData[];
};

type SubjectUpdateData = SubjectSubmitData & {
  deletedClassIds: number[];
};

export default function SubjectsForm() {
  
  const navigate = useNavigate();
  const location = useLocation();

  //Get period from context
  const {
    selectedPeriod,
    isLoadingPeriod
  } = usePeriod();

  //Detect if it is a Creation Form or an Edition Form
  const { id } = useParams();
  const isEditMode = Boolean(id);

  //States
  const [subject, setSubject] = useState<SubjectForm>({
  periodId: 0,
  name: "",
  teacher: "",
  color: "#EF4444",
  startDate: "",
  endDate: "",
  classes: [],
});

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingSubject, setIsLoadingSubject] = useState(isEditMode);
  const [isManualDate, setIsManualDate] = useState<boolean | null>(null);
  const [serverError, setServerError] = useState("");

  const [externalConflicts, setExternalConflicts] = useState<ExternalConflict[]>([]);
  const [internalConflicts, setInternalConflicts] = useState<InternalConflict[]>([]);
  const [isRecalculatingConflicts, setIsRecalculatingConflicts] = useState(false);

  const conflictCalculationId = useRef(0);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [deletedClassIds, setDeletedClassIds] = useState<number[]>([]); // Mark to delete
  const [deletingClassIds, setDeletingClassIds] = useState<string[]>([]); // Mark to animate deletion
  const [addingClassIds, setAddingClassIds] = useState<string[]>([]); // Set class to animate entrance

  const classesEndRef = useRef<HTMLDivElement | null>(null);
  const colorPickerRef = useRef<HTMLDivElement | null>(null);

  // Set the document title
  useEffect(() => {
    document.title = isEditMode ? "Editar materia" : "Nueva materia";
  }, [isEditMode]); 

  // Get the information of the subject and its conflicts if user is editing
  useEffect(() => {
    if (!isEditMode) return;

    const getSubject = async () => {
      try {
        const resSubject = await apiFetch(`/api/subjects/${id}/with-classes`, {
          method: "GET",
        });

        const subjectData: GetSubjectWithClassesResponse =
          await resSubject.json();

        if (!subjectData.success) {
          notify("error", subjectData.message);
          navigate("/app/subjects");
          return;
        }

        const classes: FormClass[] = subjectData.data.classes.map((cls) => ({
          id: cls.id,
          tempId: crypto.randomUUID(),
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
          notify("error", externalData.message);
          return;
        }

        if (!internalRes.ok) {
          notify("error", internalData.message);
          return;
        }

        setExternalConflicts(externalData.externalConflicts);
        setInternalConflicts(internalData.internalConflicts);

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
    isRecalculatingConflicts ||
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
          endTime: "",
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

  useClickOutside(colorPickerRef, () => setIsColorPickerOpen(false));

  // If user is creating a subject set setIsManualDate to false
  useEffect(() => {
    if (!isEditMode && selectedPeriod) {
      setSubject((prev) => ({
        ...prev,
        periodId: selectedPeriod.id,
        startDate: selectedPeriod.startDate,
        endDate: selectedPeriod.endDate,
      }));
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
  }, [
    isEditMode,
    selectedPeriod,
    subject.startDate,
    subject.endDate,
  ]);


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

  const handleClassChange = async <
    K extends FormClassField
  >(
    tempId: string,
    field: K,
    value: FormClass[K]
  ) => {
    const currentClass = subject.classes.find(
      (classItem) => classItem.tempId === tempId
    );

    if (!currentClass) return;

    const updatedClass = {
      ...currentClass,
      [field]: value,
    };

    if (field === "mode" && value === "online") {
      updatedClass.classroom = null;
    }

    const updatedClasses = subject.classes.map((classItem) =>
      classItem.tempId === tempId
        ? updatedClass
        : classItem
    );

    setSubject((prev) => ({
      ...prev,
      classes: updatedClasses,
    }));

    // Solo revisar conflictos si cambió el horario
    if (
      field !== "days" &&
      field !== "startTime" &&
      field !== "endTime"
    ) {
      return;
    }

    // Si el horario está incompleto, no tiene sentido consultar
    const hasCompleteSchedule =
      updatedClass.days?.length > 0 &&
      updatedClass.startTime &&
      updatedClass.endTime;

    conflictCalculationId.current += 1;
    const calculationId = conflictCalculationId.current;

    if (!hasCompleteSchedule) {
      setExternalConflicts((prev) =>
        prev.filter((conflict) => conflict.id !== tempId)
      );

      setInternalConflicts((prev) =>
        prev.filter(
          (conflict) =>
            conflict.classA !== tempId &&
            conflict.classB !== tempId
        )
      );

      return;
    }

    setIsRecalculatingConflicts(true);

    try {
      await Promise.all([
        recalculateExternalConflicts(updatedClass, calculationId),
        recalculateInternalConflicts(updatedClasses, calculationId),
      ]);
    } finally {
      if (calculationId === conflictCalculationId.current) {
        setIsRecalculatingConflicts(false);
      }
    }
  };

  const recalculateExternalConflicts = async (updatedClass: FormClass, calculationId: number) => {
    try {
      const res = await apiFetch(
        `/api/subjects/classes/check-external-conflicts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            periodId: subject.periodId,
            ...(subject.id && { subjectId: subject.id }),
            classes: [updatedClass],
          }),
        }
      );

      const data: CheckExternalConflictsResponse =
        await res.json();

      if (!data.success) {
        notify("error", data.message);
        return;
      }

      if (calculationId !== conflictCalculationId.current) {
        return;
      }

      // Reemplazar únicamente los conflictos de esta clase
      setExternalConflicts((prev) => {
        const filtered = prev.filter(
          (conflict) => conflict.id !== updatedClass.tempId
        );

        return [...filtered, ...data.externalConflicts];
      });

    } catch (error) {
      console.error("Error recalculando conflictos externos:", error);
      notify("error", "No se pudieron comprobar los conflictos.");
    }
  };

  const recalculateInternalConflicts = async (updatedClasses: FormClass[], calculationId: number) => {
    try {
      const res = await apiFetch(
        `/api/subjects/classes/check-internal-conflicts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classes: updatedClasses,
          }),
        }
      );

      const data: CheckInternalConflictsResponse =
        await res.json();

      if (!data.success) {
        notify("error", data.message);
        return;
      }

      if (calculationId !== conflictCalculationId.current) {
        return;
      }

      // Los internos siempre se reemplazan completos
      setInternalConflicts(data.internalConflicts);

    } catch (error) {
      console.error("Error recalculando conflictos internos:", error);
      notify("error", "No se pudieron comprobar los conflictos.");
    }
  };

  function handleDeleteClass(tempId: string) {
    const classToDelete = subject.classes.find(
      (c) => c.tempId === tempId
    );
    if (!classToDelete) return;

    // Si existe en BD, marcar para eliminar
    if (classToDelete.id !== undefined) {
      const classId = classToDelete.id;

      setDeletedClassIds((prev) => [...prev, classId]);
    }

    // Eliminar inmediatamente sus conflictos
    setExternalConflicts((prev) =>
      prev.filter((conflict) => conflict.id !== tempId)
    );

    setInternalConflicts((prev) =>
      prev.filter(
        (conflict) =>
          conflict.classA !== tempId &&
          conflict.classB !== tempId
      )
    );

    // Animación
    setDeletingClassIds((prev) => [...prev, tempId]);

    setTimeout(() => {
      setSubject((prev) => ({
        ...prev,
        classes: prev.classes.filter(
          (classItem) => classItem.tempId !== tempId
        ),
      }));

      setDeletingClassIds((prev) =>
        prev.filter((id) => id !== tempId)
      );
    }, 300);
  }

  // Función para obtener las clases que serán enviadas al backend
  const getClassesForSubmit = (): ClassSubmitData[] => {
    return subject.classes.map(
      ({
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
        type,
        mode,
        classroom: classroom?.trim() || null,
        startTime: startTime.trim(),
        endTime: endTime.trim(),
      })
    );
  };

  // Base function to clean subject's data
  const prepareBaseSubjectData = (): SubjectSubmitData => {
    return {
      name: subject.name.trim(),
      teacher: subject.teacher?.trim() || null,
      color: subject.color,
      startDate: subject.startDate,
      endDate: subject.endDate,
      classes: getClassesForSubmit(),
    };
  };

  // Function to clean data sent for creation
  const prepareCreateData = (): SubjectSubmitData => {
    return prepareBaseSubjectData();
  };

  // Function to clean data sent for update
  const prepareUpdateData = (): SubjectUpdateData => {
    return {
      ...prepareBaseSubjectData(),
      deletedClassIds,
    };
  };

  const handleSubjectChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handleColorChange = (color: string) => {
    setServerError("");
    setSubject(prev => ({
      ...prev,
      color
    }));
  };

  // Connection to endpoint that saves subject
  const saveSubject = async () => {
    const cleanSubjectData = isEditMode
      ? prepareUpdateData()
      : prepareCreateData();

    try {
      let url: string;
      let method: "POST" | "PUT";

      if (isEditMode) {
        if (!subject.id) {
          notify("error", "No se encontró el ID de la materia");
          return;
        }

        url = `/api/subjects/${subject.id}`;
        method = "PUT";
      } else {
        if (!selectedPeriod) {
          notify("error", "No hay un periodo seleccionado");
          return;
        }

        url = `/api/periods/${selectedPeriod.id}/subjects`;
        method = "POST";
      }

      const res = await apiFetch(url, {
        method,
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

      notify(
        "success",
        isEditMode
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

  // Submit form
  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!selectedPeriod) {
      notify("error", "No hay un periodo seleccionado");
      return;
    }

    setServerError("");

    const hasConflicts =
      externalConflicts.length > 0 ||
      internalConflicts.length > 0;

    if (hasConflicts) {
      setIsConfirmModalOpen(true);
      return;
    }

    setIsSending(true);
    await saveSubject();
  };

  if (isLoadingPeriod) {
    return <SectionLoader />;
  }

  if (!selectedPeriod) {
    return <Navigate to="/app/periods" replace />;
  }

  return (
    <div className="flex flex-col flex-1 gap-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-semibold text-white">
          {isEditMode ? "Editar materia" : "Nueva materia"}
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          {isEditMode
            ? "Modifica la información y las clases de esta materia."
            : "Agrega una materia y configura sus clases."}
        </p>
      </div>

      <div className="flex-1">
        {isLoadingSubject ? (
          <SectionLoader />
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
            autoComplete="off"
          >
            {/* Subject information */}
            <section className="p-4 sm:p-5 rounded-lg border-gray-700 bg-gray-800 shadow">
              {/* Section header */}
              <div className="flex items-center pb-4 mb-4 rounded-t gap-4 border-b sm:mb-5 border-gray-600">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                      Información de la materia
                  </h3>

                  <p className="text-sm text-gray-400">
                    Completa los datos generales de la materia.
                  </p>
                </div>
              </div>

              {/* Section body */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Subject name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="mb-2 text-sm font-medium text-white">
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

                  {/* Teacher */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="teacher" className="mb-2 text-sm font-medium text-white">
                      Nombre del profesor
                      <span className="ml-1 font-normal text-gray-400">
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
                      value={subject.teacher ?? ""}
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

                  {/* Color */}
                  <div className="flex flex-col gap-2">
                    <ColorPicker
                      value={subject.color}
                      onChange={handleColorChange}
                    />
                  </div>

                  {/* Date mode */}
                  <div className="flex flex-col gap-2">
                    <label className="mb-2 text-sm font-medium text-white">
                      Fechas de inicio y término
                    </label>

                    <div 
                      className="
                        inline-flex w-fit rounded-lg bg-gray-700 p-1
                        
                      "
                    >
                      <button
                        type="button"
                        onClick={handleUsePeriodDates}
                        className={`
                          rounded-md
                          px-3
                          py-1.5
                          text-sm
                          font-medium
                          transition
                          cursor-pointer
                          ${
                            isManualDate === false
                              ? "bg-gray-600 text-white shadow-sm"
                              : "text-gray-300 hover:text-white"
                          }
                        `}
                      >
                        Periodo académico
                      </button>

                      <button
                        type="button"
                        onClick={handleManualDate}
                        className={`
                          rounded-md
                          px-3
                          py-1.5
                          text-sm
                          font-medium
                          transition
                          cursor-pointer
                          ${
                            isManualDate === true
                              ? "bg-gray-600 text-white shadow-sm"
                              : "text-gray-300 hover:text-white"
                          }
                        `}
                      >
                        Manual
                      </button>
                    </div>
                  </div>

                  {/* Start date */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="startDate" className="mb-2 text-sm font-medium text-white">
                      Fecha de inicio
                    </label>

                    <input
                      id="startDate"
                      name="startDate"
                      type="date"
                      disabled={isManualDate !== true}
                      value={subject.startDate}
                      min={selectedPeriod.startDate}
                      max={
                        isManualDate === true
                          ? subject.endDate
                          : selectedPeriod.endDate
                      }
                      onChange={handleSubjectChange}
                      className="
                        block w-full
                        bg-gray-700
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
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    />
                  </div>

                  {/* End date */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="endDate" className="mb-2 text-sm font-medium text-white">
                      Fecha de término
                    </label>

                    <input
                      id="endDate"
                      name="endDate"
                      type="date"
                      disabled={isManualDate !== true}
                      value={subject.endDate}
                      min={
                        isManualDate === true
                          ? subject.startDate
                          : selectedPeriod.startDate
                      }
                      max={selectedPeriod.endDate}
                      onChange={handleSubjectChange}
                      className="
                        block w-full
                        bg-gray-700
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
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    />
                  </div>
                </div>        
              
            </section>

            {/* Classes */}
            <section className="p-4 sm:p-5 rounded-lg border-gray-700 bg-gray-800 shadow">
              {/* Section header */}
              <div className="flex justify-between items-center pb-4 mb-4 rounded-t gap-4 border-b sm:mb-5 border-gray-600">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      Información de las clases
                    </h3>

                    <p className="text-sm text-gray-400">
                      Configura los horarios y características de cada clase.
                    </p>
                  </div>
                </div>

                <span className="hidden rounded-sm bg-gray-700 px-3 py-1 text-xs font-medium text-white sm:inline-flex">
                  {subject.classes.length}{" "}
                  {subject.classes.length === 1 ? "clase" : "clases"}
                </span>
              </div>

              {/* Classes */}
              <div className="">
                <div className="flex flex-col">
                  {subject.classes.map((classItem) => {
                    const isDeleting = deletingClassIds.includes(
                      classItem.tempId
                    );

                    const isAdding = addingClassIds.includes(
                      classItem.tempId
                    );

                    const classExternalConflicts =
                      externalConflicts.filter(
                        (conflict) =>
                          conflict.id === classItem.tempId
                      );

                    const classInternalConflicts =
                      internalConflicts.filter(
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
                              ? "grid-rows-[0fr] opacity-0 duration-300"
                              : isAdding
                                ? "grid-rows-[0fr] opacity-0 duration-100"
                                : "grid-rows-[1fr] opacity-100 duration-100"
                          }
                        `}
                      >
                        <div className="min-h-0 overflow-hidden">
                          <ClassForm
                            classData={classItem}
                            isEditMode={isEditMode}
                            isNew={!classItem.id}
                            conflicts={{
                              externalConflicts:
                                classExternalConflicts,
                              internalConflicts:
                                classInternalConflicts,
                            }}
                            conflictCount={conflictCount}
                            isRecalculatingConflicts={
                              isRecalculatingConflicts
                            }
                            onChange={(field, value) =>
                              handleClassChange(
                                classItem.tempId,
                                field,
                                value
                              )
                            }
                            onDelete={() =>
                              handleDeleteClass(classItem.tempId)
                            }
                          />                        
                        </div>
                      </div>
                    );
                  })}

                  <div ref={classesEndRef} />
                </div>

                {/* Add class */}
                <button
                  type="button"
                  onClick={addClass}
                  className="
                    mt-5
                    inline-flex
                    items-center
                    rounded-lg
                    bg-gray-700
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-gray-600
                    cursor-pointer
                  "
                >
                  <span className="mr-2 text-lg leading-none">+</span>
                  Añadir clase
                </button>
              </div>
            </section>

            {/* Server error */}
            {serverError && (
              <div className="rounded-lg border border-red-800 bg-red-900/20 p-4 text-sm text-red-400">
                {serverError}
              </div>
            )}

            {/* Form actions */}
            <div className="flex justify-end gap-3 border-t border-gray-800 pt-4">
              <Link
                to={location.state?.from || "/app/subjects"}
                className="
                  rounded-lg
                  border
                  border-gray-600
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-gray-300
                  transition
                  hover:bg-gray-800
                  hover:text-white
                "
              >
                Cancelar
              </Link>

              <button
                disabled={isSubmitDisabled}
                type="submit"
                className="
                  inline-flex
                  items-center
                  rounded-lg
                  bg-cyan-600
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  transition
                  hover:bg-cyan-700
                  focus:outline-none
                  focus:ring-4
                  focus:ring-cyan-900
                  cursor-pointer
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isSending ? (
                  <div className="loader" />
                ) : isRecalculatingConflicts ? (
                  <div className="flex items-center gap-2">
                    <div className="loader" />
                    Comprobando...
                  </div>
                ) : isEditMode ? (
                  "Guardar cambios"
                ) : (
                  "Crear materia"
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {isConfirmModalOpen && (
        <ConfirmModal
          title="Clases en conflicto"
          message="Esta materia tiene clases que chocan con otras clases. ¿Seguro que deseas guardar?"
          variant="warning"
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={async () => {
            setIsConfirmModalOpen(false);
            setIsSending(true);
            await saveSubject();
          }}
        />
      )}
    </div>
  );
}