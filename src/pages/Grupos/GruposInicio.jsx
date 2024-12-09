import React, { useState, useLayoutEffect, useReducer } from "react";
import { Container, Row, Col, Table, Card } from "react-bootstrap";
import { Link, useNavigate  } from "react-router-dom";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Modal from "../../components/ModalBase";
import Swal from "sweetalert2";
import TextFieldInputComponente from "../../components/TextFieldInputComponent";
import AxiosHealth from "../../interceptor/axiosHealth";
import ExpReg from "../../elementos/ExpresionesReg";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import SessionService from "../../assets/sessionService";

const Grupos = () => {
  let idHC = localStorage.getItem("HMI");
  const [openModal, setOpenModal] = useState(false);
  const [openNuevoGrupo, setOpenNuevoGrupo] = useState(false);
  const [openEditarGrupo, setOpenEditarGrupo] = useState(false);
  const [editarNombreGrupo, setEditarNombreGrupo] = useState([])
  const [nombreGrupoEditar, setNombreGrupoEditar] = useState({ campo: "", valido: null });
  const [nombreGrupo, setNombreGrupo] = useState({ campo: "", valido: null });
  const [mostrarForm, setMostrarForm] = useState(true);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [gruposCreados, setGruposCreados] = useState([]);
  const [codigoUnirseGrupo, setCodigoUnirseGrupo] = useState({campo: '', valido: null});
  const [usuarioLogeado, setUsuarioLogeado] = useState()
  const navigate = useNavigate();
  
  useLayoutEffect(() => {
    Promise.all([AxiosHealth.get(`/historiasMedicas/${idHC}/gruposFamiliares`)])
    .then((value) => {
      setGruposCreados(value[0].data)
    })
    .catch((error) => {
      console.error(error);
      setGruposCreados([])
    });
    setMostrarForm(true)
    AxiosHealth.get(`/usuarios`)
      .then((value) => {
        setUsuarioLogeado(value.data.mail);
      })
      .catch((error) => {
        console.error(error);
        setUsuarioLogeado();
      });
  }, [reducerValue]); 

  //Validador obligatorio
  const validarObligatorio = (estado, cambiarEstado) => {
    if (estado.valido == null) {
      cambiarEstado({ ...estado, valido: false });
    } else if (estado.valido == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };

  async function agregarGrupo() {
		setOpenModal(false);
    validarObligatorio(nombreGrupo,setNombreGrupo);
    if(nombreGrupo.valido){
      Swal.fire({
        title: `Esta seguro que desea agregar el grupo ${nombreGrupo.campo}?`,
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await AxiosHealth.post(`/gruposFamiliares`, {
            nombre: nombreGrupo.campo,
            })
          setMostrarForm(false)
          handleCloseNuevoGrupo();
          forceUpdate();
        }
      })
    }
  }
  
  async function eliminarGrupo(option) {
    Swal.fire({
      title: `Esta seguro que desea eliminar el grupo ${option.nombre}?`,
      showDenyButton: true,
      confirmButtonText: "Si",
      denyButtonText: `No`,
    }).then(async (result) => {
      if (result.isConfirmed) {
        await AxiosHealth.delete(`/gruposFamiliares/${option.id}/eliminar`)
        setMostrarForm(false)
        handleCloseNuevoGrupo();
        forceUpdate();
      }
    })
  }

  async function editNombreGrupo() {
    validarObligatorio(nombreGrupoEditar,setNombreGrupoEditar);
    if(nombreGrupoEditar.valido){
      Swal.fire({
        title: `Esta seguro que desea editar el nombre del grupo actual a:  ${nombreGrupoEditar.campo}?`,
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await AxiosHealth.put(`/gruposFamiliares/${editarNombreGrupo.id}`, {
            nombre: nombreGrupoEditar.campo,
          })
          setMostrarForm(false)
        }
      })
    }
  }

  async function unirseAGrupo() {
    validarObligatorio(codigoUnirseGrupo,setCodigoUnirseGrupo);
    if(codigoUnirseGrupo.valido){
      console.log('aca')
      await AxiosHealth.get(`/usuarios`)
      .then((result)=>{
        const mailUsuario = result.data.mail
        Swal.fire({
          title: `Esta seguro que desea ingresar al grupo?`,
          showDenyButton: true,
          confirmButtonText: "Si",
          denyButtonText: `No`,
        }).then(async (result) => {
          if (result.isConfirmed) {
            console.log('codigo: '+ codigoUnirseGrupo.campo + ' - usuario: ' + mailUsuario)
            await AxiosHealth.post(`/gruposFamiliares/sendNotificacion`, {
              codigo: codigoUnirseGrupo.campo,
              usuarioMail: mailUsuario,
            })
            setMostrarForm(false)
            handleCloseNuevoGrupo();
            forceUpdate();
          }
        })
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  const handleOpenNuevoGrupo = () => {
    setOpenModal(true)
    setOpenNuevoGrupo(true);
  };

  const handleViajar = (grupo) => {
    SessionService.GuardarItem('pasoGrupo', grupo.id);
 };

  const handleCloseNuevoGrupo = () => {
    setOpenModal(false)
    setOpenNuevoGrupo(false);
  };

  function handleOpenEditarNombreGrupo (option){
    console.log(option)
    setEditarNombreGrupo(option);
    setOpenModal(true);
    setOpenEditarGrupo(true);
  };

  const handleCloseEditarNombreGrupo = () => {
    setOpenModal(false);
    setOpenEditarGrupo(false);
  };

  const esAdminEnGrupo = (grupo, usuarioLogeado) => {
    return grupo.admins.some(admin => admin.mail === usuarioLogeado);
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 style={{ textAlign: "left", fontWeight: "bold" }}>Grupos</h1>
        </Col>
      </Row>
      <Row>
        <Divider color="black" />

        <Row xs={1} md={2} className="g-4" style={{ textAlign: "left" }}>
        {mostrarForm && (<>
          <Col>
            <Card style={{ width: "100%", height: "100%" }}>
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <Card.Title style={{ fontWeight: "bold" }} className="py-2">
                      Mis Grupos
                    </Card.Title>
                  </Col>
                  <Col md={12}>
                    <Card.Text>
                      Aquí se listan los grupos a los que perteneces como
                      Administrador y a los que te hayas unido como Invitado.
                    </Card.Text>
                  </Col>
                </Row>
                <Divider />
                {gruposCreados.map((option) => (
                  <Row key={option.id} className="text-center" stripped>
                    <Col md={8}>
                      <Table className="my-3" striped bordered hover>
                        <tbody>
                          <tr>
                            <td style={{ textAlign: "left", width: "100%" }}>
                              {option.nombre}
                            </td>
                            <td>
                              <div>
                                <Button component={Link} to="/gruposGestion" onClick={()=>handleViajar(option)} >
                                  <VisibilityOutlinedIcon color="primary"/>
                                </Button>
                                {option.admins && esAdminEnGrupo(option, usuarioLogeado)? (
                                  <>
                                    <Button onClick={()=>handleOpenEditarNombreGrupo(option)}> 
                                      <EditIcon color="primary" />
                                    </Button>
                                    <Button onClick={()=>eliminarGrupo(option)} >
                                      <DeleteIcon color="error" />
                                    </Button>
                                  </>) : null}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                ))}
                  <Divider className="my-1" />
                    <Col style={{ textAlign: "left" }} md={4}>
                      <Button variant="contained" onClick={handleOpenNuevoGrupo}>
                        Nuevo Grupo
                      </Button>
                    </Col>
                    <Modal
                      isOpen={openModal}
                      modalEstado={setOpenModal}
                    >
                      <Dialog
                        open={openNuevoGrupo}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Nuevo Grupo"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Por favor ingrese el nombre que desea asignarle al
                            nuevo grupo. EL mismo podra ser editado en el futuro
                            si asi lo desea.
                          </DialogContentText>
                          <TextFieldInputComponente
                            type="text"
                            required
                            leyendaHelper="Nombre del nuevo grupo."
                            leyendaError="El nombre tiene que ser de 4 a 16 dígitos y solo puede contener letras y espacios."
                            id="nombre_nuevo_grupo"
                            label="Nombre nuevo grupo"
                            estado={nombreGrupo}
                            cambiarEstado={setNombreGrupo}
                            expresionRegular={ExpReg.nombre}
                          />
                        </DialogContent>
                        <DialogActions style={{ justifyContent: "center" }}>
                          <Button variant="contained" onClick={() => agregarGrupo()}>
                            Crear
                          </Button>
                          <Button onClick={handleCloseNuevoGrupo} autoFocus>
                            Volver
                          </Button>
                        </DialogActions>
                        <Divider className="my-1" />
                      </Dialog>
                      <Dialog
                        open={openEditarGrupo}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"Edicion de Grupo: "+ editarNombreGrupo.nombre}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            El mismo podrá ser editado nuevamente en el futuro si así lo
                            desea.
                          </DialogContentText>
                          <TextFieldInputComponente
                            type="text"
                            required
                            leyendaHelper="Nuevo nombre para el grupo."
                            leyendaError="El nombre tiene que ser de 4 a 16 dígitos y solo puede contener letras y espacios."
                            id="editar_nombre_grupo"
                            label="Nombre nuevo para el grupo"
                            estado={nombreGrupoEditar}
                            cambiarEstado={setNombreGrupoEditar}
                            expresionRegular={ExpReg.nombre}
                            defaultValue={editarNombreGrupo.nombre}
                          />
                        </DialogContent>
                        <DialogActions style={{ justifyContent: "center" }}>
                          <Button
                            variant="contained"
                            onClick={editNombreGrupo}
                          >
                            Cambiar
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={handleCloseEditarNombreGrupo}
                            autoFocus
                          >
                            Volver
                          </Button>
                        </DialogActions>
                        <Divider className="my-1" />
                      </Dialog>
                      
                    </Modal>
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card style={{ width: "100%", height: "100%" }}>
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <Card.Title style={{ fontWeight: "bold" }} className="py-2">
                      Unirse a un Grupo
                    </Card.Title>
                  </Col>
                  <Col md={12}>
                    <Card.Text>
                      Para ingresar a un Grupo, debe solicitar un código de
                      invitacion, el mismo lo receptara mediante correo
                      electrónico.
                    </Card.Text>
                  </Col>
                </Row>
                <Divider className="my-4"/>
                <Row className="text-center" stripped>
                  <Col md={8}>
                    <TextFieldInputComponente
                      required
                      type="text"
                      leyendaHelper="Debe ingresar un codigo valido recibido por correo."
                      leyendaError="El codigo es invalido, valide el codigo recibido y vuelva a intentar"
                      id="Codigo_unirse_grupo"
                      label="Ingresar código de invitación"
                      estado={codigoUnirseGrupo}
                      cambiarEstado={setCodigoUnirseGrupo}
                    />
                  </Col>
                  <Divider />
                  <Col style={{ textAlign: "left" }} md={4}>
                    <Button variant="contained"  onClick={unirseAGrupo}>Unirse</Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
          </>)}
        </Row>

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

export default Grupos;
