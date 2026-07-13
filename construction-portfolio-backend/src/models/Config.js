const mongoose  = require("mongoose");

const configSchema = new mongoose.Schema(
    {
        title: String,
        images: Array,
        description: String,
        message: String, 
        post: String,
        children: Array,
        linkwrap: String,
        link: String
    }
);

module.exports = mongoose.model("config", configSchema);