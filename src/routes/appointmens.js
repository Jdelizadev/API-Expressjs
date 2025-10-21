
const { Router } = require('express')
const router = Router()
const appointmentController = require('../controllers/appointmentController')
const autheticateToken = require('../middleware/auth')


router.get('/:id/appointments', autheticateToken, appointmentController.getUserAppoinments)

module.exports = router
