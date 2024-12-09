import React, { useState,useLayoutEffect } from "react";
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  FormHelperText, 
  ListItemText,
  Checkbox
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

const DropdownMultiSelect = ({estado, value, cambiarEstado, label, name, leyendaHelper,leyendaError, defaultValue})=> {
  const [seleccionadoItem, setSeleccionadoItem] = useState(estado.campo || []);

   
  useLayoutEffect(() => {
    setSeleccionadoItem(value.filter(option => estado.campo.includes(option)));
    
  }, [estado.campo, value]);
 // seleccionadoItem.map((value) => (console.log(value)))
  return (
    <FormControl sx={{ m: 1 }}  error={estado.valido == false ? true : false}>
      <InputLabel id="demo-simple-select-helper-label">{leyendaHelper}</InputLabel>
      <Select
        label={label}
        multiple
        value={estado.campo}
        onChange={(e) => {
          console.log(e.target.value)
          seleccionadoItem.map((value) => (console.log(value)))
         // setSeleccionadoItem(e.target.value);
          cambiarEstado({...estado, campo: value, valido:true})
        }} 
        input={<OutlinedInput label="Multiple Select" />}
        renderValue={() =>  seleccionadoItem.map((value) => value)  }
      > 
        {value?.map((option) => (
          <MenuItem key={option.value} value={option}>
            <Checkbox checked={seleccionadoItem.indexOf(option.nombre) > -1} />
            <ListItemText primary={option.nombre} />
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{leyendaHelper}</FormHelperText>
    </FormControl>
  );
}

export default DropdownMultiSelect;