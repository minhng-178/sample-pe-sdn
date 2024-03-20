import { CatchAsyncErrors } from "../middleware/catch-async-error.js";
import brandModel from "../models/brand.model.js";

import ErrorHandler from "../utils/error-handler.js";
export const getBrands = CatchAsyncErrors(async (req, res, next) => {
  try {
    const brands = await brandModel.find({});

    if (!brands) {
      return next(new ErrorHandler("Brand not found", 404));
    }

    res.status(200).json({
      success: true,
      brands: brands,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
export const getBrandByID = CatchAsyncErrors(async (req, res, next) => {
  try {
    const brand = await brandModel.findById(req.params.id);

    if (!brand) {
      return next(new ErrorHandler("Brand not found", 404));
    }

    res.status(200).json({
      success: true,
      brand: brand,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const createBrand = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { brandName } = req.body;

    console.log(brandName);

    const newBrand = await brandModel.create({
      brandName,
    });

    if (!newBrand) {
      return next(new ErrorHandler("update not work", 404));
    }

    res.status(200).json({
      success: true,
      brand: brandName,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const updateBrand = CatchAsyncErrors(async (req, res, next) => {
  try {
    const { brandName } = req.body;

    const brand = await brandModel.findByIdAndUpdate(
      req.params.id,
      {
        brandName,
      },
      { new: true }
    );

    if (!brand) {
      return next(new ErrorHandler("update not work", 404));
    }

    res.status(200).json({
      success: true,
      brand: brand,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export const deleteBrand = CatchAsyncErrors(async (req, res, next) => {
  try {
    await brandModel.findByIdAndDelete(req.params.id);

    // await sectionModel.deleteMany({ course: req.params.id });

    res.status(200).json({
      success: true,
      message: "delele successfull",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
