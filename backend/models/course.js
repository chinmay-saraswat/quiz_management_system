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
    type: String, 
  },
  videos: [
    {
      type: String, 
    },
  ],
  tutorials: [
    {
      type: String, 
    },
  ],
  quizzes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quiz', 
    },
  ],
});

module.exports = mongoose.model('Course', CourseSchema);
