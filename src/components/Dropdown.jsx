import React, { useState } from 'react';
import {DropdownWrapper, DropdownText, DropdownItem, DropdownList} from './../elementos/Formularios';
import { faSortDown} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



const Dropdown = ({ options, estado, cambiarEstado, placeholder}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSelectOption = (option) => {
    cambiarEstado({...estado, campo: option.id});
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  return (
    <div>
      <DropdownWrapper onClick={handleToggleDropdown}>
        <DropdownText>{selectedOption ? selectedOption.nombre : placeholder }</DropdownText>
       <FontAwesomeIcon icon={faSortDown} />
      </DropdownWrapper> 
      {isDropdownOpen && options[0] != '' &&(
        <>
          {options.map((option) => (
            <DropdownItem key={option.id} onClick={() => handleSelectOption(option)}>
              {option.nombre}
            </DropdownItem>
          ))}
        </>
      )}
    </div>
  );
};

export default Dropdown;