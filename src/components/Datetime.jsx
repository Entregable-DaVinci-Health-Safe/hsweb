import React, {useState} from 'react';
import {DateTimeWrapper, DateTimeInput, LeyendaError, IconoValidacion} from '../elementos/Formularios';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import {
	FormControl,
	IconButton
} from "@mui/material";

const ComponenteDateTime = ({required, estado, cambiarEstado, tipo, leyendaError, expresionRegular, funcion}) => {
	const onChange = (e) => {
		setDateTime(e.target.value);
		cambiarEstado({...estado, campo: e.target.value, valido:true});
		console.log(e.target.value)
	}

	const validacion = () => {
	// aca podriamos validar que la fecha de nacimiento sea mayor a 18 años caso contrario no es mayor de edad

		if(expresionRegular){
			if(expresionRegular.test(estado.campo)){
				cambiarEstado({...estado, valido: true});
			} else {
				cambiarEstado({...estado, valido: false});
			}
		}

		if(funcion){
			funcion();
		}
	}
	
	const [dateTime, setDateTime] = useState('');
	 

	const handleDateTimeChange = (event) => {
		setDateTime(event.target.value);
		
	  };
	  
	return (
		<FormControl variant="outlined">
			{/*<Label htmlFor={name} valido={estado.valido}>{label}</Label>*/}
			
			<DateTimeWrapper>
				<DateTimeInput
					type={tipo} //"datetime-local"
					value={dateTime}
					onChange={onChange}
					required
					defaultValue={'2001-08-10'}
				/>
			</DateTimeWrapper>
				<IconoValidacion 
					icon={estado.valido === true ? faCheckCircle : faTimesCircle}
					valido={estado.valido}
				/>
			
			<LeyendaError valido={estado.valido}>{leyendaError}</LeyendaError>
		</FormControl>
	);
}
 
export default ComponenteDateTime;