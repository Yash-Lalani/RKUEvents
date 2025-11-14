// routes/event.js
const express = require("express");
const router = express.Router();
const Registration = require("../models/EventRegistration");
const Event = require("../models/Event");

// POST /api/events/register
router.post("/register", async (req, res) => {
  const { userId, eventId, responses } = req.body;

  try {
    // Optional: check if user already registered
    const existing = await Registration.findOne({ userId, eventId });
    if (existing) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    // Create registration
    const registration = new Registration({ userId, eventId, responses });
    await registration.save();

    // Optional: increase total registrations in event
    await Event.findByIdAndUpdate(eventId, { $inc: { totalRegistrations: 1 } });

    res.status(200).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
