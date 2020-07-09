const nodemailer = require("nodemailer");
const Stock = require("../models/stockSchema");
const User = require("../models/userSchema");
const NotifyMail = require("../models/notifSchema");

module.exports = {
  async notifyRupture(req, res) {
    const users = await User.find({ role: "mag" });
    const stock = await Stock.find();

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

    users.forEach((user) => {
      stock.forEach(async (product) => {
        const mailOptions = {
          to: user.email,
          from: "crmproject.2020@gmail.com",
          subject: "Node.js Stock Rupture Notification",
          text: `You are receiving this because ${product.name} has reached the minimal value of ${product.min}`,
        };
        let notif = await NotifyMail.findOne({ produit: product._id });
        if (
          product.min == product.stock &&
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
        //   res.send({
        //     message: "check your stock",
        //     stock: product.stock,
        //     min: product.min,
        //   });
      });
    });
  },
};
