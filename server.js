// api-server/server.js

const express = require('express');
const cors = require('cors'); 
require('dotenv').config(); 
// Usamos node-fetch@2.6.1 por compatibilidad con 'require'
// CORRECCIÓN FINAL DE FETCH: Accedemos a .default
const fetch = require('node-fetch').default; 

const app = express();
const PORT = 5000; 

// --- Variables de Entorno de Preset.io (Cargadas desde .env) ---
const PRESET_API_KEY = process.env.PRESET_API_KEY;
const PRESET_API_SECRET = process.env.PRESET_API_SECRET; 
const PRESET_DASHBOARD_ID = process.env.PRESET_DASHBOARD_ID;
const PRESET_TEAM_ID = process.env.PRESET_TEAM_ID; 
const PRESET_WORKSPACE_ID = process.env.PRESET_WORKSPACE_ID; 
const PRESET_MANAGER_API_URL = process.env.PRESET_MANAGER_API_URL || 'https://api.app.preset.io';


// =======================================================
// 1. MIDDLEWARE (CORS)
// =======================================================
app.use(express.json()); // Habilita la lectura del cuerpo JSON

const app = express();

// 1. Configurar opciones
const corsOptions = {
    origin: ['https://phenomenal-beijinho-4ef9de.netlify.app', 'http://localhost:5173'],
    methods: 'GET,POST',
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 200 
};

// 2. ACTIVAR CORS (Esto debe ir arriba de las rutas)
app.use(cors(corsOptions));
app.use(express.json());

// 3. Rutas (Esto va después)
app.post('/api/Login', (req, res) => { ... });// Aplica CORS a TODAS las rutas


// =======================================================
// 2. RUTAS PÚBLICAS
// =======================================================

// Ruta de prueba
app.get('/api/mensaje', (req, res) => {
    res.json({ 
        mensaje: "¡Conexión exitosa desde el Backend!",
    });
});

// RUTA DE LOGIN
app.post('/api/Login', (req, res) => {
    const { username, password } = req.body; 

    if (username === 'admin' && password === '123456') {
        res.status(200).json({ 
            success: true, 
            token: 'fake-jwt-token-12345' 
        });
    } else {
        res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
    }
});


// =======================================================
// FUNCIONES DE PRESET 
// =======================================================

/**
 * 1. Obtiene el access_token del Manager API de Preset.
 */
async function getPresetAccessToken() {
    if (!PRESET_API_KEY || !PRESET_API_SECRET) {
        throw new Error('Missing PRESET_API_KEY or PRESET_API_SECRET in .env');
    }

    const authResponse = await fetch(`${PRESET_MANAGER_API_URL}/v1/auth/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: PRESET_API_KEY,
            secret: PRESET_API_SECRET,
        }),
    });

    if (!authResponse.ok) {
        const text = await authResponse.text();
        console.error('Preset auth failed:', authResponse.status, text);
        throw new Error(`Preset auth failed: ${authResponse.status}`);
    }

    const authJson = await authResponse.json();
    const accessToken = authJson?.access_token || authJson?.payload?.access_token || authJson?.data?.payload?.access_token;

    if (!accessToken) {
        console.error('No access_token in Preset auth response:', authJson);
        throw new Error('No access_token in Preset auth response');
    }

    return accessToken;
}


// =======================================================
// 3. RUTA DE PRESET EMBED (ACTUALIZADA Y CORREGIDA)
// =======================================================
app.post('/api/preset-embed-token', async (req, res) => {
    console.log('--- PETICIÓN DE GUEST TOKEN RECIBIDA ---');
    
    // Verificaciones básicas de variables de entorno
    if (!PRESET_TEAM_ID || !PRESET_WORKSPACE_ID || !PRESET_DASHBOARD_ID) {
        return res.status(500).json({
            error: 'Missing PRESET_TEAM_ID, PRESET_WORKSPACE_ID or PRESET_DASHBOARD_ID in server config.',
        });
    }

    try {
        // 1) Sacar access_token del Manager API
        const accessToken = await getPresetAccessToken();
        console.log('✓ Access Token generado.');

        // 2) Pedir guest token para ese dashboard
        const payload = {
            user: {
                username: req.body.username || 'embed-user',
                // 🟢 CORRECCIÓN FINAL: Añadimos first_name y last_name para evitar el error 400
                first_name: 'Embed',
                last_name: (req.body.username || 'user').toUpperCase(), 
            },
            resources: [
                {
                    type: 'dashboard',
                    id: PRESET_DASHBOARD_ID,
                },
            ],
            rls: [], 
        };

        const guestTokenResponse = await fetch(
            `${PRESET_MANAGER_API_URL}/v1/teams/${PRESET_TEAM_ID}/workspaces/${PRESET_WORKSPACE_ID}/guest-token/`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`, 
                },
                body: JSON.stringify(payload),
            },
        );

        const rawText = await guestTokenResponse.text();

        if (!guestTokenResponse.ok) {
            console.error('Guest token request failed:', guestTokenResponse.status, rawText);
            return res.status(guestTokenResponse.status).json({
                error: 'Failed to generate guest token',
                details: rawText,
            });
        }

        let json = {};
        try {
            json = JSON.parse(rawText);
        } catch (e) {
            console.error('Error parsing guest token JSON:', e, rawText);
            return res.status(500).json({ error: 'Invalid JSON from Preset guest-token endpoint' });
        }

        const guestToken = json?.token || json?.payload?.token || json?.data?.payload?.token;

        if (!guestToken) {
            console.error('No token in guest-token response:', json);
            return res.status(500).json({ error: 'No guest token found in response' });
        }

        console.log('✓ Guest token generado correctamente.');

        // Devolvemos solo el token.
        return res.status(200).json({ token: guestToken });

    } catch (error) {
        console.error('Unexpected error generating guest token:', error.message);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message,
        });
    }
});


// =======================================================
// 4. INICIAR EL SERVIDOR
// =======================================================
app.listen(PORT, () => {
    console.log(`Servidor API corriendo en el puerto ${PORT}`);
});





