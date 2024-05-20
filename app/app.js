const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();

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
  const newUser = new User({
    name,
    email,
    password,
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
});

app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  const result = await User.findOne({ name, password });

  if (result) {
    res.status(200).json({
      message: "Login Successful",
      result,
    });
  } else {
    res.status(403).json({
      message: "Authentication failed",
    });
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
