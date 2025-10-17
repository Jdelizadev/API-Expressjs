const { getDbUsers } = require('../services/getUserService')
 
const getUsers = async (req, res) => {
    try {
        const users = await getDbUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: error.message})
    }   
}

module.exports = { getUsers }