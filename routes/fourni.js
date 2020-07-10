const express = require("express");
const Fourni = require("./../models/fourniSchema");
const User = require("../models/userSchema");
const router = express.Router();
const passport = require("passport");

// api add fourniseur //
router.post("/:id/fourni", async (req, res) => {
  const fourn = new Fourni(req.body);
  const user = await User.findById(req.params.id);
  await fourn.save();
  await Fourni.findByIdAndUpdate(fourn._id, {
    $push: { user: user._id, pme: user.pme },
  });

  res.send(fourn);
});

router.get(
  "/list-fourn/",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user.user._id);
    const fourni = await Fourni.find({ pme: user.pme });
    res.send(fourni);
  }
);

router.get(
  "/list-fourn/:idFourn",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user.user._id);
    const fourni = await Fourni.findOne({
      pme: user.pme,
      _id: req.params.idFourn,
    });
    res.send(fourni);
  }
);
router.put("/editfourni/:id", function (req, res) {
  Fourni.findByIdAndUpdate(req.params.id, req.body, (err, resultat) => {
    if (err) res.send(err);
    res.send(resultat);
  });
});
router.delete("/deletefourni/:id", function (req, res) {
  Fourni.findByIdAndRemove(req.params.id, (err, resultat) => {
    if (err) res.send(err);
    res.send(resultat);
  });
});

module.exports = router;
