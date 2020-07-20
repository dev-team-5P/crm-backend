const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const Pme = require("../models/pmeSchema");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
const categorie = require("../models/categorieSchema");

const router = express.Router();
/*******************add categorie produit ************ */
router.post(
  "/add/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user.user);

    userPme = user ? user.pme == req.params.id : undefined;
    if (userPme) {
      const newcategorie = req.body;
      newcategorie.pme = req.params.id;

      const Categorie = new categorie(newcategorie);

      await Categorie.save();

      res.send(Categorie);
    } else return res.status(400).send({ message: "Unauthorized" });
  }
);
/***********get All Categories ************* */
router.get(
  "/get/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user.user);
    const admin = await Admin.findById(req.user.admin);
    const pageSizecat = +req.query.pagesize;
    const currentPage = +req.query.page;
    const gategoriekQuery = Gategorie.find({ pme: req.params.id });

    adminPme = admin ? admin.pme.find((p) => p == req.params.id) : undefined;
    userPme = user ? user.pme == req.params.id : undefined;

    if (adminPme || userPme) {
      if (pageSizecat && currentPage) {
        gategoriekQuery.skip(pageSizecat * (currentPage - 1)).limit(pageSizecat);
      }
      const categ = await gategoriekQuery;
      const catgkCount = await Categ.countDocuments({ pme: req.params.idPme });

      res.send({ categ: categ, count: catgkCount });
      // const Categorie = await categorie.find({ pme: req.params.id });
      // res.send(Categorie);
    }
  }
);
/*************get categorie by id ************ */
router.get(
  "/getOne/:idcat",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin);
    const user = await User.findById(req.user.user);
    const category = await categorie.findById(req.params.idcat);

    adminPme = admin
      ? admin.pme.find((p) => p.toString() == category.pme.toString())
      : undefined;
    userPme = user ? user.pme.toString() == category.pme.toString() : undefined;

    if (adminPme || userPme) {
      const Categorie = await categorie.findById(req.params.idcat);

      res.send(Categorie);
    }
  }
);
/*****************Update categorie By Id ***********/
router.put(
  "/edit/:idcat",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user.user);
    const admin = await Admin.findById(req.user.admin);
    const category = await categorie.findById(req.params.idcat);

    adminPme = admin
      ? admin.pme.find((p) => p.toString() == category.pme.toString())
      : undefined;
    userPme = user ? user.pme.toString() == category.pme.toString() : undefined;

    if (adminPme || userPme) {
      const Categorie = await categorie.findByIdAndUpdate(
        req.params.idcat,
        req.body
      );
      res.send(Categorie);
    }
  }
);
/***************delete categorie ***************** */
router.delete(
  "/:id/delete/:idcat",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const user = await User.findById(req.user.user);
    const admin = await Admin.findById(req.user.admin);

    adminPme = admin ? admin.pme.find((p) => p == req.params.id) : undefined;
    userPme = user ? user.pme == req.params.id : undefined;

    if (adminPme || userPme) {
      await categorie.findByIdAndDelete(req.params.idcat);

      res.send({ message: "categorie deleted" });
    }
  }
);

module.exports = router;
