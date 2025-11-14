const express = require("express");
const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");

const router = express.Router();

// ✅ Get all events
router.get("/all", async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
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
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch registrations" });
  }
});

module.exports = router;
