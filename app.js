import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import jwt from "jsonwebtoken";
import flash from "connect-flash";
import session from "express-session";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import expressEjsLayouts from "express-ejs-layouts";

import connectDB from "./utils/db.js";
import { ErrorMiddleWare } from "./middleware/error.js";
import passport from "./middleware/passport.js";
import authRouter from "./routes/auth.route.js";
import brandRouter from "./routes/brand.route.js";
import pagesRoute from "./routes/watch-page.route.js";
import accountModel from "./models/account.model.js";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(morgan("common"));
app.use(methodOverride("_method"));
app.use(express.json({ limit: "50mb" }));
app.use(cors({ credentials: true }));
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.authenticate("session"));

app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

app.use(async (req, res, next) => {
  const token = req.cookies["jwt"];

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const member = await accountModel.findById(decoded.id);
      res.locals.member = member;
      res.locals.isLoggedIn = true;
    } catch (err) {
      console.log(err);
      res.locals.isLoggedIn = false;
    }
  } else {
    res.locals.isLoggedIn = false;
    console.log("User not logged in!");
  }
  next();
});

app.use(express.static("public"));

app.use(expressEjsLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.get("/", (req, res, next) => {
  const locals = {
    title: "Nodejs",
    description: "Nodejs view engine",
  };
  res.render("index", locals);
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1", brandRouter);

app.use("/", pagesRoute);

app.get("/test-api", (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Api is working",
  });
});

app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  console.log(err);
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleWare);

connectDB();
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log(
//     `Server is running at http://localhost:${PORT}`
//   );
//   connectDB();
// });

export default app;
