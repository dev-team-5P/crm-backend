const nodemailer = require("nodemailer");
const Stock = require("../models/stockSchema");
const User = require("../models/userSchema");
const NotifyMail = require("../models/notifSchema");

module.exports = {
  async notifyRupture(req, res) {
    const product = await Stock.findById(req.params.prodId);
    const user = await User.findById(req.user.user);
    const notif = await NotifyMail.findOne({ produit: product._id });

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
      subject: "Node.js Stock Rupture Notification",
      text: `You are receiving this because ${product.name} has reached the minimal value of ${product.min}`,
    };

    if (product.min == product.stock && notif.send == true) {
      transporter.sendMail(mailOptions, (err, info) => {});
      await NotifyMail.findOneAndUpdate(
        { produit: product._id },
        { send: false }
      );
    }
    res.send({
      message: "check your stock",
      stock: product.stock,
      min: product.min,
    });
  },
};
