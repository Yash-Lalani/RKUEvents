const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  responses: { type: Object, default: {} }, // dynamic form fields
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EventRegistration", eventRegistrationSchema);
