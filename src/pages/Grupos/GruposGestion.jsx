import React, { useState, useReducer, useLayoutEffect } from "react";
import { Container, Row, Col, Table, Card } from "react-bootstrap";
import { Link, useNavigate  } from "react-router-dom";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import EventNoteIcon from "@mui/icons-material/EventNote";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Tooltip } from "@mui/material";
import TextFieldInputComponente from "../../components/TextFieldInputComponent";
import AxiosHealth from "../../interceptor/axiosHealth";
import ExpReg from "../../elementos/ExpresionesReg";
import Swal from "sweetalert2";
import SessionService from "../../assets/sessionService";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const GruposGestion = () => {
  const [open, setOpen] = useState(false);
  const [editarNombreGrupo, setOpenEditarGrupo] = useState(false);
  const [usuarioLogeado, setUsuarioLogeado] = useState({ id: null, mail: '' });
  const [nombreGrupoEditar, setNombreGrupoEditar] = useState({ campo: "", valido: null });
  const [openAbandonar, setOpenAbandonar] = useState(false);
  const [editarMiembro, setEditarMiembro] = useState(false);
  const [admitirUsuario, setAdmitirUsuario] = useState(false);
  const [rechazarUsuario, setRechazarUsuario] = useState(false);
  const [mailInvitacion, setMailInvitacion] = useState({campo: '', valido: null});
  const [mostrarForm, setMostrarForm] = useState(true);
  const [grupo, setGrupo] = useState([]);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const grupoID = SessionService.ObtenerItem('pasoGrupo');
  const [loading, setLoading] = useState(true);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [openConfirmMessage, setOpenConfirmMessage] = useState(false);
  const [iconConfirmMessage, setIconConfirmMessage] = useState();
  const [messageGrupos, setMessageGrupos] = useState(null)
  const navigate = useNavigate();

  useLayoutEffect(()=>{
    Promise.all([AxiosHealth.get(`/gruposFamiliares/${grupoID}`)])
      .then((value) => {
        setGrupo(value[0].data)
        setLoading(false);
      })
      .catch((error) => {
        console.error(error.response.data);
        setLoading(false);
      });
      AxiosHealth.get(`/usuarios`)
      .then((value) => {
        setUsuarioLogeado({ id: value.data.id, mail: value.data.mail });
      })
      .catch((error) => {
        console.error(error);
        setUsuarioLogeado({ id: null, mail: '' });
      });
      setMostrarForm(true)
  },[reducerValue])
  

 const validarObligatorio = (estado, cambiarEstado) => {
    if (estado.valido == null) {
      cambiarEstado({ ...estado, valido: false });
    } else if (estado.valido == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };

  async function editNombreGrupo() {
		setOpenEditarGrupo(false);
    validarObligatorio(nombreGrupoEditar,setNombreGrupoEditar);
    if(nombreGrupoEditar.valido){
      Swal.fire({
        title: `Esta seguro que desea editar el nombre del grupo actual a:  ${nombreGrupoEditar.campo}?`,
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          await AxiosHealth.put(`/gruposFamiliares/${grupo.id}`, {
            nombre: nombreGrupoEditar.campo,
          })
          setMostrarForm(false)
          forceUpdate();
        }
      })
    }
  }

  async function enviarInvitacionGrupo() {
		setOpen(false);
    validarObligatorio(mailInvitacion,setMailInvitacion);
    if(mailInvitacion.valido){
      Swal.fire({
        title: `Esta seguro que desea enviar la invitacion al correo:  ${mailInvitacion.campo}?`,
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await AxiosHealth.post(`gruposFamiliares/sendInvitacion`, {
              codigo: grupo.codigo,
              usuarioMail: mailInvitacion.campo,
            });
            setIconConfirmMessage(true);
            setOpenConfirmMessage(true);
            setMessageGrupos( 'Se envio la invitacion al usuario: '+mailInvitacion.campo)
          } catch (error) {
            setIconConfirmMessage(false);
            setOpenConfirmMessage(true);
            setMessageGrupos(error.response?.data || 'Error al querer invitar el usuario')
          }
        }
      })
    }
    }
    
  const handleClickOpenAdmitirUsuario = () => {
    setAdmitirUsuario(true);
  };

  const admitrUsuarioAGrupo = async (option) => {
    await AxiosHealth.post(`gruposFamiliares/${grupo.id}/aceptarNotificacion/${option.id}`)
    setAdmitirUsuario(false);
    setMostrarForm(false)
    forceUpdate();
  }

  const rechazarNotificacionGrupo = async (option) => {
    await AxiosHealth.delete(`gruposFamiliares/deleteNotificacion/${option.id}`)
    setRechazarUsuario(false);
    setMostrarForm(false)
    forceUpdate();
  }
  
  const expulsarUsuarioGrupo = async (option) => {
    await AxiosHealth.put(`/gruposFamiliares/${grupo.id}/removerUsuario`,{
      usuarioMail : option.mail
    }).then((response)=>{
      setMessageGrupos('El usuario '+option.mail+' fue expulsado del grupo.')
      setIconConfirmMessage(false)
      setOpenConfirmMessage(true);
    })
    setEditarMiembro(false);
    setMostrarForm(false)
    forceUpdate();
  }
  
  const abandonarGrupo = async () => {
    try {
      await AxiosHealth.put(`/gruposFamiliares/${grupo.id}/removerUsuario`, {
        usuarioMail: usuarioLogeado
      });
      setEditarMiembro(false);
      navigate('/grupos');
    } catch (error) {
      console.error('Error al abandonar el grupo:', error);
      setEditarMiembro(false);
    }
  };

  const hacerloAdministrador = async (option) => {
    await AxiosHealth.put(`/gruposFamiliares/${grupo.id}/agregarAdmin`,{
      usuarioMail : option.mail
    }).then((response)=>{
      setMessageGrupos('El usuario '+option.mail+' ahora es administrador del grupo.')
      setIconConfirmMessage(true)
      setOpenConfirmMessage(true);
    } )
    setEditarMiembro(false);
    setMostrarForm(false)
    forceUpdate();
  }
  
  const eliminarloComoAdministrador = async (option) => {
    await AxiosHealth.put(`/gruposFamiliares/${grupo.id}/removerAdmin`,{
      usuarioMail : option.mail
    }).then((response)=>{
      setMessageGrupos('El usuario '+option.mail+' fue eliminado como administrador del grupo.')
      setIconConfirmMessage(false)
      setOpenConfirmMessage(true);
    })
    setEditarMiembro(false);
    setMostrarForm(false)
    forceUpdate();
  }

  const handleCloseConfirmMessage = () =>{
    setOpenConfirmMessage(false)
    setIconConfirmMessage()
    setMessageGrupos()
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenAbandonar = () => {
    setOpenAbandonar(true);
  };

  const handleCloseAbandonar = () => {
    setOpenAbandonar(false);
  };

  const handleClickOpenEditarMiembro = async (usuario) => {
    setSelectedUsuario(usuario);
    const adminStatus = grupo.admins.some(admin => admin.mail === usuario.mail);
    setIsAdmin(adminStatus);
    setEditarMiembro(true);
  };

  const handleCloseEditarMiembro = () => {
    setEditarMiembro(false);
    setSelectedUsuario(null);
    setIsAdmin(false);
  };

  const handleOpenEditarNombreGrupo = () => {
    setOpenEditarGrupo(true);
  };

  const handleCloseEditarNombreGrupo = () => {
    setOpenEditarGrupo(false);
  };


  const handleCloseAdmitirUsuario = () => {
    setAdmitirUsuario(false);
  };

  const handleClickOpenRechazarUsuario = () => {
    setRechazarUsuario(true);
  };

  const handleCloseRechazarUsuario = () => {
    setRechazarUsuario(false);
  };

  const esAdminEnGrupo = (grupo, usuarioLogeado) => {
    return grupo.admins.some(admin => admin.mail === usuarioLogeado.mail);
  };

  const registrarVisita = (id, nombre, apellido) => {
    navigate('/visitaMedica', { state: { idHCResponsable: id, nombreResponsable: nombre, apellidoResponsable: apellido } });
  };
  
  const verVisitasMedicas = (id, nombre, apellido) => {
    navigate('/informes', { state: { idHCResponsable: id, nombreResponsable: nombre, apellidoResponsable: apellido } });
  };

  function getHistoriaMedicaIdByPacienteId(data, pacienteId) {
    let historiaMedicaId = null;
  
    data.historiasMedicasResponse.some(historia => {
      if (historia.paciente.documento === pacienteId.documento) {
        historiaMedicaId = historia.id;
        return true;
      }
      return false;
    });
  
    return historiaMedicaId;
  }

  if (loading) {
    return <h1>Cargando informacion de grupos...</h1>;
  }
  return (
    <Container>
    {mostrarForm && ( <>
      <Row>
        <Col>
          <h1 style={{ textAlign: "left", fontWeight: "bold" }}>
            {grupo ? grupo.nombre : null}
            {grupo.admins.some(admin => admin.mail === usuarioLogeado.mail) ?
            <Button onClick={handleOpenEditarNombreGrupo}>
              <EditIcon sx={{ fontSize: 55, paddingBottom: "11px" }} />
            </Button>:null}
            <Dialog
              open={editarNombreGrupo}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                {"Edicion de Grupo: "+ grupo ? grupo.nombre : null}
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
                  defaultValue={grupo.nombre}
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
          </h1>
        </Col>
      </Row>
      <Row>
        <Divider color="black" />
          <Row xs={1} md={2} className="g-4" style={{ textAlign: "left" }}>
            <Col>
              <Card style={{ width: "100%", height: "100%" }}>
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <Card.Title style={{ fontWeight: "bold" }} className="py-2">
                        Miembros del Grupo
                      </Card.Title>
                    </Col>
                    <Col md={12}>
                      <Card.Text>
                        Aquí se listan los usuarios a los que actualmente
                        Administra.
                      </Card.Text>
                    </Col>
                  </Row>
                  <Divider />
                  <Row className="text-center" stripped>
                    <Col md={12}>
                      <Table className="my-3" striped bordered hover>
                        <tbody>
                        {grupo.usuarios.map((usuario) => {
                          const historiaMedicaId = getHistoriaMedicaIdByPacienteId(grupo, usuario);
                          return (
                            <tr key={usuario}>
                              <td style={{ textAlign: "left", width: "100%", fontWeight: grupo.admins.some(admin => admin.mail === usuario.mail) ? "bold" : "normal" }}>
                                {usuario.nombre + ' ' + usuario.apellido}
                              </td>
                              {esAdminEnGrupo(grupo, usuarioLogeado) ? (
                                <>
                                  <td>
                                    <Tooltip title="Gestionar Usuario" placement="right">
                                      <Button
                                        startIcon={<EditIcon />}
                                        onClick={() => handleClickOpenEditarMiembro(usuario)}
                                      ></Button>
                                    </Tooltip>
                                  </td>
                                  <td>
                                    <Tooltip title="Informe de Grupo" placement="right">
                                    <Button onClick={() => verVisitasMedicas(historiaMedicaId, usuario.nombre, usuario.apellido)}>
                                        <EventNoteIcon color="primary" />
                                      </Button>
                                    </Tooltip>
                                  </td>
                                  <td>
                                    <Tooltip title="Registrar Visita Medica" placement="right">
                                      <Button onClick={() => registrarVisita(historiaMedicaId, usuario.nombre, usuario.apellido)}>
                                        <EventNoteIcon color="primary" />
                                      </Button>
                                    </Tooltip>
                                  </td>
                                </>
                              ) : null}
                            </tr>
                          );
                        })}
                        {selectedUsuario && (
                          <Dialog
                            open={editarMiembro}
                            onClose={handleCloseEditarMiembro}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description"
                          >
                            <DialogTitle id="alert-dialog-title">
                              {"IMPORTANTE"}
                            </DialogTitle>
                            <DialogContent>
                              <DialogContentText id="alert-dialog-description">
                                Los usuarios expulsados no podrán volver a ser gestionados y ya no podrá visualizar su historial médico. Es posible que el usuario con el código de Grupo vuelva a ingresar si así lo desea.
                              </DialogContentText>
                              <DialogContentText id="alert-dialog-description">
                                En caso que otorgue permisos de administrador a un usuario, éste podrá expulsar a otros miembros, otorgar permisos de administrador e incluso expulsarlo a usted.
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions style={{ justifyContent: "center" }}>
                              {esAdminEnGrupo(grupo, usuarioLogeado) ? (
                                <>
                                  <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => expulsarUsuarioGrupo(selectedUsuario)}
                                  >
                                    Expulsar
                                  </Button>
                                  {isAdmin ? (
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      onClick={() => eliminarloComoAdministrador(selectedUsuario)}
                                      autoFocus
                                    >
                                      Eliminar como Administrador
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => hacerloAdministrador(selectedUsuario)}
                                      autoFocus
                                    >
                                      Hacerlo Administrador
                                    </Button>
                                  )}
                                </>
                              ) : null}
                              <Button
                                variant="outlined"
                                onClick={handleCloseEditarMiembro}
                                autoFocus
                              >
                                Volver
                              </Button>
                            </DialogActions>
                            <Divider className="my-1" />
                          </Dialog>
                        )}

                        </tbody>
                      </Table>
                    </Col>
                    <Divider className="my-1" />
                    <Col style={{ textAlign: "left" }} md={6}>
                      {esAdminEnGrupo(grupo, usuarioLogeado)? (
                        <>
                        <Button variant="contained" onClick={handleClickOpen}>
                          Invitar nuevo Miembro
                        </Button>
                        <Dialog
                          open={open}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            {"IMPORTANTE"}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              Para que el usuario pueda ingresar a su grupo, deberá
                              acceder mediante el código de invitación que se le
                              enviará al correo electrónico que ingrese a
                              continuación.
                            </DialogContentText>
                            <TextFieldInputComponente
                              required
                              type="text"
                              leyendaHelper="Debe ingresar un correo valido de un usuario registrado en la plataforma."
                              leyendaError="El correo solo puede contener letras, numeros, puntos, guiones y guion bajo."
                              id="Mail_ivitacion_grupo"
                              label="Mail para envio de la invitación"
                              estado={mailInvitacion}
                              cambiarEstado={setMailInvitacion}
                              expresionRegular={ExpReg.correo}
                            />
                          </DialogContent>
                          <DialogActions style={{ justifyContent: "center" }}>
                            <Button variant="contained" onClick={enviarInvitacionGrupo}>
                              Enviar Invitacion
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={handleClose}
                              autoFocus
                            >
                              Volver
                            </Button>
                          </DialogActions>
                          <Divider className="my-1" />
                        </Dialog>
                        <Dialog
                          open={openConfirmMessage}
                          onClose={handleCloseConfirmMessage}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle className="card-header">
                            <DialogContent>
                             {iconConfirmMessage ? < CheckCircleIcon /> : < CancelIcon />}
                             
                              <DialogContentText id="alert-dialog-description">
                                {messageGrupos}
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleCloseConfirmMessage}>
                                Aceptar
                              </Button>
                            </DialogActions>
                          </DialogTitle>
                        </Dialog>
                        </>):null}
                    </Col>

                    <Col style={{ textAlign: "left" }} md={6}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={handleClickOpenAbandonar}
                      >
                        Abandonar Grupo
                      </Button>
                      <Dialog
                        open={openAbandonar}
                        onClose={handleCloseAbandonar}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          {"IMPORTANTE"}
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Si abandona el grupo perderá sus privilegios de
                            administrador. Podrá volver a ingresar al Grupo si el
                            nuevo Administrador lo invita a participar del grupo y
                            eventualmente pudiera ser asignado como Administrador.
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions style={{ justifyContent: "center" }}>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => abandonarGrupo()}
                          >
                            Abandonar
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={handleCloseAbandonar}
                            autoFocus
                          >
                            Volver
                          </Button>
                        </DialogActions>
                        <Divider className="my-1" />
                      </Dialog>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>

            <Col>
              <Card style={{ width: "100%", height: "100%" }}>
                <Card.Body>
                  <Row>
                    <Col md={12}>
                      <Card.Title style={{ fontWeight: "bold" }} className="py-2">
                        Solicitudes de union
                      </Card.Title>
                    </Col>
                    <Col md={12}>
                      <Card.Text>
                        Aquí se listan las usuarios que solicitaron ingresar al
                        Grupo.
                      </Card.Text>
                    </Col>
                  </Row>
                  <Divider className="my-2" />
                  <Row className="text-center" stripped>
                    <Col>
                      <Table striped bordered hover>
                        <tbody>
                          {grupo.notificaciones.map((notificacion)=>(
                            <tr>
                              <td style={{ textAlign: "left", width: "100%" }}>
                                {notificacion.usuarioNombre +' '+notificacion.usuarioMail}
                              </td>
                              <td>
                                <Button onClick={handleClickOpenAdmitirUsuario}>
                                  Admitir
                                </Button>
                                <Dialog
                                  open={admitirUsuario}
                                  onClose={handleCloseAdmitirUsuario}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle id="alert-dialog-title">
                                    {"IMPORTANTE"}
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      Los miembros de su grupo podrán abandonar el
                                      mismo cuando lo deseen. A su vez, como
                                      administrador tendrá la posibilidad de
                                      expulsarlos o ascenderlos a Administrador
                                      cuando usted lo desee.
                                    </DialogContentText>
                                    <DialogContentText id="alert-dialog-description">
                                      En caso de que la solicitud de admisión sea
                                      rechazada, el usuario podrá enviar una nueva
                                      en el futuro.
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions
                                    style={{ justifyContent: "center" }}
                                  >
                                    <Button
                                      variant="contained"
                                      onClick={() => admitrUsuarioAGrupo(notificacion)}
                                    >
                                      Confirmar Admision
                                    </Button>
                                    <Button
                                      variant="outlined"
                                      onClick={handleCloseAdmitirUsuario}
                                      autoFocus
                                    >
                                      Volver
                                    </Button>
                                  </DialogActions>
                                  <Divider className="my-1" />
                                </Dialog>
                              </td>
                              <td>
                                <Button
                                  onClick={handleClickOpenRechazarUsuario}
                                  color="error"
                                >
                                  Rechazar
                                </Button>

                                <Dialog
                                  open={rechazarUsuario}
                                  onClose={handleCloseRechazarUsuario}
                                  aria-labelledby="alert-dialog-title"
                                  aria-describedby="alert-dialog-description"
                                >
                                  <DialogTitle id="alert-dialog-title">
                                    {"IMPORTANTE"}
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                      {`Confirmando esta acción denegará el ingreso al
                                      grupo al usuario ${notificacion.usuarioNombre}. En caso de que la
                                      solicitud de admisión sea rechazada, el
                                      usuario podrá enviar una nueva en el futuro`}
                                    </DialogContentText>
                                  </DialogContent>
                                  <DialogActions
                                    style={{ justifyContent: "center" }}
                                  >
                                    <Button
                                      variant="outlined"
                                      color="error"
                                      onClick={() => rechazarNotificacionGrupo(notificacion)}
                                    >
                                      Rechazar
                                    </Button>
                                    <Button
                                      variant="contained"
                                      onClick={handleCloseRechazarUsuario}
                                      autoFocus
                                    >
                                      Volver
                                    </Button>
                                  </DialogActions>
                                  <Divider className="my-1" />
                                </Dialog>
                                
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
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
    </>)}
    </Container>
  );
};

export default GruposGestion;
