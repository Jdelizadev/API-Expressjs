// controllers/availabilityController.js

const { getWeeklyAvailability } = require('../services/availabilityServices');

const getAvailability = async (req, res) => {
    // Nota: Aunque esta ruta no necesita el ID del usuario para el cálculo general, 
    // es buena práctica requerir el JWT para la seguridad.

    // 1. El JWT debe ser verificado antes de llegar aquí (esto se hace con un middleware)
    // Asumimos que un middleware de JWT ya verificó el token.

    try {
        const availability = await getWeeklyAvailability();
        return res.status(200).json(availability);

    } catch (error) {
        console.error("Error fetching weekly availability:", error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAvailability };