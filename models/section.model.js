import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema({
  sectionName: { type: String, require: true },
  sectionDescription: { type: String, require: true },
  duration: { type: Number, require: true },
  isMainTask: { type: Boolean, default: false },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Courses",
    require: true,
  },
});

const sectionModal = mongoose.model("Sections", sectionSchema);

export default sectionModal;
