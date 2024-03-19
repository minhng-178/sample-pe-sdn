import express from "express";

import { isAuth } from "../middleware/auth.js";
import {
  createBrand,
  deleteBrand,
  getBrandByID,
  getBrands,
  updateBrand,
} from "../controllers/brand.controller.js";

const brandRouter = express.Router();

brandRouter.get("/brands", isAuth, getBrands);
brandRouter.post("/brands", isAuth, createBrand);
brandRouter.get("/brands/:id", isAuth, getBrandByID);
brandRouter.put("/brands/:id", isAuth, updateBrand);
brandRouter.delete("/brands/:id", isAuth, deleteBrand);

export default brandRouter;
