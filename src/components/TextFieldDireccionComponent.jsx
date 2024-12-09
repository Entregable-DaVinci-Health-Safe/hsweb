import React, { useLayoutEffect, useRef, useState } from 'react';
import { TextField } from "@mui/material";

const TextFieldDireccionComponente = ({ required, defaultValue, estado, cambiarEstado, type, label, name, leyendaHelper, leyendaError, readOnly }) => {
  const searchInput = useRef(null);
  const [textoEdit, setTextoEdit] = useState('');
  const mapApiJs = "https://maps.googleapis.com/maps/api/js";
  const apiKey = "AIzaSyDV-VE-kZWkuY8me1scSsv22z-jC0qw97E";

  const loadAsyncScript = (src) => {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(); // Ya cargado
        return;
      }

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  };

  const address = {
    locality: "",
    route: "",
    street_number: "",
    province: "",
    adm_area: "",
  };

  const handleChangeInput = () => {
    const texto2 = searchInput.current.value;
    setTextoEdit(texto2);
  };

  useLayoutEffect(() => {
    if (searchInput.current.value === '') {
      cambiarEstado({ ...estado, campo: address, valido: true });
    }
  }, [textoEdit]);

  const extractAddress = (place) => {
    if (!Array.isArray(place?.address_components)) {
      return address;
    }

    place.address_components.forEach((component) => {
      const types = component.types;
      const value = component.long_name;
      const values = component.short_name;

      if (types.includes("administrative_area_level_2")) {
        address.adm_area = value;
      }

      if (types.includes("locality")) {
        address.locality = values;
      }

      if (types.includes("street_number")) {
        address.street_number = value;
      }

      if (types.includes("route")) {
        address.route = value;
      }

      if (types.includes("administrative_area_level_1")) {
        address.province = value;
      }
    });

    return address;
  };

  const onChangeAddress = (autocomplete) => {
    const place = autocomplete.getPlace();
    cambiarEstado({ ...estado, campo: extractAddress(place), valido: true });
  };

  const initAutocomplete = () => {
    if (!searchInput.current || !window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(searchInput.current);
    autocomplete.setFields(["address_components", "geometry"]);
    autocomplete.addListener("place_changed", () => onChangeAddress(autocomplete));
  };

  useLayoutEffect(() => {
    const initMapScript = async () => {
      try {
        await loadAsyncScript(`${mapApiJs}?key=${apiKey}&libraries=places&v=weekly`);
        initAutocomplete();
      } catch (error) {
        console.error("Error al cargar la API de Google Maps", error);
      }
    };

    initMapScript();
  }, []);

  return (
    <TextField
      fullWidth
      required={required}
      InputProps={{ readOnly: readOnly }}
      type={type}
      error={estado.valido === false}
      helperText={estado.valido === false ? leyendaError : leyendaHelper}
      id={name}
      label={label}
      inputRef={searchInput}
      defaultValue={defaultValue}
      onChange={handleChangeInput}
    />
  );
};

export default TextFieldDireccionComponente;
