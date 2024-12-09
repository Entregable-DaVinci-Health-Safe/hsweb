import React, { useState } from 'react';
import {Input, LeyendaError} from './../elementos/Formularios';

const Checkbox = ({texto,estado,cambiarEstado,leyendaError}) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
    if(!isChecked){
      cambiarEstado({...estado, valido: true});
    } else {
      cambiarEstado({...estado, valido: false});
    }
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
        />
        {texto}
      </label>
      <LeyendaError valido={estado.valido}>{leyendaError}</LeyendaError>
    </div>
  );
}

export default Checkbox;



