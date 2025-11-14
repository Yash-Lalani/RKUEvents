const express = require("express");
const router = express.Router();
const EventRegistration = require("../models/EventRegistration");

// POST /api/event-registrations
router.post("/", async (req, res) => {
  try {
    const { userId, eventId, responses } = req.body;

    if (!userId || !eventId) {
      return res.status(400).json({ message: "UserId and EventId are required." });
    }

    // Optional: Check if user already registered
    const existing = await EventRegistration.findOne({ userId, eventId });
    if (existing) {
      return res.status(400).json({ message: "User already registered for this event." });
    }

    const registration = new EventRegistration({ userId, eventId, responses });
    await registration.save();

    return res.status(201).json({ message: "Registration successful!", registration });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
