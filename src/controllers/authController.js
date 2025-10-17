const { registerUser, loginUser } = require('../services/authServices')


const register = async (req, res) => {
    try {
        console.log(req.body)
        const { name, email, password} = req.body
        await registerUser(name, email, password)
        return res.status(201).json({ data: 'User created succesfully'})

    } catch (error) {
        return res.status(400).json({ error: error.stack})
    }
}


const login = async (req, res) => {
    try {
      const { email, password} = req.body
      const token = await loginUser(email, password)
      return res.status(200).json({ token})

    } catch (error) {
        return res.status(400).json({ error: error.message})
    }
}

module.exports = { login, register }