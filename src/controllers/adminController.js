
const { createTimeBlockService, listReservationsService } = require('../services/adminService')

const createTimeBlock = async (req,res) => {
    if(req.user.role !== 'ADMIN') {
        res.status(403).json({ error:'Acces denied'})
    }
    const { startTime, endTime } = req.body

    try {
        const newTimeBlock = await createTimeBlockService(startTime, endTime)
        res.status(201).json(newTimeBlock)
    } catch (error) {
        res.status(500).json({ error: 'Error creating TimeBlock'})
    }
}

const listReservations = async (req, res) => {
    console.log(req.user)
    if(req.user.role !== 'ADMIN') {
        res.status(403).json({ error: 'Access denied'})
    }

    try {
        const reservations = await listReservationsService()
        res.json(reservations)
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reservations'})
    }
}

module.exports = { listReservations, createTimeBlock }