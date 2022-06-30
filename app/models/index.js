const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.lecture = require("./lectures.model");
db.department = require("./departments.model");

db.ROLES = ["user", "admin", "moderator"];
db.DEPARTMENTS = ["Engineering", "Science"];

module.exports = db;
