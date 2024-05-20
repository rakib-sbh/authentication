const mongoose = require("mongoose");

const connectDB = async (URL) => {
  await mongoose.connect(URL);
  console.log("Database connected successfully");
};

module.exports = connectDB;
