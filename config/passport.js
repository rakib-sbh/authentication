const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("../models/user.model");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8080/auth/google/callback",
    }, // is the username field need to be modified
    async (accessToken, refreshToken, profile, cb) => {
      // console.log("profile", profile);
      try {
        const user = await User.findOne({ googleId: profile.id });

        // there is no user. so create a new user
        if (!user) {
          let newUser = new User({
            googleId: profile.id,
            username: profile.displayName,
          });

          await newUser.save();

          return cb(null, newUser);
        } else {
          return done(null, user);
        }
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

//! create session id
//! whenever we login it creates user id inside session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//! find session info using session id
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});
