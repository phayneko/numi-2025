// client-vite/src/pages/PresetDashboardEmbed.jsx (VERSIÓN FINAL CON INSTALACIÓN NPM)

import React, { useState, useEffect, useRef } from 'react';
// 🚨 CAMBIO CLAVE 1: Importamos la función del paquete NPM exitosamente instalado
import { embedDashboard } from '@superset-ui/embedded-sdk'; 

const PRESET_TOKEN_API = 'http://localhost:5000/api/preset-embed-token';
const SUPERSET_DOMAIN = "https://136e2b0c.us2a.app.preset.io"; 

const PresetDashboardEmbed = () => {
    const embedRef = useRef(null); 
    const [status, setStatus] = useState('Cargando token...');

    useEffect(() => {
        
        const fetchTokenAndEmbed = async () => {
            
            // 🚨 CAMBIO CLAVE 2: Eliminamos la verificación de window.embedDashboard.
            // La función 'embedDashboard' ahora existe porque la importamos arriba.
            
            // Verificamos el punto de montaje antes de proceder
            if (!embedRef.current) {
                console.warn("Punto de montaje (embedRef.current) aún no está disponible.");
                return;
            }

            try {
                setStatus('Buscando token en el backend...');

                // 1. Obtener el Token de tu Backend
                const response = await fetch(PRESET_TOKEN_API, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username: 'app-user', userId: 1 })
                });

                if (!response.ok) {
                    throw new Error(`Error ${response.status}: No se pudo obtener el token.`);
                }

                const data = await response.json();
                
                setStatus('Token recibido. Incrustando Dashboard...');
                
                // 2. Usar el Embed SDK con el token obtenido
                // 🚨 CAMBIO CLAVE 3: Usamos 'embedDashboard' (la importación)
                embedDashboard({ 
                    id: data.dashboardId, 
                    supersetDomain: SUPERSET_DOMAIN, 
                    mountPoint: embedRef.current, // Usamos el ref
                    fetchGuestToken: () => Promise.resolve(data.embedToken), 
                    height: '800px',
                    IframeClassName: 'preset-dashboard-iframe',
                    allowSetEnabledFeatures: true
                });

                setStatus('Dashboard de Preset.io cargado con éxito.');

            } catch (error) {
                console.error('Error al incrustar la gráfica:', error);
                setStatus(`⚠️ Error: ${error.message}. Verifica el Backend y las claves Preset.`);
            }
        };

        // 🚨 Ejecutamos el fetch si el ref existe. 
        // El useEffect con un array vacío [] garantiza que esto solo se intente al montar.
        fetchTokenAndEmbed();

    }, []); // Array vacío: Se ejecuta SÓLO una vez al montar

    return (
        <div className="dashboard-container">
            <h2>📊 Gráfica Incrustada desde Preset.io</h2>
            <p style={{ color: status.startsWith('Dashboard') ? 'green' : (status.startsWith('⚠️') ? 'red' : 'orange') }}>Estado: **{status}**</p>
            <div ref={embedRef} style={{ border: '1px solid #ccc', minHeight: '800%' }}>
                {/* Aquí aparecerá el iframe */}
            </div>
        </div>
    );
};

export default PresetDashboardEmbed;