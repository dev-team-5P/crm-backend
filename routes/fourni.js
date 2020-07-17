const express = require("express");
const Fourni = require("./../models/fourniSchema");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
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
  "/list-fourn/:idPme",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const user = await User.findOne({
      _id: req.user.user,
      pme: req.params.idPme,
    });
    const admin = await Admin.findOne({ _id: req.user.admin });

    const pme = admin
      ? admin.pme.find((p) => p == req.params.idPme)
      : undefined;

    if (user || pme) {
      const pageSize = +req.query.pagesize;
      const currentPage = +req.query.page;
      const fournisQuery = Fourni.find({ pme: req.params.idPme });

      if (pageSize && currentPage) {
        fournisQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
      }
      const fournis = await fournisQuery;
      const fournisCount = await Fourni.countDocuments({
        pme: req.params.idPme,
      });

      res.send({ fournis: fournis, count: fournisCount });
    } else return res.status(401).send({ message: "Unauthorized" });
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
