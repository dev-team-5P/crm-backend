const mongoose = require("mongoose");

resetTokenSchema = new mongoose.Schema({
  resetToken: { type: String, required: true },
  code: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 43200 },
});

module.exports = mongoose.model("ResetToken", resetTokenSchema);
