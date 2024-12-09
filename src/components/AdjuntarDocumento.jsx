import React, { useState, useLayoutEffect, useReducer, useRef } from "react";
import {
  FormControl,
  Radio,
  FormControlLabel,
  FormLabel,
  Button,
} from "@mui/material";
import RadioButtonComponent from "./RadioButtonComponent";
import TextFieldTxAreaComponente from "./TextFieldTxAreaComponent";
import { Modal } from "react-bootstrap";
import { PickerInline } from "filestack-react";

//Documentos
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseApp from "../assets/context";
import ImageIcon from "@mui/icons-material/Image";

const AdjuntarDocumento = ({
  tipoDocumento,
  setTipoDocumento,
  indicaciones,
  setIndicaciones,
  myFiles,
  setMyFiles,
}) => {
  const [checked, setChecked] = useState();

  useLayoutEffect(() => {
    if (tipoDocumento.campo == "" || tipoDocumento.campo == "NO") {
      setChecked(true);
      setTipoDocumento({ ...tipoDocumento, campo: "", valido: null });
      setMyFiles({ ...myFiles, campo: "", valido: null });
      setIndicaciones({ ...indicaciones, campo: "", valido: null });
      setDocument({ url: null, tipo: null });
    } else {
      setChecked(false);
    }
  }, [tipoDocumento.campo]);

  //Adjuntos
  const fileInputRef = useRef(null);

  const handleFileSelect = () => {
    fileInputRef.current.click();
  };

  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    //Aca levanto los datos del archivo y puedo hacer cosas, como mandarlo al servidor
    console.log(file);
  };

  async function onUploadDone(res) {
    await setMyFiles({ ...myFiles, direccion: document.url, valido: true });
    setShowModal(false);
  }

  //************************************************************ */
  //Firebase

  const [document, setDocument] = useState({ url: null, tipo: null });
  const avatarEditorRef = React.useRef(null);

  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileType = file.type.split("/")[0];

      let documentDataUrl = await readFile(file);
      setDocument({ url: documentDataUrl, tipo: fileType });

      handleOpenModal();
    }
  };

  function readFile(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result), false);
      reader.readAsDataURL(file);
    });
  }

  const [rotation, setRotation] = useState(0);

  const rotarLeft = () => {
    setRotation((prevRotation) => prevRotation - 90);
  };

  const rotarRight = () => {
    setRotation((prevRotation) => prevRotation + 90);
  };

  const [zoom, setZoom] = useState(1);

  const modificarZoom = (event, newValue) => {
    setZoom(newValue);
  };

  const aumentarZoom = () => {
    if (zoom < 10) {
      setZoom(zoom + 1);
    }
  };

  const disminuirZoom = () => {
    if (zoom > 1) {
      setZoom(zoom - 1);
    }
  };

  const inputRef = React.useRef(null);

  const onButtonClick = () => {
    inputRef.current.click();
  };
  //********************************************************************+++ */

  const renderFilePreview = () => {
    if (document.url) {
      if (document.tipo === "image") {
        return (
          <img src={document.url} alt="Documento" width="100%" height="500px" />
        );
      } else if (document.tipo === "application") {
        return (
          <iframe
            src={document.url}
            width="100%"
            height="500px"
            title="Documento"
          ></iframe>
        );
      }
    }
    return null;
  };

  const getFileName = () => {
    return inputRef.current && inputRef.current.files[0]
      ? "Se cargo exitosamente el Archivo " + inputRef.current.files[0].name
      : "";
  };
  return (
    <FormControl>
      <FormLabel>Adjuntar documentos</FormLabel>

      <RadioButtonComponent
        className="my-2"
        estado={tipoDocumento}
        cambiarEstado={setTipoDocumento}
      >
        <FormControlLabel
          value="NO"
          control={<Radio />}
          label="No lleva adjunto"
          checked={checked}
        />
        <FormControlLabel value="RECETA" control={<Radio />} label="Receta" />
        <FormControlLabel
          value="ORDEN"
          control={<Radio />}
          label="Orden de estudio"
        />
        <FormControlLabel
          value="RESULTADO"
          control={<Radio />}
          label="Resultado de estudio"
        />
      </RadioButtonComponent>

      {tipoDocumento.campo === "RECETA" && (
        <>
          <div>
            <TextFieldTxAreaComponente
              type="Textarea"
              leyendaHelper="Indicacioes del documento adjunto"
              id="Indicaciones_Documento_Adjunto"
              label="Indicaciones del documento adjunto"
              estado={indicaciones}
              cambiarEstado={setIndicaciones}
              //expresionRegular={ExpReg.nombre}
            />

            <Button
              onClick={onButtonClick}
              color="inherit"
              fullWidth
              variant="contained"
              component="span"
            >
              Adjuntar receta
            </Button>

            <input
              type="file"
              onChange={onFileChange}
              ref={inputRef}
              style={{ display: "none" }}
              id="file-input"
            />
            {getFileName()}
          </div>
        </>
      )}

      {tipoDocumento.campo === "ORDEN" && (
        <div>
          <TextFieldTxAreaComponente
            required
            type="Textarea"
            leyendaHelper="Indicacioes Medicas."
            id="Indicaciones_Medicas"
            label="Indicaciones Medicas"
            estado={indicaciones}
            cambiarEstado={setIndicaciones}
            //expresionRegular={ExpReg.nombre}
          />
          <Button
            onClick={onButtonClick}
            color="inherit"
            fullWidth
            variant="contained"
            component="span"
          >
            Adjuntar orden
          </Button>

          <input
            type="file"
            onChange={onFileChange}
            ref={inputRef}
            style={{ display: "none" }}
            id="file-input"
          />
          {getFileName()}
        </div>
      )}

      {tipoDocumento.campo === "RESULTADO" && (
        <div>
          <TextFieldTxAreaComponente
            required
            type="Textarea"
            leyendaHelper="Indicacioes Medicas."
            id="Indicaciones_Medicas"
            label="Indicaciones Medicas"
            estado={indicaciones}
            cambiarEstado={setIndicaciones}
            //expresionRegular={ExpReg.nombre}
          />
          <Button
            onClick={onButtonClick}
            color="inherit"
            fullWidth
            variant="contained"
            component="span"
          >
            Adjuntar resultado
          </Button>

          <input
            type="file"
            onChange={onFileChange}
            ref={inputRef}
            style={{ display: "none" }}
            id="file-input"
          />
          {getFileName()}
        </div>
      )}
      <div>
        <Modal
          style={{ marginTop: "20px", textAlign: "center", zIndex: 9999 }}
          show={showModal}
          onHide={handleCloseModal}
          backdrop="static"
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirmar documento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* <PickerInline
              apikey={YOUR_API_KEY_FILE}
              onUploadDone={(res) => onUploadDone(res)}
          /> */}
            <div className="file-input-container">
              {renderFilePreview()}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBlock: 20,
                }}
              >
                <Button
                  onClick={handleCloseModal}
                  variant="contained"
                  color="error"
                >
                  Cancelar
                </Button>
                <div style={{ marginInline: 20 }}></div>
                <Button onClick={onUploadDone} variant="contained">
                  Confirmar
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </FormControl>
  );
};
export default AdjuntarDocumento;