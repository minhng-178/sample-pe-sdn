import dotenv from "dotenv";
import passport from "passport";

dotenv.config();

export function isAuth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    // if (error || !user) {

    //   return next(new ErrorHandler("Unauthorized", 401))
    // }

    // req.user = user;

    if (error || !user) {
      req.flash("error", "Unauthorized");
      return res.redirect("/login");
    }

    req.login(user, { session: false }, (error) => {
      if (error) {
        req.flash("error", "Internal server error");
        return res.redirect("/login");
      }
      next();
    });
  })(req, res, next);
}

export function sanitizeUser(user) {
  return { id: user.id };
}

export const cookieExtractor = function (req) {
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

export const jwtOptions = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};
