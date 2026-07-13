const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    yourName: { type: String, required: true, trim: true },
    yourEmail: { type: String, required: true, trim: true },
    yourSubject: { type: String, required: true, trim: true },
    yourMessage: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
