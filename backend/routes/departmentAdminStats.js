const express = require("express");
const router = express.Router();

const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");

// ⭐ Dashboard Cards — FILTER BY DEPARTMENT
router.get("/cards/:department", async (req, res) => {
  try {
    const { department } = req.params;

    // 1️⃣ Get all event IDs belonging to this department
    const deptEvents = await Event.find({ department }).select("_id");
    const eventIds = deptEvents.map(e => e._id);

    // 2️⃣ Count event registrations ONLY for events of this department
    const registrations = await EventRegistration.countDocuments({
      eventId: { $in: eventIds }
    });

    // Total events in department
    const totalEvents = deptEvents.length;

    res.json({
      totalEvents,
      registrations,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});


// ⭐ Monthly Registrations — FILTER BY DEPARTMENT
router.get("/monthly/:department", async (req, res) => {
  try {
    const { department } = req.params;

    const deptEvents = await Event.find({ department }).select("_id");
    const eventIds = deptEvents.map(e => e._id);

    const data = await EventRegistration.aggregate([
      { $match: { eventId: { $in: eventIds } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});


// ⭐ Events Pie — ONLY Events of that DEPARTMENT
router.get("/events/:department", async (req, res) => {
  try {
    const dept = req.params.department;

    const count = await Event.countDocuments({ department: dept });

    res.json([
      { _id: dept, value: count }  // return in pie chart format
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
