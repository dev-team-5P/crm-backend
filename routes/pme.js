const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Pme = require("../models/pmeSchema");

const router = express.Router();

// register pme //
router.post("/register", async (req, res) => {
  const pme = new Pme(req.body);

  const unique = await Pme.findOne({ email: req.body.email }); // verifie si email est unique //
  if (unique) return res.status(400).send({ message: "email already in use" });

  const salt = await bcrypt.genSalt(10);
  pme.password = await bcrypt.hash(pme.password, salt);

  await pme.save();
  res.send(pme);
});

router.post("/login", async (req, res) => {
  const pme = await Pme.findOne({ email: req.body.email });
  if (!pme) return res.send({ message: "wrong email or password" });

  const validPass = await bcrypt.compare(req.body.password, pme.password);
  if (!validPass) return res.send({ message: "wrong email or password" });

  let token = jwt.sign(
    {
      data: {
        _id: pme._id,
        email: pme.email,
        status: pme.status,
      },
    },
    "secret"
  );

  res.send({ token: token });
});

module.exports = router;
