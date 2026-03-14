require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Event = require("./models/Event");
const EventRegistration = require("./models/EventRegistration");
const http = require("http");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    const student = await User.findOne({ role: "student" });
    const event = await Event.findOne();

    if (!student || !event) {
      console.log("❌ No student or event found.");
      process.exit(1);
    }

    // Delete existing registration so we can register fresh
    const deleted = await EventRegistration.deleteOne({ 
      userId: student._id, 
      eventId: event._id 
    });
    console.log(`🗑️  Cleared existing registration: ${deleted.deletedCount} record(s) removed`);
    console.log(`📧 Will send email to: ${student.email}`);

    // Now POST a fresh registration
    const body = JSON.stringify({ 
      userId: student._id.toString(), 
      eventId: event._id.toString(), 
      responses: {} 
    });

    const options = {
      hostname: "localhost",
      port: 5000,
      path: "/api/event-registrations",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        const json = JSON.parse(data);
        console.log("\n=== RESULT ===");
        console.log("Status   :", res.statusCode);
        console.log("Message  :", json.message);
        console.log("Email    :", json.emailStatus);
        if (res.statusCode === 201 && json.emailStatus === "Email sent successfully") {
          console.log("\n✅ SUCCESS! Email was sent to:", student.email);
        } else {
          console.log("\n❌ Something went wrong.");
        }
        mongoose.disconnect();
        process.exit(0);
      });
    });

    req.on("error", (err) => {
      console.log("❌ HTTP error:", err.message, "-> Is the backend running?");
      mongoose.disconnect();
      process.exit(1);
    });

    req.write(body);
    req.end();
  })
  .catch(err => {
    console.error("DB:", err.message);
    process.exit(1);
  });
