import { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Axios from "axios";

import HC from "./RegistrarVisitaMedica";
import AgregarInstitucionDeSalud from './AgregarInstitucionDeSalud';
import AgregarProfesionalDeSalud from './AgregarProfesionalDeSalud';
//Routes me permite anidar las rutas
//Route me permite trabajar con las con las rutas

const HistorialClinicoNavigation = () => {
    return (
      <main>
      <Routes>
        <Route index element={<HC/>} />
        <Route path="AgregarInstitucionDeSalud" element={<AgregarInstitucionDeSalud/>} />
        <Route path="AgregarProfesionalDeSalud" element={<AgregarProfesionalDeSalud/>} />
      </Routes>
    </main>
    );
  }

  export default HistorialClinicoNavigation