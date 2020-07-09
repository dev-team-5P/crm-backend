var express = require('express');
var fourni = require("./../models/fourniSchema");
const User = require("../models/userSchema");
var router = express.Router();
var passport = require('passport');

// api add fourniseur //
router.post("/:id/fourni", async (req, res) => {
    const fourn = new fourni(req.body);
    const user = await User.findById(req.params.id);
    await fourn.save();
    await fourni.findByIdAndUpdate(fourn._id, { $push: { user: user._id } });
  
    res.send(user);
  });

  router.get(
    "/list-fourn/:userId",
 
    async (req, res) => {
      const users = await fourni.findById(req.params.userId).populate("user");
      const user = users.user;
      res.send(user);
    }
  );
// router.put("/editfourni/:id",function (req,res) {
//     fourni.findByIdAndUpdate(req.params.id,req.body,(err,resultat)=>{
//         if(err) res.send(err);
//         res.send(resultat);
//     })
// })
// router.delete("/deletefourni/:id",function (req,res) {
//     fourni.findByIdAndRemove(req.params.id,(err,resultat)=>{
//         if(err) res.send(err);
//         res.send(resultat)
//     })
// })

module.exports = router;