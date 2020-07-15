const mongoose = require("mongoose");

adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  // isVerified: { type: Boolean, default: false },
  resetToken: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RestToken",
  },
  pme: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pme",
    },
  ],
  Activity: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
    },
  ],
});

module.exports = mongoose.model("Admin", adminSchema);
