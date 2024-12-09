export const createHtmlTemplate = (data) => {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
              }
              .header {
                  text-align: center;
                  margin-bottom: 20px;
              }
              .section {
                  border: 1px solid #ccc;
                  padding: 15px;
                  border-radius: 5px;
                  margin-bottom: 20px;
              }
              .section-header {
                  font-weight: bold;
                  margin-bottom: 10px;
              }
              .content {
                  margin-bottom: 15px;
              }
              table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 15px;
              }
              table, th, td {
                  border: 1px solid #ccc;
              }
              th, td {
                  padding: 8px;
                  text-align: left;
              }
              th {
                  background-color: #f4f4f4;
                  font-weight: bold;
              }
              .buttons {
                  margin-bottom: 15px;
              }
              .buttons span {
                  display: inline-block;
                  background-color: #f4f4f4;
                  padding: 8px 12px;
                  border-radius: 15px;
                  margin-right: 10px;
                  font-size: 14px;
                  color: #555;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h1>Historia Clinica</h1>
          </div>
          <div class="section">
              <div class="section-header">Fecha de visita</div>
              <div class="content">${data.fechaVisita}</div>
              <div class="buttons">
                  <span>Prescripción médica</span>
                  <span>Orden de estudios</span>
                  <span>Resultado de estudios</span>
              </div>
              <table>
                  <thead>
                      <tr>
                          <th>Fecha visita</th>
                          <th>Centro de salud</th>
                          <th>Profesional</th>
                          <th>Diagnóstico</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>${data.fechaVisita}</td>
                          <td>${data.centroSalud}</td>
                          <td>${data.profesional}</td>
                          <td>${data.diagnostico}</td>
                      </tr>
                  </tbody>
              </table>
              <div class="section-header">Indicaciones</div>
              <div class="content">${data.indicaciones}</div>
          </div>
      </body>
      </html>
    `;
  };
  