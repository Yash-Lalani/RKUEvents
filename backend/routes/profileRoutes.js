const express = require("express");
const User = require("../models/User");
const EventRegistration = require("../models/EventRegistration");
const Event = require("../models/Event"); // assuming you have an Event model
const router = express.Router();

// 🧍 Get user profile by ID
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// 🎫 Get all events registered by user
router.get("/registered-events/:userId", async (req, res) => {
  try {
    const registrations = await EventRegistration.find({ userId: req.params.userId })
      .populate("eventId", "name date venue description");
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
