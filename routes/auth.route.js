import express from "express";
import {
  getAll,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import { isAuth } from "../middleware/auth.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/logout", logout);
authRouter.get("/users", isAuth, getAll);

export default authRouter;
