const mongoose = require("mongoose");

const pmeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  description: { type: String, required: true },
  logo: String,
  telephone: Number,
  fax: Number,
  adress: String,
  tax: { type: Number, default: 18 },
  siege: String,
  activity: String,
});

module.exports = mongoose.model("Pme", pmeSchema);
