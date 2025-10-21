
const { Router } = require('express')
const router = Router()
const authRouter = require('./auth')
const adminRouter = require('./admin')
const getRouter = require('./get')
const reservations = require('./reservations')
const appointmens = require('./appointmens')

router.use('/auth', authRouter)
router.use('/admin', adminRouter)
router.use('/reservations', reservations)
router.use('/get', getRouter)
router.use('/users', appointmens)
router.get('/error', (req, res, next) => {
    next(new Error('Error intencional'))
})



module.exports = router