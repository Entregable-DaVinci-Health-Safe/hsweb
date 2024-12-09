import React, { useState, useLayoutEffect } from "react";
import { FormControl, FormHelperText } from "@mui/material";
import Select from "react-select";

const DropdownMultiSelectPrueba = ({
  estado,
  value,
  cambiarEstado,
  leyendaHelper,
  leyendaError,
  defaultValue,
}) => {
  // Convierte las opciones a un formato que acepta react-select
  const opcionesFormateadas = value.map((valor) => ({
    value: valor.id,
    label: valor.nombre,
  }));

  const [opcionesSeleccionadas, setOpcionesSeleccionadas] = useState([]);

  // Función para manejar el cambio en las opciones seleccionadas
  const handleSelectChange = (seleccionadas) => {
    setOpcionesSeleccionadas(seleccionadas);
  };

  useLayoutEffect(() => {
    const opcionesFormateadas = opcionesSeleccionadas.map((opcion) => ({
      id: opcion.value,
      nombre: opcion.label,
    }));

		if (opcionesFormateadas.length > 0) {
      cambiarEstado({ ...estado, campo: opcionesFormateadas, valido: true });
    } else {
      cambiarEstado({ ...estado, campo: opcionesFormateadas, valido: null });
    }
  }, [opcionesSeleccionadas]);

  return (
    <FormControl style={{zIndex: "100"}} fullWidth error={estado.valido == false ? true : false}>
     
      <Select
			  placeholder="Seleccione uno o varios elementos"
        defaultValue={defaultValue} // muestra seleccionados en el editar
        onChange={handleSelectChange}
        isMulti
        options={opcionesFormateadas}
      />

      <FormHelperText>
        {estado.valido == false ? leyendaError : leyendaHelper}
      </FormHelperText>
    </FormControl>
  );
};
export default DropdownMultiSelectPrueba;
