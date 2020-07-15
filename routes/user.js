const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/userSchema");
const Admin = require("../models/adminSchema");
const Token = require("../models/tokenSchema");
const config = require("../config/config-mail.json");
const Setting = require("../models/globalsettingSchema");

const Pme = require("../models/pmeSchema");

const router = express.Router();

// api register user //
router.post("/:id/register", async (req, res) => {
  const user = new User(req.body);

  const pme = await Pme.findById(req.params.id);

  if (!pme)
    return res.status(400).send({
      message: "pme does not exist",
    });

  const unique = await User.findOne({
    email: req.body.email,
  }); // verifie si email est unique //
  if (unique)
    return res.status(400).send({
      message: "email already in use",
    });

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  await User.findByIdAndUpdate(user._id, { $push: { pme: pme._id } });

  res.send(user);
  const token_access = jwt.sign(
    {
      data: {
        _id: user._id,
        email: user.email,
      },
    },
    "secret"
  );
  let token = new Token({
    _userId: user.id,
    token: token_access,
  });

  // Save the verification token
  token.save(function (err) {
    if (err) {
      return res.status(500).send({ msg: err.message });
    }
  });
  let setting = await Setting.findOne();
  if (setting.isActivSuperAdmin === true) {
    //Creating a Nodemailer Transport instance
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      tls: {
        rejectUnauthorized: false,
      },
      port: 465,
      secure: false,
      auth: {
        user: config.mail,
        pass: config.password,
      },
    });
    const mailOptions = {
      from: admin.email,
      to: config.mail,
      subject: "New User account",
      text:
        "Hello,\n\n" +
        "A new account was created by user :" +
        user.name +
        ".\n",
    };
    transporter.sendMail(mailOptions, function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      res
        .status(200)
        .send("A verification email has been sent to " + config.mail + ".");
    });
  } else console.log("email notif is desactivated by super admin");
});

//******************************** */ get allUsers api******************************* //
router.get(
  "/",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const superAdmin = await Admin.findOne({
      _id: req.user.admin._id,
      role: "superAdmin",
    });
    if (!superAdmin) return res.status(401).send({ message: "Unauthorized" });
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const usersQuery = User.find({}, { password: 0 });

    if (pageSize && currentPage) {
      usersQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    const users = await usersQuery;
    const usersCount = await User.countDocuments();
    res.send({ users: users, count: usersCount });
  }
);
router.get(
  "/pme/:idPme",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);
    if (!admin) return res.status(401).send({ message: "Unauthorized" });
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const usersQuery = User.find({ pme: req.params.idPme }, { password: 0 });

    if (pageSize && currentPage) {
      usersQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    const users = await usersQuery;
    const usersCount = await User.countDocuments({ pme: req.params.idPme });
    res.send({ users: users, count: usersCount });
  }
);

router.get(
  "/:id",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    User.findById(req.params.id, (err, resultat) => {
      if (err) {
        res.send(err);
      } else {
        res.send(resultat);
      }
    });
  }
);
router.put(
  "/putuser/:id",
  passport.authenticate("bearer", { session: false }),
  function (req, res) {
    User.findByIdAndUpdate(req.params.id, req.body, function (err, resultat) {
      if (err) res.send(err);
      else {
        res.send(resultat);
      }
    });
  }
);
// api delete user //

router.delete(
  "delete/:id",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    const admin = await Admin.findById(req.user.admin._id);
    if (!admin) return res.status(401).send({ message: "Unauthorized" });
    await User.findByIdAndDelete(req.params.id);
    res.send({ message: "User Deleted" });
  }
);

module.exports = router;
