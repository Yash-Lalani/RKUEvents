const express = require("express");
const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");

const router = express.Router();

// ✅ Get all events
router.get("/all", async (req, res) => {
  try {
    const events = await Event.find();

    // Fetch total registrations for each event
    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const count = await EventRegistration.countDocuments({ eventId: event._id });
        return { ...event.toObject(), totalRegistrations: count };
      })
    );

    res.json(eventsWithCounts);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Server error" });
  }
});



// ✅ Get registrations for a specific event
router.get("/:eventId/registrations", async (req, res) => {
  try {
    const { eventId } = req.params;
    const registrations = await EventRegistration.find({ eventId })
      .populate("userId", "name email") // optional: fetch user info
      .sort({ createdAt: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// ✅ Delete a specific registration
router.delete("/registrations/:id", async (req, res) => {
  try {
    const deletedReg = await EventRegistration.findByIdAndDelete(req.params.id);
    if (!deletedReg) {
      return res.status(404).json({ msg: "Registration not found" });
    }
    res.json({ msg: "Registration successfully removed" });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// ✅ Clear all registrations for a specific event
router.delete("/:eventId/registrations", async (req, res) => {
  try {
    const { eventId } = req.params;
    await EventRegistration.deleteMany({ eventId });
    res.json({ msg: "All registrations for this event have been cleared." });
  } catch (error) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
