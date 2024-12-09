import { Container, Row, Table } from "react-bootstrap";
import { Col } from "react-bootstrap";
import Button from "@mui/material/Button";
import { Link, useNavigate  } from "react-router-dom";
import Divider from "@mui/material/Divider";
import React, { useState, useLayoutEffect, useReducer, useRef } from "react";
import AxiosHealth from "../../interceptor/axiosHealth";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { IconButton } from "@mui/material";
import { Pagination } from "react-bootstrap";

const Documentos = () => {
  let idHC = localStorage.getItem("HMI");
  const [documentosUsuario, setDocumentosUsuario] = useState([]);
  const [filtroApply, setFiltroApply] = useReducer((x) => x + 1, 0);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const navigate = useNavigate();

  useLayoutEffect(() => {
    Promise.all([
      AxiosHealth.get(`/historiasMedicas/${idHC}/visitasMedicasWithDocuments`),
    ])
      .then((value) => {
        const documentos = Object.values(value[0].data).flatMap((visitas) =>
          visitas.prescripciones.flatMap((prescripcion) => [
            ...prescripcion.recetas.map((receta) => ({
              ...receta,
              visitaId: visitas.id,
            })),
            ...prescripcion.estudios.map((estudio) => ({
              ...estudio,
              visitaId: visitas.id,
            })),
          ])
        );
        setDocumentosUsuario(documentos);
      })
      .catch((error) => {
        console.error(error);
      });
    setMostrarForm(true);
  }, [filtroApply]); 

  const eliminarAdjunto = async (option) => {
    Swal.fire({
      title: `Esta seguro que desea eliminar el documento?`,
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        option.tipo == "Receta"
          ? await AxiosHealth.delete(
              `/prescripciones/${idHC}/recetas/${option.id}`
            )
          : await AxiosHealth.delete(
              `/prescripciones/${idHC}/estudios/${option.id}`
            );
        setMostrarForm(false);
        setFiltroApply();
      }
    });
  };

  
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = (url) => {
    setPdfUrl(url);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  //Paginador
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage] = useState(5); // Número de elementos por página

  // Calcula el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcula el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtiene los datos de la página actual
  const currentItems = documentosUsuario.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula el número total de páginas
  const totalPages = Math.ceil(documentosUsuario.length / itemsPerPage);

  // Cambia la página actual
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 style={{ textAlign: "left", fontWeight: "bold" }}>Documentos</h1>
        </Col>
      </Row>

      <Divider color="black" className="my-5" />
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

      {mostrarForm && (
        <>
          {currentItems.map((option) => (
            <Row>
              <Col>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Visita Medica</th>
                      <th>Fecha de carga</th>
                      <th>Tipo</th>
                      <th>Descripcion</th>
                      <th>Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>#{option.visitaId}</td>
                      <td>{option.fecha}</td>
                      <td>{option.tipo}</td>
                      <td>{option.descripcion}</td>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          onClick={() => handleOpenModal(option.url)}
                        >
                          <VisibilityOutlinedIcon />
                        </Button>
                        <IconButton
                          aria-label="Suspender"
                          color="error"
                          onClick={() => eliminarAdjunto(option)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  </tbody>
                </Table>

                <Modal
                  show={showModal}
                  onHide={handleCloseModal}
                  centered
                  size="lg"
                  style={{
                    marginTop: "30px",
                    textAlign: "center",
                    width: "100%",
                  }}
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
              </Col>
            </Row>
          ))}
        </>
      )}

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

export default Documentos;
