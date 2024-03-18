import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseName: { type: String, require: true },
  courseDescription: { type: String, require: true },
});

const courseModel = mongoose.model("Courses", courseSchema);

export default courseModel;
