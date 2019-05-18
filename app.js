const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

// Owm Imports
// Database Configuration
const db = require("./config/keys").mongoURI;

// Passport Configuration
require("./config/passport")(passport);

// Routes
const mainRoutes = require("./routes/index");
const userRoutes = require("./routes/users");

const PORT = process.env.PORT || 5000;

const app = express();

// Connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected"))
  .catch(error => console.log(error));

// Middleware to set EJS as View Engine
app.use(expressLayouts);
app.set("view engine", "ejs");

// Middleware to use Body Parser to parse requests
app.use(express.urlencoded({ extended: false }));

// Middleware to use express-session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// Middleware to use passport, Its important to put it after express-sessions middleware as it itself uses the sessions
app.use(passport.initialize());
app.use(passport.session());

// Middleware to use flash
app.use(flash());

// Middleware to setup Global Variables in order to show different colored flash messages
app.use((request, response, next) => {
  response.locals.success_msg = request.flash("success_msg");
  response.locals.error_msg = request.flash("error_msg");
  response.locals.error = request.flash("error");

  next();
});

// Set location for layouts
app.set("layout", "layouts/layout");

app.use("/", mainRoutes);
app.use("/users", userRoutes);

app.listen(PORT, console.log(`Server started on port ${PORT}`));
