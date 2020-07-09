var mongoose = require("mongoose");
var fourni = new mongoose.Schema({
  name: String,
  email: String,
  addresse: String,
  codepostal: String,
  ville: String,
  pays: String,
  Telportable: Number,
  fixe: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  pme: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Pme",
  },
});

module.exports = mongoose.model("fourni", fourni);
