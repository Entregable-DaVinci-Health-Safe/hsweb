import {
    FormControl,
    TextField,
    Button,
    Autocomplete,
    IconButton,
  } from "@mui/material";
import {Link} from "react-router-dom";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AxiosHealth from "../../interceptor/axiosHealth";
import ExpReg from "./../../elementos/ExpresionesReg";
import { useNavigate } from "react-router-dom";
import '../../css/Body.css';

// Importar componentes propios
import Input from './../../components/Input';
import Dropdown from './../../components/Dropdown';
import {Formulario, Boton} from './../../elementos/Formularios';

import { useState, useEffect } from "react";
import Swal from 'sweetalert2';

const AgregarInstitucionDeSalud = () => {
    let token = localStorage.getItem("token");
    let idUsuario = localStorage.getItem("idUsuario");

    const [idHC, setIdHC] = useState("");
    const [nombre, setNombre] = useState({campo: '', valido: null});
    const [razonSocial, setRazonSocial] = useState({campo: '', valido: null});
    const [mail, setMail] = useState({campo: '', valido: null});
    const [telefono, setTelefono] = useState({campo: '', valido: null});
    const [direccion, setDireccion] = useState({campo: '', valido: null});
    const [piso, setPiso] = useState({campo: '', valido: null});
    const [departamento, setDepartamento] = useState({campo: '', valido: null});
    const [referencia, setReferencia] = useState({campo: '', valido: null});
    const [provinciaSelect, setProvinciaSelect] = useState({campo: '', valido: null});
    const [provincia, setProvincia] = useState({campo: '', valido: null});
    const [localidad, setLocalidad] = useState({campo: '', valido: null});
    const [localidadSelect, setLocalidadSelect] = useState({campo: '', valido: null});
    const [mostrarComponente, setMostrarComponente] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
      Promise.all([
        AxiosHealth .get(`/provincias/all`),
        AxiosHealth.get(`/historiasMedicas/usuarios/${idUsuario}`),
      ])
        .then(function (value) {
          const provinciasArray = Object.values(value[0].data);
          setIdHC(value[1].data.id);
          setProvinciaSelect(provinciasArray);
        })
        .catch((error) => {
          console.error(error);
        });
      }, []);

      useEffect(() => {
        if (provincia.campo !== '') {
          AxiosHealth.get(`/provincias/${provincia.campo}/localidades`)
            .then(function (response) {
              const localidadArray = Object.values(response.data);
              setLocalidadSelect(localidadArray);
            });
        }
      }, [provincia]);

      function seleccionProvincia(value){
        if(value.campo!=''){
          AxiosHealth .get(`/provincias/${value.campo}/localidades`)
          .then(function (response) {
            const localidadArray = Object.values(response.data);
            setLocalidadSelect(localidadArray);
          })
        }
      }
    
      function seleccionLocalidad(value){
        const localidadSeleccionada = Object.values(localidadSelect)
          .flatMap((elemento) => elemento)
          .find((localidad) => localidad.nombre === value);
        setLocalidad(localidadSeleccionada.id);
      }

      function agregarInstitucion() {
        AxiosHealth
      .post(`/centrosSalud`, {
        nombre: nombre.campo,
        razonSocial: razonSocial.campo,
        idHistoriaMedica: idHC,
      })
      .then(function (response) {
        localStorage.setItem("id_csa", response.data.id);
        let id_csa = localStorage.getItem("id_csa");
        AxiosHealth
          .post(`/centrosSalud/${id_csa}/nuevoContacto`, {
            telefono: telefono.campo,
            mailAlternativo: mail.campo,
          })
          .then(function (response) {
            if (direccion != "") {
                AxiosHealth
                .post(`/centrosSalud/${id_csa}/nuevaDireccion`, {
                    direccion: direccion.campo,
                    piso: piso.campo,
                    departamento: departamento.campo,
                    referencia: referencia.campo,
                    idProvincia: provincia.campo,
                    idLocalidad: localidad.campo,
                })
                .then(function (e) {
                    console.log(e)
                });
            }
            localStorage.removeItem("id_csa");
            Swal.fire({
                title: 'Agregar otro centro de salud?',
                showDenyButton: true,
                confirmButtonText: 'Si',
                denyButtonText: `No`,
            }).then((result) => {
                if (result.isConfirmed) {
                navigate("/HistorialClinicoPaciente/HC/AgregarInstitucionDeSalud");
                } else if (result.isDenied) {
                navigate("/HistorialClinicoPaciente/HC");
                }
            })
            
            });
          
        });   
      }

    return (
        <> 
        <div class = "container"> 
        <h2>Agregar Institución de Salud</h2>
        <form method="put">
          <FormControl method="post">
            <Input
                estado={nombre}
                cambiarEstado={setNombre}
                tipo="text"
                label="Nombre"
                placeholder="Ingrese el nombre de la institucion *"
                name="nombre"
                leyendaError="El nombre tiene que ser de 4 a 16 dígitos y solo puede contener letras y espacios."
                expresionRegular={ExpReg.nombre}
              />
          </FormControl>
          <FormControl method="post">
            <Input
                estado={razonSocial}
                cambiarEstado={setRazonSocial}
                tipo="text"
                label="Razon Socual"
                placeholder="Ingrese la razon social de la institucion *"
                name="nombre"
                leyendaError="La razon social tiene que ser de 4 a 16 dígitos y solo puede contener letras y espacios."
                expresionRegular={ExpReg.nombre}
              />
          </FormControl>
          <FormControl method="post">
            <Input
                estado={mail}
                cambiarEstado={setMail}
                tipo="text"
                label="Mail"
                placeholder="Ingrese el correo electronico del profesional *"
                name="mail"
                leyendaError="El correo solo puede contener letras, numeros, puntos, guiones y guion bajo."
                expresionRegular={ExpReg.correo}
              />
          </FormControl>  
          <FormControl method="post">
            <Input
                estado={telefono}
                cambiarEstado={setTelefono}
                tipo="text"
                label="Telefono"
                placeholder="Ingrese el telefono del profesional *"
                name="telefono"
                leyendaError="El telefono solo puede contener numeros y el maximo son 14 dígitos."
                expresionRegular={ExpReg.telefono}
              />
          </FormControl>
          <FormControl method="post">
            <Input
              estado={direccion}
              cambiarEstado={setDireccion}
              tipo="text"
              label="Direccion"
              placeholder="Ingrese la direccion del profesional *"
              name="direccion"
              leyendaError="El la direccion debe tener minimo 4 caracteres."
              expresionRegular={ExpReg.nombre}
            />
          </FormControl>
          
          
          <div className={direccion.campo.length > 3 ? "show-element" : null}>
            {direccion.campo.length > 3 && (
              <div>
                <FormControl method="post">
                  <Input
                    estado={piso}
                    cambiarEstado={setPiso}
                    tipo="text"
                    label="Piso"
                    placeholder="Ingrese el piso"
                    name="piso"
                    leyendaError="El piso debe ser numerico."
                    expresionRegular={ExpReg.piso}
                  />
                </FormControl>
                <FormControl method="post">
                  <Input
                    estado={departamento}
                    cambiarEstado={setDepartamento}
                    tipo="text"
                    label="Departamento"
                    placeholder="Ingrese el departamento"
                    name="departamento"
                  />
                </FormControl>
                <FormControl method="post">
                  <Input
                    estado={referencia}
                    cambiarEstado={setReferencia}
                    tipo="text"
                    label="Referencia"
                    placeholder="Ingrese la referencia"
                    name="referencia"
                  />
                </FormControl>

                <FormControl method="post">
                  <Dropdown 
                    options={Object.values(provinciaSelect)}  
                    estado={provincia}
                    cambiarEstado={setProvincia}
                    tipo="text"
                    label="Provincia"
                    placeholder="Seleccione la provincia"
                    name="provincia"  
                  />
                </FormControl>
                <FormControl method="post">
                  <Dropdown 
                    options={Object.values(localidadSelect)}  
                    estado={localidad}
                    cambiarEstado={setLocalidad}
                    tipo="text"
                    label="Localidad"
                    placeholder="Seleccione la localidad"
                    name="localidad"  
                  />
                </FormControl>
              </div>
            )}
          </div>
        </form>

        <Boton  variant="outlined"
          id="Boton"
          type="submit"
          onClick={() => agregarInstitucion()}>
            Agregar Institución de Salud
        </Boton>
    </div>
</>
    );
}

export default AgregarInstitucionDeSalud
