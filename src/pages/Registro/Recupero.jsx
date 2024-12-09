import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Row, Col } from "react-bootstrap";
import Paper from "@mui/material/Paper";
import { FormControl, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Logo from "../../components/Logo";
import Loading from "../../components/Loading";
import TextFieldInputComponente from "../../components/TextFieldInputComponent";
import TextFieldPassWordComponente from "../../components/TextFieldPasswordComponent";
import ExpReg from "../../elementos/ExpresionesReg";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import AxiosHealth from "../../interceptor/axiosHealth";
import "../../css/LoginRegister.css";

const Recupero = () => {
  localStorage.clear();
  const [mail, setMail] = useState({ campo: "", valido: null });
  const [isLoading, setIsLoading] = useState(false);
  const [openValidacionCodigo, setOpenValidacionCodigo] = useState(false);
  const [codigoValidacion, setCodigoValidacion] = useState({campo: "", valido: null});
  const [correoElectornico, setCorreoElectornico] = useState({campo: "", valido: null});
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [openSuccessDialogDialogChangePassword, setOpenSuccessDialogChangePassword] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [password, setPassword] = useState({ campo: "", valido: null });
  const [password2, cambiarPassword2] = useState({ campo: "", valido: null });
  const checkRequirement = (regex, password) => regex.test(password.campo);
  const allRequirementsMet = ExpReg.requirements.every((req) =>
    checkRequirement(req.regex, password)
  );
  const navigate = useNavigate();

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      recuperarUsuario();
    }
  };

  const validarObligatorio = (estado, cambiarEstado) => {
    if (estado.valido == null) {
      cambiarEstado({ ...estado, valido: false });
    } else if (estado.valido == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };

  const validarPassword2 = () => {
    if (password.campo.length > 0) {
      if (password.campo !== password2.campo) {
        cambiarPassword2((prevState) => {
          return { ...prevState, valido: false };
        });
      } else {
        cambiarPassword2((prevState) => {
          return { ...prevState, valido: true };
        });
      }
    }
  };

  const validarCodigo = () => {
    validarObligatorio(codigoValidacion, setCodigoValidacion);
    validarObligatorio(correoElectornico, setCorreoElectornico);
    validarObligatorio(password, setPassword);
    validarObligatorio(password2, cambiarPassword2);
    if (
      codigoValidacion.valido == true &&
      correoElectornico.valido == true &&
      password.valido == true &&
      allRequirementsMet == true
    ) {
      setIsLoading(true);
      AxiosHealth.put("usuarios/resetPassword", {
        codigo: codigoValidacion.campo,
        mail: correoElectornico.campo,
        password: password.campo,
      })
        .then(function (response) {
          setDialogMessage(
            "Usted realizo correctamente la recuperacion de su clave."
          );
          setOpenSuccessDialogChangePassword(true);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.request.status === 404) {
            setDialogMessage(error.request.response);
            setOpenErrorDialog(true);
          } else if (error.request.status === 417) {
            setDialogMessage(error.request.response);
            setOpenErrorDialog(true);
          }
          console.log("Mensaje del servidor: " + error.request.response);
          console.log("Numero de error " + error.request.status);
        });
    }
  };

  function recuperarUsuario() {
    validarObligatorio(mail, setMail);
    if (mail.valido == true) {
      setIsLoading(true);
      AxiosHealth.put("usuarios/recuperarCuenta", {
        mail: mail.campo,
      })
        .then(function (response) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("idUsuario", response.data.usuarioId);
          setDialogMessage(
            "Hemos enviado una codigo de validacion para que haga el proceso de cambio de clave."
          );
          setOpenSuccessDialog(true);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          if (error.request.status === 404) {
            setDialogMessage(
              "El mail ingresado no corresponde a un usuario registrado."
            );
            setOpenErrorDialog(true);
          }
          console.log("Mensaje del servidor: " + error.request.response);
          console.log("Numero de error " + error.request.status);
        });
    }
  }

  return (
    <div id="FondoLogin">
      <>
        {isLoading && <Loading message={"Generando nueva contraseña..."} />}
        <div id="Posicionar-Carta">
          <Paper elevation={1} id="Carta">
            <div id="Posicionar-Container">
              <Logo />
              <Container>
                <Row>
                  <Col md={12}>
                    <form
                      className="my-5"
                      method="put"
                      onKeyDown={handleKeyDown}
                    >
                      <h5 style={{ textAlign: "center" }}>
                        Ingrese el mail con el cual se registro.
                      </h5>
                      <FormControl className="my-3" method="post" id="Input">
                        <TextFieldInputComponente
                          type="text"
                          required
                          id="mail_inicio_sesion"
                          label="Mail"
                          estado={mail}
                          cambiarEstado={setMail}
                          leyendaHelper="mail@dominio"
                          leyendaError="El correo solo puede contener letras, numeros, puntos, guiones y guion bajo."
                          expresionRegular={ExpReg.correo}
                        />
                      </FormControl>
                      <Col>
                        <Button
                          sx={{ width: "70%", height: "46px" }}
                          variant="contained"
                          className="form-control btn-block"
                          onClick={() => recuperarUsuario()}
                        >
                          Recuperar
                        </Button>
                      </Col>
                      <Col className="my-2">
                        <Button
                          variant="contained"
                          color="primary"
                          className="text-white"
                          style={{
                            textDecoration: "none",
                          }}
                          component={Link}
                          onClick={() => navigate(-1)}
                        >
                          Volver
                        </Button>
                      </Col>
                    </form>
                  </Col>
                </Row>
              </Container>
            </div>
          </Paper>
        </div>
        <Dialog
          open={openValidacionCodigo}
          onClose={() => setOpenValidacionCodigo(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Form>
            <Box
              component="form"
              sx={{"& > :not(style)": { m: 1, width: "50ch" },}}
              noValidate
              autoComplete="off"
            >
              <DialogTitle className="card-header">
                <EditIcon />
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <h5>
                      Ingrese el codigo recibido por mail y su correo
                      electronico para validar los datos
                    </h5>
                  </DialogContentText>
                </DialogContent>
                <Row>
                  <Col md={8}>
                    <TextFieldInputComponente
                      type="text"
                      id="Codigo de validacion"
                      label="Codigo de validacion"
                      estado={codigoValidacion}
                      cambiarEstado={setCodigoValidacion}
                      leyendaError={"Debe ingresar el codigo recibido por correo"}
                    />
                  </Col>
                  <Divider className="my-1" />
                  <Col md={8}>
                    <TextFieldInputComponente
                      type="text"
                      id="Correo electronico usuario"
                      label="Correo electronico usuario"
                      estado={correoElectornico}
                      cambiarEstado={setCorreoElectornico}
                      expresionRegular={ExpReg.mail}
                      leyendaError={"Ingrese su correo elcectronico"}
                    />
                  </Col>
                  <Divider className="my-1" />
                  <Col md={8}>
                    <TextFieldPassWordComponente
                      required
                      type="text"
                      leyendaHelper="Ingrese su contraseña."
                      leyendaError="La contraseña tiene que ser de 4 a 12 dígitos."
                      id="Contraseña_Usuario_Registrar"
                      label="Ingrese contraseña"
                      estado={password}
                      cambiarEstado={setPassword}
                      expresionRegular={ExpReg.password}
                    />
                  </Col>
                  <Divider className="my-1" />
                  <Col md={8}>
                    <TextFieldPassWordComponente
                      required
                      type="text"
                      leyendaHelper="Repita su contraseña."
                      leyendaError="Las contraseñas deben coincidir."
                      id="Contraseña_Usuario_Registrar"
                      label="Repetir Contraseña"
                      estado={password2}
                      cambiarEstado={cambiarPassword2}
                      funcion={validarPassword2}
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
                </Row>
                <Divider className="my-1" />
                <DialogActions>
                  <Button variant="contained" onClick={validarCodigo}>
                    Validar
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setOpenValidacionCodigo(false)}
                    autoFocus
                  >
                    Cancelar
                  </Button>
                </DialogActions>
              </DialogTitle>
            </Box>
          </Form>
        </Dialog>
        <Dialog
          open={openSuccessDialog}
          onClose={() => setOpenSuccessDialog(false)}
        >
          <DialogTitle>Recuperación de contraseña</DialogTitle>
          <DialogContent>
            <Typography>{dialogMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenSuccessDialog(false);
                setOpenValidacionCodigo(true);
              }}
              variant="contained"
            >
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openErrorDialog}
          onClose={() => setOpenErrorDialog(false)}
        >
          <DialogTitle>Error</DialogTitle>
          <DialogContent>
            <Typography>{dialogMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenErrorDialog(false)}
              variant="contained"
            >
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openSuccessDialogDialogChangePassword}
          onClose={() => setOpenSuccessDialogChangePassword(false)}
        >
          <DialogTitle>Recuperación de contraseña</DialogTitle>
          <DialogContent>
            <Typography>{dialogMessage}</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpenSuccessDialogChangePassword(false);
                navigate(-2);
              }}
              variant="contained"
            >
              Aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </div>
  );
};

export default Recupero;
