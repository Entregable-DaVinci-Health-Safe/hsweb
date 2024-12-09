import React, { useState, useLayoutEffect} from 'react';
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
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import { faSleigh } from '@fortawesome/free-solid-svg-icons';
import {LeyendaError} from './../elementos/Formularios';

  const TextFieldPasswordComponente = ({required, defaultValue, estado, cambiarEstado, type, label, name, leyendaHelper, leyendaError, expresionRegular,funcion}) => {
	

	const [showPassword, setShowPassword] = React.useState(false);

	const handleClickShowPassword = () => setShowPassword((show) => !show);
  
	const handleMouseDownPassword = (event) => {
	  event.preventDefault();
	};

	useLayoutEffect(() => {
		if(funcion){
			funcion();
		}
	},[estado.campo]);
  
	const onChange = (e) => {
		if (e.target.value.length === 0 ){
			cambiarEstado({...estado, campo:'', valido: null});
		}else{
			if(expresionRegular){
				if(expresionRegular.test(e.target.value)){
					cambiarEstado({...estado,campo:e.target.value, valido: true});
				} else {
					cambiarEstado({...estado, campo:e.target.value, valido: false});
				}
			} else{
				cambiarEstado({...estado,campo:e.target.value});
			}
		}
		
	}

	return (
		
		<FormControl sx={{ width: '100%' }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">{leyendaHelper}</InputLabel>
          <OutlinedInput
		 	id="outlined-adornment-password"
            type={showPassword ? 'text' : 'password'}
			error={estado.valido === false ? true : false}
			endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
						required
            label={label}
			onChange={onChange}
          />
		   <LeyendaError valido={estado.valido}>{leyendaError}</LeyendaError>
        </FormControl>
		
	);
}
 
export default TextFieldPasswordComponente;