const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path');
const PORT = process.env.PORT || 3000
const usersFilePath = path.join(__dirname, 'users.json')


app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

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
        res.status(201).json(users)
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
    const {name, email} = req.body
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!name || !email) {
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

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
