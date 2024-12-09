import React, {
  useState,
  useLayoutEffect,
} from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import TextFieldTxAreaComponente from "../../components/TextFieldTxAreaComponent";
import { Form } from "react-bootstrap";
import AxiosHealth from "../../interceptor/axiosHealth";

const Modal = ({
  isOpen,
  onClose,
  medicamentoEditar,
  setMedicamentoEditar,
  nameButton,
  refresh,
  modalEstado,
}) => {
  const [comentarioMedicamentoEditar, setComentarioMedicamentoEditar] = useState({ campo: "", valido: null });

  function setearVariables(setVariable, variable, dato) {
    if (dato !== null && dato !== undefined) {
      setVariable({ ...variable, campo: dato, valido: null });
    } else {
      setVariable({ ...variable, campo: "", valido: null });
    }
  }

  useLayoutEffect(() => {
    if (medicamentoEditar && medicamentoEditar.length !== 0) {
      setearVariables(setComentarioMedicamentoEditar, comentarioMedicamentoEditar, medicamentoEditar.comentarios);
    }
  }, [medicamentoEditar]);
  
  const handleClose = () => {
    setearVariables(setComentarioMedicamentoEditar,comentarioMedicamentoEditar,'')
    modalEstado(false);
    setMedicamentoEditar([])
  };

  async function guardarEditado() {
    if (comentarioMedicamentoEditar.valido == true){
      await AxiosHealth.put(`/historiasMedicas/actualizarMedicamentos/${medicamentoEditar.id}`,
        {
          comentarios: comentarioMedicamentoEditar.campo,
        }
      );
      modalEstado(false);
      if (refresh) {
        refresh();
      }
    } 
  }

  if (!isOpen) {
    return null;
  }

  return (
    <>
      {medicamentoEditar.length !== 0 && (
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
                  {"Usted esta editando el medicamento: Levotiroxina" }
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
                    <TextFieldTxAreaComponente
                      type="Textarea"
                      leyendaHelper="Comentarios."
                      id="comentarios_medicamento"
                      label="Comentarios"
                      estado={comentarioMedicamentoEditar}
                      cambiarEstado={setComentarioMedicamentoEditar}
                      defaultValue={comentarioMedicamentoEditar.campo}
                    />
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