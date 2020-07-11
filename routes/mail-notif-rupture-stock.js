const nodemailer = require("nodemailer");
const Stock = require("../models/stockSchema");
const User = require("../models/userSchema");
const NotifyMail = require("../models/notifSchema");

module.exports = {
  async notifyRupture(req, res) {
    const stock = await Stock.find().populate("user");

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

    stock.forEach(async (product) => {
      let user = product.user;
      if (user.email != null && user.email != undefined) {
        const mailOptions = {
          to: user.email,
          from: "crmproject.2020@gmail.com",
          subject: "Node.js Stock Rupture Notification",
          text: `You are receiving this because ${product.name} has reached the minimal value of ${product.min}`,
        };
        let notif = await NotifyMail.findOne({ produit: product._id });

        if (
          product.min >= product.stock &&
          notif.send == true &&
          product.notifRupture == true
        ) {
          return await transporter.sendMail(mailOptions, async (err, info) => {
            await NotifyMail.findOneAndUpdate(
              { produit: product._id },
              { send: false }
            );
          });
        }
      }
      //   res.send({
      //     message: "check your stock",
      //     stock: product.stock,
      //     min: product.min,
      //   });
    });
  },
};
