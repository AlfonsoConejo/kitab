import { Link } from "react-router-dom";
import NoActivePeriodMessage from "@/components/NoActivePeriodMessage";
import { apiFetch } from "@/services/apiFetch";
import { useState, useEffect } from "react";
import { notify } from "@/utils";

export default function Period() {

  const [periods, setPeriods] = useState([]);

  useEffect(()=>{
    async function fetchPeriods() {
      try{
        const res = await apiFetch("/api/periods", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          }
        });

        const data = await res.json();
        if (!res.ok) {
          notify("error", "Hubo un error en el servidor.");   
          return;
        }

        setPeriods(data.data);
      } catch (error){
        if (error.message === "SESSION_EXPIRED") {
          return;
        }
      }
    }
    fetchPeriods();
  }, []);

  console.log("Periodos del usuario: " + JSON.stringify(periods));

  return (
    <div className="flex flex-col flex-1 gap-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">
          Periodos
        </h1>

        <Link to="/app/periods/new" className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors">
          Nuevo periodo
        </Link>
      </div>

      <div className="flex-1">
        {
          periods.length === 0 ? (<NoActivePeriodMessage/>) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              HI
            </div>
          )
        }
        
      </div>
    </div>
  );
}