const mongoose = require("mongoose");

const Lectures = mongoose.model(
  "Lectures",
  new mongoose.Schema({
    name: String,
    credit: Number,
    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Departments",
      },
    ],
  })
);

module.exports = Lectures;
