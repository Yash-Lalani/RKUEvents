require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Event = require("./models/Event");
const emailService = require("./utils/emailService");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB\n");

    // Find a student (not admin)
    const student = await User.findOne({ role: "student" });
    const event = await Event.findOne();

    console.log("=== Student Found ===");
    if (student) {
      console.log("  _id    :", student._id.toString());
      console.log("  name   :", student.name);
      console.log("  email  :", student.email);
      console.log("  role   :", student.role);
      console.log("  dept   :", student.department);
    } else {
      console.log("  ❌ No student found in DB! Are there any users with role='student'?");
    }

    console.log("\n=== Event Found ===");
    if (event) {
      console.log("  _id    :", event._id.toString());
      console.log("  name   :", event.name);
      console.log("  date   :", event.date);
      console.log("  time   :", event.time);
      console.log("  loc    :", event.location);
    } else {
      console.log("  ❌ No event found in DB!");
    }

    if (student && event) {
      console.log("\n=== Sending Registration Email ===");
      console.log(`Sending to: ${student.email}`);
      await emailService.sendRegistrationEmail(student, event);
      console.log("Done!");
    }

    process.exit(0);
  })
  .catch(err => {
    console.error("DB error:", err.message);
    process.exit(1);
  });
