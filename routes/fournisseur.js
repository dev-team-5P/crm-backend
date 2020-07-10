const express = require("express");
const passport = require("passport");
const fournisseur = require("../models/fournisseurSchema");
const Pme = require("../models/pmeSchema");
const router = express.Router();

// api getAll fournisseur  //
router.get(
    "/getall",
    // passport.authenticate("bearer", { session: false }),
    async (req, res) => {
        const Fournisseur = await fournisseur.find();
        res.send(Fournisseur);
        console.log(Fournisseur);
    }
);

// get all fournisseur by pme id //
router.get(
    "/fournisseur/:pmeId",
    // passport.authenticate("bearer", { session: false }),
    async (req, res) => {
        const pme = await Pme.findById(req.params.pmeId).populate("fournisseur");
        const fournisseur = pme.fournisseur;
        res.send(fournisseur);
    }
);

// api get fournisseur par id  //
router.get(
    "/four/:id",
    // passport.authenticate("bearer", { session: false }),
    async (req, res) => {
        const four = await fournisseur.findById(req.params.id);
        res.send(four);
    }
);

//post fournisseur //
router.post("/create",
    //   passport.authenticate("bearer", { session: false }),
    async (req, res) => {
        let Fournisseur = new fournisseur(req.body);
        await Fournisseur.save();
        await Pme.findByIdAndUpdate(Pme._id, { $push: { fournisseur: fournisseur._id } });
        res.send(Fournisseur);
        console.log(Fournisseur);
    }
);

// api update fournisseur //
router.put(
    "/edit-fournisseur/:id",
    // passport.authenticate("bearer", { session: false }),
    async (req, res) => {
        const Fournisseur = await fournisseur.findByIdAndUpdate(req.params.id, req.body);
        res.send(Fournisseur)
    }
);

// api delete fournisseur //
router.delete(
    "/delete-fournisseur/:id",
    // passport.authenticate("bearer", { session: false }),
    async (req, res) => {
        await fournisseur.findByIdAndDelete(req.params.id);
        res.send({ message: "fournisseur deleted" });
    }
);

module.exports = router;