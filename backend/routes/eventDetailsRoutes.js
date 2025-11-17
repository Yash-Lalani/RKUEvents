const express = require("express");
const EventDetails = require("../models/EventDetails");

const router = express.Router();

// Add dynamic fields for event registration

router.get("/", async (req, res) => {
  const details = await EventDetails.find().populate("eventId");
  res.json(details);
});

// ✅ UPDATE event details
router.put("/:id", async (req, res) => {
  try {
    const existing = await EventDetails.findById(req.params.id);
    if (!existing) return res.status(404).json({ msg: "Not found" });

    // ❌ WRONG: Merge old + new (causing duplicates)
    // existing.dynamicFields = mergedFields;

    // ✅ RIGHT: Replace fields with updated fields
    existing.dynamicFields = req.body.dynamicFields;

    await existing.save();

    res.json({ msg: "Event details updated successfully", updated: existing });
  } catch (error) {
    console.error("Update EventDetails error:", error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.post("/add-details", async (req, res) => {
  try {
    const { eventId, department, dynamicFields } = req.body;

    if (!eventId || !department || !dynamicFields || !dynamicFields.length) {
      return res.status(400).json({ msg: "Please provide all required fields" });
    }

    const newDetails = new EventDetails({
      eventId,
      department,
      dynamicFields
    });

    await newDetails.save();

    res.json({ msg: "Event details added successfully", details: newDetails });
  } catch (err) {
    console.error("Add EventDetails error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

// Get details for a specific event
router.get("/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const details = await EventDetails.find({ eventId });
    res.json(details);
  } catch (err) {
    console.error("Get EventDetails error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});
// Get event details by its _id (for editing)
router.get("/detail/:id", async (req, res) => {
  try {
    const detail = await EventDetails.findById(req.params.id).populate("eventId");
    if (!detail) {
      return res.status(404).json({ msg: "No detail found" });
    }
    res.json(detail);
  } catch (err) {
    console.error("Fetch single EventDetails error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
