const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }, // one-line description
  date: { type: String, required: true }, // e.g. "2025-09-15"
  department: {
      type: String,
      enum: ["SOE", "SOS", "SOM", "LAW", "PHARMACY"], // predefined departments
      required: true,
    },
  time: { type: String, required: true }, // e.g. "10:30 AM"
  location: { type: String, required: true },
  totalRegistrations: { type: Number, default: 0 }, // dynamic later
  image: { type: String }, // URL or filename
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
