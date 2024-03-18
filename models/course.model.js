import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseName: { type: String, require: true },
  courseDescription: { type: String, require: true },
});

const courseModal = mongoose.model("Courses", courseSchema);

export default courseModal;
