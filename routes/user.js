const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/userSchema");
const Pme = require("../models/pmeSchema");

const router = express.Router();

// api register user //
router.post("/:domain/register", async (req, res) => {
  const user = new User(req.body);

  const domain = await Pme.findOne({ domain: req.params.domain });
  if (!domain)
    return res.status(400).send({ message: "Enter a correct http address" });

  const unique = await User.findOne({ email: req.body.email }); // verifie si email est unique //
  if (unique) return res.status(400).send({ message: "email already in use" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();
  await User.findByIdAndUpdate(user._id, { $push: { pme: domain._id } });

  res.send(user);
});

// api login user //
router.post("/:domain/login", async (req, res) => {
  const domain = await Pme.findOne({ domain: req.params.domain });

  if (!domain)
    return res.status(400).send({ message: "Enter a correct http address" });

  const user = await User.findOne({ email: req.body.email });

  if (domain._id.toString() != user.pme.toString())
    return res.status(401).send({ message: "not registered in this pme" });

  if (!user)
    return res.status(400).send({ message: "wrong email or password" }); // verification validité email //

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass)
    return res.status(400).send({ message: "wrong email or password" }); // vrification validité password //

  let token = jwt.sign(
    {
      data: {
        _id: user._id,
        email: user.email,
        role: user.role,
      },
    },
    "secret"
  );

  res.send({ token: token });
});

// get allUsers api //
router.get("/", async (req, res) => {
  users = await User.find({}, { password: 0 });
});

module.exports = router;