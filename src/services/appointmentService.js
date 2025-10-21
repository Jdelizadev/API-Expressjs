const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

exports.getUserAppoinments = async (userId) => {
    const appointments = await prisma.appointment.findMany({
        where: {
            userId: parseInt(userId,10)
        },
        include: {
            timeBlock: true
        }
    })
    if(!appointments) {
        throw new Error('No matches finded')
    }
    return appointments
}