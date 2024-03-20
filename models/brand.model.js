import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    brandName: { type: String, require: true },
  },
  { timestamps: true }
);

const brandModel = mongoose.model("Brands", brandSchema);

export default brandModel;
