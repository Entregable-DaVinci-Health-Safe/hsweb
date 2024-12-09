import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Error404 from "./pages/Error404";
import Leyaut from "./components/Layout";
import Elementos from "./pages/Elementos";
import RegistroConMail from "./pages/Registro/RegistroConMail";
import InstitucionDeSalud from "./pages/Instituciones/InstitucionDeSalud";
import Profesionales from "./pages/Profesionales/ProfesionalDeSalud";
import Informes from "./pages/Informes/Informes";
import HistoriaMedica from "./pages/HistoriaMedica/HistoriaMedica";
import VisitaMedica from "./pages/HistoriaMedica/VisitaMedica";
import CalendarioVacunacion from "./pages/CalendarioVacunacion/CalendarioVacunacion";
import MedicacionHabitual from "./pages/MedicacionHabitual/MedicacionHabitual";
import Grupos from "./pages/Grupos/GruposInicio";
import GruposGestion from "./pages/Grupos/GruposGestion";
import AgendaTurnos from "./pages/AgendaTurnos/AgendaTurnos";
import Documentos from "./pages/Documentos/Documentos";
import SignosVitales from "./pages/SignosVitales/SignosVitales";
import Recupero from "./pages/Registro/Recupero";
import Perfil from "./pages/Usuario/Perfil";

import { useThemeContext } from "./Theme/ThemeContext";
import GeneratePdf from "./pages/temp_pdf/generatePdf";
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  const { contextTheme, setContextTheme } = useThemeContext();


  //Nueva logica para impedir que el usuario abra una nueva pestaña.
  useEffect(() => {
    const preventNewTab = (event) => {
      if (event.ctrlKey || event.shiftKey || event.metaKey || event.button === 1) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('click', preventNewTab);

    return () => {
      window.removeEventListener('click', preventNewTab);
    };
  }, []);

  return (
    <div className="App">
      <div id={contextTheme}>
      {/*<GoogleOAuthProvider  clientId="67224328580-8oei1stptmdu5822ldq98in91kbd00i1.apps.googleusercontent.com">*/}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registroConMail" element={<RegistroConMail />} />
          <Route path="/recupero" element={<Recupero />} />
          <Route path="/" element={<Leyaut />}>
            <Route path="perfil" element={<Perfil />} />
            <Route path="elementos" element={<Elementos />} />
            <Route path="institucionesDeSalud" element={<InstitucionDeSalud />} />
            <Route path="profesionales" element={<Profesionales />} />
            <Route path="informes" element={<Informes />} />
            <Route path="historiaMedica" element={<HistoriaMedica />} />
            <Route path="visitaMedica" element={<VisitaMedica />} />
            <Route path="calendarioVacunacion" element={<CalendarioVacunacion />} />
            <Route path="medicacionHabitual" element={<MedicacionHabitual />} />
            <Route path="grupos" element={<Grupos />} />
            <Route path="gruposGestion" element={<GruposGestion />} />
            <Route path="agendaTurnos" element={<AgendaTurnos />} />
            <Route path="documentos" element={<Documentos />} />
            <Route path="signosVitales" element={<SignosVitales />} />
            <Route path="pdfTest" element={<GeneratePdf />} />
          </Route>
          <Route path="*" to="/404" element={<Error404 />} />
        </Routes>
      {/*</GoogleOAuthProvider>*/}
      </div>
    </div>
  );
}

export default App;
