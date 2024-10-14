import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const CreateQuiz = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  // Initial form state with title and questions
  const [formData, setFormData] = useState({
    title: '',
    questions: [],
  });

  // Handle form changes for questions, options, and correct answer checkbox
  const handleChange = (e, questionIndex, optionIndex) => {
    const { name, value } = e.target;
    const updatedQuestions = [...formData.questions];

    // Handle question text
    if (name === 'questionText') {
      updatedQuestions[questionIndex].questionText = value;
    }
    
    // Handle option text
    if (name.startsWith('optionText')) {
      updatedQuestions[questionIndex].options[optionIndex].text = value;
    }

    // Handle correct answer checkbox
    if (name.startsWith('isCorrect')) {
      updatedQuestions[questionIndex].options[optionIndex].isCorrect = e.target.checked;
    }

    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Add a new question with empty options
  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [
        ...formData.questions,
        {
          questionText: '',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
        },
      ],
    });
  };

  // Remove a question
  const removeQuestion = (index) => {
    const updatedQuestions = formData.questions.filter((_, qIndex) => qIndex !== index);
    setFormData({ ...formData, questions: updatedQuestions });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.post(`http://localhost:5000/api/admin/courses/${courseId}/quizzes`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/course/${courseId}`); // Redirect to quiz dashboard after successful creation
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Create New Quiz</h2>
        
        <form onSubmit={handleSubmit}>
          {/* Quiz Title Input */}
          <input
            type="text"
            name="title"
            placeholder="Enter Quiz Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mb-6 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          {/* Questions and Options */}
          {formData.questions.map((question, index) => (
            <div key={index} className="mb-6 bg-gray-50 p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold mb-4 text-blue-600">Question {index + 1}</h3>

              <input
                type="text"
                name="questionText"
                placeholder="Enter Question Text"
                value={question.questionText}
                onChange={(e) => handleChange(e, index)}
                className="mb-4 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />

              {/* Options */}
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="mb-2 flex items-center space-x-4">
                  <input
                    type="text"
                    name={`optionText${optionIndex}`}
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option.text}
                    onChange={(e) => handleChange(e, index, optionIndex)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name={`isCorrect${optionIndex}`}
                      checked={option.isCorrect}
                      onChange={(e) => handleChange(e, index, optionIndex)}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />{' '}
                    <span className="ml-2 text-sm">Correct</span>
                  </label>
                </div>
              ))}

              {/* Remove question button */}
              <button
                type="button"
                onClick={() => removeQuestion(index)}
                className="text-red-500 hover:underline mt-4"
              >
                Remove Question
              </button>
            </div>
          ))}
          
          {/* Add Question Button */}
          <button
            type="button"
            onClick={addQuestion}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 mb-6"
          >
            + Add Question
          </button>
          
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 w-full"
          >
            Create Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;
