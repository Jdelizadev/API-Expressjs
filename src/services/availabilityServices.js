
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const START_HOUR = 8;
const END_HOUR = 17;
const APPOINTMENT_DURATION_MINUTES = 60;


const generatePossibleBlocks = (date) => {
    const blocks = [];
    let currentTime = new Date(date);
    currentTime.setHours(START_HOUR, 0, 0, 0); // Establecer la hora de inicio (8 AM)

    const endTime = new Date(date);
    endTime.setHours(END_HOUR, 0, 0, 0); // Establecer la hora de fin (5 PM)

    while (currentTime.getTime() < endTime.getTime()) {
        const blockStart = new Date(currentTime);
        const blockEnd = new Date(blockStart.getTime() + APPOINTMENT_DURATION_MINUTES * 60000); // Sumar 60 min

        // Asegurarse de que el bloque no se extienda más allá de la hora de fin
        if (blockEnd.getTime() <= endTime.getTime()) {
            blocks.push({
                startTime: blockStart.toISOString(),
                endTime: blockEnd.toISOString(),
            });
        }
        
        // Mover al siguiente bloque
        currentTime.setTime(blockEnd.getTime());
    }

    return blocks;
};

const getWeeklyAvailability = async () => {
    const now = new Date();
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
    nextMonday.setHours(0, 0, 0, 0);

    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextSunday.getDate() + 6); 

    const existingAppointments = await prisma.appointment.findMany({
        where: {
            date: {
                gte: nextMonday.toISOString(),
                lt: nextSunday.toISOString(),
            },
        },
        select: {
            timeBlock: { select: { startTime: true } } 
        }
    });

    const weeklyAvailability = [];

    for (let i = 0; i < 6; i++) { // Iterar de Lunes (i=0) a Sábado (i=5)
        const date = new Date(nextMonday);
        date.setDate(nextMonday.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        
        const allPossibleBlocks = generatePossibleBlocks(date);

        const occupiedStartTimes = new Set(
            existingAppointments
                .filter(app => new Date(app.timeBlock.startTime).toISOString().split('T')[0] === dateString)
                .map(app => app.timeBlock.startTime) // Guarda el ISOString del startTime
        );

        const availableBlocks = allPossibleBlocks.filter(block => {
            return !occupiedStartTimes.has(block.startTime);
        });


        weeklyAvailability.push({
            date: dateString,
            dayOfWeek: date.getDay(),
            totalHoursAvailable: availableBlocks.length, // El conteo (como antes)
            availableBlocks: availableBlocks// <-- ¡Los horarios específicos!
        });
    }

    return weeklyAvailability;
};

module.exports = { getWeeklyAvailability };
