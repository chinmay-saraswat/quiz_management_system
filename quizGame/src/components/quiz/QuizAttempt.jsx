import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

// Sample logo style
const logoStyle = {
  fontFamily: "'Comic Sans MS', cursive, sans-serif",
  fontSize: '24px',
  color: '#EAB8E4',
  fontWeight: 'bold',
};

const QuizAttempt = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/quizzes/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(response.data);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerSelect = (questionIndex, option) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: option });
  };

  const handleSubmit = () => {
    const feedbackArray = quiz.questions.map((question, index) => {
      const isCorrect = selectedAnswers[index] === question.options.find(opt => opt.isCorrect)?.text;
      return {
        questionText: question.questionText,
        selectedAnswer: selectedAnswers[index],
        correctAnswer: question.options.find(opt => opt.isCorrect)?.text,
        isCorrect,
      };
    });
    setFeedback(feedbackArray);
  };

  if (!quiz) return <div className="text-white">Loading...</div>;

  return (
    <div className="bg-gradient-to-r from-gray-900 to-purple-900 min-h-screen p-8 text-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-6 p-4 bg-gray-800 rounded-lg shadow-lg">
        <div style={logoStyle}>Quiz Game</div>
        <div>
          <Link
            to="/dashboard"
            className="text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 mr-4"
          >
            Course Dashboard
          </Link>
          <Link
            to="/login"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-500 hover:to-purple-500 transition duration-300"
          >
            Logout
          </Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">{quiz.title}</h2>

        {quiz.questions.map((question, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 mb-4 shadow-lg transition-transform transform hover:scale-105">
            <p className="font-semibold text-lg mb-2">{question.questionText}</p>
            {question.options.map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center mb-2">
                <input
                  type="radio"
                  name={`question${index}`}
                  value={option.text}
                  onChange={() => handleAnswerSelect(index, option.text)}
                  checked={selectedAnswers[index] === option.text}
                  className="mr-2 text-purple-500 focus:ring-purple-500"
                />
                <label className="text-gray-300">{option.text}</label>
              </div>
            ))}
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg shadow-lg hover:from-blue-500 hover:to-purple-500 transition duration-300"
        >
          Submit Answers
        </button>

        {/* Feedback section */}
        {feedback.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Feedback</h3>
            {feedback.map((item, index) => (
              <div key={index} className={`bg-gray-700 rounded-lg p-4 mb-2 shadow-md transition-all ${item.isCorrect ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
                <p className="font-semibold">{item.questionText}</p>
                <p>Your answer: <span className={item.isCorrect ? 'text-green-300' : 'text-red-300'}>{item.selectedAnswer}</span> {item.isCorrect ? '(Correct)' : '(Incorrect)'}</p>
                <p>Correct answer: <span className="text-blue-300">{item.correctAnswer}</span></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizAttempt;
