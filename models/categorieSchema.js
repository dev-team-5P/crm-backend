const mongoose = require("mongoose");
CategorieSchema = new mongoose.Schema({
    name: { type: String, required: true },
    pme: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pme",
        },
    ],
  },{ timestamps: true });
  
  module.exports = mongoose.model("Categorie", CategorieSchema);