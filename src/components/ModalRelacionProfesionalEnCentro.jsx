import React, { useState, useLayoutEffect } from 'react';
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
import DropdownMultiSelectPrueba from './DropdownMultiSelectPrueba';




const ModalRelacionProfesionalEnCentro = ({ buttonGoTo, setOpenAsociarProfesional, openAsociarProfesional, setProfGuardar, profGuardar, setProfesional, profesional, setMostrarForm, objetos, refresh, validarObligatorio, datosResponsable }) => {
  const { idHCResponsable, nombreResponsable, apellidoResponsable } = datosResponsable || {};
  const navigate = useNavigate();
   
  function handleCloseAsociarProfesional(){
    //Aplicar editando informacion personal
    setOpenAsociarProfesional(false);
    setMostrarForm(false);
    if(refresh){
      refresh();
    }
  };

  async function relacionarPF(){
    validarObligatorio(profesional, setProfesional);
    if(profesional.valido){
      await AxiosHealth.put(`/institucionesSalud/${localStorage.getItem("id_cen")}/agregarProfesionales`,
      {
        profesionalesIds: profGuardar
      })
      .then( function (response){
        console.log('OK!!!')
      })
      .catch(function (response){
        console.error(response)
        console.log('MALARDOOOO')
      });
      handleCloseAsociarProfesional();
    }
    
  }

  useLayoutEffect(() => {
    if (profesional.campo != "") {
      //setEspGuardar((espGuardar) => [...espGuardar, especialidad.campo.id]);
      
      profesional.campo.map((value) => (
        setProfGuardar(profGuardar =>[...profGuardar, value.id])
      ))
    }
  }, [profesional.campo]);

  const agregarProfesional = () => {
    navigate('/profesionales', { state: { idHCResponsable, nombreResponsable, apellidoResponsable} });
    handleCloseAsociarProfesional();
  };

  return (
    <Dialog
      open={openAsociarProfesional}
      onClose={handleCloseAsociarProfesional}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle>Asociar Profesional del usuario {idHCResponsable ? `${nombreResponsable} ${apellidoResponsable}` : null}</DialogTitle>
      <DialogContent style={{ width: "100%", paddingBottom:"40%" }}>
        <DialogContentText>
          En caso que no encuentre al profesional puede agregarlo
        </DialogContentText>
        <div className="my-2"></div>
        <FormControl method="post" id="Input" >
          <DropdownMultiSelectPrueba
            leyendaHelper="Seleccione profesional"
            label="Profesional"
            value={objetos}
            estado={profesional}
            cambiarEstado={setProfesional}
          />
        </FormControl>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
        <Button 
          variant="contained" 
          onClick={relacionarPF}
        >
          Confirmar asociacion
        </Button>
        {buttonGoTo && (
          <>
            <Button
              variant="outlined"
              onClick={agregarProfesional}
              autoFocus
              style={{
                textDecoration: "none",
              }}
            >
              Agregar profesional
            </Button>
        </>
        )}
        <Button
          variant="outlined"
          onClick={handleCloseAsociarProfesional}
          autoFocus
        >
          Volver
        </Button>
      </DialogActions>
      <Divider className="my-1" />
             
    </Dialog>
  ); 
};

export default ModalRelacionProfesionalEnCentro;