const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/userSchema");
const Pme = require("../models/pmeSchema");

const router = express.Router();

// api register user //
router.post("/:id/register", async (req, res) => {
  const user = new User(req.body);

  const pme = await Pme.findById(req.params.id);
  if (!pme) return res.status(400).send({ message: "pme does not exist" });

  const unique = await User.findOne({ email: req.body.email }); // verifie si email est unique //
  if (unique) return res.status(400).send({ message: "email already in use" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  await User.findByIdAndUpdate(user._id, { $push: { pme: pme._id } });

  res.send(user);
});

// edit user //
router.put("");

// get allUsers api //
router.get("/", async (req, res) => {
  users = await User.find({}, { password: 0 });
  res.send(users);
});

module.exports = router;
