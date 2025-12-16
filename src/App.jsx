// client-vite/src/App.jsx

import React, { useState, useEffect } from 'react';
// 1. Importamos 'Navigate' para las redirecciones declarativas
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Login from './Login';
import Layout from './Layout';
import Home from './pages/home';
import Dashboard from './pages/Dashboard';
import './App.css';

// =======================================================
// COMPONENTES DE AYUDA PARA LA NAVEGACIÓN
// =======================================================

// 1. Componente que redirige a Home o Login al cargar la app
// Utilizaremos 'Navigate' para evitar Hooks condicionales o efectos secundarios de redirección.
const InitialRedirect = ({ isAuthenticated }) => {
    // Si ya está autenticado, navega a /home.
    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }
    // Si NO está autenticado, navega a /Login.
    return <Navigate to="/Login" replace />;
    
    /*
    NOTA: Aunque tu versión original con useEffect era funcional,
    esta versión con <Navigate> es la forma más "React-Router" de
    manejar la lógica de redirección de una ruta inicial.
    */
};

// 2. Componente para proteger las rutas (evita acceso si no está logueado)
// 🟢 CORREGIDO: Usamos <Navigate /> para la redirección condicional,
// eliminando el `useEffect` condicional que causaba el error de Hooks.
const ProtectedRoute = ({ children, isAuthenticated }) => {
    // Si no está autenticado, devuelve el componente Navigate
    if (!isAuthenticated) {
        // 'replace' asegura que el usuario no pueda volver a la página protegida
        return <Navigate to="/Login" replace />;
    }
    
    // Si está autenticado, renderiza el contenido
    return children;
};

// =======================================================
// COMPONENTE PRINCIPAL APP
// =======================================================

function App() {
    // Nota: El hook useNavigate() aquí en App es correcto, ya que no está condicional.
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userToken, setUserToken] = useState(null);
    const navigate = useNavigate();

    const handleLoginSuccess = (token) => {
        setIsAuthenticated(true);
        setUserToken(token);
        // La redirección aquí (navigate('/home')) es correcta.
        navigate('/home'); 
    };
    
    const handleLogout = () => {
        setIsAuthenticated(false);
        setUserToken(null);
        // La redirección aquí (navigate('/Login')) es correcta.
        navigate('/Login');
    };

    return (
        <div className="App">
            <Routes>
                {/* RUTA INICIAL: Redirige a /home o /login al cargar la página */}
                <Route 
                    path="/" 
                    element={<InitialRedirect isAuthenticated={isAuthenticated} />} 
                />
                
                {/* RUTA DE LOGIN (NO protegida, NO usa Layout) */}
                <Route 
                    path="/Login" 
                    element={<Login onLoginSuccess={handleLoginSuccess} />} 
                />
                
                {/* RUTAS PROTEGIDAS (Usan Layout con Sidebar):
                    Aquí es donde se envuelve el contenido con ProtectedRoute
                */}
                <Route 
                    path="/home" 
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout}>
                                <Home />
                            </Layout>
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/Dashboard" 
                    element={
                        <ProtectedRoute isAuthenticated={isAuthenticated}>
                            <Layout isAuthenticated={isAuthenticated} handleLogout={handleLogout}>
                                <Dashboard />
                            </Layout>
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </div>
    );
}

export default App;