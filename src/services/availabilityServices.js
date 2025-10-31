// services/availabilityServices.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// --- CONFIGURACIÓN DE DISPONIBILIDAD ---
const START_HOUR = 8; // 8 AM
const END_HOUR = 17; // 5 PM (17:00)
const APPOINTMENT_DURATION_MINUTES = 60; // 60 minutos por cita
// ----------------------------------------

/**
 * Calcula la disponibilidad de citas para la próxima semana (Lunes a Sábado).
 * @param {number} userId - ID del usuario (opcional, si se necesita disponibilidad específica)
 * @returns {Array<Object>} Lista de días con el número de horas disponibles.
 */
const getWeeklyAvailability = async () => {
    
    // 1. Definir el rango de la semana (próximo Lunes a próximo Sábado)
    const now = new Date();
    // Encontrar el próximo Lunes
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + (1 + 7 - now.getDay()) % 7);
    nextMonday.setHours(0, 0, 0, 0);

    // Encontrar el próximo Domingo (para incluir la disponibilidad hasta el Sábado)
    const nextSunday = new Date(nextMonday);
    nextSunday.setDate(nextSunday.getDate() + 6); // Cubre Lunes a Sábado

    // 2. Obtener TODAS las citas existentes en el rango
    const existingAppointments = await prisma.appointment.findMany({
        where: {
            date: {
                gte: nextMonday.toISOString(), // Citas desde el Lunes
                lt: nextSunday.toISOString(), // Citas hasta el Sábado
            },
        },
        select: {
            date: true,
            timeBlock: {
                select: {
                    startTime: true,
                    endTime: true,
                }
            }
        }
    });

    // 3. Generar la disponibilidad diaria y compararla con las citas
    const weeklyAvailability = [];

    for (let i = 0; i < 6; i++) { // Iterar de Lunes (i=0) a Sábado (i=5)
        const date = new Date(nextMonday);
        date.setDate(nextMonday.getDate() + i);

        // Convertir la fecha a formato 'YYYY-MM-DD' para comparación
        const dateString = date.toISOString().split('T')[0];
        
        // Calcular el número total de bloques posibles en el día (de 8 AM a 5 PM)
        const totalPossibleBlocks = (END_HOUR - START_HOUR) * (60 / APPOINTMENT_DURATION_MINUTES); // (17 - 8) * (60/60) = 9

        // Filtrar las citas que corresponden a este día
        const appointmentsOnDay = existingAppointments.filter(app => {
            return new Date(app.date).toISOString().split('T')[0] === dateString;
        });

        // Contar el número de bloques ocupados
        const occupiedBlocks = appointmentsOnDay.length;

        // Calcular la disponibilidad
        const hoursAvailable = totalPossibleBlocks - occupiedBlocks; 

        weeklyAvailability.push({
            date: dateString,
            dayOfWeek: date.getDay(), // 1=Lunes, 6=Sábado
            hoursAvailable: Math.max(0, hoursAvailable), // No puede ser negativo
        });
    }

    return weeklyAvailability;
};

module.exports = { getWeeklyAvailability };