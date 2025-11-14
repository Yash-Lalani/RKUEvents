const express = require("express");
const router = express.Router();

const Event = require("../models/Event");
const User = require("../models/User");
const EventRegistration = require("../models/EventRegistration");

// --- Dashboard Cards ---
router.get("/cards", async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalUsers = await User.countDocuments();
    const registrations = await EventRegistration.countDocuments();

    res.json({
      totalEvents,
      totalUsers,
      registrations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Monthly Registrations Chart ---
router.get("/monthly-registrations", async (req, res) => {
  try {
    const data = await EventRegistration.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// --- Events per Department Pie ---
router.get("/events-department", async (req, res) => {
  try {
    const data = await Event.aggregate([
      {
        $group: {
          _id: "$department",
          value: { $sum: 1 },
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
