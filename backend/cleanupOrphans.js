require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Event = require("./models/Event");
const EventRegistration = require("./models/EventRegistration");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to Database. Scanning for orphaned data...");
    
    let orphanedCount = 0;
    const registrations = await EventRegistration.find();
    
    for (const reg of registrations) {
      // Check if the user still exists
      const userExists = await User.findById(reg.userId);
      // Check if the event still exists
      const eventExists = await Event.findById(reg.eventId);
      
      if (!userExists || !eventExists) {
        await EventRegistration.findByIdAndDelete(reg._id);
        orphanedCount++;
        console.log(`Deleted orphaned registration: ${reg._id}`);
      }
    }

    console.log(`\nCleanup Complete! Successfully purged ${orphanedCount} ghost registrations.`);
    process.exit(0);
  })
  .catch(err => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
