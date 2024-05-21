const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("../config/passport");
const bcrypt = require("bcrypt");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");

const User = require("../models/user.model");
const connectDB = require("../db/db");

const app = express();

//! Express middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(require("body-parser").urlencoded({ extended: true }));
app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    //   cookie: { secure: true }
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);
//! to use passport
app.use(passport.initialize());
app.use(passport.session());

//* Database connection
connectDB(process.env.MONGO_URI);

//* ROUTES

const checkLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/profile");
  } else {
    next();
  }
};

app.get("/login", checkLoggedIn, (req, res) => {
  res.render("login");
});

//! LOGIN - POST - Using Passport
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/profile",
  })
);

//! authenticate using google
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/profile",
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
};

app.get("/profile", checkAuthenticated, (req, res) => {
  res.render("profile", { username: req.user.username });
});

app.get("/logout", (req, res, next) => {
  try {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.use((req, res, next) => {
  res.status(404).render("error");
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Server error occurred",
  });
});

module.exports = app;
