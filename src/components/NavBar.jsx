import React, { useState } from "react";
//react pro sidebar components
import { NavLink } from 'react-router-dom';
//icons from react icons
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import MedicationIcon from '@mui/icons-material/Medication';
import LogoutIcon from '@mui/icons-material/Logout';
import {Boton} from './../elementos/Formularios';
//sidebar css from react-pro-sidebar module
import "react-pro-sidebar/dist/css/styles.css";
import "../css/NavBar.css";

import { useNavigate } from "react-router-dom";


const NavBar = () => {
    const navigate = useNavigate();
    const [linkClicked, setLinkClicked] = useState(false);

    const cerrarSesion = () => {
        localStorage.clear();
        navigate("/");
    }
    
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const menuItem=[
        {
            path:`/HistorialClinicoPaciente/home`,
            name:"Inicio",
            icon:<HomeIcon/>
        },
        {
            path:`/HistorialClinicoPaciente/Usuario`,
            name:"Usuario",
            icon:<PersonIcon/>
        },
        {
            path:`/HistorialClinicoPaciente/HC`,
            name:"Historial Clínico",
            icon:<ArticleIcon/>
        },
        {
            path:`/HistorialClinicoPaciente/MedicacionHabitual`,
            name:"Medicación Habitual",
            icon:<MedicationIcon/>
        },
        {
            path:`/HistorialClinicoPaciente/HC/AgregarProfesionalDeSalud`,
            name:"Profesional de salud",
            icon:<PersonIcon/>
        },
        {
            path:`/HistorialClinicoPaciente/HC/AgregarInstitucionDeSalud`,
            name:"Institución de Salud",
            icon:<HomeIcon/>
        },
        {
            path:`/HistorialClinicoPaciente/Usuario/informes`,
            name:"Informes",
            icon:<ArticleIcon/>
        },
       
    ]
    return (
        <>
           <div style={{width: isOpen ? "250px" : "50px"}} className="sidebar">
               <div className="top_section">
                   <h1 style={{display: isOpen ? "block" : "none"}} className="logo"><img src={require('../img/logoNavbar.png')} /></h1>
                   <div style={{marginLeft: isOpen ? "15px" : "0px"}} className="bars">
                       <MenuIcon onClick={toggle}/>
                   </div>
               </div>
               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link"  style={{textDecoration: 'none'}}>
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text">{item.name}</div>
                       </NavLink>
                   ))
               }


                <div className="bottom_session">
                        <NavLink className="Logout" style={{textDecoration: 'none'}} >
                           <div className="icon"><LogoutIcon /></div>
                           <div style={{display: isOpen ? "block" : "none"}} className="link_text" >Cerrar Sesion.</div>
                       </NavLink>
                </div>

                <div>
                <Boton
            variant="outlined"
            id="Boton"
            type="submit"
            onClick={() => cerrarSesion()}
            >
             </Boton>
                </div>

           </div>
        </>
    );
}
export default NavBar