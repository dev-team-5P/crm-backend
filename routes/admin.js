const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const resetToken = require("./resetToken");
const nodemailer = require("nodemailer");
const Token = require("../models/tokenSchema");
const config = require("../config/config-mail.json");
const Setting = require("../models/globalsettingSchema");

const router = express.Router();

// api register admin //
router.post("/register", async (req, res) => {
  const admin = new Admin(req.body);

  // const unique = await Admin.findOne({ email: req.body.email }); // verifie si email est unique //
  // if (unique) return res.status(400).send({ message: "email already in use" });

  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);

  await admin.save();

  res.send(admin);

  const token_access = jwt.sign(
    {
      data: {
        _id: admin._id,
        email: admin.email,
      },
    },
    "secret"
  );
  let token = new Token({
    _adminId: admin.id,
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
      service: 'Gmail',
      tls: {
        rejectUnauthorized: false
      },
      port: 465,
      secure: false,
      auth: {
        user: config.mail,
        pass: config.password
      },

    });
    const mailOptions = {
      from: admin.email,
      to: config.mail,
      subject: 'New Admin account',
      text: 'Hello,\n\n' + 'A new account was created by admin :'
        +
        admin.name + '.\n'
    };
    transporter.sendMail(mailOptions, function (err) {
      if (err) { return res.status(500).send({ msg: err.message }); }
      res.status(200).send('A verification email has been sent to ' + config.mail + '.');
    });
  } else console.log('email notif is desactivated by super admin');
});

//******************************** */  api login admin******************************* //

router.post("/login", async (req, res) => {
  const admin = await Admin.findOne({ email: req.body.email });
  const user = await User.findOne({ email: req.body.email });
  if (admin) {
    const validPassAdmin = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!validPassAdmin)
      return res.send({ message: "wrong email or password 'admin'" }); // vrification validité password //
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
    res.send({ token: token, message: "admin" });
  } else if (user) {
    const validPassUser = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassUser)
      return res.send({ message: "wrong email or password 'user'" }); // vrification validité password //
    let token = jwt.sign(
      {
        data: {
          _id: user._id,
          email: user.email,
          role: user.role,
          pme: user.pme,
        },
      },
      "secret"
    );

    // Make sure the user has been verified
    if ((user.isVerified = false))
      return res.status(401).send({
        type: "not-verified",
        msg: "Your account has not been verified.",
      });
    // Login successful, write token, and send back user

    res.send({ token: token, message: "user" });
  }
});

//****************************************** */ get allAdmins api***************************************** //
router.get(
  "/",
  passport.authenticate("bearer", { session: false }),
  async (req, res) => {
    admins = await Admin.find({}, { password: 0 });
    res.send(admins);
  }
);

router.post("/req-reset-password", resetToken.ResetPassword);
router.post("/valid-password-token", resetToken.ValidPasswordToken);
router.post("/new-password", resetToken.NewPassword);

module.exports = router;
