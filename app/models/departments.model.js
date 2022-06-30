const mongoose = require("mongoose");

const Departments = mongoose.model(
  "Departments",
  new mongoose.Schema({
    name: String,
  })
);

module.exports = Departments;
