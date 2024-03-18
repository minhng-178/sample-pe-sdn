import { CatchAsyncErrors } from "../middleware/catch-async-error.js";
import memberModal from "../models/member.model.js";
import generateToken from "../utils/create-token.js";
import ErrorHandler from "../utils/error-handler.js";
import passport from "passport";
/* Register - POST */
export const register = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const existedUser = await memberModal.findOne({ username });

    if (existedUser) {
      return next(new ErrorHandler("UserName đã tồn tại", 400));
    }

    const newUser = await memberModal.create({ username, password });

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

// TO DO LATER
export const registerLayout = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { username, password } = req.body;
    // this.password = await bcrypt.hash(this.password, 10);
    const existedUser = await memberModal.findOne({ username });

    if (existedUser) {
      req.flash("error", "Email exsited");
      return res.redirect("/login");
    }

    const newUser = await memberModal.create({ username, password });

    // Redirect to login after successful registration
    req.flash("success", "Register successfull! Please Login!");
    return res.redirect("/login");
  } catch (error) {
    // Display error messages if any
    req.flash("error", error.message);
    return res.redirect("/register");
  }
});

/* LOGIN - POST */
export const login = CatchAsyncErrors(async (req, res, next) => {
  try {
    passport.authenticate(
      "local",
      { session: false },
      async (err, user, info) => {
        if (err) {
          req.flash("error", "An error occurred");
          return res.redirect("/login");
        }
        if (!user) {
          req.flash("error", info.message);
          return res.redirect("/login");
        }

        req.login(user, { session: false }, async (err) => {
          if (err) {
            req.flash("error", "Login failed");
            return res.redirect("/login");
          }

          const { id, token } = req.user;
          res.cookie("jwt", token, {
            expires: new Date(Date.now() + 3600000),
            httpOnly: true,
          });
          req.flash("success_msg", "You are logged in.");
          res.redirect("/dashboard");
        });
      }
    )(req, res, next);
  } catch (error) {
    req.flash("error", error.message);
    return res.redirect("/login");
  }
});

/* LOGOUT - GET */
export const logout = CatchAsyncErrors(async (req, res, next) => {
  res.clearCookie("jwt", {
    httpOnly: true,
  });

  req.flash("success_msg", "You are logged out");
  res.redirect("/login");
});

/* getAll - GET */
export const getAll = CatchAsyncErrors(async (req, res, next) => {
  try {
    const users = await memberModal.find();

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
