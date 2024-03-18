import express from "express";
import { isAuth } from "../middleware/auth.js";
import {
  getSections,
  getSectionAddForm,
  createSection,
  updateSection,
  getSectionById,
  deleteSection,
  viewSectionById,
} from "../controllers/section.controller.js";

const pageRoute = express.Router();

// view

pageRoute.get("/login", (req, res) => res.render("signin"));

pageRoute.get("/dashboard", isAuth, getSections);

pageRoute.get("/sections/add", isAuth, getSectionAddForm);

pageRoute.post("/sections", isAuth, createSection);

pageRoute.get("/sections/:id", isAuth, getSectionById);

pageRoute.get("/sections/detail/:id", isAuth, viewSectionById);

pageRoute.put("/sections/:id", isAuth, updateSection);

pageRoute.delete("/sections/:id", isAuth, deleteSection);

export default pageRoute;
