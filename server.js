const express = require('express')
const app = express()
exports.app = app
const { PrismaClient } = require('./src/generated/prisma')
const prisma = new PrismaClient()
exports.prisma = prisma
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const NODE_ENV = 'development'

const fs = require('fs')
const path = require('path');
const PORT = process.env.PORT || 3000
const usersFilePath = path.join(__dirname, 'users.json')
const LoggerMiddleware = require('./src/middleware/loggin')
const ErrorHandler = require('./src/middleware/errorHandler')
const autheticateToken = require('./src/middleware/auth')

//middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(LoggerMiddleware)
app.use(ErrorHandler)


app.get('/', (req, res) => {
    res.send('Hello world')
})

app.get('/users/:id', (req, res) => {
     const userID = req.params.id
     res.send(`Mostrar la información del usuario con id: ${userID}`)
})

app.get('/search', (req, res) => {
     const term = req.query.termino || 'No se especifico'
     const category = req.query.categoria || 'Categoria invalida'
     res.send(`
      <p>Bienvenido, termino:${term} y categoria:${category} </p>   
         `)
})

app.get('/users', (req,res) => {
    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if(err) {
            return res.status(400).json({error: 'Error el obtener los usuarios'})
        }
        const users = JSON.parse(data)
        res.status(200).json(users)
    })
})

app.post('/form', (req,res) => {
     const {name = 'Anonimo', email = 'No proporcionado'} = req.body
     res.json({
         message: 'Datos recibidos',
         data: {
             name, 
             email
         }})
})

app.post('/api/data', (req, res) => {
     const data = req.body;
     if(!data || Object.keys(data).length === 0) {
         return res.status(400).json({error: 'Bad request'})
     }

     res.status(201).json({
         message: 'Datos recibidos',
         data: {
             data
         }
     })
})

app.post('/users', (req, res) => {
    const newUser = req.body
    const {username, email} = req.body
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!username || !email) {
     return res.status(400).json({error: 'Datos incompletos'})
    }
    if(username.length <= 5) {
     return res.status(400).json({error: 'El username debe contener al menos 6 caracteres'})
    }
    if(!regex.test(email)) {
     return res.status(400).json({error: 'El email recibido no contiene la estructura esperada'})
    }

    fs.readFile(usersFilePath, 'utf-8', (err, data) => {
        if(err){
           return res.status(500).json({error: 'Error al leer los usuarios'})
        }
        const users = JSON.parse(data)
        users.push(newUser)
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
            if(err) {
              return res.status(500).json({error: 'Error al crear al usuario'})
            }
            res.status(201).json({data: 'Usuario creado correctamente'})
        } )
    })
})

app.put('/users/:id', (req, res) => {
    const userID = parseInt(req.params.id, 10) 
    const changedUser = req.body
    console.log(changedUser)
    console.log(userID)

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if(err) {
            return res.status(400).json({error: 'Error al cargar los datos'})
        }
        let users = JSON.parse(data)
        
        const userIndex = users.findIndex(user => user.id === userID)
        if (userIndex === -1) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        users[userIndex] = { ...users[userIndex], ...changedUser };

        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
            if(err) {
                return res.status(500).json({error: 'Error del servidor'})
            }
            console.log(users[userIndex])
            res.json(users[userIndex])
        })
    })
})

app.delete('/users/:id', (req, res) => {
    const userID = parseInt(req.params.id, 10)

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(400).json({error: 'Error en conexion de datos'})
        }

        let users = JSON.parse(data)
        users = users.filter(user => user.id !== userID)
        fs.writeFile(usersFilePath, JSON.stringify(users, null, 2), err => {
            if (err) {
                return res.status(500).json({error: 'Error al eliminar los datos'})
            }
            res.status(204).send()
        })
    })
})

app.get('/error', (req, res, next) => {
        next(new Error('Error intencional'))
})

app.get('/db-users', async (req, res) => {
    try {
        const users = await prisma.user.findMany()
        res.json(users)
    } catch (error) {
        res.status(500).json({ error: 'Error al comunicarse con la base de datos'})
    }
})

app.get('/protected', autheticateToken, (req, res) => {
    res.status(200).json({ data: 'jwt ok?'})
})

app.post('/register', async (req, res) => {
    const {name, password, email} = req.body

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
        data: {
            email,
            password: hashedPassword, 
            name,
            role: 'USER'
        }
    })
    res.status(201).json({ data: 'User Registered succesfully '})
})

app.post('/login', async (req, res) => {
    const { email, password} = req.body
    const user = await prisma.user.findUnique({ where: { email }})
    console.log(user)
    
    if(!user) return res.status(400).json({ error: 'Invalid password or email'})

    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword) return res.status(400).json({ error: 'Invalid password or email'})
  
    const token = jwt.sign(
        {id: user.id, role: user.role},
        process.env.JWT_SECRET,
        { expiresIn: '4h'}
    )  
    
    res.json(token)

})


app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
