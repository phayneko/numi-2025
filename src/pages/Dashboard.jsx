// client-vite/src/pages/Dashboard.jsx (Adaptado y Corregido)

import React from 'react';
import PresetDashboard from '../components/PresetDashboarth'; // Asegúrate de la ruta correcta

const Dashboard = () => {
    return (
        <div>
            <h2>📊 Panel de Control con Preset.io</h2>
            <p>Bienvenido. A continuación verás las métricas cargadas desde Preset.io.</p>
            
            {/* ✅ CORREGIDO: Usamos la clase CSS en lugar del margen incorrecto */}
            <div className="preset-dashboard-wrapper">
                <PresetDashboard /> 
            </div>
                
        </div>
    );
};

export default Dashboard;
