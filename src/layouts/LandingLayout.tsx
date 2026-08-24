import LandingHeader from "../components/header/LandingHeader";
import Footer from "@/components/Footer";
import { Outlet } from "react-router-dom";


export default function LandingLayout() {

  if (import.meta.env.MODE === "development") {
    console.log("Modo desarrollo");
  } else {
    console.log("Modo producción");
  }

  return (
    <div className="flex flex-col min-h-dvh w-full bg-slate-950 bg-linear-to-b from-blue-900/30 via-slate-950 to-slate-950">
      <LandingHeader />

      <main className="flex-1 flex flex-col items-stretch">
        <Outlet/>
      </main>
      
      <Footer />
    </div>
  );
}
