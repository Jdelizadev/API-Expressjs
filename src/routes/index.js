
const { Router } = require('express')
const router = Router()
const authRouter = require('./auth')
const getRouter = require('./get')

router.use('/auth', authRouter)
router.use('/get', getRouter)
router.get('/error', (req, res, next) => {
    next(new Error('Error intencional'))
})



module.exports = router