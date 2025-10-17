
const express = require('express')
const routes = require('./routes')
const app = express()
const errorHandler = require('./middleware/errorHandler')
const LoggerMiddleware = require('./middleware/loggin')

app.use(express.json())
app.use(errorHandler)
app.use(LoggerMiddleware)
app.use('/api', routes)


app.get('/', (req, res) => {
    res.send('Hello world')
})

module.exports = app