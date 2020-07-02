const mongoose = require("mongoose");

adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
});

module.exports = mongoose.model("Admin", adminSchema);
