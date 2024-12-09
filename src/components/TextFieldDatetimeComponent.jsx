import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  TextField,
} from "@mui/material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { format, parse, differenceInYears } from 'date-fns';

const TextFieldDatetimeComponent = ({ 
  filter, 
  defaultValue, 
  estado, 
  cambiarEstado, 
  type, 
  label, 
  name, 
  leyendaHelper, 
  leyendaError, 
  expresionRegular, 
  mayorDeEdad 
}) => {
  const [selectedDate, setSelectedDate] = useState('');
  const fechaActual = new Date(); // Cambio a objeto Date para maxDate

  useLayoutEffect(() => {
    setSelectedDate(defaultValue ? parse(defaultValue, 'yyyy-MM-dd', new Date()) : fechaActual);
  }, [defaultValue]);

  function CalcularEdad(fechaNacimiento) {
    const fechaNacimientoDate = parse(fechaNacimiento, 'yyyy-MM-dd HH:mm:ss', new Date());
    const fechaActual = new Date();
    return differenceInYears(fechaActual, fechaNacimientoDate);
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
        if (!filter) {
          cambiarEstado({...estado, campo: fechaFormateada, valido: defaultValue !== fechaFormateada ? true : null});
        } else {
          cambiarEstado({...estado, campo: fechaFormateada, valido: true});
        }
    }
  }, [selectedDate]);

  const onChange = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      // Formatea la fecha si es válida
      const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
      setSelectedDate(formattedDate);
    } else {
      cambiarEstado({...estado, valido: false}); // Indica que la fecha es inválida
    }
  };

  return (
    <div className="date-picker-container">
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
        <DatePicker
          label={label}
          value={selectedDate}
          onChange={onChange}
          renderInput={(params) => 
            <TextField 
              {...params} 
              error={!estado.valido}
              helperText={!estado.valido ? leyendaError : leyendaHelper}
              style={{ width: '100%' }}
            />}
          maxDate={fechaActual}
        />
      </LocalizationProvider>
    </div>
  );
};

export default TextFieldDatetimeComponent;
