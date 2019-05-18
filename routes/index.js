const express = require("express");
const router = express.Router();

// Own Imports
const { ensureAuthenticated } = require("../config/auth");

// @route   GET /
// @desc    Renders Welcome Page
// @access  Public
router.get("/", (request, response) => {
  response.render("main/welcome");
});

// @route   GET /dashboard
// @desc    Renders Dashboard Page
// @access  Private
router.get("/dashboard", ensureAuthenticated, (request, response) => {
  response.render("main/dashboard", {
    // When we're logged in, we have access to the user via request object
    user: request.user
  });
});

module.exports = router;
