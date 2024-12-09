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
  Button
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";

const TextFieldDropdownMultipleComponent = ({
  elementos,
  estado,
  cambiarEstado,
  label,
  name,
  leyendaHelper,
  leyendaError,
}) => {

  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    // Cargar elementos seleccionados por defecto al iniciar
    setSelectedOptions(estado);
  }, [estado]);


  const onChange = (e) => {
    const selectedIds = e.target.value;
    const selectedElements = elementos.filter((element) => selectedIds.includes(element.id));
    setSelectedOptions(selectedElements);
    cambiarEstado(selectedElements);
  };

  const handleRemoveAll = () => {
    setSelectedOptions([]);
    cambiarEstado([]);
  };

  const handleRemoveOne = (id) => {
    const updatedSelectedOptions = selectedOptions.filter((element) => element.id !== id);
    setSelectedOptions(updatedSelectedOptions);
    cambiarEstado(updatedSelectedOptions);
  };

  return (
    <FormControl fullWidth error={estado.valido == false ? true : false}>
      <InputLabel fullWidth>{leyendaHelper}</InputLabel>
      <Select 
        multiple 
        value={selectedOptions.map((element) => element.id)}
        label={label}
        onChange={onChange}
        fullWidth
        renderValue={(selected) => (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {selectedOptions.map((selectedElement) => (
              <Chip key={selectedElement.id} label={selectedElement.nombre} />
            ))}
          </div>
        )}
      >
        {elementos.map((element) => (
          <MenuItem key={element.id} value={element.id}>
            {element.nombre}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{estado.valido == false ? leyendaError :leyendaHelper}</FormHelperText>
    </FormControl>
  );
};

export default TextFieldDropdownMultipleComponent;
