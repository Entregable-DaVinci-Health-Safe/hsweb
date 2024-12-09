import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import {LeyendaError} from './../elementos/Formularios';

export default function RadioButtonComponent({children, estado, cambiarEstado, title,leyendaError}) {
  const [value, setValue] = React.useState();

  const onChange = (e) => {
    cambiarEstado({...estado, campo: e.target.value, valido: true});
   };

  return (
    <FormControl>
      <FormLabel id="demo-controlled-radio-buttons-group">{title}</FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-controlled-radio-buttons-group"
        name="controlled-radio-buttons-group"
        value={value}
        onChange={onChange}
        
      >
        {children}
        
      </RadioGroup>
      <LeyendaError valido={estado.valido}>{leyendaError}</LeyendaError>
    </FormControl>
  );
}