// client-vite/src/components/PresetDashboard.jsx

import React, { useEffect, useRef, useState } from 'react';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import { usePresetToken } from '../hooks/usePresetToken'; // Ajusta la ruta

// Puedes usar íconos sencillos en lugar de librerías como 'lucide-react'
const Loader = () => <div style={{ fontSize: '2em', textAlign: 'center' }}>🔄 Cargando...</div>;
const ErrorDisplay = ({ message }) => (
    <div style={{ color: 'red', textAlign: 'center', padding: '20px', border: '1px solid red' }}>
        ⚠️ Error al cargar el dashboard: {message}
    </div>
);

const PresetDashboard = () => {
    // Definimos el ID del Dashboard y el Dominio desde el .env del backend (valores fijos)
    // En un proyecto real, estos irían en las variables de entorno de Vite (.env.local)
    // Aquí los dejamos fijos para simplificar, basados en tu .env original:
    const PRESET_SUPERSET_DOMAIN = 'https://136e2b0c.us2a.app.preset.io';
    const PRESET_DASHBOARD_ID = '07c73896-632f-4446-a892-88310f13c15c';
    
    const { token, loading, error: tokenError } = usePresetToken();
    const containerRef = useRef(null);
    const [embedError, setEmbedError] = useState(null);

    useEffect(() => {
        // Solo proceder si tenemos el token y el contenedor está listo
        if (!token || !containerRef.current) return;

        // Limpiar el contenedor antes de embeber para evitar duplicados
        containerRef.current.innerHTML = '';

        try {
            embedDashboard({
                id: PRESET_DASHBOARD_ID, // Usamos el ID de tu .env
                supersetDomain: PRESET_SUPERSET_DOMAIN, // Usamos el dominio de tu .env
                mountPoint: containerRef.current,
                // Le pasamos el token directamente como una promesa resuelta
                fetchGuestToken: () => Promise.resolve(token), 
                dashboardUiConfig: {
                    hideTitle: false,
                    hideChartControls: false,
                    hideTab: false,
                },
                // Opcional: Manejar errores del IFRAME (como el CSP que mencionaste)
                onFailure: (err) => {
                    setEmbedError(`Preset Embedding Falló: ${err.message || JSON.stringify(err)}`);
                    console.error('Preset Embedding Error:', err);
                }
            });
            setEmbedError(null);
        } catch (err) {
            setEmbedError(err.message || 'Error al iniciar la incrustación.');
            console.error('Error general embedding dashboard:', err);
        }
    }, [token]);

    if (loading) {
        return <Loader />;
    }

    if (tokenError || embedError) {
        return <ErrorDisplay message={tokenError || embedError} />;
    }

    // El componente se renderiza y el useEffect se encarga de incrustar el iframe
    return (
        <div
            ref={containerRef}
            className="preset-dashboard-container"
            style={{
                width: '100%',
                height: '80vh', // Altura significativa para que el dashboard sea visible
                minHeight: '600px',
                border: '1px solid #ddd',
                borderRadius: '8px'
            }}
        />
    );
}

export default PresetDashboard;