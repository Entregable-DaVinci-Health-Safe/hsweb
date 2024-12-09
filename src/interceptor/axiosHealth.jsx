import axios from 'axios';
import Swal
from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const AxiosHealth = axios.create({
  baseURL: 
  'https://backendvtest-a80d56fb412f.herokuapp.com/api/'
  //'http://localhost:8080/api/'
});

AxiosHealth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.includeAuth !== false) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log("Hubo un error");
    return Promise.reject(error);
  }
);

AxiosHealth.interceptors.response.use(
  (response) => {
    const token = response.headers['Authorization'];
    if (token) {
      localStorage.setItem('token', token);
    }
    return response;
  },
  (error) => {
    if (error.message === 'Network Error') {
      Swal.fire({
        icon: 'error',
        title: 'Error de red',
        text: 'Hubo un problema de red. Por favor, revisa tu conexión a internet.',
      }).then(() => {
        useNavigate("/");
      });
    } else if (error.response && error.response.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Error al intentar ingresar',
        text: 'Por favor, verifique sus credenciales y vuelva a intentar',
      });
    } else {
      console.log("Hubo un error en la respuesta", error);
    }
    return Promise.reject(error);
  }
);

export default AxiosHealth;
