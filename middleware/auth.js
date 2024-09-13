// middleware/auth.js
const authToken = "mi-secreto-api-token";

// Middleware para autenticación con token
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === authToken) {
        next();
    } else {
        res.status(403).json({ error: 'Acceso denegado. Token no válido.' });
    }
};

module.exports = authenticate;
