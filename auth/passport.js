const passport = require('passport');
const User = require('../models/userSchema');
const LocalStrategy = require("passport-local");
const bcrypt= require('bcrypt');

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async function (email, password, done) {
      console.log("Here", email, password);
      try {
        let user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false);
        }
        bcrypt.compare(password, user.password).then(function (result) {
          if (result == false) return done(null, false);
          return done(null, user );
        });
      } catch (err) {
        if (err) {
          return done(err);
        }
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  console.log("y chl rha hai kya?");
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  console.log("y chl rha hai kya?");
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, false);
    });
});

module.exports = passport;