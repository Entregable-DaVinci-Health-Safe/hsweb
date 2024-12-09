import React, { useLayoutEffect, useState, useReducer, useRef } from "react";
import { Container, Row, Col, Form, Card } from "react-bootstrap";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Link, useNavigate  } from "react-router-dom";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { createTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Pagination } from "react-bootstrap";
import AxiosHealth from "../../interceptor/axiosHealth";
import TextFieldAutocompleteComponentMedicaciones from "../../components/TextFieldAutocompleteComponentMedicaciones";
import TextFieldDropdownComponente from "../../components/TextFieldDropdownComponent";
import TextFieldTxAreaComponente from "../../components/TextFieldTxAreaComponent";
import ModalEditarMedicacionHabitual from "./ModalEditarMedicacionHabitual";
import Swal from "sweetalert2";

const MedicacionHabitual = () => {
  let idHC = localStorage.getItem("HMI");
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const form = useRef();
  const [mostrarContenido, setMostrarContenido] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(true);
  const [medicamentosUsuario, setMedicamentosUsuario] = useState([]);
  const [drogaMedicamento, setDrogaMedicamento] = useState({campo: "", valido: null});
  const [productoSelect, setProductoSelect] = useState([]);
  const [productoElegido, setProductoElegido] = useState({campo: "",valido: null});
  const [comentarioMedicamento, setComentarioMedicamento] = useState({campo: "", valido: null});
  const [nombreMedicamento, setNombreMedicamento] = useState({campo: "", valido: null});
  const [medicamentoEditar, setMedicamentoEditar] = useState([]);
  const [open, setOpen] = useState(false);
  const [openTwo, setOpenTwo] = useState(false);
  const [openThree, setOpenThree] = useState(false);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    setDrogaMedicamento({ campo: "", valido: null });
    setProductoSelect([]);
    setProductoElegido({ campo: "", valido: null });
    setComentarioMedicamento({ campo: "", valido: null });
    setOpen(false);
    setOpenTwo(false);
    setOpenThree(false);
    setMostrarForm(true);
  }, [reducerValue]);

  useLayoutEffect(() => {
    setMedicamentosUsuario([]);
    Promise.all([AxiosHealth.get(`historiasMedicas/${idHC}/medicamentos`)])
      .then((value) => {
        setMedicamentosUsuario(value[0].data);
      })
      .catch((error) => {
        console.error(error);
      });
    setMostrarContenido(true);
  }, [reducerValue]);

  useLayoutEffect(() => {
    if (drogaMedicamento.campo != "") {
      drogaMedicamento.campo.productos.length != 0
        ? setProductoSelect(drogaMedicamento.campo.productos)
        : setProductoSelect([]);
    }
  }, [drogaMedicamento]);

  const eliminarMedicamento = async (medicamentoID) => {
    await AxiosHealth.delete(
      `/historiasMedicas/eliminarMedicamentos/${medicamentoID}`
    );
    handleClose()
    setMostrarContenido(false);
    forceUpdate();
  };

  const validarObligatorio = (estado, cambiarEstado) => {
    if (estado.valido == null) {
      cambiarEstado({ ...estado, valido: false });
    } else if (estado.valido == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };

  function agregarMedicacion() {
    validarObligatorio(productoElegido, setProductoElegido);
    if (productoElegido.valido == true) {
      Swal.fire({
        title: `Esta seguro que desea agregar el profesional ${nombreMedicamento.campo}?`,
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await AxiosHealth.post(`/historiasMedicas/agregarMedicamentos`, {
            comentarios: comentarioMedicamento.campo,
            cantidad: 0,
            presentacion: 'test',
            historiaMedicaId: idHC,
            medicamentoProductoId: productoElegido.campo.id,
          }).then(async function (response) {
            setMostrarForm(false);
            setMostrarContenido(true);
            forceUpdate();
          });
        }
      });
    }
  }
  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleClickOpenTwo(option) {
    setMedicamentoEditar(option);
    setOpenTwo(true);
  }

  //Paginador
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage] = useState(2); // Número de elementos por página

  // Calcula el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcula el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtiene los datos de la página actual
  const currentItems = medicamentosUsuario.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula el número total de páginas
  const totalPages = Math.ceil(medicamentosUsuario.length / itemsPerPage);

  // Cambia la página actual
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <Row>
        <Col className="my-3">
          <h1 style={{ textAlign: "left", fontWeight: "bold" }}>
            Medicacion Habitual
          </h1>
        </Col>
      </Row>
      <Row xs={1} md={2} className="g-4 my-5">
        {mostrarContenido && (
          <>
            {currentItems.map((medicamento) => (<>
                <Col>
                  <Card>
                    <Card.Body style={{ textAlign: "left" }}>
                      <Row>
                        <Col md={7}>
                          <Card.Title
                            style={{ fontWeight: "bold" }}
                            className="py-2"
                          >
                            {medicamento.medicamento.nombre}
                          </Card.Title>
                        </Col>
                      </Row>
                      <Divider />
                      <Card.Text>
                        {medicamento.medicamento.producto.nombre}
                      </Card.Text>
                      <Card.Text>
                        Comentarios: {medicamento.comentarios}
                      </Card.Text>
                      <Row className="text-center">
                        <Col md={6}>
                          <Button
                            onClick={() => handleClickOpenTwo(medicamento)}
                            startIcon={<EditIcon />}
                            variant="contained"
                            className="form-control btn-block"
                          >
                            Editar
                          </Button>
                        </Col>
                        <Col md={6}>
                          <Button
                            onClick={handleClickOpen}
                            startIcon={<DeleteIcon />}
                            variant="outlined"
                            color="error"
                            className="form-control btn-block"
                          >
                            Eliminar
                          </Button>
                          <Dialog
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <DialogTitle className="card-header">
                              <DeleteForeverIcon />
                              <DialogContent>
                                <DialogContentText id="alert-dialog-description">
                                  ¿Esta seguro que desea eliminar la Medicacion?
                                </DialogContentText>
                              </DialogContent>
                              <DialogActions>
                                <Button
                                  onClick={() =>
                                    eliminarMedicamento(medicamento.id)
                                  }
                                >
                                  Confirmar
                                </Button>
                                <Button onClick={handleClose} autoFocus>
                                  Cancelar
                                </Button>
                              </DialogActions>
                            </DialogTitle>
                          </Dialog>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </>
            ))}
          </>
        )}
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
      <h2>
        Nuevo <AddIcon sx={{ fontSize: 45 }} />
      </h2>
      <Col md={12} style={{ textAlign: "left" }}>
        {mostrarForm && (<>
          <Form ref={form} className="my-3" onSubmit={agregarMedicacion}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextFieldAutocompleteComponentMedicaciones
                leyendaHelper={"Escriba al menos 4 letras para iniciar una busqueda"}
                leyendaError="Debe escribir el la droga del medicamento."
                id="droga"
                label="Droga principal del medicamento"
                estado={drogaMedicamento}
                cambiarEstado={setDrogaMedicamento}
              />
              <TextFieldDropdownComponente
                leyendaHelper={"Generico"}
                leyendaError="Debe seleccionar un medicamento."
                id="medicamento"
                label="Medicamento"
                value={productoSelect}
                estado={productoElegido}
                cambiarEstado={setProductoElegido}
              />
              <TextFieldTxAreaComponente
                type="Textarea"
                leyendaHelper="Comentarios."
                id="comentarios_medicamento"
                label="Comentarios"
                estado={comentarioMedicamento}
                cambiarEstado={setComentarioMedicamento}
              />
              <Divider />
              <Button
                variant="contained"
                onClick={agregarMedicacion}
                className="my-3"
              >
                Agregar Medicacion
              </Button>
            </Box>
          </Form>
        </>)}
      </Col>
      {<>
        <ModalEditarMedicacionHabitual
          isOpen={openTwo}
          nameButton={"Guardar"}
          modalEstado={setOpenTwo}
          estado={openTwo}
          setMedicamentoEditar={setMedicamentoEditar}
          medicamentoEditar={medicamentoEditar}
          idUsr={idHC}
          refresh={forceUpdate}
        />
      </>}
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
  );
};

export default MedicacionHabitual;
