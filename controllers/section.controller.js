import mongoose from "mongoose";
import { CatchAsyncErrors } from "../middleware/catch-async-error.js";
import courseModal from "../models/course.model.js";
import sectionModal from "../models/section.model.js";

export const getSections = CatchAsyncErrors(async (req, res, next) => {
  try {
    const sections = await sectionModal.find({}).populate("course");

    if (!sections) {
      req.flash("error", "No section found.");
    }

    res.render("section", { sections: sections });
  } catch (error) {
    req.flash("error", error.message);
    res.render("section", { sections: [] });
  }
});

export const viewSectionById = CatchAsyncErrors(async (req, res, next) => {
  try {
    const section = await sectionModal
      .findById(req.params.id)
      .populate("course");

    const courses = await courseModal.find({});

    if (!section) {
      req.flash("error", "No section found.");
    }
    if (!courses) {
      req.flash("error", "No course found.");
    }

    res.render("viewSection", { section: section, courses: courses });
  } catch (error) {
    req.flash("error", error.message);
    res.render("viewSection", { section: {} });
  }
});

export const getSectionById = CatchAsyncErrors(async (req, res, next) => {
  try {
    const section = await sectionModal
      .findById(req.params.id)
      .populate("course");

    const courses = await courseModal.find({});

    if (!section) {
      req.flash("error", "No section found.");
    }
    if (!courses) {
      req.flash("error", "No course found.");
    }

    res.render("editSection", { section: section, courses: courses });
  } catch (error) {
    req.flash("error", error.message);
    res.render("editSection", { section: {} });
  }
});

export const getSectionAddForm = async (req, res, next) => {
  try {
    const courses = await courseModal.find({});
    if (!courses) {
      req.flash("error", "No course found.");
    }

    res.render("addSection", { courses: courses });
  } catch (error) {
    req.flash("error", error.message);
    res.render("create-section");
  }
};

export const createSection = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { sectionName, sectionDescription, duration, isMainTask, courseId } =
      req.body;

    const courses = await courseModal.find({});
    if (!courses) {
      req.flash("error", "No course found.");
    }

    const course = await courseModal.findById(courseId);
    if (!course) {
      req.flash("error", "No course found.");
      res.render("addSection", { courses: courses });
    }

    const sectionNameRegex = /^[A-Z][A-Za-z0-9\s\/]*$/;
    if (!sectionNameRegex.test(sectionName)) {
      req.flash(
        "error",
        "Invalid section name. Section name should start with a capital letter and can contain letters, digits, spaces, and forward slashes."
      );
      res.locals.error = req.flash("error");
      return res.render("addSection", { courses: courses });
    }

    if (duration <= 0) {
      req.flash(
        "error",
        "Invalid duration. Section duration must be greater than zero."
      );
      res.locals.error = req.flash("error");
      return res.render("addSection", { courses: courses });
    }

    const newData = await sectionModal.create({
      sectionName,
      sectionDescription,
      duration,
      isMainTask,
      course: courseId,
    });

    console.log("[NewData]: ", newData);

    req.flash("success_msg", "Section created successful.");
    res.redirect("/dashboard");
  } catch (error) {
    console.log("error here");
    req.flash("error", error.message);
    res.redirect("/dashboard");
  }
});

export const updateSection = CatchAsyncErrors(async (req, res, next) => {
  const { sectionName, sectionDescription, duration, isMainTask, courseId } =
    req.body;

  try {
    const section = await sectionModal
      .findById(req.params.id)
      .populate("course");

    const courses = await courseModal.find({});

    if (!section) {
      req.flash("error", "No section found.");
    }
    if (!courses) {
      req.flash("error", "No course found.");
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error("Invalid courseId");
    }

    const sectionNameRegex = /^[A-Z][A-Za-z0-9\s\/]*$/;
    if (!sectionNameRegex.test(sectionName)) {
      req.flash(
        "error",
        "Invalid section name. Section name should start with a capital letter and can contain letters, digits, spaces, and forward slashes."
      );
      res.locals.error = req.flash("error");
      return res.render("editSection", {
        section: section,
        courses: courses,
      });
    }

    if (duration <= 0) {
      req.flash(
        "error",
        "Invalid duration. Section duration must be greater than zero."
      );
      res.locals.error = req.flash("error");
      return res.render("editSection", {
        section: section,
        courses: courses,
      });
    }

    const updatedSection = await sectionModal.findByIdAndUpdate(
      req.params.id,
      {
        sectionName,
        sectionDescription,
        duration,
        isMainTask,
        courseId,
      },
      { new: true }
    );

    if (!updatedSection) {
      req.flash("error", "Section not found.");
    }

    req.flash("success_msg", "Section updated successful.");
    res.redirect("/dashboard");
  } catch (error) {
    // Handle errors
    console.error("Error updating section:", error.message);
    req.flash("error", "Failed to update section");
    res.redirect("/dashboard");
  }
});

export const deleteSection = CatchAsyncErrors(async (req, res, next) => {
  try {
    await sectionModal.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "Section deleted successful.");
    res.redirect("/dashboard");
  } catch (error) {
    // Handle errors
    console.error("Error delete section:", error.message);
    req.flash("error", "Failed to delete section");
    res.redirect("/dashboard");
  }
});
