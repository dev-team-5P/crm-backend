const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminSchema");
const ResetToken = require("../models/resetTokenSchema");

module.exports = {
  async ResetPassword(req, res) {
    if (!req.body.email) {
      return res.status(500).json({ message: "Email is required" });
    }
    const user = await Admin.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(409).json({ message: "Email does not exist" });
    }
    const resetToken = new ResetToken({
      _adminId: user._id,
      resetToken: crypto.randomBytes(16).toString("hex"),
      code: Math.floor(Math.random() * 1000),
    });
    resetToken.save(function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      ResetToken.find({
        _adminId: user._id,
        resetToken: { $ne: resetToken.resetToken },
      })
        .remove()
        .exec();
      res.status(200).send({
        message: "Reset Password successfully.",
        token: resetToken.resetToken,
      });
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "crmproject.2020@gmail.com",
          pass: "123456789crm",
        },
        tls: {
          rejectUnauthorized: false,
        },
      });
      const mailOptions = {
        to: user.email,
        from: "crmproject.2020@gmail.com",
        subject: "Node.js Password Reset",
        text:
          "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
          "Please copy this code" +
          resetToken.code +
          "\n\n" +
          "If you did not request this, please ignore this email and your password will remain unchanged.\n",
      };
      transporter.sendMail(mailOptions, (err, info) => {});
    });
  },
  async ValidPasswordToken(req, res) {
    if (!req.body.code) {
      return res.status(500).json({ message: "Token is required" });
    }
    const user = await ResetToken.findOne({
      code: req.body.code,
      resetToken: req.query.token,
    });
    if (!user) {
      return res.status(409).json({ message: "Invalid URL" });
    }
    Admin.findOne({ _id: user._adminId })
      .then(() => {
        res.status(200).json({ message: "Token verified successfully." });
      })
      .catch((err) => {
        return res.status(500).send({ msg: err.message });
      });
  },
  async NewPassword(req, res) {
    ResetToken.findOne({ resetToken: req.query.token }, function (
      err,
      userToken,
      next
    ) {
      if (!userToken) {
        return res.status(409).json({ message: "Token has expired" });
      }

      Admin.findOne(
        {
          _id: userToken._adminId,
        },
        function (err, userEmail, next) {
          if (!userEmail) {
            return res.status(409).json({ message: "User does not exist" });
          }
          return bcrypt.hash(req.body.newPassword, 10, (err, hash) => {
            if (err) {
              return res
                .status(400)
                .json({ message: "Error hashing password" });
            }
            userEmail.password = hash;
            userEmail.save(function (err) {
              if (err) {
                return res
                  .status(400)
                  .json({ message: "Password can not reset." });
              } else {
                userToken.remove();
                return res
                  .status(201)
                  .json({ message: "Password reset successfully" });
              }
            });
          });
        }
      );
    });
  },
};
