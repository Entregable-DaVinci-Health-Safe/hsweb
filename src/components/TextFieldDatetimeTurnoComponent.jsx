  import React, { useState } from 'react';
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

  import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
  import { LocalizationProvider } from '@mui/x-date-pickers';
  import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
  import { DatePicker } from '@mui/x-date-pickers';
  import {es} from 'date-fns/locale'
  import { format,parse, differenceInYears } from 'date-fns';
  import { Event } from '@mui/icons-material';
  import { useEffect, useLayoutEffect } from 'react';

  const TextFieldDatetimeTurnoComponent = ({filter, defaultValue, estado, cambiarEstado, type, label, name, leyendaHelper, leyendaError, expresionRegular,mayorDeEdad}) => {
  
  const [selectedDate, setSelectedDate] = useState('');
  const fechaActual = format(new Date(), 'yyyy-MM-dd: HH:mm:ss');

  useLayoutEffect(() => {
    setSelectedDate(defaultValue ? parse(defaultValue, 'yyyy-MM-dd', new Date()) : fechaActual);
  }, [defaultValue]);

  // Fija la fecha actual

  function CalcularEdad(fechaNacimiento) {
    const fechaNacimientoDate = parse(fechaNacimiento, 'yyyy-MM-dd: HH:mm:ss', new Date());
    const fechaActual = new Date();
    const edad = differenceInYears(fechaActual, fechaNacimientoDate);
    return edad;
  }

  function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const anio = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  useLayoutEffect(() => {
    const edad = CalcularEdad(selectedDate);
    const fechaFormateada = formatearFecha(selectedDate);

    if (expresionRegular) {
        // Realiza la validación aquí si es necesario
    }

    if (mayorDeEdad) { 
        if (edad < 18) {
            cambiarEstado({...estado, valido: false});
        } else {
            cambiarEstado({...estado, campo: fechaFormateada, valido: true});
        }
    } else {
        if(!filter){
          cambiarEstado({...estado, campo: fechaFormateada, valido: defaultValue != fechaFormateada ? true : null});
        }else{
          cambiarEstado({...estado, campo: fechaFormateada, valido: true});
        }
    }
  }, [selectedDate]);

      
      
      

    const onChange = (date) => {
      // Formatea la fecha en el formato "yyyy-MM-dd"
      const formattedDate = format(date, 'yyyy-MM-dd: HH:mm:ss');
      setSelectedDate(formattedDate);
    };

    return (
      <div className="date-picker-container">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es} >
        <DatePicker
          label={label}
          value={selectedDate}
          onChange={onChange}
          renderInput={(params) => 
            <TextField {...params} 
              error={estado.valido === false}
              helperText={estado.valido === false ? leyendaError : leyendaHelper}
							style={{ width: '100%' }}
            />}
          minDate={fechaActual}
        />
      </LocalizationProvider>
    </div>
      
    );
  }
  
  export default TextFieldDatetimeTurnoComponent;