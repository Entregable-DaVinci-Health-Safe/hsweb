import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import Divider from "@mui/material/Divider";
import FondoRegister from "../../img/Background/FondoLogin.jpg";
import { FormControl, FormControlLabel, Radio } from "@mui/material";
import { ContenedorTerminos } from "./../../elementos/Formularios";
import Button from "@mui/material/Button";
import Boton from "@mui/material/Button";
import TextFieldInputComponente from "../../components/TextFieldInputComponent";
import TextFieldPassWordComponente from "../../components/TextFieldPasswordComponent";
import Checkbox from "./../../components/Terminos";
import DialogComponent from "../../components/DialogComponent"
import TextFieldDatetimeComponent from "../../components/TextFieldDatetimeComponent";
import TextFieldDropdownComponenteSimple from "../../components/TextFieldDropdownComponentSimple";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import AxiosHealth from "../../interceptor/axiosHealth";
import ExpReg from "../../elementos/ExpresionesReg";
import Loading from "../../components/Loading";
import "../../css/LoginRegister.css";

const Register = () => {
  const [nombre, setNombre] = useState({ campo: "", valido: null });
  const [apellido, setApellido] = useState({ campo: "", valido: null });
  const [mail, setMail] = useState({ campo: "", valido: null });
  const [mail2, setMail2] = useState({ campo: "", valido: null });
  const [dni, setDni] = useState({ campo: "", valido: null });
  const [dni2, setDni2] = useState({ campo: "", valido: null });
  const [password, setPassword] = useState({ campo: "", valido: null });
  const [password2, cambiarPassword2] = useState({ campo: "", valido: null });
  const [fechaNacimiento, setFechaNacimiento] = useState({campo: "", valido: null });
  const [generoSelect, setGeneroSelect] = useState([]);
  const [genero, setGenero] = useState({ campo: "", valido: null });
  const [terminos, setTerminos] = useState({ campo: "", valido: null });
  const [validarReg, setValidarReg] = useState({ campo: "", valido: null });
  const [IsLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const checkRequirement = (regex, password) => regex.test(password.campo);
  const allRequirementsMet = ExpReg.requirements.every((req) =>
    checkRequirement(req.regex, password)
  );

  const validarObligatorio = (estado, cambiarEstado) => {
    if (estado.valido == null) {
      cambiarEstado({ ...estado, valido: false });
    } else if (estado.valido == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };

  useLayoutEffect(() => {
    AxiosHealth.get("/generos", { includeAuth: false })
      .then((response) => {
        setGeneroSelect(response.data.slice(0, 2));
      })
      .catch((error) => console.error(error.request.response));
  }, []);

  const [isDialogOpenUserExist, setIsDialogOpenUserExist] = useState(false);
  const handleDialogUserExist = () => {
    setIsDialogOpenUserExist(prevState => !prevState);
  };
  const handleConfirmActionUserExist = () => {
    setIsDialogOpenUserExist(false);
  };
  
  const registroUsuario = () => {
    validarObligatorio(nombre, setNombre);
    validarObligatorio(apellido, setApellido);
    validarObligatorio(fechaNacimiento, setFechaNacimiento);
    validarObligatorio(mail, setMail);
    validarObligatorio(mail2, setMail2);
    validarObligatorio(dni, setDni);
    validarObligatorio(dni2, setDni2);
    validarObligatorio(password, setPassword);
    validarObligatorio(password2, cambiarPassword2);
    validarObligatorio(genero, setGenero);
    validarObligatorio(terminos, setTerminos);
   
    if (
      nombre.valido == true &&
      apellido.valido == true &&
      fechaNacimiento.valido == true &&
      mail.valido == true &&
      dni.valido == true &&
      dni2.valido == true &&
      password.valido == true &&
      allRequirementsMet == true &&
      genero.valido == true &&
      fechaNacimiento.valido == true
    ) {
      setIsLoading(true);
      AxiosHealth.post("/register/pacientes", {
        documento: dni.campo,
        nombre: nombre.campo,
        apellido: apellido.campo,
        fechaNacimiento: fechaNacimiento.campo,
        mail: mail.campo,
        password: password.campo,
        genero: genero.campo,
      })
        .then('Registra',setIsLoading(false))
        .catch((error) => {
          console.log(error.request.response);
          console.log(error.request.status);
          if (error.request.status == "406") {
            handleDialogUserExist();
          }
        });
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

  const validarMail2 = () => {
    if (mail.campo.length > 0) {
      if (mail.campo !== mail2.campo) {
        setMail2((prevState) => {
          return { ...prevState, valido: false };
        });
      } else {
        setMail2((prevState) => {
          return { ...prevState, valido: true };
        });
      }
    }
  };

  const validarDNI2 = () => {
    if (dni.campo.length > 0) {
      if (dni.campo !== dni2.campo) {
        setDni2((prevState) => {
          return { ...prevState, valido: false };
        });
      } else {
        setDni2((prevState) => {
          return { ...prevState, valido: true };
        });
      }
    }
  };

  useEffect(() => {
    if (validarReg.campo !== "") {
      AxiosHealth.put(`/usuarios/verificarCuenta`, {
        mail: mail.campo,
        codigo: validarReg.campo,
      })
        .then(function (response) {
          if (response.request.status == 201) {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title:
                "Su cuenta fue activada correctamente. Será redirigido para que se loguee.",
              showConfirmButton: false,
              timer: 3000,
            }).then(function (response) {
              navigate("/");
            });
          }
        })
        .catch((error) => {
          if (error.request.status == 500) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Tiene que ingresar un codigo para validar",
              footer: '<a href="">Necesita ayuda hacer click aqui!</a>',
            }).then(() => {
              ingresarCodigo();
            });
          } else if (error.request.status == 406) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: error.request.response,
              footer: '<a href="">Necesita ayuda hacer click aqui!</a>',
            }).then(() => {
              navigate("/");
            });
          } else if (error.request.status == 417) {
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "El codigo ingresado es incorrecto, por favor verifíquedo y vuelva a intentar.",
              footer: '<a href="">Necesita ayuda hacer click aqui!</a>',
            }).then(() => {
              ingresarCodigo();
            });
          }
        });
    }
  }, [validarReg]);

  const ingresarCodigo = () => {
    Swal.fire({
      title: "Ingrese el código de activacion que recibió por mail",
      input: "text",
      inputPlaceholder: "Ingrese el código de activacion aquí",
      showCancelButton: false,
      confirmButtonText: "Aceptar",
      footer: '<a href="">Necesita ayuda hacer click aqui!</a>',
    })
      .then(({ value }) => {
        if (value != "") {
          setValidarReg({ ...validarReg, campo: value });
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Tiene que ingresar un codigo para validar",
            footer: '<a href="">Necesita ayuda hacer click aqui!</a>',
          }).then(() => {
            ingresarCodigo();
          });
        }
      })
      .catch((error) => {
        console.log(error.request.response);
        console.log(error.request.status);
      });
  };

  return (
    <>
      <Row>
        <Col xs={12} md={7}>
          <img
            style={{ backgroundPosition: "left", width: "100%", height: "109%" }}
            src={FondoRegister}
          />
        </Col>
        {IsLoading && <Loading message={"Registrando usuario..."} />}
        <Col xs={12} md={4}>
          <form method="put" className="my-5">
            <Container>
              <h1 style={{ textAlign: "left", fontWeight: "bold" }}>
                Registro de usuario
              </h1>
            </Container>
            <Divider className="my-2" />
            <Container>
              <Row className="my-5">
                <Col xs={12} md={6}>
                  <FormControl
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
                    <TextFieldInputComponente
                      required
                      type="text"
                      leyendaHelper="Ingrese su nombre."
                      leyendaError="El nombre tiene que ser de 4 a 16 dígitos y solo puede contener letras y espacios."
                      id="Nombre_Usuario_Registrar"
                      label="Nombre"
                      estado={nombre}
                      cambiarEstado={setNombre}
                      expresionRegular={ExpReg.nombre}
                    />
                  </FormControl>
                </Col>
                <Col xs={12} md={6}>
                  <FormControl
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
                    <TextFieldInputComponente
                      required
                      type="text"
                      leyendaHelper="Ingrese su apellido."
                      leyendaError="El apellido tiene que ser de 4 a 16 dígitos y solo puede contener letras y espacios."
                      id="Apellido_Usuario_Registrar"
                      label="Apellido"
                      estado={apellido}
                      cambiarEstado={setApellido}
                      expresionRegular={ExpReg.nombre}
                    />
                  </FormControl>
                </Col>
                <Col xs={12} md={6} style={{ textAlign: "left" }}>
                  <FormControl
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
                    <label style={{ textAlign: "left" }}>
                      Fecha de nacimiento
                    </label>
                    <TextFieldDatetimeComponent
                      required
                      estado={fechaNacimiento}
                      cambiarEstado={setFechaNacimiento}
                      leyendaHelper={"Seleccione la fecha de nacimiento"}
                      leyendaError="Debe ser una fecha valida, verificar"
                    />
                  </FormControl>
                </Col>
                <Col xs={12} md={6}>
                  <FormControl
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
                    <label style={{ textAlign: "left" }}>Sexo al nacer</label>
                    <Divider />
                    <TextFieldDropdownComponenteSimple
                      estado={genero}
                      value={generoSelect}
                      cambiarEstado={setGenero}
                      name={"select_genero"}
                      leyendaHelper={"Seleccionar Genero"}
                      leyendaError="Debe seleccionar el genero."
                    />
                  </FormControl>
                </Col>
                <Col xs={12} md={6}>
                  <FormControl
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
                    <TextFieldInputComponente
                      required
                      type="text"
                      leyendaHelper="DNI"
                      leyendaError="El DNI deben ser solo numeros."
                      id="Dni_Usuario_Registrar"
                      label="DNI"
                      estado={dni}
                      cambiarEstado={setDni}
                      expresionRegular={ExpReg.dni}
                    />
                  </FormControl>
                </Col>
                <Col xs={12} md={6}>
                  <FormControl
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
                    <TextFieldInputComponente
                      required
                      type="text"
                      leyendaHelper="Repetir su DNI"
                      leyendaError="El numero de DNI deben coincidir."
                      id="Dni_Repetir_Usuario_Registrar"
                      label="DNI"
                      estado={dni2}
                      cambiarEstado={setDni2}
                      funcion={validarDNI2}
                    />
                  </FormControl>
                </Col>
                <Col xs={12} md={6}>
                  <FormControl
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
                    <TextFieldInputComponente
                      required
                      type="text"
                      leyendaHelper="mail@dominio"
                      leyendaError="El correo solo puede contener letras, numeros, puntos, guiones y guion bajo."
                      id="Mail_Usuario_Registrar"
                      label="Correo electronico"
                      estado={mail}
                      cambiarEstado={setMail}
                      expresionRegular={ExpReg.correo}
                    />
                  </FormControl>
                </Col>
                <Col xs={12} md={6}>
                  <FormControl
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
                    <TextFieldInputComponente
                      required
                      type="text"
                      leyendaHelper="Repetir su correo: mail@dominio"
                      leyendaError="Los correos deben coincidir."
                      id="Mail_Repetir_Usuario_Registrar"
                      label="Correo electronico"
                      estado={mail2}
                      cambiarEstado={setMail2}
                      funcion={validarMail2}
                    />
                  </FormControl>
                </Col>
                <Col xs={12} md={6}>
                  <FormControl
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
                    <TextFieldPassWordComponente
                      required
                      type="text"
                      leyendaHelper="Ingrese su contraseña."
                      leyendaError="La contraseña tiene que ser de 8 a 20 dígitos."
                      id="Contraseña_Usuario_Registrar"
                      label="Ingrese contraseña"
                      estado={password}
                      cambiarEstado={setPassword}
                      expresionRegular={ExpReg.password}
                    />
                  </FormControl>
                </Col>
                <Col xs={12} md={6}>
                  <FormControl
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
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
                  </FormControl>
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

                <Divider className="my-3" />
                
                <Col xs={12} md={12} style={{ textAlign: "left" }}>
                  <FormControl
                    className="my-1"
                    style={{ width: "100%" }}
                    method="post"
                    id="Input"
                  >
                    <ContenedorTerminos>
                      <Checkbox
                        sx={{ marginLeft: "-100px" }}
                        texto="Acepto los Terminos y Condiciones"
                        estado={terminos}
                        cambiarEstado={setTerminos}
                        leyendaError="Debe aceptar los terminos y condiciones para registrarse."
                      />
                    </ContenedorTerminos>
                  </FormControl>
                </Col>
                <Divider className="my-2" />
                <DialogComponent
                  open={isDialogOpenUserExist}
                  title="Error en el registro"
                  content="El mail ya se encuentra registrado, por favor valide el correo y vuelva a intentar."
                  onClose={handleDialogUserExist}
                  onConfirm={handleConfirmActionUserExist}
                  alertType={'error'}
                  secondButton={false}
                  nameSecondButton={'Cancelar'}
                />
                <Col xs={12} md={12} style={{ textAlign: "left" }}>
                  <Boton
                    variant="contained"
                    id="Boton"
                    onClick={() => registroUsuario()}
                  >
                    Registrarme
                  </Boton>
                  <Link
                    to="/"
                    style={{
                      textDecoration: "none",
                    }}
                  >
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "grey" }}
                      className="text-white"
                      style={{
                        textDecoration: "none",
                      }}
                      component={Link}
                      onClick={() => navigate(-1)}
                    >
                      Volver
                    </Button>
                  </Link>
                </Col>
                <Col xs={6} md={6} style={{ textAlign: "left" }}></Col>
              </Row>
            </Container>
          </form>
        </Col>
      </Row>
  </>
  );
};

export default Register;
