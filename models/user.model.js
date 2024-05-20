const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: Schema.Types.String,
    required: true,
  },
  email: {
    type: Schema.Types.String,
    required: true,
  },
  password: {
    type: Schema.Types.String,
    required: true,
  },
  createdOn: {
    type: Schema.Types.Date,
    default: Date.now,
  },
});

const User = model("User", userSchema);

module.exports = User;
