const mongoose = require("mongoose");

const eventDetailsSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
  department: {
    
    type: String,
    enum: ["SOE", "SOS", "SOM", "LAW", "PHARMACY"],
    required: true
  },
  dynamicFields: [
    {
      label: { type: String, required: true },
      type: { type: String, required: true },
      options: [String] // only used if type is select
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("EventDetails", eventDetailsSchema);
