const express = require("express");
const router = express.Router();
const EventRegistration = require("../models/EventRegistration");
const User = require("../models/User");
const Event = require("../models/Event");
const emailService = require("../utils/emailService");

// POST /api/event-registrations
router.post("/", async (req, res) => {
  try {
    const { userId, eventId, responses } = req.body;

    console.log("\n========== NEW REGISTRATION ==========");
    console.log("userId received:", userId);
    console.log("eventId received:", eventId);
    console.log("responses received:", JSON.stringify(responses));

    if (!userId || !eventId) {
      return res.status(400).json({ message: "UserId and EventId are required." });
    }

    // Check if user already registered
    const existing = await EventRegistration.findOne({ userId, eventId });
    if (existing) {
      return res.status(400).json({ message: "User already registered for this event." });
    }

    const registration = new EventRegistration({ userId, eventId, responses });
    await registration.save();
    console.log("✅ Registration saved to DB.");

    // Send confirmation email
    let emailStatus = "Email successful";
    try {
      const user = await User.findById(userId);
      const event = await Event.findById(eventId);

      console.log("User lookup result:", user ? `${user.name} <${user.email}>` : "NOT FOUND");
      console.log("Event lookup result:", event ? event.name : "NOT FOUND");

      if (user && event) {
        // Primary: always send to stored account email
        const primaryTarget = { name: user.name, email: user.email };
        console.log(`📧 Sending confirmation to primary email: ${primaryTarget.email}`);
        await emailService.sendRegistrationEmail(primaryTarget, event);
        console.log("✅ Primary email sent successfully.");

        // Secondary: if a form field named 'email' was filled with a DIFFERENT address, send there too
        if (responses) {
          const emailKey = Object.keys(responses).find(k => k.toLowerCase() === "email");
          if (emailKey && responses[emailKey] && responses[emailKey].toLowerCase() !== user.email.toLowerCase()) {
            const secondaryTarget = {
              name: user.name,
              email: responses[emailKey],
            };
            console.log(`📧 Also sending to secondary (form) email: ${secondaryTarget.email}`);
            await emailService.sendRegistrationEmail(secondaryTarget, event);
            console.log("✅ Secondary email sent successfully.");
          }
        }

        emailStatus = "Email sent successfully";
      } else {
        emailStatus = `Missing ${!user ? "User" : "Event"} in database.`;
        console.error("❌", emailStatus);
      }
    } catch (emailErr) {
      console.error("❌ Email dispatch failed:", emailErr.message);
      emailStatus = `Email failed: ${emailErr.message}`;
    }

    console.log("======================================\n");

    return res.status(201).json({
      message: "Registration successful!",
      emailStatus,
      registration,
    });
  } catch (err) {
    console.error("Registration route error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
