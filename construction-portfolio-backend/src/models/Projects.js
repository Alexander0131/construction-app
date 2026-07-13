const mongoose = require("mongoose");
const { imageSchema } = require("./ImageSchema");

const projectSchema = new mongoose.Schema(
  {
    projectTitle: {
      type: String,
      required: true,
      trim: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    contentTitle: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true,
    },
    contentTitleTwo: {
      type: String,
    },
    contentTwo: {
      type: String,
    },
    description: {
      type: String,
    },
    quote: {
      type: String
    },
    images: [imageSchema],

    author: {
      type: String,
      default: "Admin",
    },

    likes: {
      type: Number,
      default: 0,
    },

    comments: {
      type: Number,
      default: 0,
    },
    state: {
      type: String,
      default: "ongoing"
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);