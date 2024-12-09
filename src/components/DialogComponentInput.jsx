import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Alert, AlertTitle, TextField } from '@mui/material';

const DialogComponent = ({ 
  open, 
  title, 
  content, 
  onClose, 
  onConfirm,
  alertType, 
  inputPlaceholder,
  footer 
}) => {
  const [inputValue, setInputValue] = useState("");

  const backgroundColors = {
    success: '#dff0d8', // Verde claro
    info: '#d9edf7',    // Azul claro
    warning: '#fcf8e3', // Amarillo claro
    error: '#f2dede',   // Rojo claro
    question: '#e2e3e5' // Gris claro
  };

  const backgroundColor = alertType ? backgroundColors[alertType] : '#fff';

  const handleConfirm = () => {
    onConfirm(inputValue); // Pasa el valor de la entrada
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ style: { backgroundColor } }}>
      <DialogTitle>
        {alertType && (
          <Alert severity={alertType === 'question' ? 'info' : alertType} icon={false} style={{ display: 'flex', alignItems: 'center', marginBottom: 0 }}>
            <AlertTitle style={{ display: 'flex', alignItems: 'center' }}>
              {/* Íconos personalizados para cada tipo de alerta */}
              {alertType === 'success' && '✔'}
              {alertType === 'info' && 'ℹ'}
              {alertType === 'warning' && '⚠'}
              {alertType === 'error' && '❌'}
              {alertType === 'question' && '❓'}
              <span style={{ marginLeft: 8 }}>{title}</span>
            </AlertTitle>
          </Alert>
        )}
      </DialogTitle>
      <DialogContent>
        {/* Campo de entrada de texto */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder={inputPlaceholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        {/* Mostrar contenido adicional */}
        {content && <div style={{ marginTop: 16 }}>{content}</div>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleConfirm} color="primary">Aceptar</Button>
      </DialogActions>
      {footer && (
        <div style={{ padding: 10, textAlign: 'center' }} dangerouslySetInnerHTML={{ __html: footer }} />
      )}
    </Dialog>
  );
};

export default DialogComponent;