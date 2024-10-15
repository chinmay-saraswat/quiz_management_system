import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

// Sample logo style
const logoStyle = {
  fontFamily: "'Comic Sans MS', cursive, sans-serif",
  fontSize: '24px',
  color: '#EAB8E4',
  fontWeight: 'bold',
};

const QuizDashboard = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch quizzes when the component loads
  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(
          `http://localhost:5000/api/admin/courses/${courseId}/quizzes`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQuizzes(response.data);
      } catch (error) {
        console.error('Failed to fetch quizzes:', error);
        setError('Failed to load quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [courseId]);

  // Handle quiz deletion
  const handleDeleteQuiz = async (quizId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this quiz?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/quizzes/${quizId}`);
      setQuizzes(quizzes.filter((quiz) => quiz._id !== quizId));
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz. Please try again later.');
    }
  };

  // Navigate to the quiz attempt page
  const handleViewQuiz = (quizId) => {
    navigate(`/quiz/${quizId}`); // Navigate to the quiz attempt page
  };

  return (
    <div className="p-6 bg-gradient-to-tr from-gray-900 to-purple-900 min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center mb-6 p-4 bg-gray-800 rounded-lg shadow-lg">
        <div style={logoStyle}>Quiz Game</div>
        <div>
          <Link
            to="/dashboard"
            className="text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition duration-300 mr-4"
          >
            Courses
          </Link>
          <Link
            to="/signin"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-500 hover:to-purple-500 transition duration-300"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-100"></h1>
        <Link
          to={`/course/${courseId}/quizzes/create`}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-500 hover:to-purple-500 transition duration-300"
        >
          + Add New Quiz
        </Link>
      </div>

      {loading ? (
        <p className="text-lg text-gray-300">Loading quizzes...</p>
      ) : error ? (
        <p className="text-lg text-red-400">{error}</p>
      ) : quizzes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-gray-800 shadow-lg rounded-xl p-6 transform transition-transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => handleViewQuiz(quiz._id)} // Navigate to quiz attempt page on click
            >
              <h2 className="text-2xl font-semibold mb-2 text-indigo-300">
                Quiz: {quiz.title}
              </h2>

              <p className="text-gray-400 mb-4">{quiz.questions.length} Questions</p>

              <div className="flex justify-between mt-4">
                {/* Delete Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Stop the quiz attempt navigation
                    handleDeleteQuiz(quiz._id);
                  }}
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition duration-300"
                >
                  Delete
                </button>

                {/* View Quiz Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Stop the quiz attempt navigation
                    handleViewQuiz(quiz._id);
                  }}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500 transition duration-300"
                >
                  View Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-300">No quizzes available for this course.</p>
      )}
    </div>
  );
};

export default QuizDashboard;
