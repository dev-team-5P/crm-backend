const nodemailer = require("nodemailer");
const Stock = require("../models/stockSchema");
const User = require("../models/userSchema");

module.exports = {
  async notifyRupture(req, res) {
    const product = await Stock.findById(req.params.id);
    const user = await User.findById(req.user.user);

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

    if (product.min == product.stock) {
      transporter.sendMail(mailOptions, (err, info) => {});
    }
    res.send({
      message: "check your stock",
      stock: product.stock,
      min: product.min,
    });
  },
};
