import React, { useState, useEffect, useLayoutEffect, useReducer, useRef } from "react";
import { Container, Row, Col, Table, Card } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import { Link, useNavigate  } from "react-router-dom";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import PhotoIcon from "@mui/icons-material/Photo";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Stack } from "@mui/material";
import { Slider } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import { Avatar } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import RotateRightIcon from "@mui/icons-material/RotateRight";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import { Tooltip } from "@mui/material";
import { Modal } from "react-bootstrap";
import DeleteIcon from "@mui/icons-material/Delete";
import EnhancedEncryptionIcon from "@mui/icons-material/EnhancedEncryption";
import TextFieldPassWordComponente from "../../components/TextFieldPasswordComponent";
import TextFieldInputComponente from "../../components/TextFieldInputComponent";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpReg from "../../elementos/ExpresionesReg";
import AxiosHealth from "../../interceptor/axiosHealth";
import ModalEditarDatosPersonales from "./ModalEditarDatosPersonales";

//Documentos
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseApp from "../../assets/context";
import AvatarEditor from "react-avatar-editor";

//Tema
import { useThemeContext } from '../../Theme/ThemeContext';
import { set } from "date-fns";

const Perfil = () => {
  const [open, setOpen] = useState(false);
  const [agregarContacto, setAgregarContacto] = useState(false);
  const [eliminarContacto, setEliminarContacto] = useState(false);
  const [idContact, setIdContact] = useState(null);
  const [changePassword, setChangePassword] = useState(false);
  const [messageChangePasswor, setMessageChangePasswor] = useState(null);
  const [openConfirmChangePassword, setOpenConfirmChangePassword] = useState(false);
  const [messageCreateContactos, setMessageCreateContactos] = useState(null);
  const [messageCreateTelefono, setMessageCreateTelefono] = useState(null);
  const [usuarioEdit, setUsuarioEdit] = useState([]);
  const [openModalEditarPerfil, setOpenModalEditarPerfil] = useState(false);
  

  /****************************************************/
  const [passwordActual, setPasswordActual] = useState({ campo: "", valido: null });
  const [password, setPassword] = useState({ campo: "", valido: null });
  const [password2, setPassword2] = useState({ campo: "", valido: null });
  const [usuario, setUsuario] = useState(null);
  const [myFiles, setMyFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [mail, setMail] = useState({ campo: "", valido: null });
  const [telefono, setTelefono] = useState({ campo: "", valido: null });
  const [mostrarForm, setMostrarForm] = useState(true);
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const form = useRef();
  const navigate = useNavigate();
  /*****************************************************/

  // Tema
  const { contextTheme } = useThemeContext();

  useLayoutEffect(() => {
    setMyFiles([]);
    setUsuario([]);
    setMail({ campo: "", valido: null });
    setTelefono({ campo: "", valido: null });
    setMostrarForm(true);
    setIsLoading(true);
  }, [reducerValue]);

  useLayoutEffect(() => {
    AxiosHealth.get(`/usuarios`)
      .then((res) => {
        setUsuario(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar usuario:", error);
        setIsLoading(false);
      });
  }, [reducerValue]);

  const handleClickOpen = () => {
    //Aplicar editando informacion personal
    setOpen(true);
  };

  const handleClose = () => {
    //Aplicar editando informacion personal
    setOpen(false);
  };

  // Agregar contacto
  const handleClickOpenAgregarContacto = () => {
    setAgregarContacto(true);
  };

  const handleCloseAgregarContacto = () => {
    setMail({ campo: "", valido: null });
    setTelefono({ campo: "", valido: null });
    setAgregarContacto(false);
    setMessageCreateContactos(null)
    setMessageCreateTelefono(null)
  };
  
 //Editar
 function openEditModalPerfil() {
  setUsuarioEdit(usuario);
  setOpenModalEditarPerfil(true);
}
  
  const openDeleteContacto = (option) => {
    setIdContact(option.id)
    setEliminarContacto(true);
  };

  const deleteContacto = () => {
    if(idContact!=null){
      AxiosHealth.delete(`usuarios/eliminarContacto`, {
        data: {
          contactoId: idContact,
        },
      }).then(() =>{
        setEliminarContacto(false);
        setMostrarForm(false)
        forceUpdate();
      })
    }
  };
  
  const changePasswordFunction = () => {
    validarObligatorio(passwordActual, setPasswordActual);
    validarObligatorio(password, setPassword);
    validarObligatorio(password2, setPassword2);
    if (
      passwordActual.campo !='' &&
      password.valido == true &&
      allRequirementsMet == true
    ) {
      AxiosHealth.put(`usuarios/cambiarPassword`, {
        oldPassword: passwordActual.campo,
        newPassword: password.campo,
      }).then((response) =>{
        console.log(response)
        setPasswordActual({ campo: "", valido: null })
        setPassword({ campo: "", valido: null })
        setPassword2({ campo: "", valido: null })
        setChangePassword(false);
        setMessageChangePasswor(null);
        setMessageCreateContactos(null);
        setMessageCreateTelefono(null);
        setOpenConfirmChangePassword(true);
      }).catch((error)=>setMessageChangePasswor(error.response.data))
    }
  };

  const handleCloseConfirmChangePassword = () =>{
    setOpenConfirmChangePassword(false)
  }
  
  const checkRequirement = (regex, password) => regex.test(password.campo);
  const allRequirementsMet = ExpReg.requirements.every((req) =>
    checkRequirement(req.regex, password)
  );
    
  //Validador obligatorio
  const validarObligatorio = (estado,cambiarEstado) =>{
    if(estado.valido==null){
      cambiarEstado({...estado, valido : false});
    }else if(estado.valido==''){
      cambiarEstado({...estado, valido : false});
    }
  }
  //Validador de PSS
  const validarPassword2 = () => {
    if (password.campo.length > 0) {
      if (password.campo !== password2.campo) {
        setPassword2((prevState) => {
          return { ...prevState, valido: false };
        });
      } else {
        setPassword2((prevState) => {
          return { ...prevState, valido: true };
        });
      }
    }
  };

  const validarContactDate = (mail,telefono) =>{
    console.log(usuario.contactos)
    const existeCorreo = usuario.contactos.some(contacto => contacto.mailAlternativo === mail.campo);
    const existeTelefono = usuario.contactos.some(contacto => contacto.telefono === telefono.campo);
   
    if (existeCorreo || existeTelefono) {
        existeCorreo ? setMessageCreateContactos('El correo ya existe dentro de los contactos alternativos') : setMessageCreateContactos(null);
        existeTelefono ? setMessageCreateTelefono('El telefono ya existe dentro de los contactos alternativos') : setMessageCreateTelefono(null);
        return false; 
    } else {
        return true;
    }
  }

  async function nuevoContacto() {
    if(validarContactDate(mail,telefono)){  
      if(mail.valido == true || telefono.valido == true){
        AxiosHealth.post(`usuarios/nuevoContacto`, {
          telefono: telefono.campo != ''? telefono.campo : null,
          mailAlternativo: mail.campo!= ''?mail.campo:null,
        }).then(() =>{
          setAgregarContacto(false);
          setMostrarForm(false)
          forceUpdate();
        })
      }
    }
  }

  //Cambiar contraseña
  const handleOpenChangePassword = () => {
    setChangePassword(true);
  };

  const handleCloseChangePassword = () => {
    setPasswordActual({ campo: "", valido: null })
    setPassword({ campo: "", valido: null })
    setPassword2({ campo: "", valido: null })
    setChangePassword(false);
    setMessageChangePasswor(null);
  };

  //Cambiar imagen de perfil
 
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };


  useLayoutEffect(() => {
    if (myFiles.length > 1) {
        try{
          AxiosHealth.put(`/usuarios/actualizarImagen`, {
            imgPerfil: myFiles,
          });

        }catch (error){
          console.error(error)
        }
        finally{
          setMostrarForm(false);
          setTimeout(() => forceUpdate(),1000)
          
        }
    }
  }, [myFiles]);

  //Firebase

  const [image, setImage] = useState(null);
  const avatarEditorRef = useRef(null);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      let imageDataUrl = await readFile(file);
      setImage(imageDataUrl);
      handleOpenModal();
    }
  };

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }

  const [rotation, setRotation] = useState(0);

  const rotarLeft = () => {
    setRotation((prevRotation) => prevRotation - 90);
  };

  const rotarRight = () => {
    setRotation((prevRotation) => prevRotation + 90);
  };

  const [zoom, setZoom] = useState(1);

  const modificarZoom = (event, newValue) => {
    setZoom(newValue);
  };

  const aumentarZoom = () => {
    if (zoom < 10) {
      setZoom(zoom + 1);
    }
  };

  const disminuirZoom = () => {
    if (zoom > 1) {
      setZoom(zoom - 1);
    }
  };

  const subirImagen = async () => {
    // Obtener la imagen directamente del AvatarEditor
    const canvas = avatarEditorRef.current.getImage();

    // Convertir la imagen del canvas a Blob
    await new Promise((resolve) => canvas.toBlob(resolve)).then((blob) => {
      // Obtener el nombre del archivo original desde el input de tipo file
      const fileInput = document.getElementById("file-input"); // Asigna un id a tu input de tipo file
      const fileName = fileInput.files[0].name;

      // Subir el Blob a Firebase Storage con el nombre del archivo original
      const storage = getStorage(firebaseApp);
      const storageRef = ref(storage, "images/" + fileName);

      uploadBytes(storageRef, blob).then(async () => {
        // Obtener la URL de descarga
        const downloadURL = await getDownloadURL(storageRef);
        console.log("URL de descarga:", downloadURL);
        setMyFiles(downloadURL);
        handleCloseModal();
      });
    });
  };

  const inputRef = React.useRef(null);

  const onButtonClick = () => {
    inputRef.current.click();
  };
  if (isLoading) {
    // Mostrar un indicador de carga mientras los datos no están disponibles.
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h3>Cargando datos del perfil...</h3>
      </div>
    );
  }

  if (!usuario) {
    // Mostrar un mensaje si no se cargaron datos.
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h3>No se pudo cargar el perfil del usuario.</h3>
      </div>
    );
  }
  return (
    (mostrarForm && <>
    <Container className={contextTheme}>
      <Row>
        <Col>
          <h1 style={{ textAlign: "left", fontWeight: "bold" }}>Perfil</h1>
        </Col>
      </Row>
      <Row>
        <Divider color="black" />

        <Row xs={1} md={2} className="g-4" style={{ textAlign: "left" }}>
          <Col>
            <Row>
              <Col md={12}>
                <Card style={{ width: "25rem" }}>
                  {usuario.imgPerfil ? (
                    <Card.Img variant="top" src={usuario.imgPerfil} />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "40vh",
                      }}
                    >
                      <Avatar style={{ width: 350, height: 350 }}>
                        <PersonIcon style={{ width: 400, height: 400 }} />
                      </Avatar>
                    </div>
                  )}
                  <Card.Body>
                    <Tooltip
                      title="Cambiar imagen de perfil"
                      placement="bottom"
                    >
                      <div className="file-input-container">
                        <Button variant="contained" onClick={onButtonClick}>
                          Selecciona una imagen
                        </Button>
                        <input
                          type="file"
                          onChange={onFileChange}
                          accept="image/*"
                          ref={inputRef}
                          style={{ display: "none" }}
                          id="file-input"
                        />
                      </div>
                    </Tooltip>
                  </Card.Body>
                  <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    centered
                    size="lg"
                  >
                    <Modal.Body>
                      <div className="artdeco-modal artdeco-modal--layer-default image-selector-modal">
                        <Modal.Header closeButton>
                          <Modal.Title className="custom-title">
                            <b>Actualizar foto</b>
                          </Modal.Title>
                        </Modal.Header>

                        <div>
                          <Stack
                            spacing={2}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            textAlign="center"
                          >
                            <div className="cropContainer">
                              <AvatarEditor
                                ref={avatarEditorRef}
                                image={image}
                                width={320}
                                height={300}
                                border={0}
                                borderRadius={150}
                                scale={zoom}
                                rotate={rotation}
                              />
                            </div>
                            <Stack
                              spacing={2}
                              direction="row"
                              sx={{ width: "100%", mx: "auto" }}
                              alignItems="center"
                              justifyContent="center"
                            >
                              <RotateRightIcon onClick={rotarRight} />
                              <RotateLeftIcon onClick={rotarLeft} />
                            </Stack>

                            <Stack
                              spacing={2}
                              direction="row"
                              sx={{
                                width: 550,
                                justifyContent: "flex-start",
                                alignItems: "center",
                              }}
                            >
                              <RemoveIcon onClick={disminuirZoom} />
                              <Slider
                                aria-label="Volume"
                                value={zoom}
                                onChange={modificarZoom}
                                min={1}
                                max={10}
                                valueLabelDisplay="auto"
                              />
                              <AddIcon onClick={aumentarZoom} />
                            </Stack>
                          </Stack>
                        </div>

                        <Modal.Footer>
                          <Stack spacing={2} direction="row">
                            <Button
                              variant="outlined"
                              onClick={handleCloseModal}
                            >
                              Cancelar
                            </Button>

                            <Button variant="contained" onClick={subirImagen}>
                              Guardar
                            </Button>
                          </Stack>
                        </Modal.Footer>
                      </div>
                    </Modal.Body>
                  </Modal>
                </Card>
              </Col>
              <Col md={12}></Col>
            </Row>

            <Row className="my-2 text-center" stripped>
              <Col md={12}>
                <Card style={{ width: "25rem", textAlign: "left" }}>
                  <Card.Body>
                    <Card.Title>{usuario.nombre+' ' +usuario.apellido}</Card.Title>
                    <ul>
                      <li>{'Fecha de nacimiento: '+usuario.fechaNacimiento}</li>
                      <li>{'Genero de nacimeinto: '+usuario.genero}</li>
                      <li> {'Mail: '+usuario.mail} </li>
                      <li> {'DNI: ' + usuario.documento} </li>
                    </ul>
                    <Button variant="contained" onClick={openEditModalPerfil}>
                      Editar informacion personal
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Col>
          {/* Arranca segunda seccion */}
          <Col>
            <Card style={{ width: "100%", height: "100%" }}>
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <Card.Title style={{ fontWeight: "bold" }} className="py-2">
                      Contactos alternativos
                    </Card.Title>
                  </Col>
                  <Col md={12}>
                    <Card.Text>
                      Puedes agregar un telefono y configurar un mail
                      alternativo.
                    </Card.Text>

                    <Button
                      variant="contained"
                      onClick={handleClickOpenAgregarContacto}
                    >
                      Agregar
                    </Button>
                    <Dialog
                      open={agregarContacto}
                      onClose={handleCloseAgregarContacto}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle>{'Agregar contacto'}</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          El sistema permite multiples contactos alternativos.
                        </DialogContentText>

                        <div className="my-2"></div>
                        <TextFieldInputComponente
                          required
                          type="text"
                          leyendaHelper="mail@dominio.com"
                          leyendaError="El correo solo puede contener letras, numeros, puntos, guiones y guion bajo."
                          id="Mail_Usuario_Registrar"
                          label="Correo electronico"
                          estado={mail}
                          cambiarEstado={setMail}
                          expresionRegular={ExpReg.correo}
                        />
                        
                        <div className="my-2"></div>
                        <TextFieldInputComponente
                          required
                          type="text"
                          leyendaHelper="Telefono"
                          leyendaError="Telefono debe tener solo numeros entre 7 digitos y 14 digitos maximo."
                          id="Telefono_Usuario_Alternativo"
                          label="Telefono alternativo"
                          estado={telefono}
                          cambiarEstado={setTelefono}
                          expresionRegular={ExpReg.telefono}
                        />
                        <DialogContentText className="my-2">
                            <p>{messageCreateContactos}</p>
                            <p>{messageCreateTelefono}</p>
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions style={{ justifyContent: "center" }}>
                        {mail.valido == true || telefono.valido == true ?
                          <Button variant="contained" onClick={nuevoContacto}>
                            Agregar
                          </Button>
                        :null
                        }
                        <Button
                          variant="outlined"
                          onClick={handleCloseAgregarContacto}
                          autoFocus
                        >
                          Volver
                        </Button>
                      </DialogActions>
                      <Divider className="my-1" />
                    </Dialog>
                    <Dialog
                      open={eliminarContacto}
                      onClose={()=>setEliminarContacto(false)}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle>Eliminar contacto</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Esta seguro que desea eliminar el contacto alternativo?
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions style={{ justifyContent: "center" }}>
                        <Button variant="contained" onClick={deleteContacto}>
                            Eliminar
                          </Button>
                        
                        <Button
                          variant="outlined"
                          onClick={()=>setEliminarContacto(false)}
                          autoFocus
                        >
                          Volver
                        </Button>
                      </DialogActions>
                      <Divider className="my-1" />
                    </Dialog>
                  </Col>
                </Row>
                <Divider className="my-2" />
                <Row className="text-center" stripped>
                  <Col>
                    <Table className="my-3" striped bordered hover>
                      <thead></thead>
                      <tbody>
                        {usuario.contactos.map((contacto) => (
                          <tr>
                            <td style={{ textAlign: "left" }}>
                              {contacto.mailAlternativo}
                            </td>
                            <td style={{ textAlign: "left" }}>
                              {contacto.telefono}
                            </td>
                            <td>
                              <Tooltip title="Eliminar" placement="bottom">
                                <Button  onClick={()=>openDeleteContacto(contacto)}>
                                  <DeleteIcon />
                                </Button>
                              </Tooltip>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <Divider className="my-5" />

                    {/* Arranca tercera seccion */}
                    <Row>
                      <Col md={12}>
                        <Card.Title
                          style={{ fontWeight: "bold" }}
                          className="py-2"
                        >
                          Seguridad de la cuenta <EnhancedEncryptionIcon />
                        </Card.Title>
                      </Col>
                      <Col md={12}>
                        <Card.Text>
                          Puedes cambiar tu contraseña cada vez que lo desees.
                        </Card.Text>
                        <Button
                          variant="contained"
                          onClick={handleOpenChangePassword}
                        >
                          Cambiar
                        </Button>
                        <Dialog
                          open={changePassword}
                          onClose={handleCloseChangePassword}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            {"Cambiar contraseña"}
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText className="my-2">
                              La misma podra ser modificada nuevamente en el
                              futuro si así lo desea.
                            </DialogContentText>
                            <Col md={8}>
                              <TextFieldPassWordComponente
                                required
                                type="text"
                                leyendaHelper="Ingrese su contraseña actual."
                                leyendaError={messageChangePasswor ? messageChangePasswor: "La contraseña tiene que ser de 8 a 20 dígitos."}
                                id="Contraseña_Usuario_Actual"
                                label="Ingrese contraseña actual"
                                estado={passwordActual}
                                cambiarEstado={setPasswordActual}
                              />
                            </Col>
                            <Divider className="my-1" />
                            <Col md={8}>
                              <TextFieldPassWordComponente
                                required
                                type="text"
                                leyendaHelper="Ingrese su contraseña nueva."
                                leyendaError="La contraseña tiene que ser de 8 a 20 dígitos."
                                id="Contraseña_Usuario_Nueva"
                                label="Ingrese contraseña nueva"
                                estado={password}
                                cambiarEstado={setPassword}
                                expresionRegular={ExpReg.password}
                              />
                            </Col>
                            <ul>
                              {ExpReg.requirements.map((req, index) => (
                                <li
                                  key={index}
                                  style={{
                                    color: checkRequirement(req.regex, password)
                                      ? "green"
                                      : "red",
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <span style={{ marginRight: "8px" }}>
                                    {checkRequirement(req.regex, password) ? "✔" : "✘"}
                                  </span>
                                  {req.label}
                                </li>
                              ))}
                            </ul>
                            <Divider className="my-1" />
                            <Col md={8}>
                              <TextFieldPassWordComponente
                                required
                                type="text"
                                leyendaHelper="Repita su contraseña nueva."
                                leyendaError="Las contraseñas deben coincidir."
                                id="Contraseña_Usuario_nueva_repetida"
                                label="Repetir Contraseña nueva"
                                estado={password2}
                                cambiarEstado={setPassword2}
                                funcion={validarPassword2}
                              />
                            </Col>
                            <DialogContentText className="my-2">
                              {messageChangePasswor}
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions style={{ justifyContent: "center" }}>
                            <Button
                              variant="contained"
                              onClick={changePasswordFunction}
                            >
                              Cambiar
                            </Button>
                            <Button
                              variant="outlined"
                              onClick={handleCloseChangePassword}
                              autoFocus
                            >
                              Volver
                            </Button>
                          </DialogActions>
                          <Divider className="my-1" />
                        </Dialog>
                        <Dialog
                          open={openConfirmChangePassword}
                          onClose={handleCloseConfirmChangePassword}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle className="card-header">
                            <DialogContent>
                              <CheckCircleIcon />
                              <DialogContentText id="alert-dialog-description">
                                ¡Su contraseña fue modificada con exito!
                              </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={handleCloseConfirmChangePassword}>
                                Confirmar
                              </Button>
                            </DialogActions>
                          </DialogTitle>
                        </Dialog>
                        <ModalEditarDatosPersonales
                          isOpen={openModalEditarPerfil}
                          nameButton={"Guardar"}
                          modalEstado={setOpenModalEditarPerfil}
                          estado={openModalEditarPerfil}
                          datos={usuarioEdit}
                          refresh={forceUpdate}
                          update={setMostrarForm}
                        />
                      </Col>
                    </Row>
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
    </Container>
    </>)
  );
};

export default Perfil;
