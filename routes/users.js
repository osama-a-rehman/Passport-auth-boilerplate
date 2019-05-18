const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

// Own Imports
// Models
const User = require("../models/User");

// @route   GET users/register
// @desc    Renders Registration Page
// @access  Public
router.get("/register", (request, response) => {
  response.render("users/register");
});

// @route   GET users/login
// @desc    Renders Login Page
// @access  Public
router.get("/login", (request, response) => {
  response.render("users/login");
});

// @route   POST users/register
// @desc    Registers a user in the database
// @access  Public
router.post("/register", (request, response) => {
  console.log(request.body);

  const { name, email, password, password2 } = request.body;

  let errors = [];

  // Check Required Fields
  if (!name || !email || !password || !password2) {
    errors.push({ message: "Please fill in all fields" });
  }

  // Check Passwords match
  if (password !== password2) {
    errors.push({ message: "Passwords do not match" });
  }

  // Check Password Length
  if (password.length < 6) {
    errors.push({ message: "Passwords should be at least 6 characters long" });
  }

  if (errors.length > 0) {
    response.render("users/register", {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    // Validation Passed
    User.findOne({ email }).then(user => {
      if (user) {
        console.log("Email already exists");

        errors.push({ message: "Email is already register. Please Sign in" });

        response.render("users/register", {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });

        // Hash Password
        bcrypt
          .genSalt(10)
          .then(salt => {
            bcrypt
              .hash(newUser.password, salt)
              .then(hash => {
                newUser.password = hash;

                newUser
                  .save()
                  .then(user => {
                    console.log("User Created");
                    console.log(user);

                    request.flash(
                      "success_msg",
                      "You are now registered and can Sign in"
                    );

                    // In redirect, you specify the url you want to redirect to
                    response.redirect("/users/login");
                  })
                  .catch(error => console.log(error));
              })
              .catch(error => console.log(error));
          })
          .catch(error => console.log(error));
      }
    });
  }
});

// @route   POST users/login
// @desc    Sign in a user
// @access  Public
router.post("/login", (request, response, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })(request, response, next);
});

// @route   GET users/logout
// @desc    Logs out a user
// @access  Public
router.get("/logout", (request, response, next) => {
  request.logOut();
  request.flash("success_msg", "You're logged out");
  response.redirect("/users/login");
});

module.exports = router;
