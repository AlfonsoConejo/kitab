interface Feature {
  id: number;
  title: string;
  description: string;
  status: 'implemented' | 'developing' | 'upcoming';
}

const features: Feature[] = [
    {
      id: 1,
      title: 'Autenticación con JWT',
      description: 'Acceso seguro con tokens de autenticación.',
      status: 'implemented'
    },
    {
      id: 2,
      title: 'Gestión de periodos',
      description: 'Administra ciclos y periodos académicos.',
      status: 'implemented'
    },
    {
      id: 3,
      title: 'Asignación de materias',
      description: 'Organiza materias por periodo activo.',
      status: 'implemented'
    },
    {
      id: 4,
      title: 'Gestor de tareas',
      description: 'Crea y da seguimiento a tareas por materia.',
      status: 'upcoming'
    },
    {
      id: 5,
      title: 'Dashboard diario',
      description: 'Toda la información del día en un vistazo.',
      status: 'upcoming'
    },
    {
      id: 6,
      title: 'Control de vacaciones',
      description: 'Solicita y gestiona días libres y permisos.',
      status: 'upcoming'
    },
    {
      id: 7,
      title: 'Calendario de clases',
      description: 'Visualiza tus horarios en calendario interactivo.',
      status: 'upcoming'
    },
    {
      id: 8,
      title: 'Control de sesiones',
      description: 'Cierra sesión en otros dispositivos conectados.',
      status: 'upcoming'
    },
  ];

export default features;