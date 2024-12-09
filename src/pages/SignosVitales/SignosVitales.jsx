import React, { useState, useLayoutEffect, useReducer} from "react";
import AxiosHealth from "../../interceptor/axiosHealth";
import { Container, Row, Col, Form, Table, Card } from "react-bootstrap";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { Link, useNavigate  } from "react-router-dom";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import Divider from "@mui/material/Divider";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import TextFieldDropdownComponente from "../../components/TextFieldDropdownComponent";
import TextFieldInputComponente from "../../components/TextFieldInputComponent";
import ExpReg from "../../elementos/ExpresionesReg";
import Swal from "sweetalert2";
import { Pagination } from "react-bootstrap";
import { Tooltip } from "@mui/material";
import EventNoteIcon from "@mui/icons-material/EventNote"
import { SignalCellularNull } from "@mui/icons-material";

const SignosVitales = () => {
  let idHC = localStorage.getItem("HMI");
  const [signosVitalesOriginales, setSignosVitalesOriginales] = useState([]);
  const [signosVitalesBase, setSignosVitalesBase] = useState([]);
  const [signosVitalesCustoms, setSignosVitalesCustoms] = useState([]);
  const [signosVitalesPaciente, setSignosVitalesPaciente] = useState([]);
  const [signoVitalSelect, setSignoVitalSelect] = useState({ campo: "", valido: null });
  const [valorMinimoSignoVital, setValorMinimoSignoVital] = useState({ campo: "", valido: null });
  const [valorMaximoSignoVital, setValorMaximoSignoVital] = useState({ campo: "", valido: null });
  const [segundoValorMinimoSignoVital, setSegundoValorMinimoSignoVital] = useState({ campo: "", valido: null });
  const [segundoValorMaximoSignoVital, setSegundoValorMaximoSignoVital] = useState({ campo: "", valido: null });
  const [selectedOption, setSelectedOption] = useState(null);
  const [valorUnoRegistro, setValorUnoRegistro] = useState({ campo: "", valido: null });
  const [valorDosRegistro, setValorDosRegistro] = useState({ campo: "", valido: null });
  const [maximoDisabled,setMaximoDisables] = useState(true)
  const [segundoMaximoDisabled,setSegundoMaximoDisables] = useState(true)
  const [cantidadValor,setCantidadValor] = useState(0)
  const [reducerValue, forceUpdate] = useReducer((x) => x + 1, 0);
  const [mostrarForm, setMostrarForm] = useState(true);


  //Paginador
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [itemsPerPage] = useState(1); // Número de elementos por página

  // Calcula el índice del último elemento de la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  // Calcula el índice del primer elemento de la página actual
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Obtiene los datos de la página actual
  const currentItems = signosVitalesCustoms.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  // Calcula el número total de páginas
  const totalPages = Math.ceil(signosVitalesCustoms.length / itemsPerPage);

  // Cambia la página actual
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useLayoutEffect(() => {
    let signosVitalesCustomsArray = [];
    AxiosHealth.get(`/historiasMedicas/${idHC}/signosVitalesCustoms`)
      .then((value) => {
        signosVitalesCustomsArray = Object.values(value.data);
        setSignosVitalesCustoms(signosVitalesCustomsArray);
        // const signosVitalesPacienteArray = Object.values(value?.data?.signosVitalesPaciente);
        // setSignosVitalesPaciente(signosVitalesPacienteArray);
        return AxiosHealth.get(`/tiposSignosVitales`);
      })
      .then((value) => {
        const signosVitalesBaseArray = Object.values(value.data);
        setSignosVitalesOriginales(signosVitalesBaseArray);
        const signosVitalesFiltrados = signosVitalesBaseArray.filter(signoBase => 
          !signosVitalesCustomsArray.some(signoCustom => signoCustom.tipoSignoVital === signoBase.nombre)
        );
        setSignosVitalesBase(signosVitalesFiltrados);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [idHC, reducerValue]);

    useLayoutEffect(() => {
      setSignoVitalSelect({ campo: "", valido: null });
      setValorMinimoSignoVital({ campo: "", valido: null });
      setValorMaximoSignoVital({ campo: "", valido: null });
      setSegundoValorMaximoSignoVital({ campo: "", valido: null });
      setSegundoValorMaximoSignoVital({ campo: "", valido: null });
      setMostrarForm(true);
    }, [reducerValue]);
    
    
      useLayoutEffect(() => {
        if (valorMinimoSignoVital.campo != "" && valorMinimoSignoVital.valido == true) {
          setValorMaximoSignoVital({...valorMaximoSignoVital, valido: Number(valorMinimoSignoVital.campo) < Number(valorMaximoSignoVital.campo)})
          setMaximoDisables(false)
        }else {
          setMaximoDisables(true)
        }
      }, [valorMinimoSignoVital.campo]);
      
      useLayoutEffect(() => {
        if (segundoValorMinimoSignoVital.campo != "" && segundoValorMinimoSignoVital.valido == true) {
          setSegundoValorMaximoSignoVital({...segundoValorMaximoSignoVital, valido: Number(segundoValorMinimoSignoVital.campo) < Number(segundoValorMaximoSignoVital.campo)})
          setSegundoMaximoDisables(false)
        }else {
          setSegundoMaximoDisables(true)
        }
      }, [segundoValorMinimoSignoVital.campo]);

      useLayoutEffect(() => {
        if (valorMaximoSignoVital.campo != "" && valorMaximoSignoVital.valido == true) {
         setValorMaximoSignoVital({...valorMaximoSignoVital, valido:Number( valorMinimoSignoVital.campo) < Number(valorMaximoSignoVital.campo)}) 
        }
      }, [valorMaximoSignoVital.campo]);
      
      useLayoutEffect(() => {
        if (segundoValorMaximoSignoVital.campo != "" && segundoValorMaximoSignoVital.valido == true) {
         setSegundoValorMaximoSignoVital({...segundoValorMaximoSignoVital, valido:Number( segundoValorMinimoSignoVital.campo) < Number(segundoValorMaximoSignoVital.campo)}) 
        }
      }, [segundoValorMaximoSignoVital.campo]);

      //Validador obligatorio
  const validarObligatorio = (estado, cambiarEstado) => {
    if (estado.valido == null) {
      cambiarEstado({ ...estado, valido: false });
    } else if (estado.valido == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };

  function testContenido() {
    console.log("--------------------------------------------------");
    console.log("minimo: " + valorMinimoSignoVital.campo);
    console.log("maximo: " + valorMaximoSignoVital.campo);
    console.log("segundo minimo: " + segundoValorMinimoSignoVital.campo);
    console.log("segundo maximo: " + segundoValorMaximoSignoVital.campo);
    console.log("historiaMedicaId: " + idHC);
    console.log("tipoSignoVitalId: " + signoVitalSelect.campo.id);
		console.log("linea 157");
    console.log("--------------------------------------------------");
  }

  async function guardarSignoVital() {
    validarObligatorio(signoVitalSelect,setSignoVitalSelect);
    validarObligatorio(valorMinimoSignoVital,setValorMinimoSignoVital);
    validarObligatorio(valorMaximoSignoVital,setValorMaximoSignoVital);
    if(esDobleValor(signoVitalSelect.campo)){
      validarObligatorio(segundoValorMinimoSignoVital,setSegundoValorMinimoSignoVital);
      validarObligatorio(segundoValorMaximoSignoVital,setSegundoValorMaximoSignoVital);
    } 
    if (signoVitalSelect.valido == true && valorMinimoSignoVital.valido == true && valorMaximoSignoVital.valido != false && segundoValorMaximoSignoVital.valido != false && segundoValorMaximoSignoVital.valido != false){
      testContenido();
      Swal.fire({
        title: `Esta seguro que desea agregar el signo vital a evaluar ${signoVitalSelect.campo.nombre}?`,
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await AxiosHealth.post(`/signosVitalesCustoms`, {
            minimo:  valorMinimoSignoVital.campo,
            maximo:  valorMaximoSignoVital.campo,
            segundoMinimo: esDobleValor(signoVitalSelect.campo) ? segundoValorMinimoSignoVital.campo : null,
            segundoMaximo: esDobleValor(signoVitalSelect.campo) ? segundoValorMaximoSignoVital.campo : null,
            historiaMedicaId: idHC,
            tipoSignoVitalId: signoVitalSelect.campo.id,
          })
          .then( function (response){
            setMostrarForm(false)
            // console.log('OK!!!')
          })
          .catch((error) => {
            console.error(error);
          });
        }
        forceUpdate();
      })
    }
  }
  
  async function editarSignoVital() {
    validarObligatorio(valorMinimoSignoVital,setValorMinimoSignoVital);
    validarObligatorio(valorMaximoSignoVital,setValorMaximoSignoVital);
    if(esDobleValor(selectedOption)){
      validarObligatorio(segundoValorMinimoSignoVital,setSegundoValorMinimoSignoVital);
      validarObligatorio(segundoValorMaximoSignoVital,setSegundoValorMaximoSignoVital);
    }
    testContenido();
    if (valorMinimoSignoVital.valido == true && valorMaximoSignoVital.valido != false && segundoValorMaximoSignoVital.valido != false && segundoValorMaximoSignoVital.valido != false){
      Swal.fire({
        title: `Esta seguro que desea editar el signo vital ${selectedOption.tipoSignoVital}?`,
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          await AxiosHealth.put(`/signosVitalesCustoms/${selectedOption.id}`, {
            minimo:  valorMinimoSignoVital.campo,
            maximo:  valorMaximoSignoVital.campo,
            segundoMinimo: esDobleValor(selectedOption) ? segundoValorMinimoSignoVital.campo : null,
            segundoMaximo: esDobleValor(selectedOption) ? segundoValorMaximoSignoVital.campo : null,
            
          })
          .then( function (response){
            setMostrarForm(false)
            // console.log('OK!!!')
          })
          .catch((error) => {
            console.error(error);
          });
        }
        forceUpdate();
      })
    }
  }

  async function eliminarSignoVital() {
    console.log(selectedOption)
    await AxiosHealth.delete(`/signosVitalesCustoms/${selectedOption.id}`)
    .then( function (response){
      setOpen(false);
      setMostrarForm(false)
      // console.log('OK!!!')
    })
    .catch((error) => {
      console.error(error);
    });
    forceUpdate();
  }
  
  async function guardarRegistros() {
    validarObligatorio(valorUnoRegistro,setValorUnoRegistro);
    if(cantidadValor) validarObligatorio(valorDosRegistro,setValorDosRegistro);
    // console.log("valor: " + valorUnoRegistro.campo)
    // console.log("valor: " + (cantidadValor ? valorDosRegistro.campo : null))
    // console.log("comentario: " + valorUnoRegistro.campo)
    // console.log("historiaMedicaId: " + idHC)
    // console.log("signoVitalCustomId: " + selectedOption.id)
		// console.log("linea 259")
		handleCloseThree(true);
    if (valorUnoRegistro.valido == true && valorDosRegistro.valido != false){
     Swal.fire({
        title: `Esta seguro que desea agregar los registros valor uno: ${valorUnoRegistro.campo} y valor dos: ${valorDosRegistro.campo}?`,
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      })
      .then(async (result) => {
         if (result.isConfirmed) {
          
          await AxiosHealth.post(`/signosVitalesPacientes`, {
            valor: valorUnoRegistro.campo,
            segundoValor: (cantidadValor ? valorDosRegistro.campo : null),
            comentario: valorUnoRegistro.campo,
            historiaMedicaId: idHC,
            signoVitalCustomId: selectedOption.id,
          })
          .then( function (response){
            setMostrarForm(false)
            // console.log('OK!!!')
          })
          .catch((error) => {
            console.error(error);
          });
         }
        forceUpdate();
      })
    }
  }

  async function editarRegistros() {
    validarObligatorio(valorUnoRegistro,setValorUnoRegistro);
    handleCloseTwo(true);
    if (valorUnoRegistro.valido == true && valorDosRegistro.valido != false){
     Swal.fire({
        title: `Esta seguro que desea editar los registros valor uno: ${valorUnoRegistro.campo} y valor dos: ${valorDosRegistro.campo}?`,
        showDenyButton: true,
        confirmButtonText: "Si",
        denyButtonText: `No`,
      })
      .then(async (result) => {
         if (result.isConfirmed) {
          
          await AxiosHealth.put(`/signosVitalesPacientes/${selectedOption.id}`, {
            valor: valorUnoRegistro.campo,
            segundoValor: (selectedOption.segundoValor ? valorDosRegistro.campo : null),
            comentario: valorUnoRegistro.campo,
           
          })
          .then( function (response){
            setMostrarForm(false)
            // console.log('OK!!!')
          })
          .catch((error) => {
            console.error(error);
          });
         }
        forceUpdate();
      })
    }
  }

  async function eliminarRegistros() {
    console.log(selectedOption)
    await AxiosHealth.delete(`/signosVitalesPacientes/${selectedOption.id}`)
    .then( function (response){
      setOpenFour(false);
      setMostrarForm(false)
      // console.log('OK!!!')
    })
    .catch((error) => {
      console.error(error);
    });
    forceUpdate();
  }

  //Dialog
  const [open, setOpen] = React.useState(false);
  const [openTwo, setOpenTwo] = React.useState(false);
  const [openThree, setOpenThree] = React.useState(false);
  const [openFour, setOpenFour] = React.useState(false);
  const [openFive, setOpenFive] = React.useState(false);
  const navigate = useNavigate();

  //Eliminar
  const handleClickOpen = (option) => {
    setSelectedOption(option);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //Eliminar
  const handleClickOpenFour = (option) => {
    setSelectedOption(option);
    setOpenFour(true);
  };

  const handleCloseFour = () => {
    setOpenFour(false);
  };

  //Editar
  const handleClickOpenTwo = (option) => {
    // console.log(option)
    setCantidadValor(esDobleValor(option));
    setSelectedOption(option);
    setOpenTwo(true);
  };

  const handleCloseTwo = () => {
    setOpenTwo(false);
  };
  //Editar
  const handleClickOpenFive = (option) => {
    setCantidadValor(esDobleValor(option));
    setSelectedOption(option);
    setOpenFive(true);
  };

  const handleCloseFive = () => {
    setOpenFive(false);
  };

  const handleClickOpenThree = (option) => {
    setCantidadValor(esDobleValor(option));
    setSelectedOption(option);
    setOpenThree(true);
  };
  
   const handleCloseThree = () => {
    setValorUnoRegistro({ campo: "", valido: null });
    setValorDosRegistro({ campo: "", valido: null });
    setOpenThree(false);
  };

  const agregarSignoVital = () =>{
    setCantidadValor(esDobleValor(signoVitalSelect.campo));
    // console.log(signoVitalSelect.campo)
    guardarSignoVital();
  }
 
  const esDobleValor = (signoVital) => {
    if (signoVital?.signoVitalCustom){
      return signosVitalesOriginales.some(signo => signo.nombre === signoVital.signoVitalCustom.tipoSignoVital && signo.cantidadValores === 2);
    }else if (signoVital?.tipoSignoVital){
      return signosVitalesOriginales.some(signo => signo.nombre === signoVital.tipoSignoVital && signo.cantidadValores === 2);
    }else{
      return signosVitalesOriginales.some(signo => signo.nombre === signoVital.nombre && signo.cantidadValores === 2);
    }
  };

  const getEstiloResultado = (resultado, segundoResultado) => {
    const isNormal = resultado === 'Normal' && (!segundoResultado || segundoResultado === 'Normal');
    return {
      textAlign: "left",
      // width: "100%",
      fontWeight: isNormal ? "normal" : "bold",
      color: isNormal ? "green" : "red",
    };
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 style={{ textAlign: "left", fontWeight: "bold", color: 'black' }}>
            Signos vitales del usuario 
          </h1>
        </Col>
      </Row>
      <Row>
        <Divider color="black" />
        <Row xs={1} md={1} className="g-4">
        {currentItems.map((option) => (
          <Col key={option.id}>
            <Card>
              <Card.Body style={{ textAlign: "left" }}>
                <Row>
                  <Col md={7}>
                    <Card.Title style={{ fontWeight: "bold" }} className="py-2">
                      {option.tipoSignoVital}
                    </Card.Title>
                  </Col>

                  <Col md={4}>
                    
                    <Button
                      onClick={() => handleClickOpenThree(option)}
                      startIcon={<EventNoteIcon />}
                      variant="contained"
                      className="form-control btn-block"
                    > 
                      Registrar Evaluacion
                    </Button>

                    <Dialog
                      open={openThree}
                      onClose={handleCloseThree}
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
                                <h5>Registrar Evaluacion</h5>
                              </DialogContentText>
                            </DialogContent>
                            <Row>
                              <Col md={8}>
                                <TextFieldInputComponente
                                  type="number"
                                  id="Primer valor del registro"
                                  label="Primer valor del registro"
                                  estado={valorUnoRegistro}
                                  cambiarEstado={setValorUnoRegistro}
                                  expresionRegular={ExpReg.signosVitaLes}
                                  leyendaError={'El valor deben ser un numero mayores a 0'}
                                />
                              </Col>
                              {cantidadValor && openThree ? (
                                <>
                              <Divider className="my-1" />
                              <Col md={8}>
                                <TextFieldInputComponente
                                  type="number"
                                  id="Segundo valor del registro"
                                  label="Segundo valor del registro"
                                  estado={valorDosRegistro}
                                  cambiarEstado={setValorDosRegistro}
                                  expresionRegular={ExpReg.signosVitaLes}
                                  leyendaError={'El valor deben ser un numero mayores a 0'}
                                />
                              </Col>
                              </>):null}
                            </Row>
                            <Divider className="my-1" />
                            <DialogActions>
                              <Button
                                variant="contained"
                                onClick={guardarRegistros}
                              >
                                Gurdar
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={handleCloseThree}
                                autoFocus
                              >
                                Cancelar
                              </Button>
                            </DialogActions>
                          </DialogTitle>
                        </Box>
                      </Form>
                    </Dialog>
                  </Col>
                </Row>
                <Divider />
                <Card.Text>Valor minimo: {option.minimo}</Card.Text>
                <Card.Text>Valor maximo: {option.maximo}</Card.Text>
                { option.segundoMinimo ? (<Card.Text>Segundo valor minimo: {option.segundoMinimo}</Card.Text>) : null}
                { option.segundoMaximo ? (<Card.Text>Segundo valor maximo: {option.segundoMaximo}</Card.Text>) : null}
                
                <div className="my-2">
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel-content"
                      id="panel-header"
                    >
                      <Typography variant="h6">Historial</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    <Table className="my-3" striped bordered hover>
                    <thead>
                      <tr>
                        <th>Fecha del registro</th>
                        <th>Valor del registro</th>
                        <th>Resultado</th>
                        <th>Min - Max</th>
                        <th>Editar registro</th>
                        <th>Borrar registro</th>
                       
                      </tr>
                    </thead>
                      <tbody>
                        {option.signosVitalesPaciente
                        .map(registro => {

													let date = new Date(registro.fechaIngresado);
													date.setHours(date.getHours() - 6);
													
													// Formatear la fecha
													let formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
													let splitDate = formattedDate.split(' ')[0].split('-');
													let reversedDate = splitDate.reverse().join('-');
													let finalDate = reversedDate + ' ' + formattedDate.split(' ')[1];
                            return ( 	
                              <tr key={registro.id}>
                                <td style={getEstiloResultado(registro.resultado, registro.segundoResultado)}>
                                  {finalDate}
                                </td>
                                <td style={getEstiloResultado(registro.resultado, registro.segundoResultado)}>
                                  {registro.valor} {registro.segundoValor ? " - " + registro.segundoValor : null}
                                </td>
                                <td style={getEstiloResultado(registro.resultado, registro.segundoResultado)}>
                                  {registro.resultado}
                                </td>
                                <td style={getEstiloResultado(registro.resultado, registro.segundoResultado)}>
                                  {registro.minimo} - {registro.maximo} 
                                  {registro.segundoMinimo ? " | " + registro.segundoMinimo + " - " + registro.segundoMaximo : null}
                                </td>
                                <td>
                                  <Tooltip title="Editar registro" placement="right">
                                    <Button 
                                      onClick={() => handleClickOpenTwo(registro)}
                                    >
                                      <EditIcon color="primary" />
                                    </Button>
                                  </Tooltip>
                                </td>
                                <td>
                                  <Tooltip title="Eliminar registro" placement="right">
                                    <Button 
                                      onClick={() => handleClickOpenFour(registro)}
                                    >
                                      <DeleteIcon color="error" />
                                    </Button>
                                  </Tooltip>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                    </AccordionDetails>
                  </Accordion>
                </div>
								<Divider className="my-2" />
                <Row className="text-center">
                  <Col md={6}>
                    <Button
                       onClick={() => handleClickOpenFive(option)}
                      startIcon={<EditIcon />}
                      variant="contained"
                      className="form-control btn-block"
                    >
                      Editar
                    </Button>
                    <Dialog
                      open={openFive}
                      onClose={handleCloseFive}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle className="card-header">
                        <EditIcon />
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            <h5>
                              Usted esta editando los minimos y maximos aceptables del signo vital: {selectedOption && openFive ? selectedOption.tipoSignoVital: null}
                              
                            </h5>
                          </DialogContentText>
                            </DialogContent>
                            <Row>
                              <Col md={8}>
                                <TextFieldInputComponente
                                  type="number"
                                  id="Valor minimo"
                                  label="Valor minimo aceptable"
                                  estado={valorMinimoSignoVital}
                                  cambiarEstado={setValorMinimoSignoVital}
                                  expresionRegular={ExpReg.signosVitaLes}
                                  leyendaError={'El valor deben ser un numero mayores a 0 y no puede ser mayor que el maximo'}
                                  defaultValue={selectedOption ? selectedOption.minimo : ''}
                                />
                                <Divider className="my-1" />
                                <TextFieldInputComponente
                                  type="number"
                                  id="Valor maximo"
                                  label="Valor maximo aceptable"
                                  estado={valorMaximoSignoVital}
                                  cambiarEstado={setValorMaximoSignoVital}
                                  disabled={maximoDisabled}
                                  expresionRegular={ExpReg.signosVitaLes}
                                  leyendaError={'El valor deben ser un numero mayores a 0 y no puede menor que el minimo'}
                                  defaultValue={selectedOption ? selectedOption.maximo : ''}
                                />
                              </Col>
                              {cantidadValor && openFive ? (
                                <>
                                 <Col md={8}>
                                  <Divider className="my-1" />
                                  <TextFieldInputComponente
                                    type="number"
                                    id="Segundo valor minimo"
                                    label="Segundo valor minimo aceptable"
                                    estado={segundoValorMinimoSignoVital}
                                    cambiarEstado={setSegundoValorMinimoSignoVital}
                                    expresionRegular={ExpReg.signosVitaLes}
                                    defaultValue={selectedOption ? selectedOption.segundoMinimo : ''}
                                    leyendaError={'El valor deben ser un numero mayores a 0 y no puede ser mayor que el maximo'}
                                  />
                                  <Divider className="my-1" />
                                  <TextFieldInputComponente
                                    type="number"
                                    id="Segundo valor maximo"
                                    label="Segundo valor maximo aceptable"
                                    estado={segundoValorMaximoSignoVital}
                                    cambiarEstado={setSegundoValorMaximoSignoVital}
                                    disabled={segundoMaximoDisabled}
                                    expresionRegular={ExpReg.signosVitaLes}
                                    defaultValue={selectedOption ? selectedOption.segundoMaximo : ''}
                                    leyendaError={'El valor deben ser un numero mayores a 0 y no puede menor que el minimo'}
                                  /> 
                                  </Col>
                                </>) :null}
                            </Row>
                            <Divider className="my-1" />
                            <DialogActions>
                              <Button
                                variant="contained"
                                onClick={editarSignoVital}
                              >
                                Gurdar
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={handleCloseFive}
                                autoFocus
                              >
                                Cancelar
                              </Button>
                            </DialogActions>
                          </DialogTitle>
                    </Dialog>
                    <Dialog
                      open={openTwo}
                      onClose={handleCloseTwo}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle className="card-header">
                        <EditIcon />
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            <h5>
                              Usted esta editando el registro
                            </h5>
                          </DialogContentText>
                            </DialogContent>
                            <Row>
                              <Col md={8}>
                                <TextFieldInputComponente
                                  type="number"
                                  id="Primer valor del registro"
                                  label="Primer valor del registro"
                                  estado={valorUnoRegistro}
                                  cambiarEstado={setValorUnoRegistro}
                                  expresionRegular={ExpReg.signosVitaLes}
                                  leyendaError={'El valor deben ser un numero mayores a 0'}
                                  defaultValue={selectedOption ? selectedOption.valor : ''}
                                />
                              </Col>
                              { selectedOption?.segundoValor && openTwo ? (
                                <>
                                <Divider className="my-1" />
                                <Col md={8}>
                                  <TextFieldInputComponente
                                    type="number"
                                    id="Segundo valor del registro"
                                    label="Segundo valor del registro"
                                    estado={valorDosRegistro}
                                    cambiarEstado={setValorDosRegistro}
                                    expresionRegular={ExpReg.signosVitaLes}
                                    leyendaError={'El valor deben ser un numero mayores a 0'}
                                    defaultValue={selectedOption ? selectedOption.segundoValor : ''}
                                  />
                                </Col>
                                </>) : null}
                            </Row>
                            <Divider className="my-1" />
                            <DialogActions>
                              <Button
                                variant="contained"
                                onClick={editarRegistros}
                              >
                                Gurdar
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={handleCloseTwo}
                                autoFocus
                              >
                                Cancelar
                              </Button>
                            </DialogActions>
                          </DialogTitle>
                    </Dialog>
                    
                  </Col>
                  
                  <Col md={6}>
                    <Button
                      onClick={() => handleClickOpen(option)}
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
                            ¿Esta seguro que desea eliminar el signo vital y todos sus registros?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={eliminarSignoVital}>Confirmar</Button>
                          <Button onClick={handleClose} autoFocus>
                            Cancelar
                          </Button>
                        </DialogActions>
                      </DialogTitle>
                    </Dialog>
                    <Dialog
                      open={openFour}
                      onClose={handleCloseFour}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle className="card-header">
                        <DeleteForeverIcon />
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            ¿Esta seguro que desea eliminar el registro seleccionado?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={eliminarRegistros}>Confirmar</Button>
                          <Button onClick={handleCloseFour} autoFocus>
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
          ))}
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

        <Col md={12} style={{ textAlign: "left" }}>
          <h2>
            Nuevo <AddIcon sx={{ fontSize: 45 }} />
          </h2>
          {mostrarForm && (
            <>
          <Form className="my-5">
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextFieldDropdownComponente
                leyendaHelper={"Signo vital"}
                leyendaError="Debe seleccionar un signo vital para evaluar."
                id="signo_vital"
                label="Signo vital"
                value={signosVitalesBase}
                estado={signoVitalSelect}
                cambiarEstado={setSignoVitalSelect}
              />
              <Divider />
              <TextFieldInputComponente
                type="number"
                id="Valor minimo"
                label="Valor minimo aceptable"
                estado={valorMinimoSignoVital}
                cambiarEstado={setValorMinimoSignoVital}
                expresionRegular={ExpReg.signosVitaLes}
                leyendaError={'El valor deben ser un numero mayores a 0 y no puede ser mayor que el maximo'}
              />
              <TextFieldInputComponente
                type="number"
                id="Valor maximo"
                label="Valor maximo aceptable"
                estado={valorMaximoSignoVital}
                cambiarEstado={setValorMaximoSignoVital}
                disabled={maximoDisabled}
                expresionRegular={ExpReg.signosVitaLes}
                leyendaError={'El valor deben ser un numero mayores a 0 y no puede menor que el minimo'}
              />
              {signoVitalSelect.campo.cantidadValores === 2 ? 
                (<>
                  <Divider />
                  <TextFieldInputComponente
                    type="number"
                    id="Segundo valor minimo"
                    label="Segundo valor minimo aceptable"
                    estado={segundoValorMinimoSignoVital}
                    cambiarEstado={setSegundoValorMinimoSignoVital}
                    expresionRegular={ExpReg.signosVitaLes}
                    leyendaError={'El valor deben ser un numero mayores a 0 y no puede ser mayor que el maximo'}
                  />
                  <TextFieldInputComponente
                    type="number"
                    id="Segundo valor maximo"
                    label="Segundo valor maximo aceptable"
                    estado={segundoValorMaximoSignoVital}
                    cambiarEstado={setSegundoValorMaximoSignoVital}
                    disabled={segundoMaximoDisabled}
                    expresionRegular={ExpReg.signosVitaLes}
                    leyendaError={'El valor deben ser un numero mayores a 0 y no puede menor que el minimo'}
                  /> 
                </>): null}
              <Divider />
              <Button
                variant="contained"
                onClick={guardarSignoVital}
                className="my-5"
              >
                Agregar Signo Vital
              </Button>
            </Box>
          </Form>
          </>)}
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

export default SignosVitales;
