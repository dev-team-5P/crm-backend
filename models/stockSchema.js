const mongoose = require("mongoose");

const stockSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imagePath: String,
    ref: String,
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    prix: Number,
    notifRupture: { type: Boolean, default: true },
    min: { type: Number, required: true },
    tax: Number,
    categorie: { type: String, required: true },
    pme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pme",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stock", stockSchema);
