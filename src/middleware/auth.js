
const jwt = require('jsonwebtoken')
//const JWT_SECRET = 'platzi'

function autheticateToken (req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]
    if(!token) return res.status(401).json({ error: 'Acces denied, no token provided' })

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if(err) return res.status(403).json({ error: 'Invalid Token'})
        console.log(user)
        req.user = user;
        next()
    })
    
}

module.exports = autheticateToken
