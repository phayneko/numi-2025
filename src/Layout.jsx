// client-vite/src/Layout.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children, handleLogout }) => {
    // Estado para controlar si el Sidebar está abierto o cerrado
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="layout-container">
            {/* =======================================================
              HEADER 
             ======================================================= */}
            <header className="app-header">
                <button onClick={toggleSidebar} className="hamburger-button">
                    ☰ 
                </button>
                <h1 className="app-title">Mi Proyecto Full-Stack</h1>
            </header>

            {/* =======================================================
              SIDEBAR
             ======================================================= */}
            <nav className={`app-sidebar ${isSidebarOpen ? 'is-open' : ''}`}>
                <ul className="menu-list">
                    <li className="menu-item">
                        <Link to="/home" className="menu-link" onClick={toggleSidebar}>🏠 Home</Link>
                    </li>
                    <li className="menu-item">
                        <Link to="/Dashboard" className="menu-link" onClick={toggleSidebar}>📊 Dashboard</Link>
                    </li>
                </ul>
                <button onClick={handleLogout} className="logout-button">
                    Cerrar Sesión
                </button>
            </nav>

            {/* Overlay semi-transparente para cerrar el menú en móvil */}
            {isSidebarOpen && <div className="overlay" onClick={toggleSidebar} />}


            {/* =======================================================
              CONTENIDO PRINCIPAL
             ======================================================= */}
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout; 
// 🚨 NOTA: Se eliminó el objeto 'const styles = { ... }'