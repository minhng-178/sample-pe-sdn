import mongoose from "mongoose";

const watchSchema = new mongoose.Schema({
  watchName: { type: String, require: true },
  watchDescription: { type: String, require: true },
  price: { type: Number, require: true },
  image: { type: String, require: true },
  automatic: { type: Boolean, default: false },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Brands",
    require: true,
  },
});

const watchModel = mongoose.model("Watches", watchSchema);

export default watchModel;
