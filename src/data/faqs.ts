interface Faq {
 question: string;
 answer: string;
}

// Questions
const faqs: Faq[] = [
  {
    question: "¿Kitab es realmente gratuito?",
    answer: "Sí. Kitab sigue una filosofía de código abierto (Open Source). Está siendo desarrollado activamente como parte de mi portafolio profesional y puedes probarlo sin costo."
  },
  {
    question: "¿Cómo se guardan mis datos?",
    answer: "Las contraseñas se almacenan de forma segura utilizando bcrypt. Ningún dato sensible es expuesto al frontend y todas las consultas a la base de datos están protegidas mediante consultas parametrizadas para prevenir inyecciones SQL."
  },
  {
    question: "¿Qué son los periodos?",
    answer: "Los periodos representan ciclos escolares, como semestres o cuatrimestres. Te permiten organizar materias, tareas, exámenes y calificaciones sin mezclar información de distintos ciclos académicos."
  },
  {
    question: "¿Puedo acceder a mi información desde distintos dispositivos?",
    answer: "Sí. Al iniciar sesión con tu cuenta, tu información estará disponible en cualquier dispositivo."
  }
];

export default faqs;