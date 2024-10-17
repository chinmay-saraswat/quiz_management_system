import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';

// Sample logo style
const logoStyle = {
  fontFamily: "'Comic Sans MS', cursive, sans-serif",
  fontSize: '24px',
  color: '#EAB8E4',
  fontWeight: 'bold',
};

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
    <div className="bg-gray-900 min-h-screen p-8 text-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-6 p-4 bg-gray-800 rounded-lg shadow-lg">
        <div style={logoStyle}>Quiz Game</div>
        <div>
          <Link
            to="/dashboard"
            className="text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 mr-4"
          >
            Dashboard
          </Link>
          <Link
            to="/signin"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-500 hover:to-purple-500 transition duration-300"
          >
           Logout
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Create New Quiz</h2>

        <form onSubmit={handleSubmit}>
          {/* Quiz Title Input */}
          <input
            type="text"
            name="title"
            placeholder="Enter Quiz Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mb-6 w-full p-3 border border-gray-700 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Questions and Options */}
          {formData.questions.map((question, index) => (
            <div key={index} className="mb-6 bg-gray-700 p-6 rounded-lg shadow-sm border border-gray-600">
              <h3 className="text-xl font-semibold mb-4 text-blue-400">Question {index + 1}</h3>

              <input
                type="text"
                name="questionText"
                placeholder="Enter Question Text"
                value={question.questionText}
                onChange={(e) => handleChange(e, index)}
                className="mb-4 w-full p-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full p-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
