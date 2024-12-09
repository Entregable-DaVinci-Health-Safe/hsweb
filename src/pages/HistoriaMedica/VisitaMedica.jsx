import "moment/locale/es";
import { Form, Col } from "react-bootstrap";
import Button from "@mui/material/Button";
import { Link, useNavigate, useLocation  } from "react-router-dom";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";

import React, { useState, useLayoutEffect, useReducer, useRef } from "react";
import AxiosHealth from "../../interceptor/axiosHealth";
import TextFieldDropdownComponente from "../../components/TextFieldDropdownComponent";
import TextFieldTxAreaComponente from "../../components/TextFieldTxAreaComponent";
import TextFieldDatetimeComponent from "../../components/TextFieldDatetimeComponent";
import AdjuntarDocumento from "../../components/AdjuntarDocumento";
import TextFieldAutocompleteComponent from "../../components/TextFieldAutocompleteComponent";
import ModalRelacionCentroEnProfesional from "../../components/ModalRelacionCentroEnProfesional";
import SwitchsComponent from "../../components/SwitchsComponent";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from '@mui/icons-material/Person';
import ArticleIcon from '@mui/icons-material/Article';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loading from "../../components/Loading";

function VisitaMedica() {
  
  const [tipoDocumento, setTipoDocumento] = useState({campo: "",valido: null});
  const [institucionSelect, setInstitucionSelect] = useState([]);
  const [institucionSelectModal, setInstitucionSelectModal] = useState([]);
  const [institucion, setInstitucion] = useState({ campo: "", valido: null });
  const [institucionModal, setInstitucionModal] = useState({campo: "",valido: null});
  const [profesionalSelect, setProfesionalSelect] = useState([]);
  const [profesional, setProfesional] = useState({ campo: "", valido: null });
  const [especialidadSelect, setEspecialidadSelect] = useState([]);
  const [especialidad, setEspecialidad] = useState({ campo: "", valido: null });
  const [diagnosticoSelect, setDiagnosticoSelect] = useState([]);
  const [diagnostico, setDiagnostico] = useState({ campo: "", valido: null });
  const [indicaciones, setIndicaciones] = useState({ campo: "", valido: null });
  const [indicacionesVisita, setIndicacionesVisita] = useState({campo: "",valido: null});
  const [fecha, setFecha] = useState({ campo: "", valido: null });
  const [virtual, setVirtual] = useState({ campo: false, valido: null });
  const [mostrarForm, setMostrarForm] = useState(true);
  const location = useLocation();
  const { idHCResponsable, nombreResponsable, apellidoResponsable } = location.state || {};
  let idHC = idHCResponsable ? idHCResponsable : localStorage.getItem("HMI");
  const [myFiles, setMyFiles] = useState({nombre: "", direccion: "", valido: null,});
  const navigate = useNavigate();
  const [date, setDate] = useState(null);
  const [focused, setFocused] = useState(false);
  const [openAsociarProfesional, setOpenAsociarProfesional] = useState(false);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const form = useRef();
  
  useLayoutEffect(() => {
    Promise.all([AxiosHealth.get(`/historiasMedicas/${idHC}/profesionales`)])
      .then((value) => {
        const profesionalesArray = Object.values(value[0].data);
        setProfesionalSelect(profesionalesArray);
      })
      .catch((error) => {
        console.error(error);
      });
 }, [reducerValue]);

 useLayoutEffect(() => {
    AxiosHealth.get('/diagnosticos/all')
      .then((response) =>{
        setDiagnosticoSelect(response.data);
      })
 }, []);

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
        .catch((error) => {
          console.error(error);
        });
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

  const handleClickOpenAsociarInstitucion = () => {
    setOpenAsociarProfesional(true);
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

  useLayoutEffect(() => {
    setTipoDocumento({ campo: "", valido: null });
    setInstitucionSelect([]);
    setInstitucion({ campo: "", valido: null });
    setProfesionalSelect([]);
    setProfesional({ campo: "", valido: null });
    setEspecialidadSelect([]);
    setEspecialidad({ campo: "", valido: null });
    setDiagnosticoSelect([]);
    setDiagnostico({ campo: "", valido: null });
    setIndicaciones({ campo: "", valido: null });
    setFecha({ campo: "", valido: null });
    setVirtual({ campo: false });
    setMyFiles({ direccion: "", valido: null });
    setMostrarForm(true);
  }, [reducerValue]);

  const validarObligatorio = (estado, cambiarEstado) => {
    if (estado.valido == null) {
      cambiarEstado({ ...estado, valido: false });
    } else if (estado.valido == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };

  const subirImagen = async () => {
    try {
      const base64 = myFiles.direccion;
      const blob = await fetch(base64).then((res) => res.blob());
      const nombreUnico = `Documento_${new Date().getTime()}`;
      const storage = getStorage();
      const storageRef = ref(storage, "prescripciones/" + nombreUnico);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL.toString();
    } catch (error) {
      console.log("Matenme");
      throw error;
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  async function agregarVisitaMedica() {
    validarObligatorio(profesional, setProfesional);
    validarObligatorio(institucion, setInstitucion);
    validarObligatorio(especialidad, setEspecialidad);
    validarObligatorio(diagnostico, setDiagnostico);
    validarObligatorio(fecha, setFecha);

    if (
      profesional.valido &&
      institucion.valido &&
      especialidad.valido &&
      diagnostico.valido &&
      fecha.valido
    ) {
      Swal.fire({
        title: `Esta seguro que desea registrar la visita medica?`,
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          const url = await subirImagen();
          setIsLoading(true);
          await AxiosHealth.post(`/visitasMedicas/`, {
            fechaVisita: fecha.campo,
            atencionVirtual: virtual.campo,
            institucionSaludId: institucion.campo.id,
            profesionalId: profesional.campo.id,
            especialidadId: especialidad.campo.id,
            diagnosticoId: diagnostico.campo.id,
            historiaMedicaId: idHC,
            indicaciones: indicacionesVisita.campo,
          }).then(async (response) => {
            await AxiosHealth.post(`/prescripciones/`, {
              pais: "Argentina",
              visitaMedicaId: response.data.id,
            }).then(async (response) => {
              console.log(response.data.id);
              if (myFiles.valido == true) {
                if (
                  tipoDocumento.campo == "ORDEN" ||
                  tipoDocumento.campo == "RESULTADO"
                ) {
                  console.log(tipoDocumento.campo + " URL:" + url);
                  await AxiosHealth.post(
                    `/prescripcion/${response.data.id}/crearEstudio`,
                    {
                      tipo: tipoDocumento.campo,
                      url: url,
                      descripcion: indicaciones.campo,
                    }
                  )
                    .then(async (response) => {
                      console.log(response.data.id);
                    })
                    .catch((error) => {
                      setIsLoading(false)
                      console.error(error);
                    });
                } else if (tipoDocumento.campo == "RECETA") {
                  await AxiosHealth.post(
                    `/prescripcion/${response.data.id}/crearReceta/`,
                    {
                      tipo: tipoDocumento.campo,
                      url: url,
                      descripcion: indicaciones.campo,
                    }
                  )
                    .then(async (response) => {
                      console.log(response.data.id);
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
              }
            });
          });
          setMostrarForm(false);
          forceUpdate();
          console.log("guardadooooooo");
          setIsLoading(false);
        } 
      });
    } else {
      setIsLoading(false)
    }
  }

  const agregarProfesional = () => {
    navigate('/profesionales', { state: { idHCResponsable, nombreResponsable, apellidoResponsable} });
  };

  const agregarInstitucion = () => {
    navigate('/institucionesDeSalud', { state: { idHCResponsable, nombreResponsable, apellidoResponsable} });
  };

  return (
    <>
      {isLoading && <Loading message={"Registrando visita"} />}
      <div className="container">
        <h1 style={{ textAlign: "left", fontWeight: "bold", color: idHCResponsable ? 'red' : 'black' }}>Visita Medica del usuario  {idHCResponsable ? `${nombreResponsable} ${apellidoResponsable}` : null}</h1>
        <Divider color="black" />
        <div className="row my-5">
          <div className="col-md-12">
            <div className="justify-content-center">
              <Col md={12} style={{ textAlign: "left" }}>
                <h2>Registro de Visita Medica</h2>
                {mostrarForm && (
                  <>
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
                            Fecha de visita medica
                          </label>

                          <div className="row">
                            <div className="col-md-12">
                              <TextFieldDatetimeComponent
                                required
                                estado={fecha}
                                cambiarEstado={setFecha}
                                leyendaHelper={
                                  "Seleccione la fecha de la visita"
                                }
                                leyendaError="Debe seleccionar una fecha valida."
                              />
                            </div>

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
                                estado={virtual}
                                cambiarEstado={setVirtual}
                                leyendaHelper={"Tipo de atencion"}
                                disabled={false}
                                opcionA={"Virtual"}
                                opcionB={"Presencial"}
                              />
                            </div>
                          </div>
                          <Divider className="my-2" />
                          <TextFieldDropdownComponente
                            leyendaHelper={"Profesional que brindo la atencion"}
                            leyendaError="Debe seleccionar una profesional."
                            id="profesional"
                            label="Profesional"
                            value={profesionalSelect}
                            estado={profesional}
                            cambiarEstado={setProfesional}
                          />
                          {idHCResponsable ?
                          (
                            <Button
                            variant="contained"
                            color="primary"
                            className="text-white"
                            style={{
                              textDecoration: "none",
                            }}
                            endIcon={<PersonIcon/>}
                            startIcon={<AddIcon />}
                            onClick={agregarProfesional}
                            >
                              Agregar profesional
                            </Button>
                          )
                          : null

                          }
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
                            leyendaHelper={"Institucion"}
                            leyendaError="Debe seleccionar una institucion."
                            id="institucion"
                            label="Institucion"
                            value={institucionSelect}
                            estado={institucion}
                            cambiarEstado={setInstitucion}
                          />
                          {idHCResponsable ?
                          (
                          <Button
                            variant="contained"
                            color="primary"
                            className="text-white"
                            style={{
                              textDecoration: "none",
                            }}
                            endIcon={<ArticleIcon/>}
                            startIcon={<AddIcon />}
                            onClick={agregarInstitucion}
                            >
                              Agregar institucion
                            </Button>
                            )
                            : null
  
                            }
                          <Divider className="my-2" />
                          <TextFieldAutocompleteComponent
                            leyendaHelper={
                              "Escriba al menos 4 letras para iniciar una busqueda"
                            }
                            leyendaError="Debe escribir el diagnostico."
                            id="diagnostico"
                            label="Diagnostico"
                            base={diagnosticoSelect}
                            estado={diagnostico}
                            cambiarEstado={setDiagnostico}
                          />
                          <Divider className="my-2" />
                          <TextFieldTxAreaComponente
                            type="Textarea"
                            leyendaHelper="Indicaciones medicas de la visita."
                            id="Indicaciones_Medicas_Visita"
                            label="Indicaciones medicas de la visita"
                            estado={indicacionesVisita}
                            cambiarEstado={setIndicacionesVisita}
                          />

                          <Divider className="my-2" />
                          <AdjuntarDocumento
                            tipoDocumento={tipoDocumento}
                            setTipoDocumento={setTipoDocumento}
                            indicaciones={indicaciones}
                            setIndicaciones={setIndicaciones}
                            myFiles={myFiles}
                            setMyFiles={setMyFiles}
                          />

                          <ModalRelacionCentroEnProfesional
                            setOpenAsociarProfesional={
                              setOpenAsociarProfesional
                            }
                            openAsociarProfesional={openAsociarProfesional}
                            setCentroDeSalud={setInstitucionModal}
                            centroDeSalud={institucionModal}
                            objetos={institucionSelectModal}
                            validarObligatorio={validarObligatorio}
                            buttonGoTo={true}
                            datosResponsable= {idHCResponsable ? { idHCResponsable, nombreResponsable, apellidoResponsable } : null}
                          />
                          <Button
                            variant="contained"
                            onClick={agregarVisitaMedica}
                            className="my-3"
                          >
                            Registrar Visita Medica
                          </Button>
                        </div>
                      </Box>
                    </Form>
                  </>
                )}
              </Col>
            </div>
          </div>
        </div>
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
      </div>
    </>
  );
}
export default VisitaMedica;
