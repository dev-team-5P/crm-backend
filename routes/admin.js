const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const Admin = require("../models/adminSchema");
const User = require("../models/userSchema");
const resetToken = require("./resetToken");

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
// /**
//  * This function comment is parsed by doctrine
//  * @route POST /admin/login
//  * @group Admin - Operations about admin
//  * @param {string} email.body.required -  email - eg: userdomain
//  * @param {string} password.body.required - user's password.
//  * @returns {object} 200 - JWT user Token
//  * @returns {Error}  default - wrong email or password
//  */

// api login admin //
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

    res.send({ token: token, message: "user" });
  } else return res.send({ message: "wrong email or password both" }); // verification validité email //
});

// /**
//  * This function comment is parsed by doctrine
//  * @route GET /admin
//  * @group foo - Operations about user
//  * @returns {object} 200 - An array of user info
//  * @security JWT
//  * @headers {string} Authorization - 	date in UTC when token expires
//  * @returns {Error}  default - Unexpected error
//  */
// get allAdmins api //
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
