import React, { useState } from "react";
import Dropzone from "react-dropzone";
import swal from "sweetalert2";
import PDFDocument from "pdfkit";
import fs from "fs";

//Documentos
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import firebaseApp from "../assets/context";


const UploadPdf = () => {
  const [file, setFile] = useState(null);

  const handleDrop = (acceptedFiles) => {
    // Asegurarse de que se haya subido un archivo
    if (acceptedFiles.length > 0) {
      const uploadedFile = acceptedFiles[0];

      // Aquí defines la ruta donde se guardará el archivo
      const uploadDirectory = "/uploads/";

      // Aquí defines la ruta completa donde se guardará el archivo
      const fullPath = uploadDirectory + uploadedFile.name;

      // Aquí se verifica si el archivo ya es un PDF
      if (uploadedFile.type === "application/pdf") {
        // El archivo ya es un PDF, se guarda directamente en la ruta definida
        fs.writeFile(fullPath, uploadedFile, function (error) {
          if (error) {
            console.error("Error al guardar el archivo", error);
            return;
          }

          // El archivo se ha guardado correctamente
          swal.fire({
            icon: "success",
            title: "Archivo subido correctamente",
          });
        });
      } else {
        // El archivo no es un PDF, se convierte a PDF primero
        const pdfDoc = new PDFDocument();
        pdfDoc.pipe(fs.createWriteStream(fullPath));
        pdfDoc.image(uploadedFile.path, {
          width: 612,
          height: 792,
          fit: [612, 792],
        });
        pdfDoc.end();

        // El archivo se ha convertido a PDF y guardado correctamente
        swal.fire({
          icon: "success",
          title: "Archivo subido y convertido a PDF correctamente",
        });
      }

      setFile(uploadedFile);
    }
  };

  return (
    <div>
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Arrastra y suelta un archivo aquí o haz clic para seleccionar un archivo</p>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default UploadPdf;
