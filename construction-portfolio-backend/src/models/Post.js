const mongoose = require("mongoose");
const { imageSchema } = require("./ImageSchema");



const postSchema = new mongoose.Schema(
    {
    postTitle: {
      type: String,
      required: true,
      trim: true,
    },
    postId: {
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
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Post",
  postSchema
);