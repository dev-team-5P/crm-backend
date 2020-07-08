const mongoose = require("mongoose");

const fournisseurSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    logo: String,
    telephone: Number,
    fax: Number,
    adress: String,
    activity: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fournisseur", fournisseurSchema);