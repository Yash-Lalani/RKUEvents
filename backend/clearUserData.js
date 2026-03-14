require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const EventRegistration = require("./models/EventRegistration");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB. Deleting user lyash031@rku.ac.in...");
    const targetEmail = "lyash031@rku.ac.in";
    
    const user = await User.findOne({ email: targetEmail });
    if (user) {
        console.log(`Found user ${user._id}. Deleting registrations...`);
        const regRes = await EventRegistration.deleteMany({ userId: user._id });
        console.log(`Deleted ${regRes.deletedCount} registrations.`);
        
        await User.findByIdAndDelete(user._id);
        console.log("User deleted successfully.");
    } else {
        console.log("User not found.");
    }

    console.log("Done.");
    process.exit(0);
  })
  .catch(err => {
    console.error("Database connection error:", err);
    process.exit(1);
  });
