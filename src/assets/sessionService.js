const SessionService = {

    //Manejamos el sessionService para manejar cualquier nueva logica desde aca. Es decir que
    //Si un dia por casualidades de la vida el sessionStorage cambia o queremos renovar a uno "mejor", sea lo que sea, no vamos a modificar todas las pantallas.
    //Modificaremos solo este JS.


    //GuardarItem es una funcion personalizada donde se pasa el key y value, esto es para setear un sessionStorage
    GuardarItem: (key, value) => {
      sessionStorage.setItem(key, JSON.stringify(value));
    },
  
    //Funcione de Get, lo logramos obtener con esto
    ObtenerItem: (key) => {
      const value = sessionStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    },
  

    //Por si queremos ahorrar memoria una vez que no nos sirva mas el objeto que queremos pasar, aunque tenemos un total de 15 MB para usar sin problemas.
    removerItem: (key) => {
      sessionStorage.removeItem(key);
    },
  

    //Esto mata toda la sessionStorage, es decir, borra TODO.
    borrarSessionStorage: () => {
      sessionStorage.clear();
    },



    //Tips:
    //sessionStorage funciona como una sesion de la pantalla, osea.... Van a haber datos en la sessión SIEMPRE Y CUANDO ESTE LA PESTAÑA ACTIVA.
    //Si se abre una nueva pestaña, estos datos no seran trasladados.
    //Por lo tanto, se impedira que el usuario pueda abrir una pestaña o varias de estas. Este tipo de logicas las maneja aplicaciones como Swiss Medical.

    //Este metodo, a nivel tecnico, es completamente inseguro. Obtener datos desde el localStorage o sessionStorage a nivel tecnico es totalmente inseguro.
    //Una forma distinta de obtener datos seria directamente desde el lado del servidor con la autenticación de JWT.
    //Se tendria que modificar el backend, haciendo que el JWT nos de tanto autorizacion como identificacion sin neceisdad de proporcionar siempre un id en el parametro.
    //Pero hacer esto conlleva a hacer cambios en cada consulta a la Api, para que ninguna pida el id del usuario, solo pida el JWT.
  };
  
  export default SessionService;
  