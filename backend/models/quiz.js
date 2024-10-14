const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [
    {
      questionText: { type: String, required: true },  // Ensure question text is required
      options: [
        {
          text: { type: String, required: true },  // Option text is required
          isCorrect: { type: Boolean, required: true }  // Mark whether the option is correct
        }
      ],
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
