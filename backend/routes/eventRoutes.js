const express = require("express");
const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");
const EventDetails = require("../models/EventDetails");
const User = require("../models/User");
const emailService = require("../utils/emailService");

const router = express.Router();

// GET all events
router.get("/", async (req, res) => {
  try {
    const { department } = req.query;

    let query = {};
    if (department) {
      if (department !== "ALL") {
        query.departments = { $in: [department, "ALL"] };
      }
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
// ✅ GET single event + its details + total registrations
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const EventDetails = require("../models/EventDetails");
    const details = await EventDetails.findOne({ eventId: req.params.id });

    // 👉 Count total registrations for this event
    const totalRegistrations = await EventRegistration.countDocuments({
      eventId: req.params.id
    });

    res.json({
      ...event.toObject(),
      dynamicFields: details ? details.dynamicFields : [],
      totalRegistrations,
    });

  } catch (err) {
    console.error("GET event error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// POST create new event
router.post("/add", async (req, res) => {
  try {
    const { name, description, date, time, location, image, departments } = req.body;

    if (!name || !description || !date || !time || !location || !departments || !departments.length) {
      return res.status(400).json({ msg: "Please fill all fields, including target departments" });
    }

    const newEvent = new Event({
      name,
      description,
      date,
      time,
      location,
      image,
      departments, // ✅ multiple departments support
    });

    await newEvent.save();

    // Broadcast email to target students
    try {
      let users = [];
      if (departments.some(d => d.toUpperCase() === "ALL")) {
        users = await User.find({ role: "student" });
      } else {
        users = await User.find({ role: "student", department: { $in: departments } });
      }
      console.log(`Broadcasting new event email to ${users.length} student(s) in departments: ${departments.join(", ")}`);
      await emailService.sendNewEventEmail(users, newEvent);
    } catch (emailErr) {
      console.error("Failed to broadcast new event email:", emailErr.message);
    }

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
    const eventId = req.params.id;

    // Delete the event
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Delete all registrations and details of this event
    await EventRegistration.deleteMany({ eventId });
    await EventDetails.deleteMany({ eventId });

    res.json({
      message: "Event and related registrations removed successfully",
    });

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
