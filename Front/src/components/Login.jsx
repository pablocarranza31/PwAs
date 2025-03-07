import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Archivo CSS para los estilos

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://pwasb.onrender.com/api/subs/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
 
      const data = await response.json();

      if (response.ok) {
      // Guardar solo el ID del usuario en localStorage
      localStorage.setItem('userId', data.user._id);
        alert('Inicio de sesión exitoso');
        navigate('/main');
      } else {
        setError(data.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      }
    } catch (err) {
      setError('No se pudo conectar al servidor. Inténtalo nuevamente más tarde.');
    }
  };

  return (
    <div className="page-container">
    <h2 className="page-title">Login</h2>
    {error && <h1 className="login-error">{error}</h1>}
    <form onSubmit={handleLogin} className="form">
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu email"
          required
        />
      </div>
      <div className="form-group">
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          required
        />
      </div>
      <button type="submit" className="button">
        iniciar sesión
      </button>
    </form>
    <p className="link">
      ¿Aun no tienes cuenta? <span onClick={() => navigate('/register')}>Registrate aquí</span>
    </p>
  </div>
  );
}

export default Login;
