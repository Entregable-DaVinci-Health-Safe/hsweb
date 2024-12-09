import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HelpIcon from '@mui/icons-material/Help';
import { Form, Row, Col, Table, Card } from "react-bootstrap";
import Button from "@mui/material/Button";
import { Link, useNavigate, useLocation} from "react-router-dom";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import { Tooltip } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import FilterListIcon from "@mui/icons-material/FilterList";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import React, { useState, useLayoutEffect, useReducer, useRef } from "react";
import AxiosHealth from "../../interceptor/axiosHealth";
import { Modal } from "react-bootstrap";
import ModalBase from "../../components/ModalBase";
import AdjuntarDocumento from "../../components/AdjuntarDocumento";
import { Pagination } from "react-bootstrap";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Loading from '../../components/Loading';
import Swal from "sweetalert2";
import ModalEditarVisitaMedica from './ModalEditarVisitaMedica'
import TextFieldDatetimeComponent from "../../components/TextFieldDatetimeComponent";

function HistoriaMedica() {
  const [estadoSeleccionado, setEstadoSeleccionado] = useState("opcion1");
  const [visitasMedicas, setVisitasMedicas] = useState([]);
  const [visitaEdit, setVisitaEdit] = useState([]);  
  const [openTwo, setOpenTwo] = useState(false);
  const [attachId, setAttachId] = useState({campo: '',valido: null});
  const [isLoading, setIsLoading] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(true);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [filtroApply, serFiltroApply] = useReducer((x) => x + 1, 0);
  const [showModal, setShowModal] = useState(false);
  const [modalBaseEstado, setModalBaseEstado] = useState(false);
  const [myFiles, setMyFiles] = useState({nombre: '',direccion: '',valido: null});
  const [tipoDocumento, setTipoDocumento] = useState({campo: '',valido: null});
  const [indicaciones, setIndicaciones] = useState({campo: '',valido: null});
  const [pdfUrl, setPdfUrl] = useState("");
  const [fechaDesde, setFechaDesde] = useState({ campo: '', valido: null });
  const [fechaHasta, setFechaHasta] = useState({ campo: '', valido: null });
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [optionDelete, setOptionDelete] = useState(null); 
  
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage] = useState(2);
  const navigate = useNavigate();

  const location = useLocation();
  const { idHCResponsable, nombreResponsable, apellidoResponsable } = location.state || {};
  let idHC = idHCResponsable ? idHCResponsable : localStorage.getItem("HMI");

  useLayoutEffect (() => {
    setAttachId({ campo: '', valido: null });
    setMyFiles({ nombre: '', direccion: '', valido: null });
    setTipoDocumento({ campo: '', valido: null });
    setIsLoading(false);
    setVisitaEdit([]);
    setVisitasMedicas([]);
    setOpenConfirmDelete(false);
    ApplyFilter()
  }, [reducerValue])

  useLayoutEffect(() => {
    let visitas=[]
    if(fechaDesde.campo > fechaHasta.campo){
      setFechaDesde({...fechaDesde,valido : false})
    } 
    if(fechaDesde.valido == true && fechaHasta.valido == true){
      AxiosHealth.get(`/visitasMedicas/timeRange`,{
        params: {
          historiaMedicaId: idHC,
          startDate: fechaDesde.campo,
          lastDate: fechaHasta.campo,
          giveLatest: false,
        }
      })
      .then((value) => {
        if(estadoSeleccionado === "opcion1"){
          const visitasActivas = value.data.filter(visita => visita.activo == 1);
          setVisitasMedicas(visitasActivas.reverse());
        } else if (estadoSeleccionado === "opcion2"){
          const visitasActivas = value.data.filter(visita => visita.activo == 0);
          setVisitasMedicas(visitasActivas.reverse());
        } else if (estadoSeleccionado === "opcion3"){
          setVisitasMedicas(value.data.reverse());
        }
        setMostrarForm(true)
      })
      .catch((error) => {
        console.error(error);
      });
    }else{
      AxiosHealth.get(`/historiasMedicas/${idHC}/visitasMedicas`)
      .then((value) => {
        if(estadoSeleccionado === "opcion1"){
          const visitasActivas = value.data.filter(visita => visita.activo == 1);
          setVisitasMedicas(visitasActivas.reverse());
        }
        setMostrarForm(true)
      })
      .catch((error) => {
        console.error(error);
      });
    }
    
 }, [filtroApply]);
  
  const handleOptionChangeEstado = (event) => {
    setEstadoSeleccionado(event.target.value);
  };

  const editarVisitaModal = (option) => {
    setVisitaEdit(option);
    setOpenTwo(true)    
  };
  
  const desactivarVisita = (option) => {
    setOpenConfirmDelete(true)
    setOptionDelete(option)
  };

  const eliminarTurno = async () =>{
    await AxiosHealth.put(`/visitasMedicas/${optionDelete.id}/desactivar`);
    setOpenConfirmDelete(false)
    setMostrarForm(false)
    forceUpdate();
  }

  
  const confirmDelete = () =>{
    setOpenConfirmDelete(false)
  }

  const eliminarAdjunto = async (option) => {
    Swal.fire({
      title: `Esta seguro que desea eliminar el documento?`,
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        option.tipo == 'Receta' ? await AxiosHealth.delete(`/prescripciones/${idHC}/recetas/${option.id}`) : await AxiosHealth.delete(`/prescripciones/${idHC}/estudios/${option.id}`)
        setMostrarForm(false)
        forceUpdate();
      }
    });
  };
  
  const attachFile = (option) => {
    setModalBaseEstado(true);
    setAttachId({campo : option.prescripciones[0]?.id, valido : true })
  };
  
  const cancelAttachFile = () =>{
    setAttachId({campo : '', valido : null })
    setModalBaseEstado(false);
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
      throw error;
    }
  };
  
  const saveAttachFile = async () => {
    setModalBaseEstado(false);
    setIsLoading(true);
  
    try {
      const url = await subirImagen();
      if (myFiles.valido == true) {
        if (tipoDocumento.campo === "ORDEN" || tipoDocumento.campo === "RESULTADO") {
         await AxiosHealth.post(`/prescripcion/${attachId.campo}/crearEstudio`,
            {
              tipo: tipoDocumento.campo,
              url: url,
              descripcion: indicaciones.campo,
            }
          )
          .then(async (response) => {
          })
          .catch((error) => {
            console.error(error);
          });
        } else if (tipoDocumento.campo === "RECETA") {
          await AxiosHealth.post(
            `/prescripcion/${attachId.campo}/crearReceta/`,
            {
              tipo: tipoDocumento.campo,
              url: url,
              descripcion: indicaciones.campo,
            }
          )
          .catch((error) => {
            console.error(error);
          });
        }
      }
      setMostrarForm(false)
      forceUpdate();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const cantidadDeCaracteres = 40;
  const ajustarTexto = (texto) => {
    if (texto.length <= cantidadDeCaracteres) {
      return texto;
    }
    return texto.slice(0, cantidadDeCaracteres) + "...";
  };
  const contador = 1;
  
  const handleOpenModal = (url) => {
    setPdfUrl(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const ApplyFilter = () => {
    serFiltroApply();
  }

  // Calcula el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcula el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtiene los datos de la página actual
  const currentItems = visitasMedicas.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula el número total de páginas
  const totalPages = Math.ceil(visitasMedicas.length / itemsPerPage);

  // Cambia la página actual
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="container my-3">
        <h1 style={{ textAlign: "left", fontWeight: "bold", color: idHCResponsable ? 'red' : 'black' }}>Historia medica del usuario  {idHCResponsable ? `${nombreResponsable} ${apellidoResponsable}` : null}</h1>
        <Divider color="black" />
      </div>

      <div className="container my-3">
        <div className="row">
          <div className="col-md-12">
            <div className="justify-content-center">
              <Form>
                <Row>
                  <Col md={4}>
                    <p className="text-start">Fecha inicio</p>
                    <TextFieldDatetimeComponent
                      estado={fechaDesde}
                      cambiarEstado={setFechaDesde}
                      leyendaHelper={"Seleccione la fecha de inicio a filtrar."}
                      leyendaError="Debe seleccionar una fecha de inicio a filtrar. Debe ser menor que la de fin"
                      defaultValue={"2000-01-01"}
                      filter={true}
                    />
                  </Col>
                  <Col md={4}>
                    <p className="text-start">Fecha fin</p>
                    <TextFieldDatetimeComponent
                      estado={fechaHasta}
                      cambiarEstado={setFechaHasta}
                      leyendaHelper={"Seleccione la fecha de fin a filtrar."}
                      leyendaError="Debe seleccionar una fecha de fin a filtrar.  Debe ser mayor que la de incio"
                    />
                  </Col>
                  <Col md={4}>
                    <p className="text-start">Estados</p>
                    <TextField
                      className="text-start"
                      style={{ width: "400px" }}
                      value={estadoSeleccionado}
                      onChange={handleOptionChangeEstado}
                      select
                      label="Estado de la Visita Medica"
                    >
                      <MenuItem value="opcion1">Visitas activas</MenuItem>
                      <MenuItem value="opcion2">Visitas inactivas</MenuItem>
                      <MenuItem value="opcion3">Todas las visitas</MenuItem>
                    </TextField>
                  </Col>
                  <Col md={4}>
                    <Divider className="my-3" />
                    <Button
                      startIcon={<FilterListIcon />}
                      variant="contained"
                      className="form-control btn-block"
                      onClick={ApplyFilter}
                    >
                      APLICAR FILTROS
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>

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

            <Divider className="my-3" />

            <div
              className="my-3"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <Button
                variant="contained"
                color="primary"
                className="text-white"
                style={{
                  textDecoration: "none",
                }}
                startIcon={<AddIcon />}
                component={Link}
                to="/visitaMedica"
              >
                Nuevo
              </Button>
            </div>
            {mostrarForm && (
            <>
            {currentItems.map((option) => (
              <Col key={option.id}>
                {option.prescripciones[0]?.recetas[0] != undefined}
                <Card style={{ backgroundColor: option.activo ? "rgba(255, 255, 255)" : "rgba(199, 200, 193)" }}>
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5>Registro #{option.id}</h5>
                    {option.activo == 1 ?(
                    <div>
                      <Tooltip title="Adjuntar documento" placement="top-start">
                        <IconButton
                          aria-label="Adjuntar documento"
                          color="primary"
                          onClick={() => attachFile(option)}
                        >
                          <AttachFileIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar" placement="top-start">
                        <IconButton 
                          aria-label="Editar" 
                          color="primary"
                          onClick={() => editarVisitaModal(option)}
                          >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Suspender" placement="top-start">
                        <IconButton 
                          aria-label="Suspender" 
                          color="error" 
                          onClick={() => desactivarVisita(option)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </div>):null}
                  </Card.Header>

                  <Card.Body>
                    <div className="justify-content-center my-2">
                      <Form>
                        <Row>
                          <Col>
                            <Stack direction="row" spacing={1}>
                              <Chip
                                label={`Receta (${contador})`}
                                color={
                                  option.prescripciones[0]?.recetas[0] !=
                                  undefined
                                    ? "primary"
                                    : "default"
                                }
                                variant=""
                              />
                              <Chip
                                label="Orden de estudios"
                                color={
                                  option.prescripciones[0]?.estudios[0] !=
                                  undefined
                                    ? "primary"
                                    : "default"
                                }
                                variant=""
                              />
                              <Chip
                                label="Resultado de estudios"
                                color={
                                  option.prescripciones[0]?.estudios[0] !=
                                  undefined
                                    ? "primary"
                                    : "default"
                                }
                                variant=""
                              />
                            </Stack>
                          </Col>
                        </Row>
                      </Form>
                    </div>

                    <Table className="my-4" striped bordered hover>
                      <thead>
                        <tr>
                          <th>Fecha visita</th>
                          <th>Institucion de salud</th>
                          <th>Profesional</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{option.fechaVisita}</td>
                          <td>{option.institucionSalud.nombre}</td>
                          <td>{option.profesional.nombre}</td>
                        </tr>
                      </tbody>
                    </Table>
                    {option.diagnostico.nombre ? (
                      <Typography className="my-2">
                        Diagnostico: {option.diagnostico?.nombre}
                      </Typography>
                    ) : (
                      <Typography>Sin diagnostico.</Typography>
                    )}

                    {option.indicaciones ?(
                      <Typography className="my-2">
                        Indicaciones: {option.indicaciones}
                      </Typography>
                    ) : (
                      <Typography></Typography>
                    )}

                    <div className="container">
                      <div className="my-2">
                        {option.prescripciones.map((prescripcion) => (
                          <Accordion key={prescripcion.id}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                              <Typography>Adjuntos e Indicaciones</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                              {prescripcion.recetas.length > 0 && (
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
                                            <td>{receta.fecha}</td>
                                            <td>{receta.tipo}</td>
                                            <td>
                                              {receta.descripcion
                                                ? receta.descripcion
                                                : "Sin indicaciones disponibles"}
                                            </td>
                                            <td>
                                              {receta.url ? (
                                                <div>
                                                <Button
                                                  onClick={() =>
                                                    handleOpenModal(receta.url)
                                                  }
                                                  disabled={!receta.url}
                                                >
                                                  <VisibilityOutlinedIcon />
                                                </Button>
                                                <IconButton 
                                                  aria-label="Suspender" 
                                                  color="error" 
                                                  onClick={() => eliminarAdjunto(receta)}
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
                              {prescripcion.estudios.length > 0 && (
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
                                          <tr key={estudio.id}>
                                            <td>{estudio.fecha}</td>
                                            <td>{estudio.tipo}</td>
                                            <td>
                                              {estudio.descripcion
                                                ? estudio.descripcion
                                                : "Sin indicaciones disponibles"}
                                            </td>
                                            <td>
                                              {estudio.url ? (
                                                <div>
                                                <Button
                                                  onClick={() =>
                                                    handleOpenModal(estudio.url)
                                                  }
                                                  disabled={!estudio.url}
                                                >
                                                  <VisibilityOutlinedIcon />
                                                </Button>
                                                  <IconButton 
                                                    aria-label="Suspender" 
                                                    color="error" 
                                                    onClick={() => eliminarAdjunto(estudio)}
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
                        ))}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                <Divider className="my-2" />
              </Col>
            ))}</>)}
          </div>
        </div>

        <Modal
          show={showModal}
          onHide={handleCloseModal}
          centered
          size="lg"
          style={{ marginTop: "30px", textAlign: "center", width: "100%" }}
        >
          <Modal.Body>
            <div style={{ position: "relative", paddingTop: "100%" }}>
              <iframe
                title="PDF"
                src={pdfUrl}
                frameBorder="0"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
                allowFullScreen
              ></iframe>
            </div>
          </Modal.Body>
        </Modal>

				<ModalBase
          isOpen={modalBaseEstado}
          modalEstado={setModalBaseEstado}
        >
          <div className="container">
            <div className="col-md-12">
              <AdjuntarDocumento
                tipoDocumento={tipoDocumento}
                setTipoDocumento={setTipoDocumento}
                indicaciones={indicaciones}
                setIndicaciones={setIndicaciones}
                myFiles={myFiles}
                setMyFiles={setMyFiles}
              />
            </div>
            {myFiles.valido != null && (
              <Button
                className="my-2"
                variant="contained"
                onClick={() => {
                  saveAttachFile();
                }}
              >
                Guardar
              </Button>
            )}{" "}
            <Button
              className="my-2"
              variant="contained"
              onClick={() => {
                cancelAttachFile();
              }}
            >
              Cerrar
            </Button>
          </div>
        </ModalBase>
				<ModalEditarVisitaMedica
          title={'Editar visita medica'}
          isOpen={openTwo}
          nameButton={"Guardar"}
          modalEstado={setOpenTwo}
          estado={openTwo}
          visita={visitaEdit}
          setVisitaEdit={setVisitaEdit}
          refresh={forceUpdate}
        />
        <Dialog
              open={openConfirmDelete}
              onClose={confirmDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle className="card-header">
                <DialogContent>
                  <HelpIcon />
                  <DialogContentText id="alert-dialog-description">
                    ¿Está seguro que desea eliminar la visita medica?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={eliminarTurno}>
                    Confirmar
                  </Button>
                  <Button onClick={confirmDelete}>
                    Cancelar
                  </Button>
                </DialogActions>
              </DialogTitle>
            </Dialog>
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
export default HistoriaMedica;