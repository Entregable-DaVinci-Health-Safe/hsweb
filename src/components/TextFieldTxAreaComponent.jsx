import React, { useState, useRef } from 'react';
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

const TextFieldTxAreaComponente = ({required, defaultValue, estado, cambiarEstado, type, label, name, leyendaHelper, leyendaError, expresionRegular,funcion,readOnly}) => {

    const onChange = (e) => {
		if(cambiarEstado){
			if (e.target.value.length == 0 ){
				cambiarEstado({...estado, campo:'', valido: true});
			}else{
				if(expresionRegular){
					if(expresionRegular.test(e.target.value)){
						cambiarEstado({...estado,campo:e.target.value, valido: true});
					} else {
						cambiarEstado({...estado, campo:e.target.value, valido: false});
					}
				} else{
					const textoFormateado = e.target.value
					.replace(/\n/g, '\\n') // Reemplazar caracteres de nueva línea por '\n'
					.replace(/[áÁ]/g, 'a') // Reemplazar á y Á por a
					.replace(/[éÉ]/g, 'e') // Reemplazar é y É por e
					.replace(/[íÍ]/g, 'i') // Reemplazar í e Í por i
					.replace(/[óÓ]/g, 'o') // Reemplazar ó y Ó por o
					.replace(/[úÚ]/g, 'u') // Reemplazar ú y Ú por u
					.replace(/[üÜ]/g, 'u') // Reemplazar ü y Ü por u
					.replace(/['`´]/g, ' ') // Eliminar apostrofes
					.replace(/&/g, '&amp;') // Reemplazar "&" con "&amp;"
					.replace(/\|/g, '&#124;'); // Reemplazar "|" con "&#124;"
					cambiarEstado({...estado, campo: textoFormateado, valido: true});
				}
			}
		}
	}

  return (
    <TextField 
			fullWidth
			required={required}
            multiline
            rows={4}
			InputProps={{
				readOnly: readOnly,
			  }}
			type={type}
			error={estado.valido == false ? true : false}
			helperText={estado.valido == false ? leyendaError :leyendaHelper} 
			id={name}
			label={label}
			onChange={onChange}
			valido={estado.valido}
			defaultValue={defaultValue}
		/>

    );
}
 
export default TextFieldTxAreaComponente;