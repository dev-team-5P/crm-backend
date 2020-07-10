// const express = require("express");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const nodemailer = require("nodemailer");
// const path = require('path');
// const ejs = require('ejs');
// const User = require("../models/userSchema");
// const Token = require("../models/tokenSchema");
// const config = require("../config/config-mail.json");
// const router = express.Router();

// // ******************************api ejs *******************************************//
// // router.get('/', function (req, res) {
// //   res.render('../views/mailconfirmation.ejs')
// // });

// // ******************************api register user *******************************************//
// router.post("/register", async (req, res) => {
//   const user = new User(req.body);
//   // const unique = await User.findOne({ email: req.body.email }); // verifie si email est unique //
//   // if (unique) return res.status(400).send({ message: "email already in use" });

//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(user.password, salt);
//   await user.save();
//   const token_access = jwt.sign(
//     {
//       data: {
//         _id: user._id,
//         email: user.email,
//       },
//     },
//     "secret"
//   );
//   let token = new Token({
//     _userId: user.id,
//     token: token_access
//   });

//   // Save the verification token
//   token.save(function (err) {
//     if (err) {
//       return res.status(500).send({ msg: err.message });
//     };
//   });
// });

// //Creating a Nodemailer Transport instance
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   tls: {
//     rejectUnauthorized: false
//   },
//   port: 465,
//   secure: false,
//   auth: {
//     user: config.mail,
//     pass: config.password
//   }
// });
// // Verifying the Nodemailer Transport instance
// transporter.verify((error, success) => {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Server is ready to take messages');
//   }
// });
// // ejs template
// router.post('/send', (req, res, next) => {
//   ejs.renderFile(__dirname, "views/mailconfirmation", { username: "crmUser" }, function (err, data) {
//     if (err) {
//       console.log(err);
//     }
//     else {
//       const mailOptions = {
//         from: config.mail,
//         to: user.email,
//         subject: 'Account Verification Token',
//         html: data
//       };
//     }

//     //console.log("html data ======================>", mainOptions.html);

//     // const emailTemplate = path.join(__dirname, "views/sendmail.html")

//     // const mailOptions = {
//     //   from: config.mail,
//     //   to: user.email,
//     //   subject: 'Account Verification Token',
//     // text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' 
//     // +
//     //  `${config.frontend}` 
//     // +
//     //  token.token + '.\n' };
//     transporter.sendMail(mailOptions, function (err) {
//       if (err) { return res.status(500).send({ msg: err.message }); }
//       res.status(200).send('A verification email has been sent to ' + user.email + '.');
//     });
//   });
// });
// //******************************** */ Token Confirmation api******************************* //

// router.post('/confirmation', async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) return res.send({ message: "wrong email or password" }); // verification validité email //

//   const validPass = await bcrypt.compare(req.body.password, user.password);
//   if (!validPass) return res.send({ message: "wrong email or password" }); // vrification validité password //
//   // Find a matching token
//   Token.findOne({ token: req.body.token }, function (err, token) {
//     if (!token) return res.status(400).send({ type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
//     // If we found a token, find a matching user
//     User.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
//       if (!user) return res.status(400).send({ msg: 'We were unable to find a user for this token.' });
//       if (user.isVerified) return res.status(400).send({ type: 'already-verified', msg: 'This user has already been verified.' });
//       // Verify and save the user
//       user.isVerified = true;
//       console.log(user.isVerified);
//       user.save(function (err) {
//         if (err) { return res.status(500).send({ msg: err.message }); }
//         res.status(200).send("The account has been verified. Please log in.");
//       });
//       console.log(user);
//       // send back an email to admin 
//       const transporter = nodemailer.createTransport({
//         service: 'Gmail',
//         tls: {
//           rejectUnauthorized: false
//         },
//         port: 465,
//         secure: false,
//         auth: {
//           user: config.mail,
//           pass: config.password
//         }
//       });
//       const mailOptions = {
//         from: user.email, to: config.mail, subject: 'New account',
//         text: 'Hello,\n\n' + 'There is a new account created by:\n' + 'Pme name: ' + user.name + '.\n'
//           + 'Pme Email: ' + user.email + '.'
//       };
//       transporter.sendMail(mailOptions, function (err) {
//         if (err) { return res.status(500).send({ msg: err.message }); }
//         res.status(200).send('A vnotification email has been sent to ' + user.email + '.');
//       });
//     });
//   });
// });

// //********************** */ Resending Tokens:  crée un bouton ppur réinitialiser le token de vérification******************************* //
// router.post('/resend', async (req, res) => {
//   // const user = await User.findOne({ email: req.body.email });
//   // if (!user) return res.send({ message: "wrong email or password" }); // verification validité email //

//   // // Create a verification token, save it, and send email
//   // const token = new Token({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

//   // // Save the token
//   // token.save(function (err) {
//   //   if (err) { return res.status(500).send({ msg: err.message }); }

//   //   // Send the email
//   //   const transporter = nodemailer.createTransport({
//   //     service: 'Gmail',
//   //     tls: {
//   //       rejectUnauthorized: false
//   //     },
//   //     port: 465,
//   //     secure: false,
//   //     auth: {
//   //       user: config.mail,
//   //       pass: config.password
//   //     }
//   //   });
//   //   const mailOptions = { from: config.mail, to: user.email, subject: 'Account Verification Token', text: 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n' };
//   //   transporter.sendMail(mailOptions, function (err) {
//   //     if (err) { return res.status(500).send({ msg: err.message }); }
//   //     res.status(200).send('A verification email has been sent to ' + user.email + '.');
//   //   });
//   // });
// });

// //*********************************** */ api login user *******************************************//
// router.post("/login", async (req, res) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) return res.send({ message: "wrong email or password" }); // verification validité email //

//   const validPass = await bcrypt.compare(req.body.password, user.password);
//   if (!validPass) return res.send({ message: "wrong email or password" }); // vrification validité password //

//   let token = jwt.sign(
//     {
//       data: {
//         _id: user._id,
//         email: user.email,
//         role: user.role,
//       },
//     },
//     "secret"
//   );
//   // Make sure the user has been verified
//   if (user.isVerified = false) return res.status(401).send({ type: 'not-verified', msg: 'Your account has not been verified.' });
//   // Login successful, write token, and send back user

//   res.send({ token: token });
// });

// //******************************** */ get allUsers api******************************* //
// router.get("/", async (req, res) => {
//   users = await User.find({}, { password: 0 });
// });

// module.exports = router;