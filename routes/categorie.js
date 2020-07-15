const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Pme = require("../models/pmeSchema");
const User = require("../models/userSchema");
const Admin = require ("../models/adminSchema");
const categorie = require("../models/categorieSchema");

const router = express.Router();
/*******************add categorie produit ************ */
router.post(
  "/add/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const pme = await Pme.findById(req.params.id);
    const user = await User.findById(req.user.user);

    if (!pme) return res.status(400).send({ message: "pme does not exist" });

    if (!user) return res.status(400).send({ message: "Unauthorized" });
    const newcategorie = req.body;
    newcategorie.pme = req.params.id;

    const Categorie = new categorie(newcategorie);

    await Categorie.save();

    res.send(Categorie);
  }
);
/***********get All Categories ************* */
router.get(
  "/get/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const pme = await Pme.findById(req.params.id);
    const user = await User.findById(req.user.user);
    if (!pme) return res.status(400).send({ message: "pme does not exist" });

    if (!user) return res.status(400).send({ message: "Unauthorized" });

    const Categorie = await categorie.find({pme: req.params.id})

    res.send(Categorie);
  }
);
/*************get categorie by id ************ */
router.get(
  "/:id/get/:idcat",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const pme = await Pme.findById(req.params.id);
    const user = await User.findById(req.user.user);
    if (!pme) return res.status(400).send({ message: "pme does not exist" });

    if (!user) return res.status(400).send({ message: "Unauthorized" });

    const Categorie = await categorie.findById(req.params.idcat);

    res.send(Categorie);
  }
);
/*****************Update categorie By Id ***********/
router.put(
  "/:id/edit/:idcat",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const pme = await Pme.findById(req.params.id);
    const user = await User.findById(req.user.user);
    const admin = await Admin.findById(req.user.admin);

    if (!pme) return res.status(400).send({ message: "pme does not exist" });

    if (user || admin) {

      const Categorie = await categorie.findByIdAndUpdate(req.params.idcat, req.body);
      res.send(Categorie);
    } else return res.status(400).send({ message: "Unauthorized" });
  });
/***************delete categorie ***************** */
router.delete(
  "/:id/delete/:idcat",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const pme = await Pme.findById(req.params.id);
    const user = await User.findById(req.user.user);
    if (!pme) return res.status(400).send({ message: "pme does not exist" });

    if (!user) return res.status(400).send({ message: "Unauthorized" });

    await categorie.findByIdAndDelete(req.params.idcat);

    res.send({ message: "categorie deleted" });
  }
);


module.exports = router;
