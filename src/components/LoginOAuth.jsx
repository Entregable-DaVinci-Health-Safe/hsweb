import React, { useLayoutEffect,useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Auth0Provider } from "@auth0/auth0-react";

const AuthButton = () => {
  const { loginWithRedirect, logout, user, isAuthenticated, getIdTokenClaims, getAccessTokenSilently} = useAuth0();
  const [tokenClaims, setTokenClaims] = useState([]);
  
  useLayoutEffect(()=>{
    const fetchToken = async () => {
      try {
        const accessToken = await getIdTokenClaims();
        setTokenClaims(accessToken.__raw);  // Almacena el token
      } catch (error) {
        console.error("Error al obtener el token: ", error);
      }
    };

    fetchToken();
  },[getAccessTokenSilently])

 

  return (
    
    <div>
      {isAuthenticated ? (
        <div>
          {console.log(tokenClaims)}
          <h2>Bienvenido, {user.name}!</h2>
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <button onClick={() => loginWithRedirect()}>
          Iniciar Sesión
        </button>
      )}
    </div>
    
  );
};

export default AuthButton;