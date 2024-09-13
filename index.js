// index.js
const express = require('express');
const worldbankRoutes = require('./routes/worldbankRoutes');
const authenticate = require('./middleware/auth'); // Middleware de autenticación
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para manejo de JSON
app.use(express.json());

// Límite de 20 solicitudes por minuto
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 20, // Límite de 20 solicitudes
    message: "Excediste el número de solicitudes permitidas por minuto"
});

// Aplicar el middleware de límite de solicitudes
app.use(limiter);

// Aplicar el middleware de autenticación
app.use(authenticate);

// Usar las rutas de World Bank
app.use('/api', worldbankRoutes);

// Inicializar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
