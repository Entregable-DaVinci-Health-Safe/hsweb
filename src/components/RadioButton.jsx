import React from 'react';

const RadioButton = ({ label,checked,estado,cambiarEstado,nombre,valor}) => {

    const handleRadioButtonChange = () => {
       cambiarEstado({...estado, campo: valor, valido: true});
    };

    return (
        <label>
        <input 
            type="radio" 
            checked={checked} 
            onChange={handleRadioButtonChange}
            name={nombre}
            value={valor} 
        />
        {label}
        </label>
  );
}
export default RadioButton;