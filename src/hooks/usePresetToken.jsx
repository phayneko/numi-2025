// client-vite/src/hooks/usePresetToken.jsx

import { useState, useEffect } from 'react';

// URL de la API que hemos corregido en el backend
const TOKEN_API_URL = 'http://localhost:5000/api/preset-embed-token';

export const usePresetToken = () => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch(TOKEN_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // Opcional: Envía el nombre del usuario logueado para RLS
                    body: JSON.stringify({ username: 'embed-user' }), 
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || data.message || 'Error al obtener el token de incrustación.');
                }
                
                // El backend devuelve { token: '...' }
                setToken(data.token); 
                setError(null);
            } catch (err) {
                console.error('Error fetching Preset token:', err);
                setError(err.message || 'Error de conexión con el servidor de tokens.');
            } finally {
                setLoading(false);
            }
        };

        fetchToken();
    }, []);

    return { token, loading, error };
};