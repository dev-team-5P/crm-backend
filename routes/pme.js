const express = require("express");
const passport = require("passport");
const Pme = require("../models/pmeSchema");
const Admin = require("../models/adminSchema");

const router = express.Router();

// api getAll pme  //
router.get(
  "/",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const superAdmin = await Admin.findOne({
      _id: req.user.admin._id,
      role: "superAdmin",
    });

    if (!superAdmin) return res.send({ message: "Unauthorized" });

    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const pmeQuery = Pme.find();

    if (pageSize && currentPage) {
      pmeQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    const pme = await pmeQuery;
    const pmeCount = await Pme.countDocuments();
    res.send({ pme: pme, count: pmeCount });
  }
);

// get all pme by admin id //
router.get(
  "/list-pme/:adminId",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const pmeQuery = Pme.find({ admin: req.params.adminId });

    if (pageSize && currentPage) {
      pmeQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    const pme = await pmeQuery;
    const pmeCount = await Pme.countDocuments({ admin: req.params.adminId });
    res.send({ pme: pme, count: pmeCount });
  }
);

// api get pme par id  //
router.get(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);
    const myPme = admin.pme.find((p) => p == req.params.id);

    if (admin.role == "superAdmin" || myPme) {
      const pme = await Pme.findById(req.params.id);
      res.send(pme);
    } else return res.send({ message: "Unauthorized" });
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
    if (!req.body) return res.status(400).send({ message: " false entry" });

    await pme.save();
    await Pme.findByIdAndUpdate(pme._id, { admin: admin._id });

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
      return res.status(401).send({ message: "Unauthorized" });

    await Pme.findByIdAndDelete(req.params.id);
    res.send({ message: "pme deleted" });
  }
);

module.exports = router;
