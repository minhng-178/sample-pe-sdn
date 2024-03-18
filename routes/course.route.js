import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourseByID,
  getCourses,
  updateCourses,
} from "../controllers/course.controller.js";
import { isAuth } from "../middleware/auth.js";

const courseRouter = express.Router();

courseRouter.get("/courses", isAuth, getCourses);
courseRouter.post("/courses", isAuth, createCourse);
courseRouter.get("/courses/:id", isAuth, getCourseByID);

courseRouter.put("/courses/:id", isAuth, updateCourses);
courseRouter.delete("/courses/:id", isAuth, deleteCourse);

export default courseRouter;
