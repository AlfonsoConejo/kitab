import LandingHeader from "../components/header/LandingHeader";
import MateriasApp from "../components/MateriasApp";
import { useEffect } from "react";


export default function LandingLayout() {

  const API_URL = import.meta.env.VITE_API_URL;

  if (import.meta.env.MODE === "development") {
    console.log("Modo desarrollo");
  } else {
    console.log("Modo producción");
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/api/test`);
        const data = await res.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <LandingHeader />
      <MateriasApp/>
      
    </>
  );
}
