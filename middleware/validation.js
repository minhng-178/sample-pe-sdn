const { default: courseModal } = require("../models/course.model.js");


exports.validateSectionName = (req, res, next) => {
  const { sectionName } = req.body;
  const regex = /^[A-Z][a-z\d\s/]+$/;

  if (!regex.test(sectionName)) {
    return res.status(400).json({ message: 'Invalid section name format' });
  }

  next();
};

exports.validateCourseId = async (req, res, next) => {
  const { courseId } = req.body;

  try {
    const course = await courseModal.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};