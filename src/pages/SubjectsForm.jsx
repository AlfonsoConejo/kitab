import { useParams, Navigate } from "react-router-dom";
import { useState, useRef } from "react";
import { BookOpen, NotebookPen, ChevronDown } from "lucide-react";
import colors from "@/data/colors.js";
import { useClickOutside } from "@/customHooks/useClickOutside.jsx";
import ClassForm from "@/components/ClassForm.jsx";
import { Link } from "react-router-dom";
import { usePeriod } from "@/context/PeriodContext";

export default function SubjectsForm() {
  
  //Get period from context
  const { selectedPeriod } = usePeriod();
  console.log("Periodo seleccioando: ", selectedPeriod)

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
    startDate: selectedPeriod.startDate,
    endDate: selectedPeriod.endDate,
    classes: [],
  });

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [serverError, setServerError] = useState("");

  function addClass() {
    setSubject((prev) => ({
      ...prev,
      classes: [
        ...prev.classes,
        {
          tempId: crypto.randomUUID(),
          days: [],
          type: "theory",
          mode: "onsite",
          classroom: "",
          startTime: "",
          endTime: ""
        },
      ],
    }));
  }

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

  const colorPickerRef = useRef(null);
  useClickOutside(colorPickerRef, () => setIsColorPickerOpen(false));

  const [isManualDate, setIsManualDate] = useState(false);

  function usePeriodDates() {
    setIsManualDate(false);

    setSubject((prev) => ({
      ...prev,
      startDate: selectedPeriod.startDate,
      endDate: selectedPeriod.endDate,
    }));
  }

  function handleClassChange(tempId, field, value) {
    setSubject((prev) => ({
      ...prev,
      classes: prev.classes.map((classItem) =>
        classItem.tempId === tempId
          ? { ...classItem, [field]: value }
          : classItem
      ),
    }));
  }

  function handleDeleteClass(tempId) {
    setSubject((prev) => ({
      ...prev,
      classes: prev.classes.filter((classItem) => classItem.tempId !== tempId),
    }));
  }

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Cleanead class data
    const cleanSubjectData = {
      periodId: selectedPeriod.id, 
      name: formData.name.trim(),
      teacher: formData.teacher.trim(),
      color: formData.color,
      startDate: formData.startDate,
      endDate: formData.endDate,
    };

    //Cleanead class data
    const cleanClassesData = formData.classes.map(({
      days,
      type,
      mode,
      classroom,
      startTime,
      endTime
    }) => ({
      days,
      type: type?.trim(),
      mode: mode?.trim(),
      classroom: classroom?.trim() || null,
      startTime: startTime?.trim(),
      endTime: endTime?.trim(),
    }));

    setIsSending(true);

    //Clean setServerError message
    setServerError("");

    let subjectId

    try {

      // Send subject to database
      const resSubjects = await fetch(`/api/periods/${selectedPeriod.id}/subjects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanSubjectData),
      });

      const subjectData = await resSubjects.json();

      if (!resSubjects.ok) {
        notify("error", `${subjectData.message} || Error al guardar la materia y sus clases`);
        navigate('/app/periods');
        return;
      }

      subjectId = subjectData.subject.id;

      // Send classes to database
      const resClasses = await fetch(`/api/classes/${subjectId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanClassesData),
      });

      const classesData = await resClasses.json();

      if (!resClasses.ok) {
          notify("error", `${classesData.message} || No se pudieron guardar las clases`);
        return;
      }

      navigate('/app/periods');

    } catch (err) {
      setServerError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            {isEditMode ? "Editar Materia" : "Nueva materia"}
          </h1>
        </div>

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
                  <label className="text-sm font-medium text-gray-300">
                    Color
                  </label>

                  <div className="relative w-full" ref={colorPickerRef}>
                    <button
                      type="button"
                      onClick={() => setIsColorPickerOpen((prev) => !prev)}
                      className={`
                        w-full
                        flex
                        items-center
                        justify-between
                        rounded-lg
                        border
                        px-4
                        py-3
                        transition-colors
                        bg-gray-900

                        ${isColorPickerOpen 
                          ? "border-cyan-600"
                          : "border-gray-700"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-5 h-5 rounded-full border border-white/20"
                          style={{ backgroundColor: subject.color }}
                        />

                        <span className="text-gray-300">
                          Seleccionar color
                        </span>
                      </div>
                      
                      <ChevronDown className={`
                        h-5
                        w-5
                        text-gray-400
                        transition-transform
                        ${isColorPickerOpen ? "rotate-180" : ""}
                        `}
                      />
                    </button>

                    {isColorPickerOpen && (
                      <div
                        className="
                          absolute
                          left-0
                          mt-2
                          w-full
                          rounded-xl
                          border
                          border-gray-700
                          bg-gray-900
                          p-4
                          shadow-xl
                          z-50
                          "
                      >
                        <div className="grid grid-cols-4 lg:grid-cols-6 gap-3">
                          {colors.map((color) => (
                            <button
                              key={color}
                              type="button"
                              onClick={() => {
                                handleColorChange(color);
                                setIsColorPickerOpen(false);
                              }}
                              className={`
                                h-6
                                w-6
                                md:h-7
                                md:w-7
                                lg:h-8
                                lg:w-8
                                rounded-full
                                transition-all
                                cursor-pointer
                                hover:scale-110
                                ${
                                  subject.color === color
                                    ? "ring-2 ring-white"
                                    : ""
                                }
                              `}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Switch for date selection */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    Fechas de inicio y término
                  </label>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={usePeriodDates}
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
                  disabled={!isManualDate} 
                  value={subject.startDate}
                  min={selectedPeriod.startDate}
                  max={isManualDate ? subject.endDate : selectedPeriod.endDate}
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
                  disabled={!isManualDate} 
                  value={subject.endDate}
                  min={isManualDate ? subject.startDate : selectedPeriod.startDate}
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

              <div className="flex flex-col gap-4">
                {subject.classes.map((classItem, index) => (
                  <ClassForm
                    key={classItem.tempId}
                    classData={classItem}
                    onChange={(field, value) =>
                      handleClassChange(classItem.tempId, field, value)
                    }
                    onDelete={() => handleDeleteClass(classItem.tempId)}
                  />
                ))}
              </div>

              {/* "Add class" button */}
              <div className="flex ">
                <button
                  type="button"
                  onClick={addClass}
                  className={`
                    rounded-lg
                    bg-orange-600 hover:bg-orange-500
                    px-4
                    py-2
                    font-semibold
                    text-sm
                    text-white
                    cursor-pointer
                    transition-colors
                    ${subject.classes.length > 0 ? "mt-6" : ""}
                  `}
                >
                  Añadir clase
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <Link to="/app/subjects"
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
                    : "Crear periodo"
                }
              </button>
            </div>
          </form>
        </div>
      
    </div>  
  )
}