const { default: mongoose } = require("mongoose");


const CountSchema = new mongoose.Schema({
    pageId: {
      type: String,
      required: true,
    },
    pageName:   {
      type: String,
      required: true,
    },
    visitcount: Number,
    subpage: Array
});

module.exports = mongoose.model("viewcount", CountSchema);