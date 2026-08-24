import NoActivePeriodMessage from "@/components/NoActivePeriodMessage";
import { usePeriod } from "@/context/PeriodContext";

export default function Tests() {
  const { selectedPeriod } = usePeriod();

  return(
    <div className="flex flex-col flex-1 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">
          Exámenes
        </h1>
        {
          selectedPeriod && 
          <button className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors">
            Agendar exámen
          </button>
        }
        
      </div>

      <div className="flex-1">
      {
        !selectedPeriod ? <NoActivePeriodMessage/> : (
          <>
          </>
        )
      }
      </div>
        
    </div>
  );
}