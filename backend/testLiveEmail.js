require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Event = require("./models/Event");
const emailService = require("./utils/emailService");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to Database. Fetching a user and an event...");
    
    // Find any student
    const user = await User.findOne();
    const event = await Event.findOne();
    
    if (!user || !event) {
      console.log("Missing User or Event in DB.");
      process.exit(1);
    }
    
    console.log(`Sending test email to: ${user.email} (${user.name}) for Event: ${event.name}`);
    await emailService.sendRegistrationEmail(user, event);
    
    console.log("Finished sending.");
    process.exit(0);
  })
  .catch(err => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
