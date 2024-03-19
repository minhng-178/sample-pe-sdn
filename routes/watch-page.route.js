import express from "express";
import { isAuth } from "../middleware/auth.js";
import {
  createwatch,
  deleteWatch,
  getWatchAddForm,
  getWatchById,
  getWatches,
  updateWatch,
  viewWatchById,
} from "../controllers/watch.controller.js";

const pagesRoute = express.Router();

// view

pagesRoute.get("/login", (req, res) => res.render("signin"));

pagesRoute.get("/dashboard", isAuth, getWatches);

pagesRoute.get("/watches/add", isAuth, getWatchAddForm);

pagesRoute.post("/watches", isAuth, createwatch);

pagesRoute.get("/watches/:id", isAuth, getWatchById);

pagesRoute.get("/watches/detail/:id", isAuth, viewWatchById);

pagesRoute.put("/watches/:id", isAuth, updateWatch);

pagesRoute.delete("/watches/:id", isAuth, deleteWatch);

export default pagesRoute;
