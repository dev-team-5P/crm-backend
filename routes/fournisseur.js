const express = require("express");
const passport = require("passport");
const fournisseur = require("../models/fournisseurSchema");
const Admin = require("../models/adminSchema");

const router = express.Router();

// api getAll fournisseur  //
router.get(
  "/fournisseur",
  // passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const fournisseur = await fournisseur.find();
    res.send(fournisseur);
  }
);

// get all fournisseur by admin id //
router.get(
  "/fournisseur/:adminId",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.params.adminId).populate("fournisseur");
    const fournisseur = admin.fournisseur;
    res.send(fournisseur);
  }
);

// api get fournisseur par id  //
router.get(
  "/fournisseur/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);
    const Fournisseur = admin.fournisseur.find((p) => p == req.params.id);
    console.log(Fournisseur);

    if (admin.role == "superAdmin" || Fournisseur) {
      const fournisseur = await fournisseur.findById(req.params.id);
      res.send(fournisseur);
    } else return res.send({ message: "Unauthorized" });
  }
);

//post fournisseur //
router.post(
  "/create-fournisseur",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);

    if (!admin) return res.send({ message: "Unauthorized" });

    const fournisseur = new fournisseur(req.body);

    await fournisseur.save();
    await fournisseur.findByIdAndUpdate(fournisseur._id);

    await Admin.findByIdAndUpdate(admin._id, { $push: { fournisseur: fournisseur._id } });
    res.send(fournisseur);
  }
);

// api update fournisseur //
router.put(
  "/edit-fournisseur/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);

    if (!admin) return res.send({ message: "Unauthorized" }); // only admin and superAdmin can modify //

    const verify = admin.fournisseur.find((p) => p == req.params.id);

    if (verify || admin.role === "superAdmin") {
      const fournisseur = await fournisseur.findByIdAndUpdate(req.params.id, req.body);
      res.send(fournisseur);
    } else res.send({ message: "Unauthorized access" });
  }
);

// api delete fournisseur //
router.delete(
  "/delete-fournisseur/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);

    if (admin.role !== "superAdmin")
      return res.send({ message: "Unauthorized" });

    await fournisseur.findByIdAndDelete(req.params.id);
    res.send({ message: "fournisseur deleted" });
  }
);

module.exports = router;