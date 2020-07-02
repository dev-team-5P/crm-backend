const passport = require("passport");
const BearerStrategy = require("passport-http-bearer").Strategy;
const Pme = require("./models/pmeSchema");
const jwt = require("jsonwebtoken");

passport.use(
  new BearerStrategy((token, done) => {
    jwt.verify(token, "secret", (err, decoded) => {
      Pme.findOne({ _id: decoded.data._id }, (err, pme) => {
        if (!pme) {
          return done(null, false);
        }
        if (err) {
          return done(null, false);
        }
        return done(null, { pme });
      });
    });
  })
);
