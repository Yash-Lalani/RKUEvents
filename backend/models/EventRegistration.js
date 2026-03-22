const mongoose = require("mongoose");

const eventRegistrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  responses: { type: Object, default: {} }, // dynamic form fields
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'not_required'], 
    default: 'not_required' 
  },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("EventRegistration", eventRegistrationSchema);
