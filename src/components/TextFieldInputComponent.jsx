import React, { useState, useLayoutEffect } from 'react';
import {
    FormControl,
    TextField,
    Box,
    Button,
    Autocomplete,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    IconButton,
    DialogContentText,
    Divider
  } from "@mui/material";
import { faSleigh } from '@fortawesome/free-solid-svg-icons';

  const TextFieldInputComponente = ({required, defaultValue, estado, disabled, cambiarEstado, type, label, name, leyendaHelper, leyendaError, expresionRegular,funcion,readOnly}) => {
	
	useLayoutEffect(() => {
		if(funcion){
			funcion();
		}
	},[estado.campo]);
	
	useLayoutEffect(()=>{
		if(defaultValue != undefined){
			cambiarEstado({...estado, campo: defaultValue, valido: true});
		}
	},[defaultValue])

	const onChange = (e) => {
		if(cambiarEstado){
			if (e.target.value.length == 0 ){
				cambiarEstado({...estado, campo:'', valido: null});
			}else{
				if(expresionRegular){
					if(expresionRegular.test(e.target.value)){
						cambiarEstado({...estado,campo:e.target.value, valido: true});
					} else {
						cambiarEstado({...estado, campo:e.target.value, valido: false});
					}
				} else{
					cambiarEstado({...estado,campo:e.target.value, valido: true});
				}
			}
		}
	}
	return (
		
		
		<TextField 
			fullWidth
			required={required}
			disabled={disabled}
			InputProps={{
				readOnly: readOnly,
			  }}
			type={type}
			error={estado.valido == false ? true : false}
			helperText={estado.valido == false ? leyendaError :leyendaHelper} 
			id={name}
			label={label}
			onChange={onChange}
			//onKeyDown={onChange}
			valido={estado.valido}
			defaultValue={defaultValue}
		/>
		
	);
}
 
export default TextFieldInputComponente;