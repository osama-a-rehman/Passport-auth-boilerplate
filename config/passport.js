const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Own Imports
// Models
const User = require("../models/User");

module.exports = passport => {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      // Match user email

      console.log("Local Strategy");
      console.log(email);
      console.log(password);

      User.findOne({ email })
        .then(user => {
          if (!user) {
            // User doesn't exist
            return done(null, false, { message: "Email is not registered" });
          }

          // User exists, so match password
          bcrypt
            .compare(password, user.password)
            .then(isMatch => {
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Incorrect Password" });
              }
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
