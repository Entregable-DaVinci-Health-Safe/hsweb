import { Form, Row, Col, Table, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import React, { useState, useLayoutEffect, useReducer, useRef } from "react";
import AxiosHealth from "../interceptor/axiosHealth";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { IconButton } from "@mui/material";
import { Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import EditIcon from "@mui/icons-material/Edit";
import { FormControl, Divider } from "@mui/material";

import ExpReg from "./../elementos/ExpresionesReg";
import TextFieldInputComponente from "../components/TextFieldInputComponent";
import TextFieldDatetimeComponent from "../components/TextFieldDatetimeComponent";
import TextFieldDropdownComponenteSimple from "../components/TextFieldDropdownComponentSimple";
import AddAlertIcon from "@mui/icons-material/AddAlert";

function Elementos() {
  const [visitasMedicas, setVisitasMedicas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(true);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  let idHC = localStorage.getItem("HMI");

  //Dialog
  const [open, setOpen] = React.useState(false);
  const [dni, setDni] = useState({ campo: "", valido: null });
  const [dni2, setDni2] = useState({ campo: "", valido: null });
  const [fechaNacimiento, setFechaNacimiento] = useState({
    campo: "",
    valido: null,
  });
  const [generoSelect, setGeneroSelect] = useState([]);
  const [genero, setGenero] = useState({ campo: "", valido: null });
  const [turnosMedicos, setTurnosMedicos] = useState([]);
  const navigate = useNavigate();

  //Close Completar datos de registro
  const handleClose = () => {
    setOpen(false);
    localStorage.clear();
    navigate("/");
  };

  //const location = useLocation();
  useLayoutEffect(() => {
    AxiosHealth.get("/generos", { includeAuth: false })
      .then((response) => {
        setGeneroSelect(response.data.slice(0, 2));
      })
      .catch((error) => console.error(error.request.response));
    if (localStorage.getItem("HMI") == 0) {
      setOpen(true);
    }
  }, []);

  //acturaliza datos
  const actualizarDatos = () => {
    validarObligatorio(fechaNacimiento, setFechaNacimiento);
    validarObligatorio(dni, setDni);
    validarObligatorio(dni2, setDni2);
    validarObligatorio(genero, setGenero);

    if (
      fechaNacimiento.valido == true &&
      dni.valido == true &&
      dni2.valido == true &&
      genero.valido == true
    ) {
      AxiosHealth.put("usuarios/googleUpdate", {
        documento: dni.campo,
        fechaNacimiento: fechaNacimiento.campo,
        genero: genero.campo,
      })
        .then((response) => {
          setOpen(false);
          AxiosHealth.get("historiasMedicas/usuarios/").then((response) => {
            localStorage.setItem("HMI", response.data.id);
          });
        })
        .catch((error) => {
          console.log(error.request.response);
          console.log(error.request.status);
        });
    }
  };

  //Validador de DNI
  const validarDNI2 = () => {
    if (dni.campo.length > 0) {
      if (dni.campo !== dni2.campo) {
        setDni2((prevState) => {
          return { ...prevState, valido: false };
        });
      } else {
        setDni2((prevState) => {
          return { ...prevState, valido: true };
        });
      }
    }
  };

  //Validador obligatorio
  const validarObligatorio = (estado, cambiarEstado) => {
    if (estado.valido == null) {
      cambiarEstado({ ...estado, valido: false });
    } else if (estado.valido == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };

  useLayoutEffect(() => {
    let visitas = [];
    AxiosHealth.get(`/historiasMedicas/${idHC}/visitasMedicas`)
      .then((value) => {
        visitas = Object.values(value.data);
        const visitasActivas = visitas.filter((visita) => visita.activo == 1);
        setVisitasMedicas(visitasActivas.reverse());
        setMostrarForm(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [reducerValue]);

  useLayoutEffect(() => {
    AxiosHealth.get(`historiasMedicas/${idHC}/turnos`)
      .then((value) => {
        if (typeof value.data != "string") {
          const activeRecords = value.data.filter((item) => item.activo == 1);
          const limitedResults = activeRecords.slice(0, 3);
          setTurnosMedicos(limitedResults);
        }
      })
      .catch((error) => console.error(error));
  }, [reducerValue]);

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
      <div className="container">
        <h1 style={{ textAlign: "left", fontWeight: "bold" }}>Inicio</h1>
        <Divider color="black" />

        <div className="row my-5">
          <div className="col-md-12">
            <div>
              <Card.Title>Proximos Eventos</Card.Title>
              <Divider className="my-2" />
              <Row xs={1} md={4} className="g-4">
                {turnosMedicos.map((option) => (
                  <Col key={option.id}>
                    <Card>
                      <Card.Body style={{ textAlign: "left" }}>
                        {option.activo ? (
                          <div>
                            <Row>
                              <Col md={12}>
                                <Card.Header
                                  style={{
                                    fontWeight: "bold",
                                    background: "white",
                                    marginBottom: "15px",
                                  }}
                                  className="d-flex justify-content-between align-items-center"
                                >
                                  {option.motivo}
                                  {option.googleId != null && option.activo ? (
                                    <Tooltip
                                      title="Recordatorio Activo"
                                      placement="top-start"
                                    >
                                      <AddAlertIcon color="primary" />
                                    </Tooltip>
                                  ) : null}
                                </Card.Header>
                              </Col>
                            </Row>
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
                              Profesional:{" "}
                              {getFirstWord(option.profesional).nombre}
                            </Card.Text>
                            <Card.Text>
                              Especialidad:{" "}
                              {getFirstWord(option.especialidad).nombre}
                            </Card.Text>
                            <Card.Text>
                              Institucion:{" "}
                              {getFirstWord(option.institucion).nombre}
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
                                  {getFirstWord(option.direccion).departamento}{" "}
                                  / Referencia:{" "}
                                  {getFirstWord(option.direccion).referencia}
                                </Card.Text>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        ) : null}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              {/* </Row> */}

              <Divider className="my-3" />

              <Row>
                <Col>
                  <Card>
                    <Card.Body>
                      <Row>
                        <Card.Title>
                          Último registro de Visita Medica
                        </Card.Title>
                        {mostrarForm && (
                          <>
                            {visitasMedicas.map((option) => (
                              <Col md={12} key={option.id}>
                                <Card className="my-3">
                                  <Card.Header className="text-start">
                                    <h5>
                                      {option.fechaVisita
                                        .split("-")
                                        .reverse()
                                        .join("-")}
                                    </h5>
                                  </Card.Header>

                                  <Card.Body>
                                    <div className="justify-content-center my-2">
                                      <Form>
                                        <Row>
                                          <Col>
                                            <Stack direction="row" spacing={1}>
                                              <Chip
                                                label="Prescripcion médica"
                                                color="primary"
                                                variant=""
                                              />
                                              <Chip
                                                label="Orden de estudios"
                                                variant=""
                                              />
                                              <Chip
                                                label="Resultado de estudios"
                                                variant=""
                                              />
                                            </Stack>
                                          </Col>
                                        </Row>
                                      </Form>
                                    </div>

                                    <Table
                                      className="my-4"
                                      striped
                                      bordered
                                      hover
                                    >
                                      <thead>
                                        <tr>
                                          <th>Fecha visita</th>
                                          <th>Centro de salud</th>
                                          <th>Profesional</th>
                                          <th>Diagnóstico</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>
                                            {option.fechaVisita
                                              .split("-")
                                              .reverse()
                                              .join("-")}
                                          </td>
                                          <td>
                                            {option.institucionSalud.nombre}
                                          </td>
                                          <td>{option.profesional.nombre}</td>
                                          <td>
                                            {" "}
                                            {option.diagnostico.nombre ? (
                                              <Typography className="my-2">
                                                Diagnostico:{" "}
                                                {option.diagnostico?.nombre}
                                              </Typography>
                                            ) : (
                                              <Typography>
                                                Sin diagnostico.
                                              </Typography>
                                            )}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </Table>

                                    <div className="container">
                                      <div className="my-2">
                                        {option.prescripciones.map(
                                          (prescripcion) => (
                                            <Accordion key={prescripcion.id}>
                                              <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                              >
                                                <Typography>
                                                  Adjuntos e Indicaciones
                                                </Typography>
                                              </AccordionSummary>
                                              <AccordionDetails>
                                                {/* Recetas */}
                                                {prescripcion.recetas.length >
                                                  0 && (
                                                  <>
                                                    <Table
                                                      className="text-center"
                                                      striped
                                                      bordered
                                                      hover
                                                      size="sm"
                                                    >
                                                      <thead>
                                                        <tr>
                                                          <th>Fecha</th>
                                                          <th>Tipo</th>
                                                          <th>Indicacion</th>
                                                          <th>Adjunto</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        {prescripcion.recetas.map(
                                                          (receta, index) => (
                                                            <tr key={receta.id}>
                                                              <td>
                                                                {receta.fecha}
                                                              </td>
                                                              <td>
                                                                {receta.tipo}
                                                              </td>
                                                              <td>
                                                                {receta.descripcion
                                                                  ? receta.descripcion
                                                                  : "Sin indicaciones disponibles"}
                                                              </td>
                                                              <td>
                                                                {receta.url ? (
                                                                  <div>
                                                                    <Button
                                                                      disabled
                                                                    >
                                                                      <VisibilityOutlinedIcon />
                                                                    </Button>
                                                                    <IconButton
                                                                      aria-label="Suspender"
                                                                      color="error"
                                                                    >
                                                                    </IconButton>
                                                                  </div>
                                                                ) : (
                                                                  <Tooltip
                                                                    title="Sin adjuntos disponibles"
                                                                    placement="top-start"
                                                                  >
                                                                    <Button
                                                                      style={{
                                                                        color:
                                                                          "rgba(0, 0, 0, 0.26)",
                                                                      }}
                                                                    >
                                                                      <VisibilityOutlinedIcon />
                                                                    </Button>
                                                                  </Tooltip>
                                                                )}
                                                              </td>
                                                            </tr>
                                                          )
                                                        )}
                                                      </tbody>
                                                    </Table>
                                                  </>
                                                )}

                                                {/* Estudios */}
                                                {prescripcion.estudios.length >
                                                  0 && (
                                                  <>
                                                    <Table
                                                      className="text-center"
                                                      striped
                                                      bordered
                                                      hover
                                                      size="sm"
                                                    >
                                                      <thead>
                                                        <tr>
                                                          <th>Fecha</th>
                                                          <th>Tipo</th>
                                                          <th>Indicacion</th>
                                                          <th>Adjunto</th>
                                                        </tr>
                                                      </thead>
                                                      <tbody>
                                                        {prescripcion.estudios.map(
                                                          (estudio, index) => (
                                                            <tr
                                                              key={estudio.id}
                                                            >
                                                              <td>
                                                                {estudio.fecha}
                                                              </td>
                                                              <td>
                                                                {estudio.tipo}
                                                              </td>
                                                              <td>
                                                                {estudio.descripcion
                                                                  ? estudio.descripcion
                                                                  : "Sin indicaciones disponibles"}
                                                              </td>
                                                              <td>
                                                                {estudio.url ? (
                                                                  <div>
                                                                    <Button
                                                                      disabled
                                                                    >
                                                                      <VisibilityOutlinedIcon />
                                                                    </Button>
                                                                    <IconButton
                                                                      aria-label="Suspender"
                                                                      color="error"
                                                                    >
                                                                      <DeleteIcon />
                                                                    </IconButton>
                                                                  </div>
                                                                ) : (
                                                                  <Tooltip
                                                                    title="Sin adjuntos disponibles"
                                                                    placement="top-start"
                                                                  >
                                                                    <Button
                                                                      style={{
                                                                        color:
                                                                          "rgba(0, 0, 0, 0.26)",
                                                                      }}
                                                                    >
                                                                      <VisibilityOutlinedIcon />
                                                                    </Button>
                                                                  </Tooltip>
                                                                )}
                                                              </td>
                                                            </tr>
                                                          )
                                                        )}
                                                      </tbody>
                                                    </Table>
                                                  </>
                                                )}
                                              </AccordionDetails>
                                            </Accordion>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))}
                          </>
                        )}
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </div>

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Form>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <DialogTitle className="card-header">
                <EditIcon />
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <h5>Completar datos de registro</h5>
                  </DialogContentText>
                </DialogContent>
                <Col xs={12} md={6}>
                  <FormControl
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
                    <TextFieldInputComponente
                      required
                      type="text"
                      leyendaHelper="DNI"
                      leyendaError="El DNI deben ser solo numeros."
                      id="Dni_Usuario_Registrar"
                      label="DNI"
                      estado={dni}
                      cambiarEstado={setDni}
                      expresionRegular={ExpReg.dni}
                    />
                  </FormControl>
                </Col>
                <Col xs={12} md={6}>
                  <FormControl
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
                    <TextFieldInputComponente
                      required
                      type="text"
                      leyendaHelper="Repetir su DNI"
                      leyendaError="El numero de DNI deben coincidir."
                      id="Dni_Repetir_Usuario_Registrar"
                      label="DNI"
                      estado={dni2}
                      cambiarEstado={setDni2}
                      funcion={validarDNI2}
                    />
                  </FormControl>
                </Col>
                <Col xs={12} md={6} style={{ textAlign: "left" }}>
                  <FormControl
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
                    <label style={{ textAlign: "left" }}>
                      Fecha de nacimiento
                    </label>
                    <TextFieldDatetimeComponent
                      required
                      estado={fechaNacimiento}
                      cambiarEstado={setFechaNacimiento}
                      leyendaHelper={"Seleccione la fecha de nacimiento"}
                      leyendaError="Debe ser mayor de 18 años."
                      mayorDeEdad
                    />
                  </FormControl>
                </Col>
                <Col xs={12} md={6}>
                  <FormControl
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
                    <label style={{ textAlign: "left" }}>Sexo al nacer</label>
                    <Divider />
                    <TextFieldDropdownComponenteSimple
                      estado={genero}
                      value={generoSelect}
                      cambiarEstado={setGenero}
                      //label={'Seleccionar Genero'}
                      name={"select_genero"}
                      leyendaHelper={"Seleccionar Genero"}
                      leyendaError="Debe seleccionar el genero."
                    />
                  </FormControl>
                </Col>
                <Divider className="my-1" />
                <DialogActions>
                  <Button variant="contained" onClick={actualizarDatos}>
                    Guardar
                  </Button>
                  <Button variant="outlined" onClick={handleClose} autoFocus>
                    Cancelar
                  </Button>
                </DialogActions>
              </DialogTitle>
            </Box>
          </Form>
        </Dialog>
      </div>
    </>
  );
}
export default Elementos;
