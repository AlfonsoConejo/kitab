interface Sprint {
  version: string;
  date: string;
  description: string;
  duration: string;
  videoUrl: string,
  type: string;
}

const allSprints: Sprint[] = [
  {
    version: "v0.2",
    date: "30 sept 2026",
    description: "Migración a TS + BroadcastChannel + Reestructura del backend y nuevas pruebas con Vitest.",
    duration: "18:10",
    videoUrl: "https://www.youtube.com/embed/aD0szSaXzO8?si=n33Hp6tbGamDp_u6",
    type: "frontend + backend",
  },
  {
    version: "v0.1",
    date: "28 jun 2026",
    description: "Presentación del proyecto y su arquitectura.",
    duration: "8:46",
    videoUrl: "https://www.youtube.com/embed/wKC6KTFtyNg?si=4YNqQeqQtoKRlOT0",
    type: "frontend",
  },
];

export default allSprints;