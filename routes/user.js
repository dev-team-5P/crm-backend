const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/userSchema");

const router = express.Router();

// api register user //
router.post("/register", async (req, res) => {
  const user = new User(req.body);

  const unique = await User.findOne({ email: req.body.email }); // verifie si email est unique //
  if (unique) return res.status(400).send({ message: "email already in use" });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  res.send(user);
});

// api login user //
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.send({ message: "wrong email or password" }); // verification validité email //

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.send({ message: "wrong email or password" }); // vrification validité password //

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
