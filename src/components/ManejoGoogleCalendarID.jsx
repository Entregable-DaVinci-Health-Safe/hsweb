import axios from 'axios';

const checkOrCreateCalendar = async ({ accessToken, calendarTitle }) => {
  try {
    // Paso 1: Obtener la lista de calendarios
    const calendarListUrl = 'https://www.googleapis.com/calendar/v3/users/me/calendarList';
    const calendarResponse = await axios.get(calendarListUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const calendars = calendarResponse.data.items;

    // Paso 2: Verificar si existe un calendario con el título especificado
    const existingCalendar = calendars.find((cal) => cal.summary === calendarTitle);

    if (existingCalendar) {
      console.log('El calendario ya existe:', existingCalendar.id);
      return existingCalendar.id; // Devuelve el ID del calendario existente
    }

    // Paso 3: Si no existe, crearlo
    const createCalendarUrl = 'https://www.googleapis.com/calendar/v3/calendars';
    const createResponse = await axios.post(
      createCalendarUrl,
      {
        summary: calendarTitle, // Título del nuevo calendario
        timeZone: 'America/Argentina/Buenos_Aires', // Configura el timezone según sea necesario
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Calendario creado:', createResponse.data.id);
    return createResponse.data.id; // Devuelve el ID del nuevo calendario
  } catch (error) {
    console.error('Error al verificar o crear el calendario:', error);
    throw new Error(error.message || 'Ocurrió un error.');
  }
};

export default checkOrCreateCalendar;
