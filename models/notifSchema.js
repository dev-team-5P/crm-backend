const mongoose = require("mongoose");

const notifSchema = new mongoose.Schema({
  produit: { type: mongoose.Schema.Types.ObjectId, ref: "stock" },
  send: { type: Boolean, default: true },
});

module.exports = mongoose.model("Notify", notifSchema);
