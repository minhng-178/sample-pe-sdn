import { CatchAsyncErrors } from "../middleware/catch-async-error.js";

import courseModal from "../models/course.model.js";
import ErrorHandler from "../utils/error-handler.js";
export const getCourses = CatchAsyncErrors(async (req, res, next) => {
  try {
    const courses = await courseModal.find({});

    if (!courses) {
      return next(new ErrorHandler("Courses not found", 404));
    }

    res.status(200).json({
      success: true,
      courses: courses,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
export const getCourseByID = CatchAsyncErrors(async (req, res, next) => {
  try {
    const course = await courseModal.findById(req.params.id);

    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    res.status(200).json({
      success: true,
      course: course,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const createCourse = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { courseName, courseDescription } = req.body;

    const newCourse = await courseModal.create({
      courseName,
      courseDescription,
    });

    if (!newCourse) {
      return next(new ErrorHandler("update not work", 404));
    }

    res.status(200).json({
      success: true,
      course: newCourse,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const updateCourses = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { courseName, courseDescription } = req.body;

    const course = await courseModal.findByIdAndUpdate(
      req.params.id,
      {
        courseName,
        courseDescription,
      },
      { new: true }
    );

    if (!course) {
      return next(new ErrorHandler("update not work", 404));
    }

    res.status(200).json({
      success: true,
      course: course,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const deleteCourse = CatchAsyncErrors(async (req, res, next) => {
  try {
    await courseModal.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "delele successfull",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
