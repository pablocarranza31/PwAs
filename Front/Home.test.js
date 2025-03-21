import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './src/components/Home';
import '@testing-library/jest-dom';

// Mock de useNavigate
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Home Component', () => {
  test('renders welcome message', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('Bienvenido')).toBeInTheDocument();
  });

  test('renders navigation buttons', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText('Ir al Login')).toBeInTheDocument();
    expect(screen.getByText('Ir al Registro')).toBeInTheDocument();
  });

  test('navigates to login when login button is clicked', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByText('Ir al Login'));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
