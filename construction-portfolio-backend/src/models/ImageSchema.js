const mongoose = require("mongoose");

exports.imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },

  public_id: {
    type: String,
    required: true,
  }, 
});