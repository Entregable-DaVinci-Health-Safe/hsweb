import React, { useEffect } from 'react';
import jsPDF from 'jspdf';

const GeneratePdf = ({ dataList }) => {
  useEffect(() => {
    const generatePDF = () => {
      const pdf = new jsPDF('p', 'mm', 'a4');
      pdf.setFont('Helvetica', 'normal');

      let yOffset = 20; // Posición inicial en la página

      dataList.forEach((data) => {
        if (yOffset > 270) { // Pregunta si hay espacios
          pdf.addPage();
          yOffset = 20; // Reinicia la posición vertical, cosa de que no quede cortado
        }

        // Header (equivalente a .header)
        pdf.setFontSize(22);
        pdf.setTextColor(51, 51, 51); // #333333 en hexadecimal
        pdf.text('Historia Clinica', 105, yOffset, { align: 'center' });
        yOffset += 30; // Equivalente a margin-bottom: 30px

        // Sección Header (equivalente a .section-header)
        pdf.setFontSize(16);
        pdf.setTextColor(74, 144, 226); // #4A90E2 en hexadecimal
        pdf.text('Fecha de visita', 10, yOffset);
        yOffset += 10;

        // Contenido (equivalente a .content)
        pdf.setFontSize(14);
        pdf.setTextColor(85, 85, 85); // #555555 en hexadecimal
        pdf.text(data.fechaVisita || 'dd/mm/aaaa', 10, yOffset);
        yOffset += 16; // line-height de 1.6 multiplicado por font-size

        // Botones simulados (equivalente a .buttons y .button)
        pdf.setFontSize(11);

        // Definir colores por defecto
        const activeColor = [0, 122, 255]; // Azul para el botón activo
        const inactiveColor = [240, 240, 240]; // Gris claro para los botones inactivos
        const activeTextColor = [255, 255, 255]; // Blanco para el texto del botón activo
        const inactiveTextColor = [85, 85, 85]; // Gris oscuro para el texto de los botones inactivos

        
        const activeType = data.prescripciones?.some((prescripcion) => prescripcion.recetas?.length)
        ? 1
        : data.prescripciones.some((prescripcion) => prescripcion.estudios?.some((estudio) => estudio.tipo === 'Orden'))
        ? 2
        : data.prescripciones.some((prescripcion) => prescripcion.estudios?.some((estudio) => estudio.tipo === 'Resultado'))
        ? 3
        : null 

      const isActive = (type) => activeType === type;
        console.log( data.prescripciones)
        console.log( data.prescripciones)

        
        // Primer botón (Prescripción médica)
        if (isActive(1)) {
          pdf.setFillColor(...activeColor);
          pdf.setTextColor(...activeTextColor);
        } else {
          pdf.setFillColor(...inactiveColor);
          pdf.setTextColor(...inactiveTextColor);
        }
        pdf.roundedRect(10, yOffset, 50, 10, 5, 5, 'F');
        pdf.text('Receta', 12, yOffset + 7);

        // Segundo botón (Orden de estudios)
        if (isActive(2)) {
          pdf.setFillColor(...activeColor);
          pdf.setTextColor(...activeTextColor);
        } else {
          pdf.setFillColor(...inactiveColor);
          pdf.setTextColor(...inactiveTextColor);
        }
        pdf.roundedRect(65, yOffset, 50, 10, 5, 5, 'F');
        pdf.text('Orden de estudios', 67, yOffset + 7);

        // Tercer botón (Resultado de estudios)
        if (isActive(3)) {
          pdf.setFillColor(...activeColor);
          pdf.setTextColor(...activeTextColor);
        } else {
          pdf.setFillColor(...inactiveColor);
          pdf.setTextColor(...inactiveTextColor);
        }
        pdf.roundedRect(120, yOffset, 60, 10, 5, 5, 'F');
        pdf.text('Resultado de estudios', 122, yOffset + 7);

        yOffset += 20; // Espacio extra después de los botones

        // Tabla (equivalente a .table)
        pdf.setTextColor(74, 144, 226); // #4A90E2 para los headers de la tabla
        pdf.setFillColor(240, 240, 240); // #f0f0f0 para el fondo de los headers
        pdf.rect(10, yOffset, 190, 10, 'F');
        pdf.text('Fecha visita', 12, yOffset + 7);
        pdf.text('Centro de salud', 60, yOffset + 7);
        pdf.text('Profesional', 110, yOffset + 7);
        yOffset += 10;

        pdf.setTextColor(85, 85, 85); // #555555 para el contenido de la tabla
        pdf.setFillColor(255, 255, 255); // Fondo blanco para las filas
        pdf.rect(10, yOffset, 190, 10, 'F');
        pdf.text(data.fechaVisita || 'dd/mm/aaaa', 12, yOffset + 7);
        pdf.text(data.institucionSalud.nombre || 'Nombre del centro de salud', 60, yOffset + 7);
        pdf.text(data.profesional.nombre || 'Nombre del profesional', 110, yOffset + 7);
        yOffset += 20;

        // Indicaciones (equivalente a .section-header e .content)
        pdf.setFontSize(16);
        pdf.setTextColor(74, 144, 226); // #4A90E2 para el header de la sección
        pdf.text('Indicaciones', 10, yOffset);
        yOffset += 10;

        pdf.setFontSize(14);
        pdf.setTextColor(85, 85, 85); // #555555 para el texto de la sección
        const splitText = pdf.splitTextToSize(data.indicaciones || 'Tomar un ibuprofeno por día', 190);
        pdf.text(splitText, 10, yOffset);
        yOffset += splitText.length * 8 + 5; // Ajusta el espacio según el tamaño del texto



        // Indicaciones (equivalente a .section-header e .content)
        pdf.setFontSize(16);
        pdf.setTextColor(74, 144, 226); // #4A90E2 para el header de la sección
        pdf.text('Diagnostico', 10, yOffset);
        yOffset += 10;

        pdf.setFontSize(14);
        pdf.setTextColor(85, 85, 85); // #555555 para el texto de la sección
        const splitText2 = pdf.splitTextToSize(data.diagnostico.nombre  || 'Tomar un ibuprofeno por día', 190);
        pdf.text(splitText2, 10, yOffset);
        yOffset += splitText2.length * 8 + 20; // Ajusta el espacio según el tamaño del texto

        yOffset += 10; // Espacio extra entre registros
      });

      pdf.save('historia_clinica.pdf');
    };

    generatePDF();
  }, [dataList]);

  return null; // No se necesita renderizar nada en la pantalla
};

export default GeneratePdf;
