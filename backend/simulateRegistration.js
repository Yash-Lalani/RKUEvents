require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");
const Event = require("./models/Event");
const EventRegistration = require("./models/EventRegistration");

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to DB\n");

    const student = await User.findOne({ role: "student" });
    const event = await Event.findOne();

    if (!student || !event) {
      console.log("❌ No student or event found. Aborting.");
      process.exit(1);
    }

    console.log("=== Simulating what the frontend sends ===");
    
    // This is exactly the data EventDetails.jsx sends:
    // userId = user?.id || user?.user?.id  (from localStorage)
    // The login stores data.user = { id: user._id, name, email, ... }
    // So userId should be the _id string
    
    const userId = student._id.toString();
    const eventId = event._id.toString();

    console.log("userId being sent:", userId);
    console.log("eventId being sent:", eventId);
    console.log("Student email (where email will go):", student.email);
    console.log("");

    // Simulate what http://localhost:5000/api/event-registrations POST does:
    console.log("--- Making real HTTP request to the running server ---");
    
    // We need http module since we can't use fetch in old Node without extra setup
    const http = require("http");
    const body = JSON.stringify({ userId, eventId, responses: { "Test Field": "Test Value" } });
    
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
        console.log("\n=== Server Response ===");
        console.log("Status Code:", res.statusCode);
        try {
          const json = JSON.parse(data);
          console.log("message    :", json.message);
          console.log("emailStatus:", json.emailStatus);
        } catch(e) {
          console.log("Raw response:", data);
        }
        console.log("\n✅ If emailStatus says 'Email sent successfully' -> check", student.email);
        console.log("❌ If emailStatus says 'Missing User' -> the userId from localStorage doesn't match DB");
        mongoose.disconnect();
        process.exit(0);
      });
    });

    req.on("error", (err) => {
      console.log("❌ HTTP request failed:", err.message);
      console.log("   -> Make sure your backend server is RUNNING on port 5000.");
      mongoose.disconnect();
      process.exit(1);
    });

    req.write(body);
    req.end();
  })
  .catch(err => {
    console.error("DB error:", err.message);
    process.exit(1);
  });
