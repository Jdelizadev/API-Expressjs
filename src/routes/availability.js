// routes/availability.js

const { Router } = require('express');
const router = Router();

const { getAvailability } = require('../controllers/availabilityController');

const autheticateToken = require('../middleware/auth'); 


// Ruta para obtener la disponibilidad semanal (protegida por el middleware JWT)

router.get('/semana', autheticateToken, getAvailability);

module.exports = router;