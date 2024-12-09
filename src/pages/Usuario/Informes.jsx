import { Button, Form, Row, Col, Table, Card, Toast } from "react-bootstrap";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DoneIcon from '@mui/icons-material/Done';
import { ColorLensTwoTone } from "@mui/icons-material";
import { Link, useNavigate  } from "react-router-dom";

function Documentos() {
  const navigate = useNavigate();

  return (
    <>
      <h1 className="my-5">Informes</h1>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="justify-content-center">
              <Form>
                <Row>
                  <Col md={4}>
                    <p className="text-start">Fecha inicio</p>
                    <Form.Control type="date" />
                  </Col>
                  <Col md={4}>
                    <p className="text-start">Fecha fin</p>
                    <Form.Control type="date" />
                  </Col>
                  <Col md={4}>
                    <p className="text-start">Categoria</p>
                    <Form.Select defaultValue="0">
                      <option value="0">Seleccionar</option>
                      <option value="1">Visitas medicas</option>
                      <option value="2">Vacunas</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Form>
            </div>

            <div className="justify-content-center my-4">
              <Form>
                <Row>
                  <Col md={4}>
                    <p className="text-start">Profesional</p>
                    <Form.Select defaultValue="0">
                      <option value="0">Seleccionar</option>
                      <option value="1">Profesional Uno</option>
                      <option value="2">Profesional Dos</option>
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <p className="text-start">Centros de Salud</p>
                    <Form.Select defaultValue="0">
                      <option value="0">Seleccionar</option>
                      <option value="1">Centro Uno</option>
                      <option value="2">Centro Dos</option>
                    </Form.Select>
                  </Col>
                  <Col md={4}>
                    <p className="text-start">Especialidades</p>
                    <Form.Select defaultValue="0">
                      <option value="0">Seleccionar</option>
                      <option value="1">Especialidad 1</option>
                      <option value="2">Especialidad 2</option>
                      <option value="3">Especialidad 3</option>
                    </Form.Select>
                  </Col>
                </Row>
              </Form>
            </div>

            <div className="justify-content-center my-5">
              <Form>
                <Row>
                  <Col>
                    <Button
                      variant="primary"
                      type="button"
                      className="form-control btn-block"
                    >
                      Buscar
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="secondary"
                      type="button"
                      className="form-control btn-block"
                    >
                      Limpiar filtros
                    </Button>
                  </Col>
                  <Col>
                    <Button
                      variant="success"
                      type="button"
                      className="form-control btn-block"
                    >
                      Exportar resultado a PDF
                    </Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-3">
        <div className="row">
          <div className="col-md-12">
            <Card className="my-1">
              <Card.Header className="text-start">
                <h5>dd/mm/aaaa</h5>
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
														doneIcon={<DoneIcon />}
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

                <Table className="my-4" striped bordered hover>
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
                      <td>dd/mm/aaaa</td>
                      <td>Nombre del centro de salud</td>
                      <td>Nombre del profesional</td>
                      <td>Descripción del diagnóstico</td>
                    </tr>
                  </tbody>
                </Table>

                <div className="container">
                  <h5 className="text-start my-2">Indicaciones</h5>
                  <p className="text-start">
                    Tomar 1 comprimido de Amoxicilina 500mg cada 8 horas por un
                    periodo de 7 días para tratar la infección en la muela.
                    Comenzar el tratamiento lo antes posible y continuar hasta
                    completar los 7 días, incluso si los síntomas de la
                    infección desaparecen antes. Si experimenta efectos
                    secundarios como dolor abdominal intenso, diarrea o
                    erupciones cutáneas, suspenda el tratamiento y consulte a su
                    médico de inmediato
                  </p>
                </div>
              </Card.Body>
            </Card>

            <Card className="my-1">
              <Card.Header className="text-start">dd/mm/aaaa</Card.Header>
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Fecha visita</th>
                      <th>Centro de salud</th>
                      <th>Profesional</th>
                      <th>Diagnóstico</th>
                      <th>Indicaciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>dd/mm/aaaa</td>
                      <td>Nombre del centro de salud</td>
                      <td>Nombre del profesional</td>
                      <td>Descripción del diagnóstico</td>
                      <td>Descripción de las indicaciones</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
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
export default Documentos;