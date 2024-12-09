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
import TextFieldInputComponente from "../../components/TextFieldInputComponent";
import TextFieldDropdownComponenteSimple from "../../components/TextFieldDropdownComponentSimple";
import DropdownMultiSelectPrueba from "../../components/DropdownMultiSelectPrueba";
import ExpReg from "../../elementos/ExpresionesReg";
import { Form } from "react-bootstrap";
import AxiosHealth from "../../interceptor/axiosHealth";

const Modal = ({
  isOpen,
  onClose,
  especialidades,
  profesionales,
  nameButton,
  resetId,
  refresh,
  modalEstado,
}) => {
  const [nombreEdit, setNombreEdit] = useState({ campo: "", valido: null });
  const [mailEdit, setMailEdit] = useState({ campo: "", valido: null });
  const [especialidadEdit, setEspecialidadEdit] = useState({campo: "", valido: null});
  const [espGuardarEdit, setEspGuardarEdit] = useState([]);
  const [espBorrarEdit, setEspBorrarEdit] = useState([]);
  const [telefonoEdit, setTelefonoEdit] = useState({ campo: "", valido: null});
  const [matriculaEdit, setMatriculaEdit] = useState({campo: "",valido: null});
  const [tipoMatriculaSelect, setTipoMatriculaSelect] = useState(["MP", "MN"]);
  const [tipoMatriculaEdit, setTipoMatriculaEdit] = useState({campo: [], valido: null});
  const [opcionesDefault, setOpcionesDefault] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(true);

  function setearVairables(setVariable, variable, dato) {
    if (dato !== null && dato !== undefined) {
      setVariable({ ...variable, campo: dato, valido: null });
    } else {
      setVariable({ ...variable, campo: "", valido: null });
    }
  }

  useLayoutEffect(() => {
    if (profesionales && profesionales.length !== 0) {
      setearVairables(setNombreEdit, nombreEdit, profesionales.nombre);
      setearVairables(
        setEspecialidadEdit,
        especialidadEdit,
        profesionales.especialidades
      );
      setearVairables(
        setTelefonoEdit,
        telefonoEdit,
        profesionales.contactos[0]?.telefono
      );
      setearVairables(
        setMailEdit,
        mailEdit,
        profesionales.contactos[0]?.mailAlternativo
      );
      setearVairables(
        setTipoMatriculaEdit,
        tipoMatriculaEdit,
        profesionales.tipoMatricula
      );
      setearVairables(setMatriculaEdit, matriculaEdit, profesionales.matricula);

      if (profesionales.especialidades.length > 0) {
        const defaultFormateadas = profesionales.especialidades.map(
          (valor) => ({
            value: valor.id,
            label: valor.nombre,
          })
        );
        setOpcionesDefault(defaultFormateadas);
        const borrar = profesionales.especialidades.map((valor) => valor.id);
        setEspBorrarEdit(borrar);
      }
    }
  }, [profesionales]);

  useLayoutEffect(() => {
    if (especialidadEdit.campo != "") {
      const agregar = especialidadEdit.campo.map((valor) => valor.id);
      setEspGuardarEdit(agregar);
    }
  }, [especialidadEdit.campo]);

  const handleClose = () => {
    modalEstado(false);
  };

  async function guardarEditado() {
    if (
      nombreEdit.valido !== false &&
      especialidadEdit.valido !== false &&
      mailEdit.valido !== false &&
      telefonoEdit.valido !== false &&
      matriculaEdit.valido !== false
    ) {
      if (nombreEdit.valido || tipoMatriculaEdit.valido || matriculaEdit.valido) {
        await AxiosHealth.put(`/profesionales/${profesionales.id}`, {
          nombre: nombreEdit.campo,
          tipoMatricula: tipoMatriculaEdit.campo,
          matricula: matriculaEdit.campo,
        });
      }
      if (especialidadEdit.valido == true) {
        if (profesionales.especialidades.length > 0) {
          await AxiosHealth.put(
            `profesionales/${profesionales.id}/removerEspecialidades`,
            {
              especialidadesIds: espBorrarEdit,
            }
          );
        }
        await AxiosHealth.put(
          `/profesionales/${profesionales.id}/agregarEspecialidades`,
          {
            especialidadesIds: espGuardarEdit,
          }
        );
      }
      if (mailEdit.valido == true || telefonoEdit.valido == true) {
        if (profesionales?.contactos != "") {
          if (mailEdit.campo != "" || telefonoEdit.campo != "") {
            await AxiosHealth.put(
              `/profesionales/${profesionales?.id}/actualizarContacto/${profesionales?.contactos[0]?.id}`,
              {
                mailAlternativo: mailEdit.campo == "" ? null : mailEdit.campo,
                telefono: telefonoEdit.campo,
              }
            );
          } else {
            await AxiosHealth.delete(
              `/profesionales/${profesionales?.id}/eliminarContacto`,
              {
                data: {
                  contactoId: profesionales?.contactos[0].id,
                },
              }
            );
          }
        } else {
          await AxiosHealth.post(
            `/profesionales/${profesionales?.id}/nuevoContacto`,
            {
              mailAlternativo: mailEdit.campo == "" ? null : mailEdit.campo,
              telefono: telefonoEdit.campo,
            }
          );
        }
      }
      resetId([]);
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
      {mostrarForm && profesionales.length !== 0 && (<>
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
                  {"Usted esta editando al profesional: " + nombreEdit.campo}
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
                      leyendaHelper="Nombre del profesional."
                      leyendaError="El nombre tiene que ser de 4 a 16 dígitos y solo puede contener letras y espacios."
                      id="nombre_profesional"
                      label="Nombre"
                      estado={nombreEdit}
                      cambiarEstado={setNombreEdit}
                      expresionRegular={ExpReg.nombre}
                      defaultValue={nombreEdit.campo}
                    />
                    <TextFieldDropdownComponenteSimple
                      leyendaHelper={"Tipo de matricula"}
                      leyendaError="Debe seleccionar un tipo de matricula MP o MN."
                      id="tipoMatricula"
                      label="Tipo Matricula"
                      value={tipoMatriculaSelect}
                      estado={tipoMatriculaEdit}
                      cambiarEstado={setTipoMatriculaEdit}
                    />
                    <TextFieldInputComponente
                      type="text"
                      required
                      leyendaHelper="Numero de matricula del profesional."
                      leyendaError="El correo solo puede contener numeros."
                      id="matricual_profesional"
                      label="Numero de Matricual"
                      estado={matriculaEdit}
                      cambiarEstado={setMatriculaEdit}
                      expresionRegular={ExpReg.matricula}
                      defaultValue={matriculaEdit.campo}
                    />
                    <TextFieldInputComponente
                      type="text"
                      leyendaHelper="Mail del profesional."
                      leyendaError="El correo solo puede contener letras, numeros, puntos, guiones y guion bajo."
                      id="mail_profesional"
                      label="Mail"
                      estado={mailEdit}
                      cambiarEstado={setMailEdit}
                      expresionRegular={ExpReg.correo}
                      defaultValue={mailEdit.campo}
                    />
                    <TextFieldInputComponente
                      type="text"
                      leyendaHelper="Telefono del profesional."
                      leyendaError="El telefono solo puede contener numeros y el maximo son 14 dígitos."
                      id="telefono_profesional"
                      label="Telefono"
                      estado={telefonoEdit}
                      cambiarEstado={setTelefonoEdit}
                      expresionRegular={ExpReg.telefono}
                      defaultValue={telefonoEdit.campo}
                    />
                    <DropdownMultiSelectPrueba
                      leyendaHelper={"Especialidad"}
                      leyendaError="Debe seleccionar una especialidad."
                      id="especialidades"
                      label="Especialidades"
                      value={especialidades}
                      estado={especialidadEdit}
                      cambiarEstado={setEspecialidadEdit}
                      defaultValue={opcionesDefault}
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
