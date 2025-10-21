
const appointmentService = require('../services/appointmentService')


exports.getUserAppoinments = async (req, res) => {
    try {
        const userId = req.params.id
        const appointments = await appointmentService.getUserAppoinments(userId)
        res.status(200).json(appointments)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el historial de citas'}) 
    }
}