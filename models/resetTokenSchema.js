const mongoose = require("mongoose");

resetTokenSchema = new mongoose.Schema({
  _adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  },
  resetToken: { type: String, required: true },
  code: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: 43200 },
});

module.exports = mongoose.model("RestToken", resetTokenSchema);
