const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const Admin = require("./models/adminSchema");
const jwt = require("jsonwebtoken");

passport.use(
  new BearerStrategy((token, done) => {
    jwt.verify(token, "secret", (err, decoded) => {
      Admin.findOne({ _id: decoded.data._id }, (err, admin) => {
        if (!admin) {
          return done(null, false);
        }
        if (err) {
          return done(null, false);
        }
        return done(null, { admin });
      });
    });
  })
);
