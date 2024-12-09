import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';

const TimeZoneSelector = ({
  defaultValue,
  estado,
  cambiarEstado,
  timeZone,
  setTimeZone,
  offset,
  setOffset,
  label,
  leyendaHelper,
  leyendaError,
}) => {
  const [selectedTime, setSelectedTime] = useState(''); // Para guardar el horario seleccionado

  useEffect(() => {
    // Detectar zona horaria y desfase
    const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const date = new Date();
    const offsetMinutes = -date.getTimezoneOffset(); // En minutos
    const offsetHours = Math.floor(offsetMinutes / 60);
    const offsetMinutesRemainder = offsetMinutes % 60;

    const formattedOffset = `${offsetHours >= 0 ? '+' : ''}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutesRemainder).padStart(2, '0')}`;
    setTimeZone(timeZoneName);
    setOffset(formattedOffset);
  }, [setTimeZone, setOffset]);

  const handleTimeChange = (event) => {
    cambiarEstado({...estado, campo:event.target.value, valido: true}); // Guardar el horario seleccionado
  };

  return (
    <div>
      <div>
        <TextField
          id="time-picker"
          label={label || 'Seleccionar Horario'}
          type="time"
          value={estado.campo}
          onChange={handleTimeChange}
          error={estado.valido === false}
          helperText={estado.valido === false ? leyendaError : leyendaHelper}
          InputLabelProps={{
            shrink: true, // Asegura que la etiqueta no se superponga
          }}
          inputProps={{
            step: 1, // Permite incluir segundos en el selector de tiempo
          }}
          fullWidth
        />
        <p>Zona horaria detectada: {timeZone}</p>
      </div>
    </div>
  );
};

export default TimeZoneSelector;
