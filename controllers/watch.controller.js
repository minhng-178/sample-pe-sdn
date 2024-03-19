import mongoose from "mongoose";
import { CatchAsyncErrors } from "../middleware/catch-async-error.js";
import watcheModel from "../models/watch.model.js";
import brandModel from "../models/brand.model.js";

export const getWatches = CatchAsyncErrors(async (req, res, next) => {
  try {
    const watches = await watcheModel.find({}).populate("brand");

    if (!watches) {
      req.flash("error", "No watch found.");
    }

    res.render("section", { watches: watches });
  } catch (error) {
    req.flash("error", error.message);
    res.render("section", { watches: [] });
  }
});

export const viewWatchById = CatchAsyncErrors(async (req, res, next) => {
  try {
    const watch = await watcheModel.findById(req.params.id).populate("brand");

    const brands = await brandModel.find({});

    if (!watch) {
      req.flash("error", "No watch found.");
    }
    if (!courses) {
      req.flash("error", "No course found.");
    }

    res.render("viewSection", { watch: watch, brands: brands });
  } catch (error) {
    req.flash("error", error.message);
    res.render("viewSection", { watch: {} });
  }
});

export const getWatchById = CatchAsyncErrors(async (req, res, next) => {
  try {
    const watch = await watcheModel.findById(req.params.id).populate("course");

    const brands = await brandModel.find({});

    if (!watch) {
      req.flash("error", "No watch found.");
    }
    if (!brands) {
      req.flash("error", "No course found.");
    }

    res.render("editSection", { watch: watch, brands: brands });
  } catch (error) {
    req.flash("error", error.message);
    res.render("editSection", { watch: {} });
  }
});

export const getWatchAddForm = async (req, res, next) => {
  try {
    const brands = await brandModel.find({});
    if (!brands) {
      req.flash("error", "No course found.");
    }

    res.render("addSection", { brands: brands });
  } catch (error) {
    req.flash("error", error.message);
    res.render("create-watch");
  }
};

export const createwatch = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { watchName, watchDescription, price, automatic, brandId } = req.body;

    const brands = await brandModel.find({});
    if (!brands) {
      req.flash("error", "No course found.");
    }

    const brand = await brandModel.findById(brandId);
    if (!brand) {
      req.flash("error", "No course found.");
      res.render("addWatch", { brands: brands });
    }

    //?  ^: Bắt đầu từ đầu chuỗi.
    //? ([A-Z]): Bắt đầu bằng một chữ cái hoa từ A đến Z.
    //? \w+: Bất kỳ số lượng ký tự chữ (lặp lại 1 hoặc nhiều lần) bao gồm chữ cái thường, chữ số và dấu gạch dưới.
    //? $: Kết thúc chuỗi.

    const watchNameRegex = /^[A-Z][A-Za-z0-9\s\/]*$/;

    if (!watchNameRegex.test(watchName)) {
      req.flash(
        "error",
        "Invalid watch name. watch name should start with a capital letter and can contain letters, digits, spaces, and forward slashes."
      );
      res.locals.error = req.flash("error");
      return res.render("addWatch", { brands: brands });
    }

    if (price <= 0) {
      req.flash(
        "error",
        "Invalid price. watch price must be greater than zero."
      );
      res.locals.error = req.flash("error");
      return res.render("addWatch", { brands: brands });
    }

    const newData = await watcheModel.create({
      watchName,
      watchDescription,
      price,
      automatic,
      brand: brandId,
    });

    console.log("[NewData]: ", newData);

    req.flash("success_msg", "watch created successful.");
    res.redirect("/dashboard");
  } catch (error) {
    console.log("error here");
    req.flash("error", error.message);
    res.redirect("/dashboard");
  }
});

export const updateWatch = CatchAsyncErrors(async (req, res, next) => {
  const { watchName, watchDescription, price, automatic, brandId } = req.body;

  try {
    const watch = await watcheModel.findById(req.params.id).populate("");

    const brands = await brandModel.find({});

    if (!watch) {
      req.flash("error", "No watch found.");
    }
    if (!brands) {
      req.flash("error", "No course found.");
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new Error("Invalid courseId");
    }

    const watchNameRegex = /^[A-Z][A-Za-z0-9\s\/]*$/;
    if (!watchNameRegex.test(watchName)) {
      req.flash(
        "error",
        "Invalid watch name. watch name should start with a capital letter and can contain letters, digits, spaces, and forward slashes."
      );
      res.locals.error = req.flash("error");
      return res.render("editWatch", {
        watch: watch,
        brands: brands,
      });
    }

    if (price <= 0) {
      req.flash(
        "error",
        "Invalid duration. watch duration must be greater than zero."
      );
      res.locals.error = req.flash("error");
      return res.render("editWatch", {
        watch: watch,
        courses: brands,
      });
    }

    const updatedWatch = await watcheModel.findByIdAndUpdate(
      req.params.id,
      {
        watchName,
        watchDescription,
        price,
        automatic,
        brandId,
      },
      { new: true }
    );

    if (!updatedWatch) {
      req.flash("error", "watch not found.");
    }

    req.flash("success_msg", "watch updated successful.");
    res.redirect("/dashboard");
  } catch (error) {
    // Handle errors
    console.error("Error updating watch:", error.message);
    req.flash("error", "Failed to update watch");
    res.redirect("/dashboard");
  }
});

export const deleteWatch = CatchAsyncErrors(async (req, res, next) => {
  try {
    await watcheModel.findByIdAndDelete(req.params.id);
    req.flash("success_msg", "watch deleted successful.");
    res.redirect("/dashboard");
  } catch (error) {
    // Handle errors
    console.error("Error delete watch:", error.message);
    req.flash("error", "Failed to delete watch");
    res.redirect("/dashboard");
  }
});
