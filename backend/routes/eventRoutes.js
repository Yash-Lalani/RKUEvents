const express = require("express");
const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");


const router = express.Router();

// GET all events
router.get("/", async (req, res) => {
  try {
    const { department } = req.query;

    let query = {};
    if (department) {
      query.department = department;
    }

    const events = await Event.find(query);

    const eventsWithCounts = await Promise.all(
      events.map(async (event) => {
        const count = await EventRegistration.countDocuments({ eventId: event._id });
        return {
          ...event.toObject(),
          totalRegistrations: count,
        };
      })
    );

    res.json(eventsWithCounts);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});
// ✅ GET single event + its details
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const EventDetails = require("../models/EventDetails");
    const details = await EventDetails.findOne({ eventId: req.params.id });

    res.json({
      ...event.toObject(),
      dynamicFields: details ? details.dynamicFields : []
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// POST create new event
router.post("/add", async (req, res) => {
  try {
    const { name, description, date, time, location, image, department } = req.body;

    if (!name || !description || !date || !time || !location || !department) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    const newEvent = new Event({
      name,
      description,
      date,
      time,
      location,
      image,
      department, // ✅ make sure this is included
    });

    await newEvent.save();

    res.json({ msg: "Event created successfully", event: newEvent });
  } catch (err) {
    console.error("Event creation error:", err); // ✅ log full error
    res.status(500).json({ msg: "Server error", error: err.message }); // include error message
  }
});

// GET single event + its details
// GET all events (with total registrations)
// router.get("/", async (req, res) => {
//   try {
//     const { department } = req.query;

//     let query = {};
//     if (department) {
//       query.department = department; // filter by department
//     }

//     const events = await Event.find(query);

//     const eventsWithCounts = await Promise.all(
//       events.map(async (event) => {
//         const count = await EventRegistration.countDocuments({ eventId: event._id });

//         return {
//           ...event.toObject(),
//           totalRegistrations: count,
//         };
//       })
//     );

//     res.json(eventsWithCounts);

//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });


router.delete("/:id", async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
