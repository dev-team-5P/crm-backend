const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Admin = require("../models/adminSchema");

const router = express.Router();

// api register admin //
router.post("/register", async (req, res) => {
  const admin = new Admin(req.body);

  const unique = await Admin.findOne({ email: req.body.email }); // verifie si email est unique //
  if (unique) return res.status(400).send({ message: "email already in use" });

  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);

  await admin.save();

  res.send(admin);
});

// api login admin //
router.post("/login", async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });
  if (!admin) return res.send({ message: "wrong email or password" }); // verification validité email //

  const validPass = await bcrypt.compare(req.body.password, admin.password);
  if (!validPass) return res.send({ message: "wrong email or password" }); // vrification validité password //

  let token = jwt.sign(
    {
      data: {
        _id: admin._id,
        email: admin.email,
        role: admin.role,
      },
    },
    "secret"
  );

  res.send({ token: token });
});

// get allAdmins api //
router.get(
  "/",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    admins = await Admin.find({}, { password: 0 });
  }
);

module.exports = router;
