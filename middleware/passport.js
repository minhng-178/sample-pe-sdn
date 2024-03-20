import dotenv from "dotenv";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy } from "passport-jwt";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jwtOptions, sanitizeUser } from "./auth.js";
import accountModal from "../models/account.model.js";
dotenv.config();

passport.use(
  "local",
  new LocalStrategy({ usernameField: "username" }, async function (
    username,
    password,
    done
  ) {
    try {
      const user = await accountModal.findOne({ us: username }).select("+pw");

      if (!user) {
        return done(null, false, { message: "Invalid username or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.pw);

      if (!isPasswordValid) {
        return done(null, false, { message: "Invalid username or password" });
      }

      const token = jwt.sign(sanitizeUser(user), process.env.JWT_SECRET);

      console.log(token, "token");

      return done(null, {
        id: user.id,
        token,
      });
    } catch (error) {
      done(error, false);
    }
  })
);

// Jwt strategy
passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, async function (jwt_payload, done) {
    try {
      const user = await accountModal.findById(jwt_payload.id);

      if (!user) {
        return done(null, false);
      }

      return done(null, sanitizeUser(user));
    } catch (error) {
      done(error, false);
    }
  })
);

// Serialize user
passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
    });
  });
});

// Deserialize user
passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

export default passport;
