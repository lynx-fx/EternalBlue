const cron = require("node-cron");
const User = require("../model/Users");

// Run every minute to clean up abandoned pending tickets older than 15 minutes
cron.schedule('* * * * *', async () => {
    try {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

        // Find tickets that are pending and older than 15 minutes
        const expiredTickets = await Ticket.find({
            status: "pending",
            createdAt: { $lt: fifteenMinutesAgo }
        });

        if (expiredTickets.length === 0) return;

        for (const ticket of expiredTickets) {
            const event = await Event.findById(ticket.eventId);
            if (event) {
                const ticketType = ticket.ticketType || 'standard';
                const count = ticket.seatCount || 1;
                if (event.soldTickets[ticketType] >= count) {
                    event.soldTickets[ticketType] -= count;
                    await event.save();
                }
            }
            // Mark the expired pending ticket as cancelled instead of deleting
            ticket.status = "cancelled";
            await ticket.save();
        }

        console.log(`Automatically cancelled ${expiredTickets.length} expired pending payment tickets and released seats.`);
    } catch (err) {
        console.error("Pending Tickets Cleanup Cron Error:", err.message);
    }
});
