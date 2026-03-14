const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/RKUEvents")
  .then(async () => {
    console.log("Connected to MongoDB for migration.");
    const db = mongoose.connection.db;
    
    // Find all legacy events that have a "department" string field
    const legacyEvents = await db.collection("events").find({ department: { $exists: true } }).toArray();
    console.log(`Found ${legacyEvents.length} legacy events to migrate...`);

    for (let event of legacyEvents) {
      if (!event.departments || event.departments.length === 0) {
        await db.collection("events").updateOne(
          { _id: event._id },
          { 
            $set: { departments: [event.department] },
            $unset: { department: "" }
          }
        );
        console.log(`Migrated event: ${event.name}`);
      }
    }
    
    console.log("Migration complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
