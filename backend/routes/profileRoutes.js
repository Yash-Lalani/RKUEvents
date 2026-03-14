const express = require("express");
const User = require("../models/User");
const EventRegistration = require("../models/EventRegistration");
const Event = require("../models/Event"); // assuming you have an Event model
const router = express.Router();
const bcrypt = require("bcryptjs");

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
router.put("/change-password/:id", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    // compare using bcrypt
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Old password incorrect" });

    // hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: "Password updated successfully!" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;
