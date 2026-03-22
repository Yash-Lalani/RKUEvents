const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }, // one-line description
  date: { type: String, required: true }, // e.g. "2025-09-15"
  departments: [{
      type: String,
      required: true,
    }],
  time: { type: String, required: true }, // e.g. "10:30 AM"
  location: { type: String, required: true },
  totalRegistrations: { type: Number, default: 0 }, // dynamic later
  image: { type: String }, // URL or filename
  isPaid: { type: Boolean, default: false }, // Indicates if event requires payment
  price: { type: Number, default: 0 }, // Price for the event
}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
