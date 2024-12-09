import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText
  } from "@mui/material";

const ModalBase = ({ children, isOpen, title, modalEstado}) => {


  
  const handleClose = () => {
    modalEstado(false);
  };

  
  if (!isOpen) {
    return null;
  }

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle className="card-header">
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {title} 
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {children}
        </DialogActions>
      </DialogTitle>
    </Dialog>
        
  );
};

export default ModalBase;