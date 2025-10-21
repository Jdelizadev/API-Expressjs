const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.createReservation = async (data) => {
    console.log(data)
    const conflict = await prisma.appointment.findFirst({
        where: {
            date: data.date,
            timeBlockId: data.timeBlockId 
        }
    })
    if(conflict) {
        throw new Error('EL horario ya esta reservado')
    }
    return prisma.appointment.create({ data })
}

exports.getReservation = (id) => {
    return prisma.appointment.findUnique({
        where: {
            id: parseInt(id, 10)
        }
    })
}

exports.updateReservation = async (id, data) => {
    console.log(data, id)
    const conflict = await prisma.appointment.findFirst({
        where: {
            date: data.date,
            timeBlockId: data.timeBlockId,
            id: { not: parseInt(id, 10)}
        }
    })
    if(conflict) {
        throw new Error('El horario ya esta reservado')
    }
    return prisma.appointment.update({ 
        where: {
            id: parseInt(id, 10)
        },
        data
    })
}

exports.deleteReservation = (id) => {
    return prisma.appointment.delete({ 
        where: {
            id: parseInt(id, 10)
        }
    })
}