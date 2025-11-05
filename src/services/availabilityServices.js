
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getWeeklyAvailability = async () => {
    // 1. Obtener todos los bloques de tiempo recurrentes (IDs y horas)
    const existingTimeBlocks = await prisma.timeBlock.findMany({
        select: { id: true, startTime: true, endTime: true }
    });

    const now = new Date();
    // (Código para calcular nextMonday y nextSunday se mantiene igual)
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
    nextMonday.setHours(0, 0, 0, 0);

    // 2. Obtener todas las citas para la próxima semana (solo necesitamos el TimeBlockId y la fecha)
    const existingAppointments = await prisma.appointment.findMany({
        where: {
            date: {
                gte: nextMonday,
                lt: new Date(nextMonday.getTime() + 7 * 24 * 60 * 60 * 1000), // Una semana completa
            },
        },
        select: { date: true, timeBlockId: true }
    });

    // 3. Crear un Set para búsquedas rápidas de horarios ocupados
    const occupiedSlots = new Set(
        existingAppointments.map(app => `${app.date.toISOString().split('T')[0]}_${app.timeBlockId}`)
    );

    const weeklyAvailability = [];

    for (let i = 0; i < 6; i++) { // Iterar de Lunes (i=0) a Sábado (i=5)
        const date = new Date(nextMonday);
        date.setDate(nextMonday.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        
        const availableBlocks = existingTimeBlocks.filter(block => {
            // La clave única es la fecha combinada con el ID del bloque de tiempo
            const slotKey = `${dateString}_${block.id}`;
            return !occupiedSlots.has(slotKey);
        }).map(block => ({
            timeBlockId: block.id,
            startTime: block.startTime, // Hora como string
            endTime: block.endTime,     // Hora como string
        }));

        weeklyAvailability.push({
            date: dateString,
            dayOfWeek: date.getDay(),
            totalHoursAvailable: availableBlocks.length,
            availableBlocks: availableBlocks
        });
    }

    return weeklyAvailability;
};

module.exports = { getWeeklyAvailability };
