import React, {
  useState,
  useLayoutEffect,
  useReducer,
} from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

import TextFieldInputComponente from "../../components/TextFieldInputComponent";
import TextFieldDropdownComponente from "../../components/TextFieldDropdownComponent";
import TextFieldDatetimeComponent from "../../components/TextFieldDatetimeComponent";
import SwitchsComponent from "../../components/SwitchsComponent";
import TextFieldAutocompleteComponent from "../../components/TextFieldAutocompleteComponent";
import TextFieldTxAreaComponente from "../../components/TextFieldTxAreaComponent";
import ModalRelacionCentroEnProfesional from "../../components/ModalRelacionCentroEnProfesional";
import Loading from '../../components/Loading';
import { Form } from "react-bootstrap";
import AxiosHealth from "../../interceptor/axiosHealth";

const Modal = ({isOpen, title, visita, nameButton, setVisitaEdit, resetId, refresh, modalEstado}) => {
  let idHC = localStorage.getItem("HMI");
  const [idVisita, setIdVisita] = useState({ campo: "", valido: null });
  const [institucionSelectEdit, setInstitucionSelectEdit] = useState([]);
  const [institucionSelectModalEdit, setInstitucionSelectModalEdit] = useState([]);
  const [institucionEdit, setInstitucionEdit] = useState({ campo: "", valido: null });
  const [institucionModalEdit, setInstitucionModalEdit] = useState({ campo: "", valido: null });
  const [profesionalSelectEdit, setProfesionalSelectEdit] = useState([]);
  const [profesionalEdit, setProfesionalEdit] = useState({ campo: "", valido: null });
  const [especialidadSelectEdit, setEspecialidadSelectEdit] = useState([]);
  const [especialidadEdit, setEspecialidadEdit] = useState({ campo: "", valido: null });
  const [diagnosticoSelectEdit, setDiagnosticoSelectEdit] = useState([]);
  const [diagnosticoEdit, setDiagnosticoEdit] = useState({ campo: "", valido: null });
  const [diagnosticoVer, setDiagnosticoVer] = useState({ campo: "", valido: null });
  const [indicacionesEdit, setIndicacionesEdit] = useState({ campo: "", valido: null });
  const [fechaEdit, setFechaEdit] = useState({ campo: "", valido: null });
  const [virtualEdit, setVirtualEdit] = useState({ campo: "", valido: null });
  const [blanqueo, setBlanqueo] = useState(false)
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [openAsociarProfesional, setOpenAsociarProfesional] = useState(false);
  
  useLayoutEffect(() => {
    AxiosHealth.get('/diagnosticos/all')
      .then((response) =>{
        setDiagnosticoSelectEdit(response.data);
      })
 }, []);
  
  useLayoutEffect(() => {
    Promise.all([AxiosHealth.get(`/historiasMedicas/${idHC}/profesionales`)])
      .then((value) => {
        const profesionalesArray = Object.values(value[0].data);
        setProfesionalSelectEdit(profesionalesArray);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [reducerValue]);

  function traeCentrosPorProfesional(){
    if (profesionalEdit.campo != "") {
      Promise.all([AxiosHealth.get(`/profesionales/${profesionalEdit.campo.id}/institucionesSalud`)])
      .then((value) => {
        const centroSaludArray = Object.values(value[0].data);
        setInstitucionSelectEdit(centroSaludArray);
        
      })
      .catch((error) => {
        setInstitucionSelectEdit([]);
      });
    }
 }

  useLayoutEffect(() => {
    if (profesionalEdit.campo != "") {
      localStorage.setItem("id_pro", profesionalEdit.campo.id);
      Promise.all([
        AxiosHealth.get(`profesionales/${profesionalEdit.campo.id}/especialidades`),
      ])
      .then((value) => {
        const especialidadesArray = Object.values(value[0].data);
        setEspecialidadSelectEdit(especialidadesArray);
      })
      .catch((error) => {
        console.error(error);
      });
      traeCentrosPorProfesional();
      if(profesionalEdit.campo.id != visita?.profesional?.id && !blanqueo){
        setEspecialidadEdit({campo:'', valido: false});
        setInstitucionEdit({campo:'', valido: false});
        setBlanqueo(true);
      }else if(blanqueo){
        setEspecialidadEdit({campo:'', valido: false});
        setInstitucionEdit({campo:'', valido: false});
      }
    }
  }, [profesionalEdit.campo]);
  
  function setearVariables(setVariable, variable, dato) {
    if (dato !== null && dato !== undefined) {
      setVariable({ ...variable, campo: dato, valido: null });
    } else {
      setVariable({ ...variable, campo: "", valido: null });
    }
  }

  useLayoutEffect(()=>{
    traeCentrosPorProfesional();
  },[openAsociarProfesional])

  const handleClickOpenAsociarInstitucion = () => {
    setOpenAsociarProfesional(true);
  };
  
  const validarObligatorioModal = (estado, cambiarEstado) => {
    if (estado.valido == null) {
      cambiarEstado({ ...estado, valido: false });
    } else if (estado.valido == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };

 useLayoutEffect (()=>{
    if(institucionSelectEdit.length < 1 && profesionalEdit.campo != ''){
      setInstitucionSelectModalEdit([]);
      Promise.all([AxiosHealth.get(`/historiasMedicas/${idHC}/institucionesSalud`)])
      .then((value) => {
        const institucionesArray = Object.values(value[0].data);
        setInstitucionSelectModalEdit(institucionesArray);
      })
      .catch((error) => {
        console.error(error);
      });
      handleClickOpenAsociarInstitucion();
    }
  },[institucionSelectEdit])

  useLayoutEffect(() => {
    if (visita && visita.length !== 0) {
      setearVariables(setProfesionalEdit,profesionalEdit,visita.profesional)
      setearVariables(setEspecialidadEdit,especialidadEdit,visita.especialidad)
      setearVariables(setInstitucionEdit,institucionEdit,visita.institucionSalud)
      setearVariables(setDiagnosticoEdit,diagnosticoEdit,visita.diagnostico)
      setearVariables(setDiagnosticoVer,diagnosticoVer,visita.diagnostico.nombre)
      setearVariables(setFechaEdit,fechaEdit,visita.fechaVisita)
      setearVariables(setVirtualEdit,virtualEdit,visita.atencionVirtual)
      setearVariables(setIdVisita,idVisita,visita.id)
      setearVariables(setIndicacionesEdit,indicacionesEdit,visita.indicaciones)
    }
  }, [visita]);

  const validarObligatorio = (estado, cambiarEstado) => {
    if (estado.valido == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };
  
  const handleClose = () => {
    setearVariables(setProfesionalEdit,profesionalEdit,'')
      setearVariables(setEspecialidadEdit,especialidadEdit,'')
      setearVariables(setInstitucionEdit,institucionEdit,'')
      setearVariables(setDiagnosticoEdit,diagnosticoEdit,'')
      setearVariables(setIndicacionesEdit,indicacionesEdit,'')
      setearVariables(setFechaEdit,fechaEdit,'')
      setearVariables(setVirtualEdit,virtualEdit,'')
      setearVariables(setIdVisita,idVisita,'')
      setBlanqueo(false);
      modalEstado(false);
      setVisitaEdit([]);
  };

  
  const [isLoading, setIsLoading] = useState(false);
  async function guardarEditado() {
    validarObligatorio(profesionalEdit, setProfesionalEdit);
    validarObligatorio(institucionEdit, setInstitucionEdit);
    validarObligatorio(especialidadEdit, setEspecialidadEdit);
    validarObligatorio(diagnosticoEdit, setDiagnosticoEdit);
    if(profesionalEdit.valido != false && institucionEdit.valido != false && especialidadEdit.valido != false && diagnosticoEdit.valido != false){
      if(profesionalEdit.valido == true || institucionEdit.valido == true || especialidadEdit.valido == true || diagnosticoEdit.valido == true || indicacionesEdit.valido == true || virtualEdit.valido == true || fechaEdit.valido == true){
        setIsLoading(true);
        await AxiosHealth.put(`/visitasMedicas/${visita.id}`,
          {
            fechaVisita: fechaEdit.campo,
            atencionVirtual: virtualEdit.campo,
            institucionSaludId: institucionEdit.campo.id,
            profesionalId: profesionalEdit.campo.id,
            especialidadId: especialidadEdit.campo.id, 
            diagnosticoId: diagnosticoEdit.campo.id,
            historiaMedicaId: idHC,
            indicaciones: indicacionesEdit.campo
          }
        );
        modalEstado(false);
        setIsLoading(false)
        if (refresh) {
          refresh();
        }
      }
    } else {
      console.log("NOOOOOO");
    }
  }

  if (!isOpen) {
    return null;
  }

  return (<>
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
    <DialogTitle className="card-header">
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {title} 
        </DialogContentText>
      </DialogContent>
      <Form >
        <Box
            component="form"
            sx={{
            "& > :not(style)": { m: 1, width: "50ch" },
            }}
            noValidate
            autoComplete="off"
        >
        <div>
          <TextFieldDatetimeComponent
            required
            estado={fechaEdit}
            cambiarEstado={setFechaEdit}
            leyendaHelper={"Seleccione la fecha de la visita"}
            leyendaError="Debe seleccionar una fecha valida."
            defaultValue={visita.fechaVisita}
          />
          <SwitchsComponent
            required
            estado={virtualEdit}
            cambiarEstado={setVirtualEdit}
            leyendaHelper={"La atencion fue virtual?"}
          />
          <TextFieldDropdownComponente
            leyendaHelper={"Profesional que brindo la atencion"}
            leyendaError="Debe seleccionar una profesional."
            id="profesional_edit"
            label="Profesional"
            value={profesionalSelectEdit}
            estado={profesionalEdit}
            cambiarEstado={setProfesionalEdit}
          />
          <TextFieldDropdownComponente
            leyendaHelper={
              "Seleccionar la especialidad del profesional"
            }
            leyendaError="Debe seleccionar la especialidad del profesional."
            id="especialidad_edit"
            label="Especialidad"
            value={especialidadSelectEdit}
            estado={especialidadEdit}
            cambiarEstado={setEspecialidadEdit}
          />
          <TextFieldDropdownComponente
            leyendaHelper={"Institucion"}
            leyendaError="Debe seleccionar una institucion."
            id="institucion_edit"
            label="Institucion"
            value={institucionSelectEdit}
            estado={institucionEdit}
            cambiarEstado={setInstitucionEdit}
          />
          <TextFieldInputComponente
            type="text"
            disabled={true}
            readOnly={true}
            id="diagnostico_actual"
            label="Diagnostico Actual"
            estado={diagnosticoVer}
            cambiarEstado={setDiagnosticoVer}
            defaultValue={diagnosticoVer.campo}
          />
         <TextFieldAutocompleteComponent
            leyendaHelper={"Escriba las 4 letras y elija pues"}
            leyendaError="Debe escribir el diagnostico."
            id="diagnostico_edit"
            label="Nuevo Diagnostico"
            base={diagnosticoSelectEdit}
            estado={diagnosticoEdit}
            cambiarEstado={setDiagnosticoEdit}
            defaultValue={diagnosticoEdit.campo}
          />
          <TextFieldTxAreaComponente
            required
            type="Textarea"
            leyendaHelper="Indicacioes Medicas."
            id="Indicaciones_Medicas_edit"
            label="Indicaciones Medicas"
            estado={indicacionesEdit}
            cambiarEstado={setIndicacionesEdit}
            defaultValue={indicacionesEdit.campo}
          />
        </div>
        <ModalRelacionCentroEnProfesional 
          setOpenAsociarProfesional={setOpenAsociarProfesional}
          openAsociarProfesional={openAsociarProfesional} 
          setCentroDeSalud={setInstitucionModalEdit} 
          centroDeSalud={institucionModalEdit} 
          objetos={institucionSelectModalEdit} 
          validarObligatorio={validarObligatorioModal}
          buttonGoTo={true}
        />
        </Box>
      </Form>
      <DialogActions>
      <Button variant="contained" onClick={guardarEditado} className="my-3"> {nameButton} </Button>
      <Button onClick={handleClose} autoFocus> Cancelar </Button>
      </DialogActions>
    </DialogTitle>
  </Dialog>
  </>
  );
};

export default Modal;
