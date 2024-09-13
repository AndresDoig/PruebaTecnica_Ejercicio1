// routes/worldbankRoutes.js
const express = require('express');
const { searchWorldBank } = require('../controllers/worldbankController');
const router = express.Router();

// Ruta para búsqueda en The World Bank Debarred Firms
router.get('/worldbank/:entity', searchWorldBank);

module.exports = router;
