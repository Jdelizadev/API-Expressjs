const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.createReservation = async (data) => {
    
    const dataToCreate = {
        date: new Date(data.date), // Convierte el string de fecha ISO a objeto Date (Prisma lo necesita)
        timeBlockId: parseInt(data.timeBlockId, 10), // Convierte a entero
        userId: parseInt(data.userId, 10), // Convierte a entero
    };
    const conflict = await prisma.appointment.findFirst({
        where: {
            date: dataToCreate.date,
            timeBlockId: dataToCreate.timeBlockId 
        }
    })
    
    if(conflict) {
        throw new Error('El horario ya está reservado');
    }
    return prisma.appointment.create({ data: dataToCreate })
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