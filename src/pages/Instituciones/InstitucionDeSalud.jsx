import AxiosHealth from "../../interceptor/axiosHealth";
import ExpReg from "../../elementos/ExpresionesReg";
import "../../css/Body.css";
import TextFieldInputComponente from "../../components/TextFieldInputComponent";
import TextFieldDireccionComponente from "../../components/TextFieldDireccionComponent";
import ModalRelacionProfesionalEnCentro from "../../components/ModalRelacionProfesionalEnCentro";
import React, { useState, useLayoutEffect, useReducer, useRef } from "react";
import Swal from "sweetalert2";
import { Pagination } from "react-bootstrap";
import { Box, Button, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EmailIcon from "@mui/icons-material/Email";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HelpIcon from "@mui/icons-material/Help";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import Modal from "./ModalEditarInstitucion";
import ModalConfirmar from "./ModalConfirmar";

const AgregarInstitucionDeSalud = () => {
  const [institucionesEdit, setInstitucionesEdit] = useState([]);
  const [nombre, setNombre] = useState({ campo: "", valido: null });
  const [mail, setMail] = useState({ campo: "", valido: null });
  const [telefono, setTelefono] = useState({ campo: "", valido: null });
  const [direccion, setDireccion] = useState({ campo: "", valido: null });
  const [piso, setPiso] = useState({ campo: "", valido: null });
  const [departamento, setDepartamento] = useState({ campo: "", valido: null });
  const [referencia, setReferencia] = useState({ campo: "", valido: null });
  const [provincia, setProvincia] = useState({ campo: "", valido: null });
  const [localidad, setLocalidad] = useState({ campo: "", valido: null });
  const [barrio, setBarrio] = useState({ campo: "", valido: null });
  const [institucionSelect, setInstitucionSelect] = useState([]);
  const [profesionalSelect, setProfesionalSelect] = useState([]);
  const [profesional, setProfesional] = useState({ campo: "", valido: null });
  const [mostrarCamposAdicionales, setMostrarCamposAdicionales] = useState(false);
  const [profGuardar, setProfGuardar] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(true);
  const [address, setAddress] = useState({ campo: null, valido: null });
  const [idSelect, setIdSelect] = useState(0);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const form = useRef();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  const [openAsociarProfesional, setOpenAsociarProfesional] = useState(false);
  const { idHCResponsable, nombreResponsable, apellidoResponsable } = location.state || {};
  let idHC = idHCResponsable ? idHCResponsable : localStorage.getItem("HMI");
  
  useLayoutEffect(() => {
    Promise.all([AxiosHealth.get(`/historiasMedicas/${idHC}/institucionesSalud`)])
      .then((value) => {
        const institucionesArray = Object.values(value[0].data);
        setInstitucionSelect(institucionesArray);
      })
      .catch((error) => {
        console.error(error.response.data);
      });
    Promise.all([AxiosHealth.get(`/historiasMedicas/${idHC}/profesionales`)])
      .then((value) => {
        const profesionalesArray = Object.values(value[0].data);
        setProfesionalSelect(profesionalesArray);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [reducerValue]);

  //Paginador
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage] = useState(4); // Número de elementos por página

  // Calcula el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcula el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtiene los datos de la página actual
  const currentItems = institucionSelect.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula el número total de páginas
  const totalPages = Math.ceil(institucionSelect.length / itemsPerPage);

  // Cambia la página actual
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useLayoutEffect(() => {
    if (address.valido == true) {
      if (address.campo.route != "") {
        setDireccion({
          campo: address.campo.route + " " + address.campo.street_number,
          valido: true,
        });
        setProvincia({ campo: address.campo.province, valido: true });
        setLocalidad({ campo: address.campo.locality, valido: true });
        setBarrio({ campo: address.campo.adm_area, valido: true });
      }
      if (address.campo.route.length > 3) {
        setMostrarCamposAdicionales(true);
      } else {
        setMostrarCamposAdicionales(false);
      }
    }
  }, [address]);

  useLayoutEffect(() => {
    setNombre({ campo: "", valido: null });
    setMail({ campo: "", valido: null });
    setTelefono({ campo: "", valido: null });
    setAddress({ campo: [], valido: null });
    setDireccion({ campo: "", valido: null });
    setPiso({ campo: "", valido: null });
    setDepartamento({ campo: "", valido: null });
    setReferencia({ campo: "", valido: null });
    setProfesional({ campo: "", valido: null });
    setProfGuardar([]);
    localStorage.removeItem("id_cen");
    setMostrarForm(true);
  }, [reducerValue]);

  const validarObligatorio = (estado, cambiarEstado) => {
    if (estado.valido == null) {
      cambiarEstado({ ...estado, valido: false });
    } else if (estado.valido == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };

  async function agregarInstitucion() {
    validarObligatorio(nombre, setNombre);
    validarObligatorio(direccion, setDireccion);
    if (!direccion.valido) {
      setAddress({ ...address, valido: false });
    }
    if (
      nombre.valido == true &&
      mail.valido !== false &&
      telefono.valido !== false &&
      direccion.valido == true &&
      piso.valido !== false
    ) {
      Swal.fire({
        title: `Esta seguro que desea agregar la institucion ${nombre.campo}?`,
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          handleClickOpenAsociarProfesional();
          await AxiosHealth.post(`/institucionesSalud`, {
            nombre: nombre.campo,
            historiaMedicaId: idHC,
            direccion: {
              direccion: direccion.campo,
              localidad: localidad.campo,
              provincia: provincia.campo,
              barrio: barrio.campo,
              piso: piso.campo,
              departamento: departamento.campo,
              referencia: referencia.campo,
            },
          }).then(async function (response) {
            localStorage.setItem("id_cen", response.data.id);
          });
          if (mail.valido == true || telefono.valido == true) {
            await AxiosHealth.post(
              `/institucionesSalud/${localStorage.getItem("id_pro")}/nuevoContacto`,
              {
                mailAlternativo: mail.campo == "" ? null : mail.campo,
                telefono: telefono.campo,
              }
            );
          }
          handleClickOpenAsociarProfesional()
        }
      });
    } 
   
  }
  
  const handleClickOpen = (id) => {
    setIdSelect(id);
    setOpen(true);
  };

  const handleClickOpenAsociarProfesional = () => {
    setOpenAsociarProfesional(true);
  };
  
  return (
    <Container>
      <Row>
        <Col>
          <h1 style={{ textAlign: "left", fontWeight: "bold", color: idHCResponsable ? 'red' : 'black' }}>
            Intituciones de salud del usuario {idHCResponsable ? `${nombreResponsable} ${apellidoResponsable}` : null}
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
                        <Card.Text>
                          <LocationOnIcon /> {option.direccion?.direccion || ""}
                        </Card.Text>
                        <Card.Text>
                          <LocationOnIcon /> Piso:{" "}
                          {option.direccion?.piso || ""} {"|"} Departamento:{" "}
                          {option.direccion?.departamento || ""}
                        </Card.Text>
                        <Card.Text>
                          <HelpIcon />{" "}
                          {option.direccion?.referencia || "Referencia"}
                        </Card.Text>
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                  <Divider className="my-2" />
                  <Row className="text-center">
                    <Col md={6}>
                      <Button
                        onClick={() => {
                          setInstitucionesEdit(option);
                          setOpenTwo(true);
                        }}
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
          {<>
            <Modal
              isOpen={openTwo}
              nameButton={"Guardar"}
              modalEstado={setOpenTwo}
              estado={openTwo}
              instituciones={institucionesEdit}
              resetId={setInstitucionesEdit}
              idUsr={idHC}
              refresh={forceUpdate}
            />
            <ModalConfirmar
              isOpen={open}
              nameButton={"Confirmar"}
              modalEstado={setOpen}
              estado={open}
              idSelect={idSelect}
              objetos={institucionSelect}
              title={"¿Esta seguro que desea eliminar la institucion?"}
              refresh={forceUpdate}
            />
          </>}
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
        <Divider className="my-3" color="black" />
        <Col md={12} style={{ textAlign: "left" }}>
          <h2>
            Nuevo <AddIcon sx={{ fontSize: 45 }} />
          </h2>
          {mostrarForm && (
            <>
              <Form ref={form} className="my-3" onSubmit={agregarInstitucion}>
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
                    leyendaHelper="Razon Social."
                    leyendaError="La Razon Social solo puede contener letras, numeros, puntos, guiones y guion bajo."
                    id="nombre_institucion"
                    label="Razon Social"
                    estado={nombre}
                    cambiarEstado={setNombre}
                    expresionRegular={ExpReg.nombre}
                  />
                  <TextFieldInputComponente
                    type="text"
                    leyendaHelper="Mail de la institucion."
                    leyendaError="El correo solo puede contener letras, numeros, puntos, guiones y guion bajo."
                    id="mail_institucion"
                    label="Mail"
                    estado={mail}
                    cambiarEstado={setMail}
                    expresionRegular={ExpReg.correo}
                  />
                  <TextFieldInputComponente
                    type="text"
                    leyendaHelper="Telefono de la institucion."
                    leyendaError="El telefono solo puede contener numeros y el maximo son 14 dígitos."
                    id="telefono_institucion"
                    label="Telefono"
                    estado={telefono}
                    cambiarEstado={setTelefono}
                    expresionRegular={ExpReg.telefono}
                  />
                  <TextFieldDireccionComponente
                    type="text"
                    leyendaHelper="Direccion de la institucion."
                    leyendaError="El la direccion debe tener minimo 4 caracteres."
                    id="direccion_institucion"
                    label="Direccion"
                    estado={address}
                    cambiarEstado={setAddress}
                    expresionRegular={ExpReg.direccion}
                  />
                  {mostrarCamposAdicionales && (
                    <>
                      <TextFieldInputComponente
                        type="text"
                        leyendaHelper="Piso si corresponde."
                        leyendaError="El piso debe tener maximo 2 caracteres."
                        id="piso_direccion_institucion"
                        label="Piso"
                        estado={piso}
                        cambiarEstado={setPiso}
                        expresionRegular={ExpReg.piso}
                      />
                      <TextFieldInputComponente
                        type="text"
                        leyendaHelper="Departamento si corresponde."
                        id="departamento_direccion_institucion"
                        label="Departamento"
                        estado={departamento}
                        cambiarEstado={setDepartamento}
                      />
                      <TextFieldInputComponente
                        type="text"
                        leyendaHelper="Referencia (opcional)."
                        id="referencia_direccion_institucion"
                        label="Referencia (opcional)"
                        estado={referencia}
                        cambiarEstado={setReferencia}
                      />
                    </>
                  )}
                  <Divider />
                  <ModalRelacionProfesionalEnCentro 
                    setOpenAsociarProfesional={setOpenAsociarProfesional}
                    openAsociarProfesional={openAsociarProfesional} 
                    setProfesional={setProfesional} 
                    profesional={profesional} 
                    setMostrarForm={setMostrarForm} 
                    objetos={profesionalSelect} 
                    refresh={forceUpdate} 
                    validarObligatorio={validarObligatorio}
                    profGuardar={profGuardar}
                    setProfGuardar={setProfGuardar}
                    buttonGoTo={true}
                    datosResponsable= {idHCResponsable ? { idHCResponsable, nombreResponsable, apellidoResponsable } : null}
                  />
                  <Button
                    variant="contained"
                    onClick={agregarInstitucion}
                    className="my-5"
                  >
                    Agregar Institucion
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
export default AgregarInstitucionDeSalud;
