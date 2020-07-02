const mongoose = require("mongoose");

adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  pme: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pme",
    },
  ],
});

module.exports = mongoose.model("Admin", adminSchema);
