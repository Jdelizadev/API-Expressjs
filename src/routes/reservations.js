
const { Router } = require('express')
const router = Router()
const reservationController = require('../controllers/reservationsController')
const autheticateToken = require('../middleware/auth')


router.post('/', autheticateToken, reservationController.createReservation)
router.get('/:id', autheticateToken, reservationController.getReservation)
router.put('/:id', autheticateToken, reservationController.updateReservation)
router.delete('/:id', autheticateToken, reservationController.deleteReservation)

module.exports = router



