import React, { useState, useLayoutEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContentText,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import TextFieldInputComponente from "../../components/TextFieldInputComponent";
import TextFieldDireccionComponente from "../../components/TextFieldDireccionComponent";
import ExpReg from "../../elementos/ExpresionesReg";
import { Form } from "react-bootstrap";
import AxiosHealth from "../../interceptor/axiosHealth";

const Modal = ({
  isOpen,
  instituciones,
  nameButton,
  resetId,
  modalEstado,
  refresh,
}) => {
  /****************************************/
  const [mailEdit, setMailEdit] = useState({ campo: "", valido: null });
  const [nombreEdit, setNombreEdit] = useState({ campo: "", valido: null });
  const [telefonoEdit, setTelefonoEdit] = useState({ campo: "", valido: null });
  const [direccionEdit, setDireccionEdit] = useState({campo: "", valido: null });
  const [pisoEdit, setPisoEdit] = useState({ campo: "", valido: null });
  const [departamentoEdit, setDepartamentoEdit] = useState({ campo: "", valido: null});
  const [referenciaEdit, setReferenciaEdit] = useState({campo: "", valido: null});
  const [provinciaEdit, setProvinciaEdit] = useState({campo: "",valido: null});
  const [localidadEdit, setLocalidadEdit] = useState({campo: "", valido: null});
  const [mostrarCamposAdicionales, setMostrarCamposAdicionales] = useState(false);
  const [barrioEdit, setBarrioEdit] = useState({ campo: "", valido: null });
  const [address, setAddress] = useState({ campo: [], valido: null });
  const [mostrarForm, setMostrarForm] = useState(true);

  
  useLayoutEffect(() => {
    if (instituciones && instituciones.length !== 0) {
      setearVairables(setNombreEdit, nombreEdit, instituciones.nombre);
      setearVairables(setTelefonoEdit, telefonoEdit, instituciones.contactos[0]?.telefono);
      setearVairables(
        setMailEdit,
        mailEdit,
        instituciones.contactos[0]?.mailAlternativo
      );
      setearVairables(
        setDireccionEdit,
        direccionEdit,
        instituciones.direccion?.direccion
      );
      setearVairables(
        setProvinciaEdit,
        provinciaEdit,
        instituciones.direccion?.provincia
      );
      setearVairables(
        setLocalidadEdit,
        localidadEdit,
        instituciones.direccion?.localidad
      );
      setearVairables(
        setBarrioEdit,
        barrioEdit,
        instituciones.direccion?.barrio
      );
      setearVairables(setPisoEdit, pisoEdit, instituciones.direccion?.piso);
      setearVairables(
        setDepartamentoEdit,
        departamentoEdit,
        instituciones.direccion?.departamento
      );
      setearVairables(
        setReferenciaEdit,
        referenciaEdit,
        instituciones.direccion?.referencia
      );
    }
  }, [instituciones]);

  useLayoutEffect(() => {
    if (address.campo != "") {
      if (address.campo.route != "") {
        setDireccionEdit({
          campo: address.campo.route + " " + address.campo.street_number,
          valido: true,
        });
        setProvinciaEdit({ campo: address.campo.province, valido: true });
        setLocalidadEdit({ campo: address.campo.locality, valido: true });
        setBarrioEdit({ campo: address.campo.adm_area, valido: true });
      } else {
        setDireccionEdit({ campo: "", valido: false });
        setPisoEdit({ campo: "", valido: null });
        setDepartamentoEdit({ campo: "", valido: null });
        setReferenciaEdit({ campo: "", valido: null });
        setProvinciaEdit({ campo: "", valido: null });
        setLocalidadEdit({ campo: "", valido: null });
        setBarrioEdit({ campo: "", valido: null });
      }

      if (address.campo.route.length > 3) {
        setMostrarCamposAdicionales(true);
      } else {
        setMostrarCamposAdicionales(false);
      }
    }
  }, [address]);

  const handleClose = () => {
    resetId([]);
    setAddress({ ...address, valido: true });
    if (refresh) {
      refresh();
    }
    modalEstado(false);
  };

  const validarObligatorio = (estado, cambiarEstado) => {
    if (estado.campo == null) {
      cambiarEstado({ ...estado, valido: false });
    } else if (estado.campo == "") {
      cambiarEstado({ ...estado, valido: false });
    }
  };

  async function guardarEditado() {
    validarObligatorio(nombreEdit, setNombreEdit);
    validarObligatorio(direccionEdit, setDireccionEdit);
    if (!direccionEdit.valido) {
      setAddress({ ...address, valido: false });
    }
    if (
      nombreEdit.valido !== false &&
      mailEdit.valido !== false &&
      telefonoEdit.valido !== false &&
      direccionEdit.valido !== false &&
      pisoEdit.valido !== false
    ) {
      if (nombreEdit.valido) {
        await AxiosHealth.put(`/institucionesSalud/${instituciones.id}`, {
          nombre: nombreEdit.campo,
        });
      }
      if (mailEdit.valido == true || telefonoEdit.valido == true) {
        if (instituciones?.contactos != "") {
          if (mailEdit.campo != "" || telefonoEdit.campo != "") {
            await AxiosHealth.put(
              `/institucionesSalud/${instituciones?.id}/actualizarContacto/${instituciones?.contactos[0]?.id}`,
              {
                mailAlternativo: mailEdit.campo == "" ? null : mailEdit.campo,
                telefono: telefonoEdit.campo,
              }
            );
          } else {
            await AxiosHealth.delete(
              `/institucionesSalud/${instituciones?.id}/eliminarContacto`,
              {
                data: {
                  contactoId: instituciones?.contactos[0].id,
                },
              }
            );
          }
        } else {
          await AxiosHealth.post(
            `/institucionesSalud/${instituciones?.id}/nuevoContacto`,
            {
              mailAlternativo: mailEdit.campo == "" ? null : mailEdit.campo,
              telefono: telefonoEdit.campo,
            }
          );
        }
      }

      if (
        address.valido == true ||
        pisoEdit.valido == true ||
        departamentoEdit.valido == true ||
        referenciaEdit.valido == true
      ) {
        if (instituciones?.direccion) {
          if (direccionEdit.campo !== "" && direccionEdit.campo !== " ") {
            await AxiosHealth.put(
              `/institucionesSalud/${instituciones?.id}/actualizarDireccion/${instituciones?.direccion?.id}`,
              {
                direccion: direccionEdit.campo,
                piso: pisoEdit.campo,
                departamento: departamentoEdit.campo,
                provincia: provinciaEdit.campo,
                localidad: localidadEdit.campo,
                barrio: barrioEdit.campo,
                referencia: referenciaEdit.campo,
              }
            );
          } else {
            await AxiosHealth.delete(`/institucionesSalud/${instituciones?.id}/eliminarDireccion`,
              {
                data: {
                  direccionId: instituciones?.direccion?.id,
                },
              }
            );
          }
        } else if (direccionEdit.campo !== "") {
          await AxiosHealth.post(
            `/institucionesSalud/${instituciones.id}/nuevaDireccion`,
            {
              direccion: direccionEdit.campo,
              piso: pisoEdit.campo,
              departamento: departamentoEdit.campo,
              referencia: referenciaEdit.campo,
              provincia: provinciaEdit.campo,
              localidad: localidadEdit.campo,
              barrio: barrioEdit.campo,
            }
          ).catch((error) => {
            console.error(error);
          });
        }
      }
      console.log("Guardando");
      resetId([]);
      if (refresh) {
        refresh();
      }
    } 
  }

  function setearVairables(setVariable, variable, dato) {
    if (dato !== null && dato !== undefined) {
      setVariable({ ...variable, campo: dato, valido: true });
    } else {
      setVariable({ ...variable, campo: "", valido: null });
    }
  }

  return (
    <>
      {mostrarForm && instituciones.length !== 0 && (
        <>
          <Dialog
            open={isOpen}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xl"
            maxheight="xl"
            style={{ marginTop: "50px", textAlign: "center", width: "100%", zIndex: 100 }}
          >
            <DialogTitle className="card-header">
              <DialogContentText>
                <h5>
                  {" "}
                  <EditIcon sx={{ fontSize: 25 }} /> Usted esta editando al
                  institucion: {nombreEdit.campo}
                </h5>
              </DialogContentText>
              <div className="my-5"></div>
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
                      leyendaHelper="Razon social de la institucion."
                      leyendaError="El nombre tiene que ser de 4 a 16 dígitos y solo puede contener letras y espacios."
                      id="nombre_institucion"
                      label="Razon Social"
                      estado={nombreEdit}
                      cambiarEstado={setNombreEdit}
                      expresionRegular={ExpReg.nombre}
                      defaultValue={nombreEdit.campo}
                    />
                    <TextFieldInputComponente
                      type="text"
                      leyendaHelper="Mail del institucion."
                      leyendaError="El correo solo puede contener letras, numeros, puntos, guiones y guion bajo."
                      id="mail_institucion"
                      label="Mail"
                      estado={mailEdit}
                      cambiarEstado={setMailEdit}
                      expresionRegular={ExpReg.correo}
                      defaultValue={mailEdit.campo}
                    />
                    <TextFieldInputComponente
                      type="text"
                      leyendaHelper="Telefono del institucion."
                      leyendaError="El telefono solo puede contener numeros y el maximo son 14 dígitos."
                      id="telefono_institucion"
                      label="Telefono"
                      estado={telefonoEdit}
                      cambiarEstado={setTelefonoEdit}
                      expresionRegular={ExpReg.telefono}
                      defaultValue={telefonoEdit.campo}
                    />
                    <TextFieldDireccionComponente
                      type="text"
                      leyendaHelper="Direccion de la institucion."
                      leyendaError="El la direccion debe tener minimo 4 caracteres."
                      id="direccion_institucion"
                      label="Direccion"
                      estado={address}
                      cambiarEstado={setAddress}
                      expresionRegular={ExpReg.direccion}
                      defaultValue={direccionEdit.campo}
                    />

                    {direccionEdit.campo && direccionEdit.campo.length > 3 && (
                      <>
                        <TextFieldInputComponente
                          type="text"
                          leyendaHelper="Piso si corresponde."
                          leyendaError="El piso debe tener maximo 2 caracteres."
                          id="piso_direccion_institucion"
                          label="Piso"
                          estado={pisoEdit}
                          cambiarEstado={setPisoEdit}
                          expresionRegular={ExpReg.piso}
                          defaultValue={pisoEdit.campo}
                        />
                        <TextFieldInputComponente
                          type="text"
                          leyendaHelper="Departamento si corresponde."
                          id="departamento_direccion_institucion"
                          label="Departamento"
                          estado={departamentoEdit}
                          cambiarEstado={setDepartamentoEdit}
                          expresionRegular={ExpReg.piso}
                          defaultValue={departamentoEdit.campo}
                        />
                        <TextFieldInputComponente
                          type="text"
                          readOnly
                          leyendaHelper=" "
                          id="provincia_direccion_institucion"
                          label="Provincia"
                          estado={provinciaEdit}
                          cambiarEstado={setProvinciaEdit}
                          defaultValue={provinciaEdit.campo}
                        />
                        <TextFieldInputComponente
                          type="text"
                          readOnly
                          leyendaHelper=" "
                          id="localidad_direccion_institucion"
                          label="Localidad"
                          estado={localidadEdit}
                          cambiarEstado={setLocalidadEdit}
                          defaultValue={localidadEdit.campo}
                        />
                        <TextFieldInputComponente
                          type="text"
                          readOnly
                          leyendaHelper=" "
                          id="barrio_direccion_institucion"
                          label="Barrio"
                          estado={barrioEdit}
                          cambiarEstado={setBarrioEdit}
                          defaultValue={barrioEdit.campo}
                        />

                        <TextFieldInputComponente
                          type="text"
                          leyendaHelper="Referencia (opcional)."
                          id="referencia_direccion_institucion"
                          label="Referencia (opcional)"
                          estado={referenciaEdit}
                          cambiarEstado={setReferenciaEdit}
                          defaultValue={referenciaEdit.campo}
                        />
                      </>
                    )}
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
