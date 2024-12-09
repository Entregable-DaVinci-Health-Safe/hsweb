import AxiosHealth from "../../interceptor/axiosHealth";
import axios from 'axios';
import { Container, Row, Col, Form, Table, Card } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import AddAlertIcon from "@mui/icons-material/AddAlert";
import { Tooltip} from "@mui/material";
import React, { useState, useLayoutEffect, useReducer, useRef } from "react";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import HelpIcon from '@mui/icons-material/Help';
import { Link, useNavigate, useLocation } from "react-router-dom";
import TextFieldDatetimeTurnoComponent from "../../components/TextFieldDatetimeTurnoComponent";
import TextFieldDropdownComponente from "../../components/TextFieldDropdownComponent";
import ModalRelacionCentroEnProfesional from "../../components/ModalRelacionCentroEnProfesional";
import TextFieldTxAreaComponente from "../../components/TextFieldTxAreaComponent";
import TextFieldTimeSelectComponent from "../../components/TextFieldTimeSelectComponent";
import SwitchsComponent from "../../components/SwitchsComponent";
import DialogComponent from "../../components/DialogComponent";
import ModalEditarTurnoMedico from "./ModalEditarTurnoMedico";
import {
  requestAdditionalScopes,
  handleGoogleLoginSuccess,
} from "../../components/googleOAuthUtil";
import checkOrCreateCalendar from "../../components/ManejoGoogleCalendarID";
import PersonIcon from "@mui/icons-material/Person";
import ArticleIcon from "@mui/icons-material/Article";
import { Pagination } from "react-bootstrap";
import {
  GoogleOAuthProvider,
  useGoogleLogin,
} from "@react-oauth/google";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from 'dayjs';
import { IconButton } from "@mui/material";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

function AgendaTurnos() {
  const [turnosMedicos, setTurnosMedicos] = useState([]);
  const [turnoEdit, setTurnoEdit] = useState([]);
  const [turnoDel, setTurnoDel] = useState("");
  const [googleDel, setGoogleDel] = useState("");
  const [institucionSelect, setInstitucionSelect] = useState([]);
  const [institucionSelectModal, setInstitucionSelectModal] = useState([]);
  const [institucion, setInstitucion] = useState({ campo: "", valido: null });
  const [institucionModal, setInstitucionModal] = useState({
    campo: "",
    valido: null,
  });
  const [profesionalSelect, setProfesionalSelect] = useState([]);
  const [profesional, setProfesional] = useState({ campo: "", valido: null });
  const [especialidadSelect, setEspecialidadSelect] = useState([]);
  const [especialidad, setEspecialidad] = useState({ campo: "", valido: null });
  const [timeZone, setTimeZone] = useState("");
  const [offset, setOffset] = useState("");
  const [idGoogleCal, setIdGoogleCal] = useState("");
  const [reloadinGoogle, setReloginGoogle] = useState(false);
  const [hora, setHora] = useState({ campo: "", valido: null });
  const [motivoVisita, setMotivoVisita] = useState({ campo: "", valido: null });
  const [fecha, setFecha] = useState({ campo: "", valido: null });
  const [recordatorio, setRecordatorio] = useState({campo: false,valido: null,});
  const [mostrarForm, setMostrarForm] = useState(true);
  const [loginTrue, setLoginTrue] = useState(false);
  const [openEditarTurno, setOpenEditarTurno] = useState(false);
  const [openConfirmSave, setOpenConfirmSave] = useState(false);
  /****************************************************/
  const navigate = useNavigate();
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  /*****************************************************/
  let idHC = localStorage.getItem("HMI");
  //Paginador
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage] = useState(3); // Número de elementos por página

  //Dialog asociar institucion al profesional
  const [openAsociarProfesional, setOpenAsociarProfesional] = useState(false);
  //Manejo modal de interaccion con instituciones
  const handleClickOpenAsociarInstitucion = () => {
    //Aplicar editando informacion personal
    setOpenAsociarProfesional(true);
  };

  useLayoutEffect(() => {
    Promise.all([AxiosHealth.get(`/historiasMedicas/${idHC}/profesionales`)])
      .then((value) => {
        const profesionalesArray = Object.values(value[0].data);
        setProfesionalSelect(profesionalesArray);
      })
      .catch((error) =>{console.log(error)});
  }, [reducerValue]);

  useLayoutEffect(() => {
    if (profesional.campo != "") {
      localStorage.setItem("id_pro", profesional.campo.id);
      Promise.all([
        AxiosHealth.get(`profesionales/${profesional.campo.id}/especialidades`),
      ])
        .then((value) => {
          const especialidadesArray = Object.values(value[0].data);
          setEspecialidadSelect(especialidadesArray);
        })
        .catch((error)=>{console.log(error)});
      traeCentrosPorProfesional();
    }
  }, [profesional.campo]);

  useLayoutEffect(() => {
    traeCentrosPorProfesional();
  }, [openAsociarProfesional]);

  function traeCentrosPorProfesional() {
    if (profesional.campo != "") {
      Promise.all([
        AxiosHealth.get(
          `/profesionales/${profesional.campo.id}/institucionesSalud`
        ),
      ])
        .then((value) => {
          const centroSaludArray = Object.values(value[0].data);
          setInstitucionSelect(centroSaludArray);
        })
        .catch((error) => {
          setInstitucionSelect([]);
        });
    }
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
        (recordatorio.campo || reloadinGoogle) &&
        localStorage.getItem("accessCAL") == null;
      if (shouldLogin) {
        login();
      }
    }, [loginTrue, recordatorio.campo, reloadinGoogle, login]);
  };

  useLayoutEffect(() => {
    if (recordatorio.campo == true) {
      validateGoogleTokenOnFrontend(localStorage.getItem("token"));
    }
  }, [recordatorio]);

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
  
  // Validador de token de google
  // const verifyAccessToken = async (accessToken) => {
  //   const url = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
  
  //   try {
  //     const response = await axios.get(url, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  
  //     console.log('Respuesta de la API:', response.data);
  //   } catch (error) {
  //     console.error('Error verificando el token:', error.response?.data || error.message);
  //   }
  // };

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
  
  
  async function registrarTurno() {
    validarObligatorio(motivoVisita, setMotivoVisita);
    validarObligatorio(fecha, setFecha);
    validarObligatorio(hora, setHora);
    validarObligatorio(profesional, setProfesional);
    validarObligatorio(especialidad, setEspecialidad);
    validarObligatorio(institucion, setInstitucion);

    if (
      motivoVisita.valido == true &&
      fecha.valido == true &&
      hora.valido == true &&
      profesional.valido == true &&
      especialidad.valido == true &&
      institucion.valido == true
    ) {
      let idGoogle = null;
      if (recordatorio.campo) {
        try {
          const startDateTime = dayjs(`${fecha.campo}T${hora.campo}`).format('YYYY-MM-DDTHH:mm:ssZ');
          const endDateTime = dayjs(`${fecha.campo}T${hora.campo}`).add(1, 'hour').format('YYYY-MM-DDTHH:mm:ssZ');
         
          const eventData={
            "summary": 'Turno Medico: '+motivoVisita.campo,
            "location": institucion.campo.direccion.direccion,
            "description": 'Motivo del turno: ' +motivoVisita.campo+ ' - Profesional: '+profesional.campo.nombre+ ' - Institucion: '+institucion.campo.nombre,
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
      }
      AxiosHealth.post("/turnos", {
        fechaInicio: fecha.campo + " " + hora.campo,
        direccion:
          "direccion:" +
          institucion.campo.direccion.direccion +
          "?" +
          "piso:" +
          institucion.campo.direccion.piso +
          "?" +
          "departamento:" +
          institucion.campo.direccion.departamento +
          "?" +
          "referencia:" +
          institucion.campo.direccion.referencia,
        profesional:
          "nombre:" +
          profesional.campo.nombre +
          "?" +
          "id:" +
          profesional.campo.id,
        especialidad:
          "nombre:" +
          especialidad.campo.nombre +
          "?" +
          "id:" +
          especialidad.campo.id,
        institucion:
          "nombre:" +
          institucion.campo.nombre +
          "?" +
          "id:" +
          institucion.campo.id,
        motivo: motivoVisita.campo,
        googleId: idGoogle,
        historiaMedicaId: idHC,
      }).then(() => {
        setMostrarForm(false);
        forceUpdate();
      });
    }else{setOpenConfirmSave(false)}
  }

  useLayoutEffect(() => {
    setInstitucionSelect([]);
    setInstitucion({ campo: "", valido: null });
    setProfesionalSelect([]);
    setProfesional({ campo: "", valido: null });
    setEspecialidadSelect([]);
    setEspecialidad({ campo: "", valido: null });
    setFecha({ campo: "", valido: null });
    setHora({ campo: "", valido: null });
    setMotivoVisita({ campo: "", valido: null });
    setRecordatorio({ campo: false });
    setReloginGoogle(false);
    setOpenConfirmSave(false);
    setMostrarForm(true);
  }, [reducerValue]);

  useLayoutEffect(() => {
    AxiosHealth.get(`historiasMedicas/${idHC}/turnos`)
      .then((value) => {
        if (typeof value.data != "string") {
          setTurnosMedicos(value.data);
        }
      })
      .catch((error) => console.error(error));
  }, [reducerValue]);

  // Calcula el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcula el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtiene los datos de la página actual
  const currentItems = turnosMedicos.slice(indexOfFirstItem, indexOfLastItem);

  // Calcula el número total de páginas
  const totalPages = Math.ceil(turnosMedicos.length / itemsPerPage);

  // Cambia la página actual
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useLayoutEffect(() => {
    if (institucionSelect.length < 1 && profesional.campo != "") {
      setInstitucionSelectModal([]);
      Promise.all([
        AxiosHealth.get(`/historiasMedicas/${idHC}/institucionesSalud`),
      ])
        .then((value) => {
          const institucionesArray = Object.values(value[0].data);
          setInstitucionSelectModal(institucionesArray);
        })
        .catch((error) => {
          console.error(error);
        });
      handleClickOpenAsociarInstitucion();
    }
  }, [institucionSelect]);

  //Validador obligatorio
  const validarObligatorio = (estado, cambiarEstado) => {
    if (estado.valido == null) {
      cambiarEstado({ ...estado, valido: false });
    } else if (estado.valido == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };

  const agregarProfesional = () => {
    navigate("/profesionales");
  };

  const agregarInstitucion = () => {
    navigate("/institucionesDeSalud");
  };

  const reactivarTurno = (option) => {
    AxiosHealth.put(`/turnos/${option.id}/activar`).then(() => {
      setMostrarForm(false);
      forceUpdate();
    });
  };

  //########## Manejo de Dialog #########//
  const [isDialogOpenUserExist, setIsDialogOpenUserExist] = useState(false);
  const handleDialogUserExist = (option) => {
    setTurnoDel(option.id);
    setGoogleDel(option.googleId);
    setIsDialogOpenUserExist((prevState) => !prevState);
  };
  const handleConfirmActionUserExist = async () => {
    setReloginGoogle(true)
    await validateGoogleTokenOnFrontend(localStorage.getItem('token'))
    deleteEvent(localStorage.getItem("accessCAL"),googleDel,idGoogleCal)
    AxiosHealth.put(`/turnos/${turnoDel}/desactivar`).then(() => {
      setMostrarForm(false);
      forceUpdate();
    });

    setIsDialogOpenUserExist(false);
  };
  //####################################//

  const editarTurnoModal = (option) => {
    setTurnoEdit(option);
    setOpenEditarTurno(true);
  };

  const confirmSave = () =>{
    setOpenConfirmSave(false)
  }
  
  const getFirstWord = (str) => {
    if (typeof str === "string" && str.includes("?")) {
      const result = {};
      str.split("?").forEach((item) => {
        const [key, value] = item.split(":");
        result[key] = value;
      });
      return result;
    }
    return { str };
  };

  const getFechaHora = (value) => {
    if (typeof value === "string" && value.includes(" ")) {
      const parts = value.split(" ");
      return { fecha: parts[0], hora: parts[1] };
    }
    return { fecha: value, hora: null };
  };

  return (
    <>
      {mostrarForm && (
        <>
          <Container>
            <Row>
              <Row>
                <Col>
                  <h1 style={{ textAlign: "left", fontWeight: "bold" }}>
                    Gestion de turnos
                  </h1>
                </Col>
              </Row>

              <Divider color="black" />
              <Row xs={1} md={3} className="g-4">
                {currentItems.map((option) => (
                  <Col>
                    <Card>
                      <Card.Body style={{ textAlign: "left" }}>
                        <Row>
                          <Col md={12}>
                            {option.activo ? (
                              <Card.Header
                                style={{
                                  fontWeight: "bold",
                                  background: "white",
                                  marginBottom: "15px",
                                }}
                                className="d-flex justify-content-between align-items-center"
                              >
                                {option.motivo}

                                <div>
                                  {option.googleId != null && option.activo ? (
                                    <Tooltip
                                      title="Recordatorio Activo"
                                      placement="top-start"
                                    >
                                      <IconButton>
                                        <AddAlertIcon color="primary" />
                                      </IconButton>
                                    </Tooltip>
                                  ) : null}
                                  <Tooltip title="Editar" placement="top-start">
                                    <IconButton
                                      aria-label="Editar"
                                      color="primary"
                                      onClick={() => editarTurnoModal(option)}
                                    >
                                      <EditIcon />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip
                                    title="Suspender"
                                    placement="top-start"
                                  >
                                    <IconButton
                                      aria-label="Suspender"
                                      color="error"
                                      onClick={() =>
                                        handleDialogUserExist(option)
                                      }
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              </Card.Header>
                            ) : (
                              <Card.Header
                                style={{
                                  fontWeight: "bold",
                                  background: "white",
                                  color: "red",
                                }}
                                className="d-flex justify-content-between align-items-center"
                              >
                                Turno suspendido
                                <div>
                                  <Tooltip
                                    title="Reactivar"
                                    placement="top-start"
                                  >
                                    <IconButton
                                      aria-label="Reactivar"
                                      color="primary"
                                      onClick={() =>
                                        reactivarTurno(option)
                                      }
                                    >
                                      <RotateLeftIcon />
                                    </IconButton>
                                  </Tooltip>
                                </div>
                              </Card.Header>
                            )}
                          </Col>
                         </Row>
                        {!option.activo ? <Card.Text>{} </Card.Text> : null}
                        <Card.Text>
                          Fecha del turno:{" "}
                          {getFechaHora(option.fechaInicio)
                            .fecha.split("-")
                            .reverse()
                            .join("-")}{" "}
                        </Card.Text>
                        <Card.Text>
                          Hora del turno:{" "}
                          {getFechaHora(option.fechaInicio).hora}{" "}
                        </Card.Text>
                        <Card.Text>
                          Profesional: {getFirstWord(option.profesional).nombre}
                        </Card.Text>
                        <Card.Text>
                          Especialidad:{" "}
                          {getFirstWord(option.especialidad).nombre}
                        </Card.Text>
                        <Card.Text>
                          Institucion: {getFirstWord(option.institucion).nombre}
                        </Card.Text>

                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel-content"
                            id="panel-header"
                          >
                            <Typography variant="p">Detalles</Typography>
                          </AccordionSummary>

                          <AccordionDetails>
                            <Card.Text>
                              Direccion:{" "}
                              {getFirstWord(option.direccion).direccion}{" "}
                            </Card.Text>
                            <Card.Text>
                              Piso: {getFirstWord(option.direccion).piso} /
                              Departamento:{" "}
                              {getFirstWord(option.direccion).departamento} /
                              Referencia:{" "}
                              {getFirstWord(option.direccion).referencia}
                            </Card.Text>
                          </AccordionDetails>
                        </Accordion>

                        {option.activo ? (
                          <DialogComponent
                            open={isDialogOpenUserExist}
                            title="Eliminar turno medico"
                            content="¿Esta seguro que desea eliminar el turno medico?"
                            onClose={handleDialogUserExist}
                            onConfirm={handleConfirmActionUserExist}
                            alertType={"question"}
                            secondButton={true}
                            nameSecondButton={"Cancelar"}
                          />
                        ) : null}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Col>
                <Pagination className="my-5">
                  <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {Array.from({ length: totalPages }, (_, index) => (
                    <Pagination.Item
                      key={index + 1}
                      active={index + 1 === currentPage}
                      onClick={() => handlePageChange(index + 1)}
                    >
                      {index + 1}
                    </Pagination.Item>
                  ))}
                  <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </Col>
            </Row>
          </Container>

          <Container>
            <Divider className="my-5" color="black" />
            <Col md={12} style={{ textAlign: "left" }}>
              <h2>
                Nuevo turno a registrar <AddIcon sx={{ fontSize: 45 }} />
              </h2>
              <Form className="my-5">
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "50ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div className="col-md-12">
                    <label style={{ textAlign: "left" }}>
                      Fecha del turno a registrar
                    </label>

                    <div className="row">
                      <div className="col-md-12">
                        <TextFieldDatetimeTurnoComponent
                          required
                          estado={fecha}
                          cambiarEstado={setFecha}
                          leyendaHelper={"Seleccione la fecha de la visita"}
                          leyendaError={"Debe seleccionar una fecha valida."}
                        />
                      </div>
                      <Divider className="my-2" />
                      <TextFieldTimeSelectComponent
                        leyendaHelper={"Profesional que brindará la atencion"}
                        leyendaError="Debe seleccionar una profesional."
                        id="Hora_Turno"
                        label="Seleccionar Horario"
                        estado={hora}
                        cambiarEstado={setHora}
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
                          estado={recordatorio}
                          cambiarEstado={setRecordatorio}
                          leyendaHelper={"Recordar en el calendario de Google?"}
                          disabled={false}
                          opcionA={"Si"}
                          opcionB={"No"}
                        />
                      </div>
                    </div>
                    <Divider className="my-2" />
                    <TextFieldDropdownComponente
                      leyendaHelper={"Profesional que brindará la atencion"}
                      leyendaError="Debe seleccionar una profesional."
                      id="profesional"
                      label="Profesional"
                      value={profesionalSelect}
                      estado={profesional}
                      cambiarEstado={setProfesional}
                    />

                    <Button
                      variant="contained"
                      color="primary"
                      className="text-white"
                      style={{
                        textDecoration: "none",
                      }}
                      endIcon={<PersonIcon />}
                      startIcon={<AddIcon />}
                      onClick={agregarProfesional}
                    >
                      Agregar profesional
                    </Button>

                    <Divider className="my-2" />
                    <TextFieldDropdownComponente
                      leyendaHelper={
                        "Seleccionar la especialidad del profesional"
                      }
                      leyendaError="Debe seleccionar la especialidad del profesional."
                      id="especialidad"
                      label="Especialidad"
                      value={especialidadSelect}
                      estado={especialidad}
                      cambiarEstado={setEspecialidad}
                    />
                    <Divider className="my-2" />
                    <TextFieldDropdownComponente
                      leyendaHelper={"Institucion donde debe concurrir"}
                      leyendaError="Debe seleccionar una institucion."
                      id="institucion"
                      label="Institucion"
                      value={institucionSelect}
                      estado={institucion}
                      cambiarEstado={setInstitucion}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      className="text-white"
                      style={{
                        textDecoration: "none",
                      }}
                      endIcon={<ArticleIcon />}
                      startIcon={<AddIcon />}
                      onClick={agregarInstitucion}
                    >
                      Agregar institucion
                    </Button>

                    <Divider className="my-2" />
                    <TextFieldTxAreaComponente
                      type="Textarea"
                      leyendaHelper="Motivo de la visita."
                      id="Indicaciones_Medicas_Visita"
                      label="Motivo de la visita."
                      estado={motivoVisita}
                      cambiarEstado={setMotivoVisita}
                    />

                    <ModalRelacionCentroEnProfesional
                      setOpenAsociarProfesional={setOpenAsociarProfesional}
                      openAsociarProfesional={openAsociarProfesional}
                      setCentroDeSalud={setInstitucionModal}
                      centroDeSalud={institucionModal}
                      objetos={institucionSelectModal}
                      validarObligatorio={validarObligatorio}
                      buttonGoTo={true}
                      datosResponsable={null}
                    />
                    <Button
                      variant="contained"
                      onClick={()=>setOpenConfirmSave(true)}
                      className="my-3"
                    >
                      Registrar turno medico
                    </Button>
                  </div>
                </Box>
              </Form>
              <ModalEditarTurnoMedico
                title={"Editar turno medico"}
                isOpen={openEditarTurno}
                nameButton={"Guardar"}
                modalEstado={setOpenEditarTurno}
                estado={openEditarTurno}
                turno={turnoEdit}
                setTurnoEdit={setTurnoEdit}
                refresh={forceUpdate}
              />
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GCID}>
                <AutoLogin />
              </GoogleOAuthProvider>
            </Col>
            <Dialog
              open={openConfirmSave}
              onClose={confirmSave}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle className="card-header">
                <DialogContent>
                  <HelpIcon />
                  <DialogContentText id="alert-dialog-description">
                    ¿Está seguro que desea guardar el turno?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={registrarTurno}>
                    Confirmar
                  </Button>
                  <Button onClick={confirmSave}>
                    Cancelar
                  </Button>
                </DialogActions>
              </DialogTitle>
            </Dialog>
            <div className="d-flex my-5">
              <Button
                variant="contained"
                color="primary"
                className="text-white"
                style={{
                  textDecoration: "none",
                }}
                component={Link}
                onClick={() => navigate(-1)}
              >
                Volver
              </Button>
            </div>
          </Container>
        </>
      )}
    </>
  );
}

export default AgendaTurnos;
