const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  username: {
    type: Schema.Types.String,
    required: true,
  },
  googleId: {
    type: Schema.Types.String,
    required: true,
  },
});

const User = model("User", userSchema);

module.exports = User;
