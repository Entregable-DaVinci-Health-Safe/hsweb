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
    DialogContentText,
    Divider
  } from "@mui/material";

import { Link, useNavigate } from "react-router-dom";
import AxiosHealth from '../interceptor/axiosHealth';
import TextFieldDropdownComponente from './TextFieldDropdownComponent';




const ModalRelacionCentroEnProfesional = ({ buttonGoTo, setOpenAsociarProfesional, openAsociarProfesional, setCentroDeSalud, centroDeSalud, setMostrarForm, objetos, refresh, validarObligatorio, datosResponsable }) => {
  const { idHCResponsable, nombreResponsable, apellidoResponsable } = datosResponsable || {};
  const navigate = useNavigate();
  
  function handleCloseAsociarInstitucion(){
    //Aplicar editando informacion personal
    setOpenAsociarProfesional(false);
    setMostrarForm(false);
    if(refresh){
      refresh();
    }
  };

  function volver(){
    setCentroDeSalud({campo:'', valido: null})
    handleCloseAsociarInstitucion();
  }

  async function relacionarCS(){
    validarObligatorio(centroDeSalud, setCentroDeSalud);
    if(centroDeSalud.valido){
      await AxiosHealth.put(`/institucionesSalud/${centroDeSalud.campo.id}/agregarProfesional/${localStorage.getItem("id_pro")}`)
      .then( function (response){
        console.log('OK!!!')
      })
      .catch(function (response){
        console.error(response)
        console.log('MALARDOOOO')
      });
      handleCloseAsociarInstitucion();
    }
    
  }

  const agregarInstitucion = () => {
    navigate('/institucionesDeSalud', { state: { idHCResponsable, nombreResponsable, apellidoResponsable} });
    handleCloseAsociarInstitucion();
  };

  return (
    <Dialog
      open={openAsociarProfesional}
      //onClose={handleCloseAsociarInstitucion}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Asociar Institucion del usuario {idHCResponsable ? `${nombreResponsable} ${apellidoResponsable}` : null}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          En caso que no encuentre la institucion puede agregarla
        </DialogContentText>

        <div className="my-2"></div>

        <FormControl
          // style={{ zIndex: "1000%" }}
          method="post"
          id="Input"
        > 
          <TextFieldDropdownComponente
            leyendaHelper="Seleccione centro de salud"
            // leyendaError="Debe seleccionar un tipo de matricula MP o MN."
            label="Centro de salud"
            value={objetos}
            estado={centroDeSalud}
            cambiarEstado={setCentroDeSalud}
          />
          
        </FormControl>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <Button 
          variant="contained" 
          onClick={relacionarCS}
        >
          Confirmar asociacion
        </Button>
        {buttonGoTo && (
          <>
            <Button
              variant="outlined"
              onClick={agregarInstitucion}
              autoFocus
              style={{
                textDecoration: "none",
              }}
            >
              
                Agregar institucion
           </Button>
            </>
        )}

        <Button
          variant="outlined"
          onClick={volver}
          autoFocus
        >
          Volver
        </Button>
      </DialogActions>
      <Divider className="my-1" />
    </Dialog>
  ); 
};

export default ModalRelacionCentroEnProfesional;