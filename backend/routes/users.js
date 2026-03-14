const express = require("express");
const User = require("../models/User");
const EventRegistration = require("../models/EventRegistration");
const router = express.Router();

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    // Cascade delete any event registrations explicitly tied to this user
    await EventRegistration.deleteMany({ userId });
    
    // Delete the user themselves
    await User.findByIdAndDelete(userId);

    res.json({ msg: "User and associated event registrations deleted" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});
// Get single user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Update user
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
});


module.exports = router;
