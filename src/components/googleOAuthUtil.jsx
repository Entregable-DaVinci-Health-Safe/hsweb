//import { google } from 'google-auth-library';

const clientId = process.env.REACT_APP_GCID;

export const requestAdditionalScopes = (accessToken, onSuccess, onError) => {
  const client = window.google.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: 'https://www.googleapis.com/auth/calendar',
    prompt: '',
    callback: (response) => {
      if (response.access_token) {
        console.log('Scopes adicionales otorgados:', response);
        onSuccess(response.access_token);
      } else {
        console.error('Error otorgando scopes adicionales:', response);
        onError(response);
      }
    },
  });

  client.requestAccessToken({ hint: accessToken });
};

export const handleGoogleLoginSuccess = async (credentialResponse, requestAdditionalScopes, handleLogin) => {
  const accessToken = credentialResponse;

  // Solicitar scopes adicionales
  requestAdditionalScopes(
    accessToken,
    (newAccessToken) => {
      console.log('Scopes adicionales otorgados:', newAccessToken);
      localStorage.setItem('accessCAL',newAccessToken)
      handleLogin(newAccessToken);
    },
    (error) => {
      console.error('Error solicitando scopes adicionales:', error);
    }
  );
};
