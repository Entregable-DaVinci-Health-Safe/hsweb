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
import axios from 'axios';
import dayjs from 'dayjs';
import TextFieldDropdownComponente from "../../components/TextFieldDropdownComponent";
import TextFieldDatetimeTurnoComponent from "../../components/TextFieldDatetimeTurnoComponent";
import SwitchsComponent from "../../components/SwitchsComponent";
import TextFieldTxAreaComponente from "../../components/TextFieldTxAreaComponent";
import ModalRelacionCentroEnProfesional from "../../components/ModalRelacionCentroEnProfesional";
import TextFieldTimeSelectComponent from "../../components/TextFieldTimeSelectComponent";
import { Form } from "react-bootstrap";
import AxiosHealth from "../../interceptor/axiosHealth";
import {
  requestAdditionalScopes,
  handleGoogleLoginSuccess,
} from "../../components/googleOAuthUtil";
import checkOrCreateCalendar from "../../components/ManejoGoogleCalendarID";
import {
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";

const ModalEditarTurno = ({isOpen, title, turno, nameButton, setTurnoEdit, refresh, modalEstado}) => {
  let idHC = localStorage.getItem("HMI");
  const [idTurno, setIdTurno] = useState({ campo: "", valido: null });
  const [institucionSelectEdit, setInstitucionSelectEdit] = useState([]);
  const [institucionSelectModalEdit, setInstitucionSelectModalEdit] = useState([]);
  const [institucionEdit, setInstitucionEdit] = useState({ campo: "", valido: null });
  const [institucionModalEdit, setInstitucionModalEdit] = useState({ campo: "", valido: null });
  const [direccionEdit, setDireccionEdit] = useState({ campo: "", valido: null });
  const [profesionalSelectEdit, setProfesionalSelectEdit] = useState([]);
  const [profesionalEdit, setProfesionalEdit] = useState({ campo: "", valido: null });
  const [especialidadSelectEdit, setEspecialidadSelectEdit] = useState([]);
  const [especialidadEdit, setEspecialidadEdit] = useState({ campo: "", valido: null });
  const [motivoEdit, setMotivoEdit] = useState({ campo: "", valido: null });
  const [fechaEdit, setFechaEdit] = useState({ campo: "", valido: null });
  const [horaEdit, setHoraEdit] = useState({ campo: "", valido: null });
  const [timeZone, setTimeZone] = useState('');
  const [offset, setOffset] = useState('');
  const [googleIdEdit, setGoogleIdEdit] = useState({campo: "",valido: null,});
  const [recordatorioEdit, setRecordatorioEdit] = useState({ campo: "", valido: null });
  const [blanqueo, setBlanqueo] = useState(false)
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [openAsociarProfesional, setOpenAsociarProfesional] = useState(false);
  const [loginTrue, setLoginTrue] = useState(false);
  const [idGoogleCal, setIdGoogleCal] = useState("");
  const [reloadingGoogle, setRelogingGoogle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  useLayoutEffect(() => {
    AxiosHealth.get(`/historiasMedicas/${idHC}/profesionales`)
    .then((value) => {
      const profesionalesArray = Object.values(value.data);
      setProfesionalSelectEdit(profesionalesArray);
    })
    .catch((error) => {
      console.error(error);
    });
  }, [reducerValue]);

  async function traeCentrosPorProfesional() {
    if (profesionalEdit.campo != "") {
      try {
        const response = await AxiosHealth.get(`profesionales/${profesionalEdit.campo.id}/institucionesSalud`);
        const centroSaludArray = Object.values(response.data);
        setInstitucionSelectEdit(centroSaludArray);
      } catch (error) {
        setInstitucionSelectEdit([]);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }

  useLayoutEffect(() => {
    async function fetchData() {
      if (profesionalEdit.campo !== "") {
        try {
          localStorage.setItem("id_pro", profesionalEdit.campo.id);
          const especialidadesResponse = await AxiosHealth.get(
            `profesionales/${profesionalEdit.campo.id}/especialidades`
          );
          const especialidadesArray = Object.values(especialidadesResponse.data);
          setEspecialidadSelectEdit(especialidadesArray);
          await traeCentrosPorProfesional();
          if (profesionalEdit.campo.id !== getFirstWord(turno.profesional).id && !blanqueo) {
            setEspecialidadEdit({ campo: "", valido: false });
            setInstitucionEdit({ campo: "", valido: false });
            setBlanqueo(true);
          } else if (blanqueo) {
            setEspecialidadEdit({ campo: "", valido: false });
            setInstitucionEdit({ campo: "", valido: false });
          }
        } catch (error) {
          console.error("Error al cargar los datos:", error);
        }
      }
    }
    fetchData();
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

   const getFirstWord = (str) => {
    if (typeof str === "string" && str.includes("?")) {
      const result = {};
      str.split("?").forEach((item) => {
        const [key, value] = item.split(":"); 
        result[key] = value;
      });
      return result; 
    }
    return {str};
  };

  const getFechaHora = (value) => {
    if (typeof value === "string" && value.includes(" ")) {
      const parts = value.split(" ");
      return { fecha: parts[0], hora: parts[1] };
    }
    return { fecha: value, hora: null };
  };

  useLayoutEffect(() => {
    if (turno && turno.length !== 0) {
      setearVariables(setProfesionalEdit,profesionalEdit,getFirstWord(turno.profesional))
      setearVariables(setEspecialidadEdit,especialidadEdit,getFirstWord(turno.especialidad))
      setearVariables(setInstitucionEdit,institucionEdit,getFirstWord(turno.institucion))
      setearVariables(setFechaEdit,fechaEdit,getFechaHora(turno.fechaInicio).fecha)
      setearVariables(setHoraEdit,horaEdit,getFechaHora(turno.fechaInicio).hora)
      setearVariables(setRecordatorioEdit,recordatorioEdit,turno.googleId !=null?true:false)
      setearVariables(setIdTurno,idTurno,turno.id)
      setearVariables(setMotivoEdit,motivoEdit,turno.motivo)
      setearVariables(setGoogleIdEdit,googleIdEdit,turno.googleId)
      setearVariables(setDireccionEdit,direccionEdit,turno.direccion)
    }
  }, [turno]);

  useLayoutEffect(() => {
    if(turno && turno.length !== 0){
      if(recordatorioEdit.campo == true){
        validateGoogleTokenOnFrontend(localStorage.getItem("token"));
      }else{
        if(googleIdEdit.campo !='') {
          setRelogingGoogle(true);
          validateGoogleTokenOnFrontend(localStorage.getItem("token"));
        }
      }
    }
  }, [recordatorioEdit,googleIdEdit]);

   const validarObligatorio = (estado, cambiarEstado) => {
    if (estado.valido == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };
  
  const handleClose = () => {
    setearVariables(setProfesionalEdit,profesionalEdit,'')
      setearVariables(setEspecialidadEdit,especialidadEdit,'')
      setearVariables(setInstitucionEdit,institucionEdit,'')
      setearVariables(setMotivoEdit,motivoEdit,'')
      setearVariables(setFechaEdit,fechaEdit,'')
      setearVariables(setHoraEdit,horaEdit,'')
      setearVariables(setRecordatorioEdit,recordatorioEdit,'')
      setearVariables(setIdTurno,idTurno,'')
      setBlanqueo(false);
      modalEstado(false);
      setRelogingGoogle(false);
      setTurnoEdit([]);
  };

  async function guardarEditado() {
    validarObligatorio(profesionalEdit, setProfesionalEdit);
    validarObligatorio(institucionEdit, setInstitucionEdit);
    validarObligatorio(especialidadEdit, setEspecialidadEdit);
    validarObligatorio(motivoEdit, setMotivoEdit);
    validarObligatorio(fechaEdit, setFechaEdit);
    validarObligatorio(horaEdit, setHoraEdit);
    
    if(profesionalEdit.valido != false && institucionEdit.valido != false && especialidadEdit.valido != false ){
      if(profesionalEdit.valido == true || institucionEdit.valido == true || especialidadEdit.valido == true || motivoEdit.valido == true || recordatorioEdit.valido == true || fechaEdit.valido == true || horaEdit.valido == true){
        let direccion='';
        let direccionGoogle='';
        if(institucionEdit.valido == true){
          direccion='direccion:'+institucionEdit.campo.direccion.direccion+'?'+'piso:'+institucionEdit.campo.direccion.piso+'?'+'departamento:'+institucionEdit.campo.direccion.departamento+'?'+'referencia:'+institucionEdit.campo.direccion.referencia;
          direccionGoogle=institucionEdit.campo.direccion.direccion
        }else{
          direccion=direccionEdit.campo;
          direccionGoogle=getFirstWord(direccionEdit.campo).direccion
        }
        
        let idGoogle = null;
        let borrarIdGoogle = false;
        const startDateTime = dayjs(`${fechaEdit.campo}T${horaEdit.campo}`).format('YYYY-MM-DDTHH:mm:ssZ');
        const endDateTime = dayjs(`${fechaEdit.campo}T${horaEdit.campo}`).add(1, 'hour').format('YYYY-MM-DDTHH:mm:ssZ');
        if(recordatorioEdit.campo){
          if(googleIdEdit.campo =='') {
            try {
              const eventData={
                "summary": 'Turno Medico: '+motivoEdit.campo,
                "location": direccionGoogle,
                "description": 'Motivo del turno: ' +motivoEdit.campo+ ' - Profesional: '+profesionalEdit.campo.nombre+ ' - Institucion: '+institucionEdit.campo.nombre,
                "start": {
                  "dateTime": startDateTime,
                  "timeZone": "America/Argentina/Buenos_Aires"
                },
                "end": {
                  "dateTime": endDateTime,
                  "timeZone": "America/Argentina/Buenos_Aires"
                }
              }
              
              idGoogle = await new Promise((idEvento) => {
                createEvent(localStorage.getItem("accessCAL"),eventData,idGoogleCal,idEvento)
              });
            } catch (error) {
              return;
            }
          }else{
            try {
              const eventData={
                "summary": 'Turno Medico: '+motivoEdit.campo,
                "location": institucionEdit.valido == true ? institucionEdit.campo.direccion.direccion : ' DIRECCION ',
                "description": 'Motivo del turno: ' +motivoEdit.campo+ ' - Profesional: '+profesionalEdit.campo.nombre+ ' - Institucion: '+institucionEdit.campo.nombre,
                "start": {
                  "dateTime": startDateTime,
                  "timeZone": "America/Argentina/Buenos_Aires"
                },
                "end": {
                  "dateTime": endDateTime,
                  "timeZone": "America/Argentina/Buenos_Aires"
                }
              }
              updateEvent(localStorage.getItem("accessCAL"),googleIdEdit.campo,eventData,idGoogleCal)
              idGoogle = googleIdEdit.campo
            } catch (error) {
              return;
            }
          }
        }else{
          if(googleIdEdit.campo !='') {
            try {
              deleteEvent(localStorage.getItem('accessCAL'),turno.googleId,idGoogleCal)
              borrarIdGoogle=true;
            } catch (error) {
              return;
            }
          }
        }
         
          AxiosHealth.put(`/turnos/${idTurno.campo}`,{
            fechaInicio: fechaEdit.campo +' '+ horaEdit.campo,
            direccion: direccion,
            profesional: 'nombre:'+profesionalEdit.campo.nombre +'?'+ 'id:'+ profesionalEdit.campo.id,
            especialidad: 'nombre:'+especialidadEdit.campo.nombre +'?'+ 'id:'+ especialidadEdit.campo.id,
            institucion: 'nombre:'+institucionEdit.campo.nombre +'?'+ 'id:'+ institucionEdit.campo.id,
            motivo: motivoEdit.campo,
            googleId: borrarIdGoogle? '' : idGoogle !=null?idGoogle:googleIdEdit.campo,
          })
          .then(()=>{
            modalEstado(false);
            if (refresh) {
              refresh();
            }
          })

          setIsLoading(false)
      }
    } 
  }

  if (!isOpen) {
    return null;
  }

 async function handleCalendar(aT) {
    const accessToken = aT;
    const calendarTitle = "H&S";
    try {
      const calendarId = await checkOrCreateCalendar({
        accessToken,
        calendarTitle,
      });
      setIdGoogleCal(calendarId);
      return calendarId;
    } catch (error) {
      console.error("Error manejando el calendario:", error.message);
      throw error;
    }
  }

  async function validateGoogleTokenOnFrontend(token) {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${token}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
     
      if ("error" in data && localStorage.getItem("accessCAL") == null) {
        setLoginTrue(true);
      } else if (localStorage.getItem("accessCAL") != null) {
        let calendarId;
        if (localStorage.getItem("accessCAL") != null) {
          calendarId = await handleCalendar(localStorage.getItem("accessCAL"));
        } else {
          const accessCAL = await new Promise((resolve) => {
            handleGoogleLoginSuccess(token, requestAdditionalScopes, resolve);
          });
          localStorage.setItem("accessCAL", accessCAL);
          calendarId = await handleCalendar(accessCAL);
        }
        return calendarId;
      } else {
        setLoginTrue(true);
        throw new Error("Token inválido. Se requiere inicio de sesión.");
      }
    } catch (error) {
      console.error("Error al validar el token:", error);
      throw error;
    }
  }

  const AutoLogin = () => {
    const login = useGoogleLogin({
      onSuccess: (response) => {
        localStorage.setItem("accessCAL", response.access_token);
        handleCalendar(response.access_token);
      },
      onError: (error) => {
        console.error("Login failed:", error);
      },
      scope:
        "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email",
    });

    useLayoutEffect(() => {
      const shouldLogin =
        loginTrue &&
        (recordatorioEdit.campo || reloadingGoogle) &&
        localStorage.getItem("accessCAL") == null;
      if (shouldLogin) {
        login();
      }
    }, [loginTrue, recordatorioEdit.campo, reloadingGoogle, login]);
  };

  const createEvent = async (accessToken, eventData, calendarId,idEvento) => {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`;
    try {
      const response = await axios.post(
        url,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      idEvento(response.data.id)
    } catch (error) {
      console.error('Error creando evento:', error);
    }
  };

  const updateEvent = async (accessToken, eventId, updatedEventData,calendarId) => {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`;
    try {
      const response = await axios.put(
        url,
        updatedEventData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Error actualizando evento:', error);
    }
  };
  

  const deleteEvent = async (accessToken, eventId,calendarId) => {
    const url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`;
    try {
       await axios.delete(url, {
         headers: {
           Authorization: `Bearer ${accessToken}`,
         },
       });
     } catch (error) {
       console.error('Error eliminando evento:', error);
     }
   };

  if (isLoading) {
    return <div>Cargando...</div>;
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
          <TextFieldDatetimeTurnoComponent
            required
            estado={fechaEdit}
            cambiarEstado={setFechaEdit}
            leyendaHelper={"Seleccione la fecha de la turno"}
            leyendaError="Debe seleccionar una fecha valida."
            defaultValue={getFechaHora(turno.fechaInicio).fecha}
          />
          <TextFieldTimeSelectComponent
            leyendaHelper={"Profesional que brindará la atencion"}
            leyendaError="Debe seleccionar una profesional."
            id="Hora_Turno"
            label="Seleccionar Horario"
            estado={horaEdit}
            cambiarEstado={setHoraEdit}
            timeZone={timeZone}
            setTimeZone={setTimeZone}
            offset={offset}
            setOffset={setOffset}
          />
          <div
            className="col-md-12 my-1"
            style={{
              marginLeft: "10px",
              border: "1px solid #ced4da",
              padding: "8px 10px",
              width: "95%",
              
            }}
          >
            <SwitchsComponent
              required
              estado={recordatorioEdit}
              cambiarEstado={setRecordatorioEdit}
              leyendaHelper={"Recordar en el calendario de Google?"}
              disabled={false}
              opcionA={"Si"}
              opcionB={"No"}
            />
          </div>
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
                     
          <TextFieldTxAreaComponente
            required
            type="Textarea"
            leyendaHelper="Motivo del turno."
            id="Motivo_Turno_Edit"
            label="Motivo del turno"
            estado={motivoEdit}
            cambiarEstado={setMotivoEdit}
            defaultValue={motivoEdit.campo}
          />
        </div>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GCID}>
          <AutoLogin />
        </GoogleOAuthProvider>
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

export default ModalEditarTurno;
