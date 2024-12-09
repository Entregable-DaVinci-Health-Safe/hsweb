import React, { useState, useRef, useEffect } from 'react';
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
import AxiosHealth from "./../interceptor/axiosHealth";

  const TextFieldAutocompleteComponentMedicaciones = ({required, defaultValue, estado, cambiarEstado, type,  label, name, leyendaHelper, leyendaError, expresionRegular,funcion,readOnly}) => {
	const [query, setQuery] = useState(defaultValue || []);
  	const [results, setResults] = useState([]);
	
	useEffect(() => {
		
		if (query.length >= 4 || defaultValue) {
			AxiosHealth.get(`/medicamentos/all/${query}`)
			.then((response) =>{
				setResults(response.data);
			})
		}else{
			setResults([]);
		}
	}, [query]);

	const onChange = (e,valor) => {
		console.log(valor)
		if(cambiarEstado){
			if(valor){
				cambiarEstado({...estado,campo:valor, valido: true});
			}
			else{
				cambiarEstado({...estado,campo:'', valido: null});
			}
		}
	}
	return (
		<FormControl>
		<Autocomplete
			id="search"
			options={results}
			getOptionLabel={(option) => option.nombre}
			onChange={onChange}
			renderInput={(params) => (
				<TextField
				{...params}
				label={label}
				variant="outlined"
				onChange={(e) => setQuery(e.target.value)}
				error={estado.valido == false}
				helperText={estado.valido == false ? leyendaError :leyendaHelper}
				/>
			)}
		/>
		</FormControl>
	);
}
 
export default TextFieldAutocompleteComponentMedicaciones;