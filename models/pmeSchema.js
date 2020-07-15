const mongoose = require("mongoose");

const pmeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: true },
    logo: String,
    telephone: Number,
    fax: Number,
    adress: String,
    tax: { type: Number, default: 18 },
    siege: String,
    activity: String,
    // fournisseur: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Fournisseur",
    //   },
    // ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pme", pmeSchema);
