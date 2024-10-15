const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String, // URL or path of the image file
  },
  videos: [
    {
      type: String, // Array of video URLs
    },
  ],
  tutorials: [
    {
      type: String, // Array of text-based tutorials
    },
  ],
  quizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz', // Array of quizzes linked to this course
    },
  ],
});

module.exports = mongoose.model('Course', CourseSchema);
