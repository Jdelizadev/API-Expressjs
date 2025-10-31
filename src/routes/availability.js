// routes/availability.js

const { Router } = require('express');
const {getAvailability} = require('../controllers/availabilityController');
const autheticateToken = require('../middleware/auth'); // Asegúrate que esta ruta es correcta

const router = Router();

// Ruta para obtener la disponibilidad semanal (protegida por el middleware JWT)
router.get('/semana', autheticateToken, getAvailability);

module.exports = router;