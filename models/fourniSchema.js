var mongoose = require("mongoose");
var fourni = new mongoose.Schema({
   
   nom:String,
   email:String,
   adresse:String,
   codepostal:String,
   article:String,
   ville:String,
   pays:String,
   Telportable :String,
   fixe:String,
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
})

module.exports = mongoose.model("fourni", fourni)   