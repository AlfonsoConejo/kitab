import allSprints from '../data/sprints';
import { useEffect } from "react";
import { Play } from "lucide-react";

export default function Sprints() {

  useEffect(() => {
    document.title = "Sprints - Kitab";
  }, []);

  return (

    <div className="h-auto w-full text-white">
      {/* CENTER WRAPPER */}
      <div className="mx-auto flex flex-col w-full max-w-7xl justify-center">
        <section className="flex flex-col w-full max-w-4xl mx-auto px-6 pt-10 sm:pt-12 pb-6 overflow-hidden gap-6">
          {/* Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Todos los Sprints de Kitab
            </h1>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            {allSprints.map((sprint, index) => (
              <div
                key={sprint.version}
                className="bg-slate-800 backdrop-blur-sm rounded-xl border border-slate-900 p-5 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-sm font-mono bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                          {sprint.version}
                        </span>
                        <span className="text-sm text-gray-400">
                          {sprint.date}
                        </span>
                        <span className="text-xs bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded-full">
                          {sprint.duration}
                        </span>
                        <span className="text-xs bg-gray-700/50 text-gray-400 px-2 py-0.5 rounded-full">
                          {sprint.type}
                        </span>
                      </div>
                      <p className="text-gray-300 mt-1">{sprint.description}</p>
                    </div>
                  </div>
                  <a
                    href={sprint.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center text-white text-sm font-medium bg-blue-600 hover:bg-blue-500 border border-blue-400/30 hover:border-blue-400/60 px-4 py-2 rounded-lg transition-colors text-center gap-2"
                  >
                    <Play size={16} /> Ver video
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};