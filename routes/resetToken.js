const crypto = require("crypto");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const Admin = require("../models/adminSchema");
const ResetToken = require("../models/resetTokenSchema");
const {
  getCollection,
  getCollectinById,
  updateCollection,
} = require("./collection-user");

module.exports = {
  async ResetPassword(req, res) {
    if (!req.body.email) {
      return res.status(500).json({ message: "Email is required" });
    }
    const userGet = await getCollection(req);
    const user = await userGet.findOne({
      email: req.body.email,
    });
    if (!user) {
      return res.status(409).json({ message: "Email does not exist" });
    }

    const resetToken = new ResetToken({
      resetToken: crypto.randomBytes(16).toString("hex"),
      code: Math.floor(Math.random() * 10000),
    });
    const userUpd = await updateCollection(req, resetToken);
    resetToken.save(function (err) {
      if (err) {
        return res.status(500).send({ msg: err.message });
      }
      userUpd.findOneAndUpdate(
        { email: req.body.email },
        { resetToken: resetToken._id }
      );
      // ResetToken.find({
      //   _id: resetToken._id,
      //   resetToken: { $ne: resetToken.resetToken },
      // })
      //   .remove()
      //   .exec();
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
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
          Please copy this code ${resetToken.code}
          If you did not request this, please ignore this email and your password will remain unchanged.`,
      };
      transporter.sendMail(mailOptions, (err, info) => {});
    });
  },
  async ValidPasswordToken(req, res) {
    if (!req.body.code) {
      return res.status(500).json({ message: "Token is required" });
    }
    const userToken = await ResetToken.findOne({
      code: req.body.code,
      resetToken: req.query.token,
    });
    // const userGet = await getCollection(req);
    if (!userToken) {
      return res.status(409).json({ message: "Invalid Code" });
    }
    const userIdGet = await getCollectinById(userToken);
    userIdGet
      .findOne({ resetToken: userToken._id })
      .then(() => {
        res.status(200).json({ message: "Token verified successfully." });
      })
      .catch((err) => {
        return res.status(500).send({ msg: err.message });
      });
  },
  async NewPassword(req, res) {
    ResetToken.findOne({ resetToken: req.query.token }, async function (
      err,
      userToken,
      next
    ) {
      const userIdGet = await getCollectinById(userToken);
      if (!userToken) {
        return res.status(409).json({ message: "Token has expired" });
      }
      userIdGet.findOne(
        {
          resetToken: userToken._id,
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
