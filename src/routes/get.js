
const { Router } = require('express')
const router = Router()
const { getUsers } = require('../controllers/getController')

router.get('/db-users', getUsers)

module.exports = router