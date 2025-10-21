
const { Router } = require('express')
const router = Router()
const autheticateToken = require('../middleware/auth')

const { createTimeBlock, listReservations } = require('../controllers/adminController')

router.post('/time-blocks',autheticateToken, createTimeBlock)
router.get('/reservations', autheticateToken, listReservations)


module.exports = router