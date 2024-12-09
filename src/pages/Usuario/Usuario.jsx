import {useState, useEffect} from "react";


import ModalNum from "./ModalNum";
import Axios from "axios";

import {Button, Avatar, Container} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { Row, Col } from "react-bootstrap";

import "../../css/Usuario.css";

const Usuario = () => {
    
    const [modalNumero, setModalNumero] = useState(false);
    const [tipoLectura, setTipoLectura] = useState(false);
    const [usuario, setUsuario] = useState([]);

    const TipoModal = (tipo) => {
        switch (tipo) {
          case 1:
            setModalNumero(true);
            setTipoLectura(true);
            break;
          case 2:
            setModalNumero(true);
            setTipoLectura(false);
            break;
        }
      };

    let idUsuario = localStorage.getItem("idUsuario")
    let token = localStorage.getItem("token")

    function calcularEdad(fecha) {
        var hoy = new Date();
        var cumpleanos = new Date(fecha);
        var edad = hoy.getFullYear() - cumpleanos.getFullYear();
        var m = hoy.getMonth() - cumpleanos.getMonth();
    
        if (m < 0 || (m === 0 && hoy.getDate() < cumpleanos.getDate())) {
            edad--;
        }
    
        return edad;
    }
    
    const instance = Axios.create({
        baseURL: 'http://localhost:8080/',
        timeout: 1000,
        headers: {'Authorization':`Bearer ${token}`}
      });
      
      useEffect(() => {
        instance.get(`api/usuarios`)
        .then((res) => {
            setUsuario(res.data);
          })
      }, [])
    
    return (
        
        <main>
            <div class="informacionUsuario">
            
            <Avatar
                        alt={usuario.nombre + " " + usuario.apellido}
                        sx={{ width: 190, height: 190 }}>
                            <PersonIcon  sx={{ width: 150, height: 150 }}/>
            </Avatar>
            <Row className="ColumnasUsuario">
            <Col  xs={6} md={4} id="Columnas">
            <h6>Nombre y Apellido: {usuario.nombre} {usuario.apellido}</h6>
            <br/>
            <h6>Edad: {calcularEdad(usuario.fechaNacimiento)}</h6>
            </Col>

            <Col xs={6} md={4} id="Columnas">
            <h6>Direcciones: {usuario.direcciones?.[0]?.direccion ?? ""} {/*Con una mano en el corazón, no se como funciona esto. */}</h6>
            <br/>
            <h6>Teléfono: <Button variant="contained" onClick={() => TipoModal(2)} >Ver Numeros </Button></h6>
            </Col>
            </Row>
            </div>
           
            <h2>Usuario</h2>
            <Button variant="contained" onClick={() => TipoModal(1)}>
                Agregar Numero
            </Button>
            <ModalNum Mostrar={modalNumero} Ocultar={() => setModalNumero(false)} Tipo={tipoLectura}/>


        </main>
    );
}

export default Usuario