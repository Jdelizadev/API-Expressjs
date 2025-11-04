
const { getWeeklyAvailability } = require('../services/availabilityServices');

const getAvailability = async (req, res) => {
    try {
        const availability = await getWeeklyAvailability();
        return res.status(200).json(availability);

    } catch (error) {
        console.error("Error fetching weekly availability:", error.message);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { getAvailability };