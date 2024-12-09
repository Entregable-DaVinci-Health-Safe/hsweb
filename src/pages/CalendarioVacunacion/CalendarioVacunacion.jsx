import React, { useLayoutEffect, useReducer, useState } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { Link, useNavigate  } from "react-router-dom";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { Box, Button, Divider } from "@mui/material";
import { IconButton } from "@mui/material";
import { Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Typography } from "@mui/material";
import AxiosHealth from "../../interceptor/axiosHealth";
import Modal from "../../components/ModalBase";
import TextFieldDatetimeComponent from "../../components/TextFieldDatetimeComponent";
import TextFieldDropdownComponente from "../../components/TextFieldDropdownComponent";
import Swal from "sweetalert2";
import Switch from "../../components/SwitchsComponent";

const VacunaItem = ({
  vacuna,
  objetoVacuna,
  objetoCalendario,
  refresh,
  setMostrarContenido,
  setAccordionExpanded,
}) => {
  const eliminarVacuna = async () => {
    Swal.fire({
      title: "BORRAR VACUNA APLICADA",
      text: `Esta seguro que desea borrar la aplicacion de la vacuna: ${vacuna.nombre} aplicada el día: ${vacuna.fechaAplicada}?`,
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await AxiosHealth.delete(
          `/calendarios/${objetoCalendario.id}/vacunas`,
          {
            data: {
              rangoEdadId: objetoVacuna.id,
              vacunaAplicadaId: vacuna.id,
            },
          }
        );
        setMostrarContenido(false);
      }
      setAccordionExpanded(objetoCalendario.id);
      refresh();
    });
  };

  return (
    <>
      <div style={{ marginLeft: "10px" }}>
        <Card>
          <Card.Body>
            <Row>
              <Col md={12} style={{ textAlign: "left" }}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <Card.Title>{vacuna.nombre}</Card.Title>
                  <div style={{ textAlign: "right" }}>
                    <Tooltip title="Eliminar" placement="top-start">
                      <IconButton
                        aria-label="Eliminar"
                        color="error"
                        onClick={() => eliminarVacuna()}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Card.Header>
                <Divider />
                <Card.Text className="my-3">
                  Descripcion: {vacuna.descripcion}
                </Card.Text>
                <Typography style={{ textAlign: "left" }}>
                  Fecha de aplicacion: {vacuna.fechaAplicada}
                </Typography>
                <Typography style={{ textAlign: "left" }}>
                  Dosis: {vacuna.numeroDosis}/X
                </Typography>
                <Col md={12}>
                  <Stack className="my-3" direction="row">
                    <Chip
                      label={vacuna.aplicada == "Aplicada" ? "Aplicada" : ""}
                      color="primary"
                      variant=""
                    />
                  </Stack>
                </Col>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>

      <Divider className="my-2" />
    </>
  );
};

function VacunasList() {
  const [calendarioGlobal, setCalendarioGlobal] = useState([]);
  const [selectRangoEdad, setSelectRangoEdad] = useState([]);
  const [selectVacunaPorEdad, setSelectVacunaPorEdad] = useState([]);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [mostrarContenido, setMostrarContenido] = useState(true);
  const [accordionExpanded, setAccordionExpanded] = useState();
  const [switchEsProfesional, setSwitchEsProfesional] = useState({
    campo: "",
    valido: null,
  });
  const [edadParaAgregarVacuna, setEdadParaAgregarVacuna] = useState({
    campo: "",
    valido: null,
  });
  const [vacunaParaAgregarPorEdad, setVacunaParaAgregarPorEdad] = useState({
    campo: "",
    valido: null,
  });
  const [fechaAplicacionVacuna, setFechaAplicacionVacuna] = useState({
    campo: "",
    valido: null,
  });
  const [idCalendario, setIdCalendario] = useState({ campo: "", valido: null });
  const [modalRegistrar, setOpenModalRegistrar] = useState("");
  let idHC = localStorage.getItem("HMI");
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (
      switchEsProfesional.valido == true &&
      calendarioGlobal[2] == undefined
    ) {
      Swal.fire({
        title: "ATENCION!",
        text: "Activando este check ud está aceptando que es profesional de salud y ya no podra desactivarlo. Esta seguro que desea activarlo ahora?",
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          setMostrarContenido(false);
          AxiosHealth.post(`historiasMedicas/${idHC}/calendarios/personalSalud`)
            .then(async (response) => {
              forceUpdate();
            })
            .catch((error) => {
              console.error(error);
            });
        } else {
          setSwitchEsProfesional({ campo: false, valido: null });
        }
      });
    }
  }, [switchEsProfesional]);

  useLayoutEffect(() => {
    setCalendarioGlobal([]);
    Promise.all([AxiosHealth.get(`historiasMedicas/${idHC}/calendarios`)])
      .then((value) => {
        setCalendarioGlobal(value[0].data);
        if (value[0].data[2] != undefined) {
          setSwitchEsProfesional({ campo: true, valido: true });
        }
      })
      .catch((error) => {
        console.error(error);
      });
    setMostrarContenido(true);
  }, [reducerValue]);

  useLayoutEffect(() => {
    if (edadParaAgregarVacuna.campo != "") {
      Promise.all([
        AxiosHealth.get(
          `/vacunas/byRangoEdad/${edadParaAgregarVacuna.campo.id}`
        ),
      ])
        .then((value) => {
          setSelectVacunaPorEdad(value[0].data);
        })
        .catch((error)=>{console.log(error)});
    }
  }, [edadParaAgregarVacuna]);

    const openModalRegistrar = (option) => {
    setSelectRangoEdad(option.rangoEdades);
    setIdCalendario({ campo: option.id, valido: true });
    setOpenModalRegistrar(true);
  };

  const handleCloseModalRegisrar = (event) => {
    setOpenModalRegistrar(false);
  };

  const registrarVacuna = async () => {
    if (
      fechaAplicacionVacuna.valido == true &&
      vacunaParaAgregarPorEdad.valido == true &&
      edadParaAgregarVacuna.valido == true &&
      idCalendario.valido == true
    ) {
      handleCloseModalRegisrar();
      Swal.fire({
        title: `Los siguientes datos, son correctos?`,
        text:
          "Rango de edad: " +
          edadParaAgregarVacuna.campo.nombre +
          " Vacuna: " +
          vacunaParaAgregarPorEdad.campo.nombre +
          " Fecha de aplicacion: " +
          fechaAplicacionVacuna.campo,
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await AxiosHealth.post(`/calendarios/${idCalendario.campo}/vacunas`, {
            rangoEdadId: edadParaAgregarVacuna.campo.id,
            vacunaId: vacunaParaAgregarPorEdad.campo.id,
            fechaAplicada: fechaAplicacionVacuna.campo,
            aplicada: "Aplicada",
            numeroDosis: 1,
          }).then(async function (response) {
            setMostrarContenido(false);
            cancelRegistro();
            forceUpdate();
          });
        } else {
        }
      });
    } 
  };

  const cancelRegistro = () => {
    setSelectRangoEdad([]);
    setSelectVacunaPorEdad([]);
    setEdadParaAgregarVacuna({ campo: "", valido: null });
    setVacunaParaAgregarPorEdad({ campo: "", valido: null });
    setFechaAplicacionVacuna({ campo: "", valido: null });
    setIdCalendario({ campo: "", valido: null });
    setOpenModalRegistrar(false);
  };

  return (
    <>
      {mostrarContenido && (
        <>
          <Container>
            <Row>
              <Col>
                <h1 style={{ textAlign: "left", fontWeight: "bold" }}>
                  Calendario de Vacunacion
                </h1>
                <Divider color="black" />
              </Col>
            </Row>
            <div className="my-5 justify-content-center">
              <Form>
                <Row>
                  <Col md={4}>
                    <div>
                      <div>
                        <Switch
                          estado={switchEsProfesional}
                          cambiarEstado={setSwitchEsProfesional}
                          leyendaHelper={
                            "Soy personal de salud! (Si activa esta opcion solo un administrador del servicio puede volver a desactivarla)"
                          }
                          disabled={true}
                          opcionA={"SI"}
                          opcionB={"NO"}
                        />
                      </div>
                    </div>
                  </Col>
                  <Divider />
                </Row>
              </Form>
            </div>

            {calendarioGlobal.map((objetoCalendario) => (
              <>
                <Divider color="black" />
                <Accordion
                  defaultExpanded={
                    objetoCalendario.id == accordionExpanded ? true : false
                  }
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <h5>Calendario {objetoCalendario.tipo}</h5>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Button
                      onClick={() => openModalRegistrar(objetoCalendario)}
                      variant="contained"
                      color="primary"
                      className="text-white"
                    >
                      Registrar vacuna
                    </Button>

                    <Row md={3}>
                      {objetoCalendario.rangoEdades.map((objetoVacuna) =>
                        objetoVacuna.vacunasAplicadas.length > 0
                          ? objetoVacuna.vacunasAplicadas.map((aplicada) => (
                              <>
                                <div className="my-3">
                                  <VacunaItem
                                    vacuna={aplicada}
                                    objetoVacuna={objetoVacuna}
                                    objetoCalendario={objetoCalendario}
                                    idHC={idHC}
                                    refresh={forceUpdate}
                                    setMostrarContenido={setMostrarContenido}
                                    setAccordionExpanded={setAccordionExpanded}
                                  />
                                </div>
                              </>
                            ))
                        : null
                      )}
                    </Row>
                  </AccordionDetails>
                </Accordion>
              </>
            ))}

            <Divider color="black" />
            <div className="d-flex my-5">
            <Button variant="contained"
              color="primary"
              className="text-white"
              style={{
                textDecoration: "none",
              }}
              component={Link}
              onClick={ () => navigate(-1)}
            >
                Volver
            </Button>
            </div>
          </Container>
          <Modal
            isOpen={modalRegistrar}
            modalEstado={setOpenModalRegistrar}
            title={"Registro de vacuna"}
          >
            <Col>
              <Form>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "50ch" },
                  }}
                  noValidate
                  autoComplete="off"
                ></Box>
                <TextFieldDropdownComponente
                  leyendaHelper={"Seleccionar un rango de edad"}
                  id="rangoEdad_agregarVacuna"
                  label="Seleccion rango edad"
                  value={selectRangoEdad}
                  estado={edadParaAgregarVacuna}
                  cambiarEstado={setEdadParaAgregarVacuna}
                />
                <TextFieldDropdownComponente
                  leyendaHelper={"Seleccionar la vacuna aplicada"}
                  id="vacuna_agregarVacuna"
                  label="Seleccion vacuna aplicada"
                  value={selectVacunaPorEdad}
                  estado={vacunaParaAgregarPorEdad}
                  cambiarEstado={setVacunaParaAgregarPorEdad}
                />
                <TextFieldDatetimeComponent
                  required
                  estado={fechaAplicacionVacuna}
                  cambiarEstado={setFechaAplicacionVacuna}
                  leyendaHelper={"Seleccione la fecha de la aplicacion"}
                  leyendaError="Debe seleccionar una fecha valida."
                />
                {fechaAplicacionVacuna.valido == true &&
                  vacunaParaAgregarPorEdad.valido == true &&
                  edadParaAgregarVacuna.valido == true && (
                    <>
                      <Button
                        variant="contained"
                        onClick={() => {
                          registrarVacuna();
                        }}
                      >
                        Guardar
                      </Button>
                    </>
                  )}{" "}
                <Button
                  variant="contained"
                  onClick={() => {
                    cancelRegistro();
                  }}
                >
                  Cerrar
                </Button>
              </Form>
            </Col>
          </Modal>
        </>
      )}
    </>
  );
}
export default VacunasList;
