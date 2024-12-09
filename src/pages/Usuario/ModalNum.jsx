import {useState, useEffect} from "react";

import {Button, IconButton} from "@mui/material";
import {FormControl, TextField, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody} from "@mui/material";
import Modal from 'react-bootstrap/Modal';

import Axios from "axios";

import DeleteIcon from '@mui/icons-material/Delete';

import Swal from "sweetalert2";

import "../../css/ModalNumero.css";
const ModalNum = ({Mostrar, Ocultar, Tipo}) => {

    let idUsuario = localStorage.getItem("idUsuario")
    let token = localStorage.getItem("token")
    
    const [numero, setNumero] = useState("");
    const [listadoNumeros, setListadoNumeros] = useState([]);

    const instance = Axios.create({
        baseURL: 'http://localhost:8080/',
        timeout: 1000,
        headers: {'Authorization':`Bearer ${token}`}
      });

    function AceptarNumero() {
      return instance
      .post(`http://localhost:8080/api/usuarios/nuevoContacto`, {
        telefono: numero
      })
      .then(function () {
        Swal.fire({icon: 'success', title: 'Se agrego el numero.'}).then(function (result) {
          if (result.value) {
            window.location.href = window.location.href;
          }
          });
      })
      .catch(function () {
        Swal.fire({icon: 'error', title: 'No se pudo agregar el numero.'});
      });
    }

    useEffect(() => {
      instance.get(`api/usuarios`)
      .then((res) => {
          setListadoNumeros(res.data.contactos);
        })
    }, [])
  return (
    <>
        {Tipo === true
            ? <Modal show={Mostrar} onHide={Ocultar}>
            <Modal.Header closeButton="closeButton">
                <Modal.Title>Agregar Numero</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{textAlign: "center"}}>
                <form method="put">
                    <FormControl method="post">
                           <TextField
                                    id="number"
                                    label="Ingrese numero"
                                    type="number"
                                    onChange={(e) => setNumero(e.target.value)}
                                    InputLabelProps={{
                                        shrink: true
                                    }}/>
                    </FormControl>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={Ocultar}>
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" onClick={() => AceptarNumero()}>
                    Aceptar
                </Button>
            </Modal.Footer>
            </Modal>
            :  <Modal show={Mostrar} onHide={Ocultar}>
            <Modal.Header closeButton="closeButton">
                <Modal.Title>Listado de Numeros</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{textAlign: "center"}}>
                  <TableContainer component={Paper}>
                  <Table>
                    <TableHead id="TituloTable">
                      <TableRow>
                        <TableCell>Numero</TableCell>
                        <TableCell align="center">Accion</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {listadoNumeros.map((listadoNumeros) => (
                        <TableRow
                          key={listadoNumeros.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {listadoNumeros.telefono}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton color="primary" variant="text" size="large">
                              <DeleteIcon/> 
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={Ocultar}>
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" onClick={() => AceptarNumero()}>
                    Aceptar
                </Button>
            </Modal.Footer>
            </Modal>}
    </>
);
 
}

export default ModalNum