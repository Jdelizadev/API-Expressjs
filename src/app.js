
const express = require('express')
const routes = require('./routes')
const app = express()
const errorHandler = require('./middleware/errorHandler')
const LoggerMiddleware = require('./middleware/loggin')
const cors = require('cors')

const corsOptions = {
    // Reemplaza 'http://localhost:5173' con la URL exacta de tu frontend de React
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Esto es necesario si manejas cookies o tokens de sesión
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json())
app.use(errorHandler)
app.use(LoggerMiddleware)
app.use('/api', routes)


app.get('/', (req, res) => {
    res.send('Hello world')
})

module.exports = app