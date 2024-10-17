const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  questions: [
    {
      questionText: { type: String, required: true },  
      options: [
        {
          text: { type: String, required: true },  
          isCorrect: { type: Boolean, required: true } 
        }
      ],
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);
