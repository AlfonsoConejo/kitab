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
    version: "v0.1",
    date: "28 jun 2026",
    description: "Presentación del proyecto y su arquitectura",
    duration: "8:46",
    videoUrl: "https://www.youtube.com/embed/wKC6KTFtyNg?si=4YNqQeqQtoKRlOT0",
    type: "frontend",
  },
];

export default allSprints;