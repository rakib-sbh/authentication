const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const connectDB = require("../db/db");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Database connection
connectDB(process.env.MONGO_URI);

//* ROUTES

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashPassword,
    });
    const result = await User.findOne({ email });
    if (result) {
      res.status(201).json({
        message: "User already registered.",
      });
    } else {
      await newUser.save();
      res.json({
        message: "User already registered",
        newUser,
      });
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        res.status(200).json({
          message: "Login Successful",
          user,
        });
      } else {
        res.status(403).json({
          message: "Authentication failed",
        });
      }
    } else {
      res.status(403).json({
        message: "Authentication failed",
      });
    }
  } catch (error) {
    throw Error(error.message);
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
});

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "../views/error.html"));
});

app.use((err, req, res, next) => {
  res.status(500).json({
    message: "Server error occurred",
  });
});

module.exports = app;
