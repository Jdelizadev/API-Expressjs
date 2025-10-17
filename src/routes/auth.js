
const { Router } = require('express')
const { register, login} = require('../controllers/authController')
const autheticateToken = require('../middleware/auth')

const router = Router()

router.post('/register', register)
router.post('/login', login)

router.get('/protected', autheticateToken, (req, res) => {
    res.status(200).json({ data: 'jwt ok?'})
})

module.exports = router