// client-vite/src/pages/Home.jsx

import React from 'react';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#f4f4f4', minHeight: '80vh' }}>
      <h1>🌍 Bienvenido a la Página de Inicio (HOME)</h1>
      <p>Esta es una página de acceso público. No requiere iniciar sesión.</p>
      
      <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '600px', margin: '30px auto' }}>
        <h3>Próximos Pasos</h3>
        <p>Para ver el contenido privado, dirígete al menú de navegación y haz clic en "Iniciar Sesión".</p>
      </div>
    </div>
  );
};

export default Home;