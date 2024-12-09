import React, { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Switch,
  FormLabel,
} from "@mui/material";

const SwitchsComponent = ({
  estado,
  cambiarEstado,
  leyendaHelper,
  disabled,
  opcionA,
  opcionB,
}) => {
  const [label, setLabel] = useState(estado.campo ? opcionA : opcionB);

  const onChange = (e) => {
    cambiarEstado({ ...estado, campo: e.target.checked, valido: true });
    setLabel(e.target.checked ? opcionA : opcionB);
  };

  return (
    <FormControl fullWidth>
      <FormLabel fullWidth>{leyendaHelper}</FormLabel>
      
      <FormControlLabel
        control={
          <Switch
            color="primary"
            checked={estado.campo || false}
            onChange={onChange}
            inputProps={{ "aria-label": "controlled" }}
            disabled={disabled == estado.valido ? true : false}
            
          />
        }
        label={estado.campo ? opcionA : opcionB}
      />
    </FormControl>
  );
};

export default SwitchsComponent;
