import React, { useState, useEffect } from "react";
import {
  OutlinedInput,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
  FormHelperText,
  Stack,
  Chip,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

const TextFieldDropdownComponenteSimple = ({
  estado,
  value,
  cambiarEstado,
  label,
  name,
  leyendaHelper,
  leyendaError,
}) => {
  const onChange = (e) => {
    cambiarEstado({ ...estado, campo: e.target.value, valido: true });
  };
 return (
    <FormControl fullWidth error={estado.valido == false ? true : false}>
      <InputLabel fullWidth>{leyendaHelper}</InputLabel>
      <Select
        value={estado.campo}
        label={label}
        onChange={onChange}
        fullWidth
      >
        <MenuItem value={estado.campo} disabled>
          {estado.campo}
        </MenuItem>
        {value?.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{estado.valido == false ? leyendaError :leyendaHelper}</FormHelperText>
    </FormControl>
  );
};

export default TextFieldDropdownComponenteSimple;
