import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useReducer,
} from "react";
import {
  FormControl,
  TextField,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import TextFieldInputComponente from "../../components/TextFieldInputComponent";
import TextFieldDatetimeComponent from "../../components/TextFieldDatetimeComponent";
import ExpReg from "../../elementos/ExpresionesReg";
import { Form } from "react-bootstrap";
import AxiosHealth from "../../interceptor/axiosHealth";
import es from "date-fns/esm/locale/es/index.js";
import { Axios } from "axios";

const Modal = ({
  isOpen,
  onClose,
  datos,
  nameButton,
  refresh,
  modalEstado,
  update,
}) => {
  /****************************************/
  const [nombreEdit, setNombreEdit] = useState({ campo: "", valido: null });
  const [apellidoEdit, setApellidoEdit] = useState({ campo: "", valido: null });
  const [fechaNacimientoEdit, setFechaNacimientoEdit] = useState({campo: "",valido: null,});

  const [espGuardarEdit, setEspGuardarEdit] = useState([]);
  const [espBorrarEdit, setEspBorrarEdit] = useState([]);
  const [opcionesDefault, setOpcionesDefault] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(true);

  /****************************************/

  useLayoutEffect(() => {
    if (datos && datos.length !== 0) {
      setearVairables(setNombreEdit, nombreEdit, datos.nombre);
      setearVairables(setApellidoEdit, apellidoEdit, datos.apellido);
      setearVairables(setFechaNacimientoEdit, fechaNacimientoEdit, datos.fechaNacimiento);
    }
  }, [datos]);

  function setearVairables(setVariable, variable, dato) {
    if (dato !== null && dato !== undefined) {
      setVariable({ ...variable, campo: dato, valido: null });
    } else {
      setVariable({ ...variable, campo: "", valido: null });
    }
  }

  
  const handleClose = () => {
    modalEstado(false);
  };

  const validarObligatorio = (estado,cambiarEstado) =>{
    if(estado.valido==null){
      cambiarEstado({...estado, valido : false});
    }else if(estado.valido==''){
      cambiarEstado({...estado, valido : false});
    }
  }

  /******** Guardar Editado **********/
  async function guardarEditado() {
    validarObligatorio(nombreEdit, setNombreEdit);
    validarObligatorio(apellidoEdit, setApellidoEdit);
    
    if (
      nombreEdit.valido !== false &&
      apellidoEdit.valido !== false &&
      fechaNacimientoEdit.valido !== false
    ) {
        AxiosHealth.put(`usuarios/pacientes`,{
          nombre: nombreEdit.campo,
          apellido: apellidoEdit.campo,
          fechaNacimiento: fechaNacimientoEdit.campo
        })
        .then((response)=>{
            handleClose();
            update(false);
            if (refresh) {
              refresh();
            }
        })
        .catch((error)=>{
          console.error(error)
        })

      
      console.log("Guardando");
      
    } else {
      console.log("NOOOOOO");
    }
  }

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {mostrarForm && datos.length !== 0 && (
        <>
          <Dialog
            open={isOpen}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{ zIndex: 100 }}
          >
            <DialogTitle className="card-header">
              <EditIcon />
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  {"Usted esta editando sus datos personales"}
                </DialogContentText>
              </DialogContent>
              <Form>
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "50ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <div>
                    <TextFieldInputComponente
                      type="text"
                      required
                      leyendaHelper="Nombre del paciente."
                      leyendaError="El nombre tiene que ser de 4 a 16 dígitos y solo puede contener letras y espacios."
                      id="nombre_paciente"
                      label="Nombre Paciente"
                      estado={nombreEdit}
                      cambiarEstado={setNombreEdit}
                      expresionRegular={ExpReg.nombre}
                      defaultValue={datos.nombre}
                    />
                    <TextFieldInputComponente
                      type="text"
                      required
                      leyendaHelper="Apellido del paciente."
                      leyendaError="El apellido tiene que ser de 4 a 16 dígitos y solo puede contener letras y espacios."
                      id="apellido_paciente"
                      label="Apellido Paciente"
                      estado={apellidoEdit}
                      cambiarEstado={setApellidoEdit}
                      expresionRegular={ExpReg.nombre}
                      defaultValue={datos.apellido}
                    />
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
                        estado={fechaNacimientoEdit}
                        cambiarEstado={setFechaNacimientoEdit}
                        leyendaHelper={"Seleccione la fecha de nacimiento"}
                        leyendaError="Debe seleccionar la fecha de su nacimiento."
                        defaultValue={datos.fechaNacimiento}
                      />
                    </FormControl>
                    
                  </div>
                </Box>
              </Form>
              <DialogActions>
                <Button onClick={guardarEditado}>{nameButton}</Button>
                <Button onClick={handleClose} autoFocus>
                  Cancelar
                </Button>
              </DialogActions>
            </DialogTitle>
          </Dialog>
        </>
      )}
    </>
  );
};

export default Modal;
