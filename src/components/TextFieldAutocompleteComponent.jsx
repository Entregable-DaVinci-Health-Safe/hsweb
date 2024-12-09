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

  const TextFieldAutocompleteComponent = ({required, base, defaultValue, estado, cambiarEstado, type,  label, name, leyendaHelper, leyendaError, expresionRegular,funcion,readOnly}) => {
	const [query, setQuery] = useState( '');
  	const [results, setResults] = useState([]);
	
	useEffect(() => {
	if (query.length >= 4) {
		// Simulación de una consulta (reemplazar con tu lógica real)
		const filteredData = base.filter((item) => item.nombre.includes(query));
		//console.log(filteredData)
		// const fakeResults = Array.from({ length: 10 }, (_, index) => `Result ${index + 1}`);
		setResults(filteredData);
		}else{
		setResults([]);
		}
	}, [query]);

	const onChange = (e, valor) => {
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
		<Autocomplete
			id="search"
			options={results}
			getOptionLabel={(option) => option.nombre.toUpperCase()}
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
	);
}
 
export default TextFieldAutocompleteComponent;