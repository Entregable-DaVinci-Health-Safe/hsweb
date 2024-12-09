import React, { useState } from 'react';
import {
    FormControl,
    TextField,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText
  } from "@mui/material";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AxiosHealth from '../interceptor/axiosHealth';

import { Form } from "react-bootstrap";

import { set } from 'date-fns';

const ModalConfirmar = ({ isOpen, title, idSelect, nameButton, modalEstado, objetos, refresh }) => {

 const objetosDelete = objetos.filter((filtrarObjetos)=>filtrarObjetos.id==idSelect);
  
 /******** Desactivar Centro **********/
 async function desactivarCentro(){
  await AxiosHealth .put(`institucionesSalud/${idSelect}/desactivar`)
  if(refresh){
    refresh();
  }
  modalEstado(false);
 }
  
  const handleClose = () => {
    modalEstado(false);
  };

  
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className="card-header">
        <DeleteForeverIcon />
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {title} {objetosDelete[0]?.nombre}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={desactivarCentro}>{nameButton}</Button>
          <Button onClick={handleClose} autoFocus>
            Cancelar
          </Button>
        </DialogActions>
      </DialogTitle>
    </Dialog>
        
  );
};

export default ModalConfirmar;