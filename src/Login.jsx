// client-vite/src/Login.jsx

import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api/Login';

const Login = ({ onLoginSuccess }) => {
  // Estado para los campos del formulario
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Estado para mensajes de la API
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          // Indicamos que estamos enviando JSON
          'Content-Type': 'application/json',
        },
        // Convertimos los datos a JSON para enviarlos
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Login exitoso (status 200)
        setMessage(data.message);
        setIsError(false);
        // Llamamos a la función para cambiar la vista a 'Home' o 'Dashboard'
        onLoginSuccess(data.token); 
      } else {
        // Login fallido (status 401)
        setMessage(data.message || 'Error desconocido en la autenticación.');
        setIsError(true);
      }

    } catch (error) {
      console.error('Error de red o CORS:', error);
      setMessage('Error de conexión. Verifica que el servidor esté encendido.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username">Usuario:</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="password">Contraseña:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px', backgroundColor: '#61dafb', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {isLoading ? 'Cargando...' : 'Entrar'}
        </button>
      </form>

      {/* Mostrar mensajes */}
      {message && (
        <p style={{ 
          marginTop: '15px', 
          color: isError ? 'red' : 'green', 
          fontWeight: 'bold' 
        }}>
          {message}
        </p>
      )}

      {/* Credenciales de prueba */}
      <p style={{ marginTop: '20px', fontSize: '0.8em', color: '#555' }}>
        **Credenciales de Prueba:** Usuario: `admin`, Contraseña: `123456`
      </p>
    </div>
  );
};

export default Login;