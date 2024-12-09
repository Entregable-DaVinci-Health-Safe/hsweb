import AxiosHealth from "../../interceptor/axiosHealth";
import ExpReg from "../../elementos/ExpresionesReg";
import "../../css/Body.css";
import TextFieldInputComponente from "../../components/TextFieldInputComponent";
import TextFieldDropdownComponenteSimple from "../../components/TextFieldDropdownComponentSimple";
import DropdownMultiSelectPrueba from "../../components/DropdownMultiSelectPrueba";
import React, { useState, useLayoutEffect, useReducer, useRef } from "react";
import Swal from "sweetalert2";
import { Pagination } from "react-bootstrap";
import { Box, Button, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import Modal from "./ModalEditarProfesional";
import ModalConfirmar from "./ModalConfirmar";
import ModalRelacionCentroEnProfesional from "../../components/ModalRelacionCentroEnProfesional";

const AgregarProfesionalDeSalud = () => {
  const [profesionalEdit, setProfesionalEdit] = useState([]);
  const [nombre, setNombre] = useState({ campo: "", valido: null });
  const [matricula, setMatricula] = useState({ campo: "", valido: null });
  const [tipoMatriculaSelect, setTipoMatriculaSelect] = useState(['MP','MN']);
  const [tipoMatricula, setTipoMatricula] = useState({ campo: [], valido: null });
  const [mail, setMail] = useState({ campo: null, valido: null });
  const [telefono, setTelefono] = useState({ campo: "", valido: null });
  const [especialidad, setEspecialidad] = useState({ campo: [], valido: null });
  const [especialidadSelect, setEspecialidadHardcode] = useState([]);
  const [espGuardar, setEspGuardar] = useState([]);
  const [profesionalSelect, setProfesionalSelect] = useState([]);
  const [institucionSelect, setInstitucionSelect] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(true);
  const [openAsociarProfesional, setOpenAsociarProfesional] = useState(false);
  const [centroDeSalud, setCentroDeSalud] = useState({campo: "", valido: null});
  const [idSelect, setIdSelect] = useState(0);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const form = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const { idHCResponsable, nombreResponsable, apellidoResponsable } = location.state || {};
  let idHC = idHCResponsable ? idHCResponsable : localStorage.getItem("HMI");
  const [open, setOpen] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); 
  const [itemsPerPage] = useState(4);

  // Calcula el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcula el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtiene los datos de la página actual
  const currentItems = profesionalSelect.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(profesionalSelect.length / itemsPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useLayoutEffect(() => {
    Promise.all([
      AxiosHealth.get(`/historiasMedicas/${idHC}/profesionales`),
    ])
      .then((value) => {
        const profesionalesArray = Object.values(value[0].data);
        setProfesionalSelect(profesionalesArray);
      })
      .catch((error) => {
        console.error(error);
      });
      Promise.all([AxiosHealth.get(`/historiasMedicas/${idHC}/institucionesSalud`)])
      .then((value) => {
        const institucionesArray = Object.values(value[0].data);
        setInstitucionSelect(institucionesArray);
      })
      .catch((error) => {
        console.error(error);
      });
    Promise.all([AxiosHealth.get(`/especialidades/all`)])
      .then((value) => {
        const especialidadesArray = Object.values(value[0].data);
        setEspecialidadHardcode(especialidadesArray);
      })
      .catch((error) => {
        console.error(error);
      });
   }, [reducerValue]);

  useLayoutEffect(() => {
    setNombre({ campo: "", valido: null });
    setMail({ campo: "", valido: null });
    setEspecialidad({ campo: [], valido: null });
    setTipoMatricula({ campo: [], valido: null });
    setMatricula({ campo: '', valido: null });
    setTelefono({ campo: "", valido: null });
    setCentroDeSalud({ campo: "", valido: null })
    setEspGuardar([]);
    localStorage.removeItem("id_pro");
    setMostrarForm(true);
  }, [reducerValue]);

  useLayoutEffect(() => {
    if (especialidad.campo != "") {
      especialidad.campo.map((value) => (
        setEspGuardar(espGuardar =>[...espGuardar, value.id])
      ))
    }
  }, [especialidad.campo]);

  const validarObligatorio = (estado, cambiarEstado) => {
    if (estado.valido == null) {
      cambiarEstado({ ...estado, valido: false });
    } else if (estado.valido == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };

  async function agregarProfesional() {
    validarObligatorio(nombre, setNombre);
    validarObligatorio(especialidad, setEspecialidad);
    validarObligatorio(tipoMatricula, setTipoMatricula);
    validarObligatorio(matricula, setMatricula);
    if (
      nombre.valido == true &&
      especialidad.valido == true &&
      mail.valido !== false &&
      telefono.valido !== false &&
      tipoMatricula.valido == true &&
      matricula.valido == true
    ) {
      Swal.fire({
        title: `Esta seguro que desea agregar el profesional ${nombre.campo}?`,
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await AxiosHealth.post(`/profesionales`, {
            nombre: nombre.campo,
            tipoMatricula: tipoMatricula.campo,
            matricula: matricula.campo,
            idHistoriaMedica: idHC,
          }).then(async function (response) {
            localStorage.setItem("id_pro", response.data.id);
            await AxiosHealth.put(
              `/profesionales/${response.data.id}/agregarEspecialidades`,
              {
                especialidadesIds: espGuardar,
              }
            );
          });
          if (mail.valido == true || telefono.valido == true) {
            await AxiosHealth.post(
              `/profesionales/${localStorage.getItem("id_pro")}/nuevoContacto`,
              {
                mailAlternativo: mail.campo == "" ? null : mail.campo,
                telefono: telefono.campo,
              }
            );
          }
          handleClickOpenAsociarInstitucion();
        } 
      }); 
    } else {
      console.log("Algo no esta bien");
    }
  }
  
  const handleClickOpen = (id) => {
    setIdSelect(id);
    setOpen(true);
  };

  function handleClickOpenTwo(option) {
    setProfesionalEdit(option);
    setOpenTwo(true);
  }
  const handleClickOpenAsociarInstitucion = () => {
    setOpenAsociarProfesional(true);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 style={{ textAlign: "left", fontWeight: "bold", color: idHCResponsable ? 'red' : 'black' }}>
            Profesionales de salud del usuario {idHCResponsable ? `${nombreResponsable} ${apellidoResponsable}` : null}
          </h1>
        </Col>
      </Row>
      <Row>
        <Divider color="black" />
        <Row xs={1} md={2} className="g-4">
          {currentItems.map((option) => (
            <Col key={option.id}>
              <Card>
                <Card.Body style={{ textAlign: "left" }}>
                  <Card.Title style={{ fontWeight: "bold" }} className="py-2">
                    {option.nombre}
                  </Card.Title>
                  <Card.Text>
                    <ContactPageIcon /> {option.especialidades[0]?.nombre || ""}
                  </Card.Text>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel-content"
                      id="panel-header"
                    >
                      <Typography variant="h7">Ver más</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography style={{ textAlign: "left" }}>
                        <Card.Text>
                          <EmailIcon />{" "}
                          {option.contactos[0]?.mailAlternativo || ""}
                        </Card.Text>
                        <Card.Text>
                          <PhoneAndroidIcon />{" "}
                          {option.contactos[0]?.telefono || ""}
                        </Card.Text>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Divider className="my-2" />
                  <Row className="text-center">
                    <Col md={6}>
                      <Button
                        onClick={() => handleClickOpenTwo(option)}
                        startIcon={<EditIcon />}
                        variant="contained"
                        className="form-control btn-block"
                      >
                        Editar
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Button
                        onClick={() => handleClickOpen(option.id)}
                        startIcon={<DeleteIcon />}
                        variant="outlined"
                        color="error"
                        className="form-control btn-block"
                      >
                        Eliminar
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          ))}
          {
            <>
              <Modal
                isOpen={openTwo}
                nameButton={"Guardar"}
                modalEstado={setOpenTwo}
                estado={openTwo}
                idSelect={idSelect}
                profesionales={profesionalEdit}
                especialidades={especialidadSelect}
                resetId={setProfesionalEdit}
                idUsr={idHC}
                refresh={forceUpdate}
              />
              <ModalConfirmar
                isOpen={open}
                nameButton={"Confirmar"}
                modalEstado={setOpen}
                estado={open}
                idSelect={idSelect}
                objetos={profesionalSelect}
                title={"¿Esta seguro que desea eliminar al profesional?"}
                refresh={forceUpdate}
              />
            </>
          }
        </Row>
        <Col>
          <Pagination className="my-3">
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
        <Divider className="my-5" color="black" />
        <Col md={12} style={{ textAlign: "left" }}>
          <h2>
            Nuevo <AddIcon sx={{ fontSize: 45 }} />
          </h2>
          {mostrarForm && (<>
              <Form className="my-5" onSubmit={agregarProfesional}>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "50ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextFieldInputComponente
                    type="text"
                    required
                    leyendaHelper="Nombre del profesional."
                    leyendaError="El nombre tiene que ser de 4 a 16 dígitos y solo puede contener letras y espacios."
                    id="nombre_profesional"
                    label="Nombre"
                    estado={nombre}
                    cambiarEstado={setNombre}
                    expresionRegular={ExpReg.nombre}
                  />
                  <DropdownMultiSelectPrueba 
                    leyendaHelper={"Especialidad"}
                    leyendaError="Debe seleccionar una especialidad."
                    id="especialidades"
                    label="Especialidades"
                    value={especialidadSelect}
                    estado={especialidad}
                    cambiarEstado={setEspecialidad}
                  />
                  <TextFieldDropdownComponenteSimple
                    leyendaHelper={"Tipo de matricula"}
                    leyendaError="Debe seleccionar un tipo de matricula MP o MN."
                    id="tipoMatricula"
                    label="Tipo Matricula"
                    value={tipoMatriculaSelect}
                    estado={tipoMatricula}
                    cambiarEstado={setTipoMatricula}
                  />
                  <TextFieldInputComponente
                    type="text"
                    leyendaHelper="Numero de matricula del profesional."
                    leyendaError="El correo solo puede contener numeros."
                    id="matricual_profesional"
                    label="Numero de Matricual"
                    estado={matricula}
                    cambiarEstado={setMatricula}
                    expresionRegular={ExpReg.matricula}
                  />  
                  <TextFieldInputComponente
                    type="text"
                    leyendaHelper="Mail del profesional."
                    leyendaError="El correo solo puede contener letras, numeros, puntos, guiones y guion bajo."
                    id="mail_profesional"
                    label="Mail"
                    estado={mail}
                    cambiarEstado={setMail}
                    expresionRegular={ExpReg.correo}
                  />
                  <TextFieldInputComponente
                    type="text"
                    leyendaHelper="Telefono del profesional."
                    leyendaError="El telefono solo puede contener numeros y el maximo son 14 dígitos."
                    id="telefono_profesional"
                    label="Telefono"
                    estado={telefono}
                    cambiarEstado={setTelefono}
                    expresionRegular={ExpReg.telefono}
                  />
                  <Divider />
                  <ModalRelacionCentroEnProfesional 
                    setOpenAsociarProfesional={setOpenAsociarProfesional}
                    openAsociarProfesional={openAsociarProfesional} 
                    setCentroDeSalud={setCentroDeSalud} 
                    centroDeSalud={centroDeSalud} 
                    setMostrarForm={setMostrarForm} 
                    objetos={institucionSelect} 
                    refresh={forceUpdate} 
                    validarObligatorio={validarObligatorio}
                    buttonGoTo={true}
                    datosResponsable= {idHCResponsable ? { idHCResponsable, nombreResponsable, apellidoResponsable } : null}
                  />
                  <Button
                    variant="contained"
                    onClick={agregarProfesional}
                    className="my-3"
                  >
                    Agregar Profesional
                  </Button>
                </Box>
              </Form>
            </>
          )}
        </Col>
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
      </Row>
    </Container>
  );
};

export default AgregarProfesionalDeSalud;
