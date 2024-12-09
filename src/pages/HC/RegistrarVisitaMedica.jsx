import {FormControl, TextField, Button, Autocomplete, RadioGroup, Radio, FormControlLabel, FormLabel, IconButton, Paper} from "@mui/material";
import  Axios  from "axios";
import { useEffect } from "react";


import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import {useState} from "react";
import Swal from "sweetalert2";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AxiosHealth from "../../interceptor/axiosHealth";
import ExpReg from "./../../elementos/ExpresionesReg";

import '../../css/HistorialClinico.css';

// Importar componentes propios
import Dropdown from './../../components/Dropdown';
import Texarea from './../../components/Textarea';
import Datetime from './../../components/Datetime';
import RadioButton from './../../components/RadioButton';
//import UploadPdf from './../../components/UploadPdf';
import {Formulario, Boton} from './../../elementos/Formularios';



const diagnosticoHardcode = [
    {   
        id: 1,
        nombre: 'Moreton'
    }, 
    {   
        id: 2,
        nombre: 'Migraña'
    },
    {   
        id: 3,
        nombre: 'Inflamación Muscular'
    }
];


const RegistrarVisitaMedica = () => {
    const [idHC, setIdHC] = useState("");
    const [usuario, setUsuario] = useState({campo: '', valido: null});
    const [profesionalSelect, setProfesionalSelect] = useState({campo: '', valido: null});
    const [centrosSaludSelect, setCentrosSaludSelect] = useState({campo: '', valido: null});
    const [especialidadesSelect, setEspecialidadSelect] = useState({campo: '', valido: null});
    const [especialidad, setEspecialidad] = useState({campo: '', valido: null});
    const [profesional, setProfesional] = useState({campo: '', valido: null});
    const [centroDeSalud, setCentroDeSalud] = useState({campo: '', valido: null});
    const [diagnostico, setDiagnostico] = useState({campo: '', valido: null});
    const [indicaciones, setIndicaciones] = useState({campo: '', valido: null});
    const [fechavisita, setFechaVisita] = useState({campo: '', valido: null});
    const [tipoDocumento, setTipoDocumento] = useState ({campo: 'Receta', valido: null});
    const [prescripcion, setPrescripcion] = useState ({campo: 'Medica', valido: null});

    let idUsuario = localStorage.getItem("idUsuario")
    let token = localStorage.getItem("token")

    useEffect(() => {
    Promise.all([
        AxiosHealth.get(`/usuarios`),
        AxiosHealth.get(`/historiasMedicas/usuarios/${idUsuario}`),
    ])
        .then((value) => {
        const profesionalesArray = Object.values(value[1].data.profesionales);
        const usuario = Object.values(value[0].data);
        setIdHC(value[1].data.id);
        setProfesionalSelect(profesionalesArray);
        //setCentrosSalud(centrosSaludArray);
        setUsuario(usuario);
        })
        .catch((error) => {
        console.error(error);
        });
    }, []);

   useEffect(() => {
        if (profesional.campo !== '') {
            AxiosHealth.get(`/profesionales/${profesional.campo}/especialidades`)
            .then(function (response) {
                const especialidadesSelectArray = Object.values(response.data);
                setEspecialidadSelect(especialidadesSelectArray);
            });
            AxiosHealth.get(`/profesionales/${profesional.campo}/institucionesSalud`)
            .then(function (response){
                //console.log(response)
                 const centrosSaludArray = Object.values(response.data);
                 setCentrosSaludSelect(centrosSaludArray);
            });
        }
      }, [profesional]);

    const prescripcionChange = (event) => {
        setPrescripcion(event.target.value);
    };

    function registroVisitaMedica(){
        console.log(fechavisita)
        console.log(centroDeSalud)
        console.log(profesional)
        console.log(idHC)
        console.log(indicaciones)
        console.log(diagnostico)
    }
  

    return (
    <> 
        <div class = "container"> 
        <h3>Registro de Visita Medica para: <strong>{usuario[1] + " " +usuario[2]}</strong></h3>
            <Paper elevation={3} style={{width: 800}} id="ContenedorForm">
                <br/>
                <form>
                <FormControl method="post" id="Input">
                    <Datetime 
                        estado={fechavisita}
                        cambiarEstado={setFechaVisita}
                        tipo="datetime-local"
                        label="Fecha y Hora"
                        name="fecha_hora"  
                    />
                    
                </FormControl>
                <FormControl method="post" id="Input">
                    <Dropdown 
                        options={Object.values(profesionalSelect)}  
                        estado={profesional}
                        cambiarEstado={setProfesional}
                        tipo="text"
                        label="Profesional"
                        placeholder="Seleccione el profesional"
                        name="profesional"  
                    />
                </FormControl>
                {/* <FormControl method="post" id="Input">
                    <Dropdown 
                       // options={Object.values(centrosSaludSelect)}  
                        estado={centroDeSalud}
                        cambiarEstado={setCentroDeSalud}
                        tipo="text"
                        label="Centro de salud"
                        placeholder="Seleccione centro de salud"
                        name="centroDeSalud"  
                    />
                </FormControl> */}
                <FormControl method="post" id="Input">
                    <Dropdown 
                        options={Object.values(especialidadesSelect)}  
                        estado={especialidad}
                        cambiarEstado={setEspecialidad}
                        tipo="text"
                        label="Especialidad"
                        placeholder="Seleccione especialidad del profesional"
                        name="especialidad"  
                    />
                </FormControl>
                <FormControl method="post" id="Input">
                    <Dropdown 
                        options={Object.values(diagnosticoHardcode)}  
                        estado={diagnostico}
                        cambiarEstado={setDiagnostico}
                        tipo="text"
                        label="Diagnostico"
                        placeholder="Seleccione diagnostico"
                        name="diagnostico"  
                    />
                </FormControl>
                <FormControl method="post" id="Input">
                <FormLabel>Tipo de Documento.</FormLabel>
                    <RadioButton
                        label='Receta'
                        estado={tipoDocumento}
                        cambiarEstado={setTipoDocumento}
                        nombre='documentos'
                        valor='R'
                    />
                    <RadioButton
                        label='Estudio'
                        estado={tipoDocumento}
                        cambiarEstado={setTipoDocumento}
                        nombre='documentos'
                        valor='E'
                    />

                    {
                        tipoDocumento.campo === "R" && (
                            <h4>vas a enviar una Receta</h4>
                           //<UploadPdf />
                        )
                    }
                    {
                        tipoDocumento.campo === "E" && (
                            <div>
                                <h4>vas a enviar un Estudio.</h4>
                                <h4>¿Que tipo de estudio?</h4>
                                <RadioButton
                                    label='Medico'
                                    estado={prescripcion}
                                    cambiarEstado={setPrescripcion}
                                    nombre='eDcumentos'
                                    valor='EM'
                                />
                                <RadioButton
                                    label='Solicitud de estudio'
                                    estado={prescripcion}
                                    cambiarEstado={setPrescripcion}
                                    nombre='eDcumentos'
                                    valor='ESE'
                                />
                                
                            </div>
                        )
                    }
                </FormControl>
                <FormControl method="post" id="Input">
                    <Texarea
                        estado={indicaciones}
                        cambiarEstado={setIndicaciones}
                        tipo="text"
                        label="Indicaciones"
                        placeholder="Describa aqui las indicaciones"
                        name="indicaciones"
                        //leyendaError="El correo solo puede contener letras, numeros, puntos, guiones y guion bajo."
                        //expresionRegular={expresiones.correo}
                    />
                </FormControl>
                </form>
            <Boton variant="contained" type="submit" id="Boton" onClick={() => registroVisitaMedica()}>
                Registrar Visita Medica
            </Boton>
            </Paper>
        </div> 
    </>
    );
}

export default RegistrarVisitaMedica;