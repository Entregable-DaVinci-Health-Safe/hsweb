import * as React from 'react';
import { useState, useEffect,useLayoutEffect } from 'react';
import { useNavigate } from "react-router-dom";

//Componentes
import Paper from "@mui/material/Paper";
import { FormControl, Divider} from "@mui/material";
import Button from "@mui/material/Button";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import Alert from 'react-bootstrap/Alert';
import Logo from "../components/Logo";
import Loading from '../components/Loading';
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Container, Row, Col, Form, Table, Card } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";
//Componentes
import TextFieldInputComponente from '../components/TextFieldInputComponent';
import TextFieldPassWordComponent from '../components/TextFieldPasswordComponent';
import TextFieldDatetimeComponent from "../components/TextFieldDatetimeComponent";
import TextFieldDropdownComponenteSimple from "../components/TextFieldDropdownComponentSimple";
import { requestAdditionalScopes, handleGoogleLoginSuccess } from '../components/googleOAuthUtil';
import GoogleButton from 'react-google-button'
import AuthButton from '../components/LoginOAuth';
import Swal from 'sweetalert2';

// Importar componentes propios
import Input from './../components/Input';
import {Formulario, Boton} from './../elementos/Formularios';
import ExpReg from "./../elementos/ExpresionesReg";

//REACT ROUTER
import { Link } from "react-router-dom";

//REACT ROUTER
import AxiosHealth from '../interceptor/axiosHealth';
import axios from 'axios';

import "../css/LoginRegister.css";
import { Margin } from '@mui/icons-material';

import { GoogleOAuthProvider,GoogleLogin } from '@react-oauth/google';


const Login = () => {
  localStorage.clear();

  //ExpresionesRegulares
  // const expresiones = {
  //   password: /^.{4,12}$/, // 4 a 12 digitos.
  //   correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  // }

  const [mail, setMail] = useState({campo: '', valido: null});
  const [password, setPassword] = useState({campo: '', valido: null});
  const [isLoading, setIsLoading] = useState(false);
  const [validarReg, setValidarReg] = useState({campo: '', valido: null});
  //Dialog
  const [open, setOpen] = React.useState(false);
  const [dni, setDni] = useState({ campo: "", valido: null });
  const [dni2, setDni2] = useState({ campo: "", valido: null });
  const [fechaNacimiento, setFechaNacimiento] = useState({campo: "",valido: null});
  const [generoSelect, setGeneroSelect] = useState([]);
  const [genero, setGenero] = useState({ campo: "", valido: null });
  const [token, setToken] = useState();
  const navigate = useNavigate();

  //Close Completar datos de registro
  const handleClose = () => {
    setOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      validadorlogin();
    }
  }

  //Validador de DNI
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
  
  
  //Validador obligatorio
  const validarObligatorio = (estado,cambiarEstado) =>{
    if(estado.valido==null){
      cambiarEstado({...estado, valido : false});
    }else if(estado.valido==''){
      cambiarEstado({...estado, valido : false});
    }
  }

   function validadorlogin() {
    validarObligatorio(mail,setMail);
    validarObligatorio(password,setPassword);
    
    if (mail.valido == true  && password.valido == true){
      setIsLoading(true);
      AxiosHealth.post('login', {
          mail: mail.campo,
          password: password.campo
      })
      .then(async function (response) {
        localStorage.setItem("token", response.data.token);
        console.log(response);
        //localStorage.setItem("idUsuario", response.data.usuarioId);
        localStorage.setItem("HMI", response.data.historiaMedicaId)
        navigate("/elementos");
      })
      .catch(error => {
        setIsLoading(false)
        {if(error.request.status == "404"){ingresarCodigo()}}
        console.log(error.request.response)
        console.log(error.request.status)
      });
    }
  }

   
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-start',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  })
  
  useEffect(() => {
    if (validarReg.campo !== '') {
      AxiosHealth
        .put(`/usuarios/verificarCuenta`, {
          mail: mail.campo,
          codigo: validarReg.campo,
        })
        .then(function (response) {
          if(response.request.status==201){
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Su cuenta fue activada correctamente. Será redirigido para que se loguee.',
              showConfirmButton: false,
              timer: 3000
            })
            .then(function (response) {
                navigate("/");
            })
          }
        })
				.catch((error) => {
          if(error.request.status==500){
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Tiene que ingresar un codigo para validar',
              footer: '<a href="">Necesita ayuda hacer click aqui!</a>'
            })
            .then(() => {
              ingresarCodigo()
             })
          }else if(error.request.status==406){
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.request.response,
              footer: '<a href="">Necesita ayuda hacer click aqui!</a>'
            })
            .then(() => {
              navigate("/");
             })
          }else if(error.request.status==417){
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'El codigo ingresado es incorrecto, por favor verifíquedo y vuelva a intentar.',
              footer: '<a href="">Necesita ayuda hacer click aqui!</a>'
            })
            .then(() => {
              ingresarCodigo()
             })
          }
       });
    }
  }, [validarReg]);

  
  const navigateToRegister = () => {
    navigate('/registroConMail');
  };

  const ingresarCodigo = () => {
    Swal.fire({
      title: 'Ingrese el código de activacion que recibió por mail',
      input: 'text',
      inputPlaceholder: 'Ingrese el código de activacion aquí',
      showCancelButton: false,
      confirmButtonText: 'Aceptar',
    }).then(({ value }) => {
      setValidarReg({...validarReg, campo: value})
    });
  };

  const onSuccess =  (response) => {
    setToken(response.credential)
    AxiosHealth.post('login/google', { tokenId: response.credential }, { includeAuth: false })
    .then((res) => {
      AxiosHealth.get('/generos',{includeAuth:false})
      .then((res) => {
        setGeneroSelect(res.data.slice(0, 2))})
      .catch((error) => console.error(error.request.res))
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("HMI", res.data.historiaMedicaId)
      navigate("/elementos");
    })
    .catch(error => {
      setIsLoading(false)
    })
  };


  //acturaliza datos
  const actualizarDatos = () => {
    validarObligatorio(fechaNacimiento, setFechaNacimiento);
    validarObligatorio(dni, setDni);
    validarObligatorio(dni2, setDni2);
    validarObligatorio(genero, setGenero);
    
    if(fechaNacimiento.valido == true && dni.valido == true && dni2.valido == true && genero.valido ==true){
      localStorage.setItem('token', token)
      AxiosHealth.put('usuarios/googleUpdate',{
          documento: dni.campo,
          fechaNacimiento: fechaNacimiento.campo,
          genero: genero.campo
      })
      .then((response)=> {
        console.log(response)
        handleClose();
        console.log(localStorage.getItem('token'))
        AxiosHealth.get('historiasMedicas/usuarios/')
        .then((response)=>{
          localStorage.setItem('token', token)
          localStorage.setItem("HMI", response.data.id)
          navigate("/elementos");
        })

      })
      .catch((error)=> {
        console.log(error.request.response)
        console.log(error.request.status)
      })
    }
  };

  const onFailure = (error) => {
    console.log('Login Failed', error);
  };
  
  return (
    <div id="FondoLogin">
      <>
        {isLoading && <Loading message={"Iniciando sesión..."} />}
        <div id="Posicionar-Carta">
          <Paper elevation={1} id="Carta">
            <div id="Posicionar-Container">
              <Logo />
              <form className="my-5" method="put" onKeyDown={handleKeyDown}>
                <div id="Columna-Inputs">
                  <FormControl method="post" id="Input">
                    <TextFieldInputComponente
                      type="text"
                      required
                      leyendaHelper="mail@dominio"
                      leyendaError="El correo solo puede contener letras, numeros, puntos, guiones y guion bajo."
                      id="mail_inicio_sesion"
                      label="Mail"
                      estado={mail}
                      cambiarEstado={setMail}
                      expresionRegular={ExpReg.correo}
                    />
                  </FormControl>
                  <FormControl method="post" id="Input">
                    <TextFieldPassWordComponent
                      leyendaHelper="Ingrese su contraseña."
                      leyendaError="La contraseña tiene que ser de 4 a 12 dígitos."
                      label="Contraseña_inicio_sesion"
                      estado={password}
                      cambiarEstado={setPassword}
                      expresionRegular={ExpReg.password}
                    />
                  </FormControl>
                <Link style={{ marginLeft: "40%" }} to="/recupero">Olvide mi contraseña</Link>
                </div>
              </form>

              <Button
                sx={{ width: "70%" }}
                startIcon={<ArrowCircleRightIcon />}
                className="form-control btn-block"
                variant="outlined"
                id="Boton"
                type="submit"
                onClick={() => validadorlogin()}
              >
                Iniciar sesion
              </Button>
              <Button
                sx={{ width: "70%" }}
                startIcon={<ArrowCircleRightIcon />}
                variant="contained"
                className="form-control btn-block"
                onClick={() => navigateToRegister()}
              >
                Registrar
              </Button>
              <Divider className="my-3" />
              <GoogleOAuthProvider clientId={process.env.REACT_APP_GCID}>
                <GoogleLogin
                  onSuccess={onSuccess}
                  onError={onFailure}
                  scope="https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email"
                />
              </GoogleOAuthProvider>
            </div>
          </Paper>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Form>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <DialogTitle className="card-header">
                <EditIcon />
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    <h5>Completar datos de registro</h5>
                  </DialogContentText>
                </DialogContent>
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
                        leyendaError="Debe ser mayor de 18 años."
                        mayorDeEdad
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
                        //label={'Seleccionar Genero'}
                        name={'select_genero'}
                        leyendaHelper={'Seleccionar Genero'}
                        leyendaError="Debe seleccionar el genero."
                      />
                    </FormControl>
                  </Col>
                <Divider className="my-1" />
                <DialogActions>
                  <Button
                    variant="contained"
                    onClick={actualizarDatos}
                  >
                    Gurdar
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleClose}
                    autoFocus
                  >
                    Cancelar
                  </Button>
                </DialogActions>
              </DialogTitle>
            </Box>
          </Form>
        </Dialog>
      </>
    </div>
  );
};

export default Login;
