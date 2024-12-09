import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeContextProvider } from "./Theme/ThemeContext";
import "bootstrap/dist/css/bootstrap.min.css";
import { createTheme, ThemeProvider } from '@mui/material/styles';

//Toda la app se contiene en un BrowserRouter
import { BrowserRouter } from "react-router-dom";
// import Prendas from "./pages/Prendas";
// import Clientes from "./pages/Clientes";
// import Ventas from "./pages/Ventas";

const theme = createTheme({
  // palette: {
  //   secondary: {
  //     main: '#9e9e9e', // Gris
  //   },
  //   text: {
	// 		secondary: {
	// 			main: '#9e9e9e', // Blanco
	// 		}
  //   },
  // },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeContextProvider>
    <React.StrictMode>
      <BrowserRouter>
			<ThemeProvider theme={theme}>
        <App />
				</ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  </ThemeContextProvider>
);