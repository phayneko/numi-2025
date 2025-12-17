// api-server/server.js

const express = require('express');
const cors = require('cors'); 
require('dotenv').config(); 
const fetch = require('node-fetch').default; 

const app = express();
// Render usa la variable de entorno PORT, si no existe usa 5000
const PORT = process.env.PORT || 5000; 

// =======================================================
// 1. MIDDLEWARE (CORS) - CORREGIDO
// =======================================================
app.use(express.json()); 

const corsOptions = {
    // CORRECCIÓN: Se eliminó "/api/Login". Solo se deja el dominio base.
    origin: [
        'https://phenomenal-beijinho-4ef9de.netlify.app', 
        'http://localhost:5173'
    ],
    methods: ['GET', 'POST', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    optionsSuccessStatus: 200 
};

app.use(cors(corsOptions)); 

// =======================================================
// 2. RUTAS PÚBLICAS
// =======================================================

app.get('/api/mensaje', (req, res) => {
    res.json({ 
        mensaje: "¡Conexión exitosa desde el Backend!",
    });
});

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

const PRESET_API_KEY = process.env.PRESET_API_KEY;
const PRESET_API_SECRET = process.env.PRESET_API_SECRET; 
const PRESET_DASHBOARD_ID = process.env.PRESET_DASHBOARD_ID;
const PRESET_TEAM_ID = process.env.PRESET_TEAM_ID; 
const PRESET_WORKSPACE_ID = process.env.PRESET_WORKSPACE_ID; 
const PRESET_MANAGER_API_URL = process.env.PRESET_MANAGER_API_URL || 'https://api.app.preset.io';

async function getPresetAccessToken() {
    if (!PRESET_API_KEY || !PRESET_API_SECRET) {
        throw new Error('Missing PRESET_API_KEY or PRESET_API_SECRET');
    }

    const authResponse = await fetch(`${PRESET_MANAGER_API_URL}/v1/auth/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: PRESET_API_KEY,
            secret: PRESET_API_SECRET,
        }),
    });

    if (!authResponse.ok) {
        throw new Error(`Preset auth failed: ${authResponse.status}`);
    }

    const authJson = await authResponse.json();
    return authJson?.payload?.access_token || authJson?.access_token;
}

// =======================================================
// 3. RUTA DE PRESET EMBED
// =======================================================
app.post('/api/preset-embed-token', async (req, res) => {
    try {
        const accessToken = await getPresetAccessToken();
        
        const payload = {
            user: {
                username: req.body.username || 'embed-user',
                first_name: 'Embed',
                last_name: (req.body.username || 'user').toUpperCase(), 
            },
            resources: [{ type: 'dashboard', id: PRESET_DASHBOARD_ID }],
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

        const json = await guestTokenResponse.json();
        const guestToken = json?.payload?.token || json?.token;

        if (!guestToken) {
            return res.status(500).json({ error: 'No guest token found' });
        }

        return res.status(200).json({ token: guestToken });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// =======================================================
// 4. INICIAR EL SERVIDOR
// =======================================================
app.listen(PORT, () => {
    console.log(`Servidor API corriendo en el puerto ${PORT}`);
});
