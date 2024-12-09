import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  AlertTitle,
} from "@mui/material";

import Divider from "@mui/material/Divider";
const DialogComponent = ({
  open,
  title,
  content,
  onClose,
  onConfirm,
  alertType,
  secondButton,
  nameSecondButton,
}) => {
  const backgroundColors = {
    success: "#dff0d8", // Verde claro
    info: "#d9edf7", // Azul claro
    warning: "#fcf8e3", // Amarillo claro
    error: "#f2dede", // Rojo claro
    question: "#e2e3e5", // Gris claro
  };

  const backgroundColor = alertType ? backgroundColors[alertType] : "#eb4c19";

  return (
<Dialog
  open={open}
  onClose={onClose}
  PaperProps={{
    style: {
      boxShadow: "none", // Eliminar la sombra del Dialog
      border: "none", // Eliminar el borde
      padding: 0, // Sin relleno
    },
  }}
>
  <DialogTitle style={{ padding: 0 }}>
    {alertType && (
      <Alert
        severity={alertType === "question" ? "info" : alertType}
        icon={false}
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 0,
          width: "100%",
          //backgroundColor: "inherit", // Heredar fondo transparente
          boxShadow: "none", // Eliminar sombra del Alert
        }}
      >
        <AlertTitle style={{ display: "flex", alignItems: "center" }}>
          {alertType === "success" && "✔"}
          {alertType === "info" && "ℹ"}
          {alertType === "warning" && "⚠"}
          {alertType === "error" && "❌"}
          {alertType === "question" && "❓"}
          <span style={{ marginLeft: 8 }}>{title}</span>
        </AlertTitle>
				<br />
        <DialogContent style={{ padding: 0 }}>{content}</DialogContent>
        <DialogActions style={{ padding: 0 }}>
          {secondButton && (
            <>
              <Button onClick={onClose}>{nameSecondButton}</Button>
            </>
          )}
          <Button onClick={onConfirm} color="primary" className="my-2" >
            Aceptar
          </Button>
        </DialogActions>
      </Alert>
    )}
  </DialogTitle>
</Dialog>


  );
};

export default DialogComponent;
