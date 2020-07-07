const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const Admin = require("./models/adminSchema");
const User = require("./models/userSchema");
const jwt = require("jsonwebtoken");

// passport.use(
//   new BearerStrategy((token, done) => {
//     jwt.verify(token, "secret", (err, decoded) => {
//       Admin.findOne({ _id: decoded.data._id }, (err, admin) => {
//         if (!admin) {
//           return done(null, false);
//         }
//         if (err) {
//           return done(null, false);
//         }
//         return done(null, { admin });
//       });
//     });
//   })
// );
passport.use(
  new BearerStrategy(async (token, done) => {
    const tokenData = await jwt.verify(token, "secret");
    const admin = await Admin.findOne({ _id: tokenData.data._id });
    const user = await User.findOne({ _id: tokenData.data._id });
    if (!admin) {
      done(null, false);
    } else return done(null, { admin });
    if (!user) {
      return done(null, false);
    } else return done(null, { user });
  })
);
