import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Asegúrate de importar MemoryRouter
import Recupero from '../../pages/Registro/Recupero'

test('Verifica que un campo vacío marca el estado como inválido', () => {
 render(
    <MemoryRouter>
      <Recupero />
    </MemoryRouter>
  );
  
  // Simulamos el click en el botón de recuperación
  const button = screen.getByText('Recuperar');
  fireEvent.click(button);

  // Esperamos que el campo mail no sea válido
  expect(screen.getByLabelText(/Mail/i)).toHaveAttribute('aria-invalid', 'true');
});

test('Verifica que las contraseñas coincidan', () => {
   render(
    <MemoryRouter>
      <Recupero />
    </MemoryRouter>
  );
  
    const passwordInput = screen.getByLabelText('Ingrese contraseña');
    const password2Input = screen.getByLabelText('Repetir Contraseña');
  
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(password2Input, { target: { value: 'password123' } });
  
    // Verifica que las contraseñas coinciden
    expect(passwordInput.value).toBe(password2Input.value);
  });
  
  test('Muestra el diálogo de éxito después de la recuperación', async () => {
   render(
    <MemoryRouter>
      <Recupero />
    </MemoryRouter>
  );
    
    const mailInput = screen.getByLabelText(/Mail/i);
    const button = screen.getByText('Recuperar');
  
    fireEvent.change(mailInput, { target: { value: 'usuario@dominio.com' } });
    fireEvent.click(button);
  
    // Simula la respuesta del servidor
    await screen.findByText('Hemos enviado una código de validación para cambiar la clave.');
  
    expect(screen.getByText('Recuperación de contraseña')).toBeInTheDocument();
  });
    