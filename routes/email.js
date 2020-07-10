// const express = require("express");
// const nodemailer = require("nodemailer");
// const mailuser = require('./user');
// // const fs = require("fs");
// // const ejs = require("ejs");

// router = express.Router();

// const transporter = nodemailer.createTransport({
//     service: 'Gmail',
//     tls: {
//         rejectUnauthorized: false
//     },
//     port: 465,
//     secure: false,
//     auth: {
//         user: 'mooti.ahmed147@gmail.com',
//         pass: '*********'
//     }
// });

// router.post("/new-pme", function (req, res) {
//     // const data = await ejs.renderFile(__dirname + "/test.ejs", { name: 'Stranger' });
//     const mail = mailuser.mail;
//     const mailOptions = {
//         from: mail,
//         to: '"mooti"mooti.ahmed147@gmail.com',
//         subject: 'Hello, world!',
//         html: '<p>ejs nom pme + description</p>',
//         // + data
//         createTextFromHtml: true
//     };
//     console.log("html data ======================>", mailOptions.html);
//     transporter.sendMail(mailOptions, (err, info) => {
//         if (err) {
//             console.log(err);
//             // resizeBy.send(err);
//         } else {
//             console.log('Message sent: ' + info.response);
//             res.send(info);
//             res.send({
//                 message: 'mail send success!'
//             });
//         }
//     });
// });

// module.exports = router;
