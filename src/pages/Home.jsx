import MateriasApp from '../components/MateriasApp';
import {
  CheckCircle,
  CircleAlert,
  TriangleAlert,
  Info
} from "lucide-react";

export default function Home({}) {
    return (
        <>
        <MateriasApp/>
        <div className="flex items-start gap-3 rounded-xl border border-slate-700 bg-slate-800 p-4 shadow-lg">
        <div className="mt-0.5 text-green-400">
            <CheckCircle size={20} />
        </div>

        <div>
            <p className="font-medium text-white">
            Cambios guardados
            </p>

            <p className="text-sm text-slate-400">
            La tarea se actualizó correctamente.
            </p>
        </div>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-slate-800 p-4 shadow-lg">
        <div className="mt-0.5 text-red-400">
            <CircleAlert size={20} />
        </div>

        <div>
            <p className="font-medium text-white">
            Error al guardar
            </p>

            <p className="text-sm text-slate-400">
            No fue posible conectar con el servidor.
            </p>
        </div>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-slate-800 p-4 shadow-lg">
  <div className="mt-0.5 text-yellow-400">
    <TriangleAlert size={20} />
  </div>

    <div>
        <p className="font-medium text-white">
        Atención
        </p>

        <p className="text-sm text-slate-400">
        Algunos cambios aún no se han sincronizado.
        </p>
    </div>
    </div>

    <div className="flex items-start gap-3 rounded-xl border border-blue-500/20 bg-slate-800 p-4 shadow-lg">
    <div className="mt-0.5 text-blue-400">
        <Info size={20} />
    </div>

    <div>
        <p className="font-medium text-white">
        Nueva actualización
        </p>

        <p className="text-sm text-slate-400">
        Ya puedes crear materias personalizadas.
        </p>
    </div>
    </div>
        </>
    );
}