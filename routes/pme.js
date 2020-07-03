const express = require("express");
const passport = require("passport");
const Pme = require("../models/pmeSchema");
const Admin = require("../models/adminSchema");

const router = express.Router();

// api getAll pme  //
router.get(
  "/",
  // passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    // const admin = await Admin.findById(req.user.admin._id);

    // if (admin.role !== "superAdmin")
    //   return res.send({ message: "Unauthorized" });

    const pme = await Pme.find();

    res.send(pme);
  }
);

// api get pme par id  //
router.get(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);

    if (admin.role !== "superAdmin")
      return res.send({ message: "Unauthorized" });

    const pme = await Pme.findById(req.params.id, { password: 0 });
    res.send(pme);
  }
);

//post pme //
router.post(
  "/create-pme",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);

    if (!admin) return res.send({ message: "Unauthorized" });

    const pme = new Pme(req.body);
    await pme.save();

    await Admin.findByIdAndUpdate(admin._id, { $push: { pme: pme._id } });
    res.send(pme);
  }
);

// api update pme //
router.put(
  "/edit/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);

    if (!admin) return res.send({ message: "Unauthorized" }); // only admin and superAdmin can modify //

    const verify = admin.pme.find((p) => p == req.params.id);

    if (verify || admin.role === "superAdmin") {
      const pme = await Pme.findByIdAndUpdate(req.params.id, req.body);
      res.send(pme);
    } else res.send({ message: "Unauthorized access" });
  }
);

// api delete pme //
router.delete(
  "/delete/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);

    if (admin.role !== "superAdmin")
      return res.send({ message: "Unauthorized" });

    await Pme.findByIdAndDelete(req.params.id);
    res.send({ message: "pme deleted" });
  }
);

module.exports = router;
