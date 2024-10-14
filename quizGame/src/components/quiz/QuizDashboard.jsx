import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';

const QuizDashboard = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/courses/${courseId}/quizzes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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

  const handleDeleteQuiz = async (quizId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this quiz?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/quizzes/${quizId}`);
      setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete quiz. Please try again later.');
    }
  };

  return (
    <div className="p-6 bg-gradient-to-tr from-gray-900 to-purple-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-100">Quizzes for Course</h1>
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
        {quizzes.map((quiz,index) => (
            <div key={quiz._id} className="bg-gray-800 shadow-lg rounded-xl p-6 transform transition-transform hover:scale-105 hover:shadow-2xl">
            <h2 className="text-2xl font-semibold mb-2 text-indigo-300">Quiz: {quiz.title}</h2>

              <p className="text-gray-400 mb-4">{quiz.questions.length} Questions</p>
          
              <div className="flex justify-between mt-4">
                
                <button 
                  onClick={() => handleDeleteQuiz(quiz._id)} 
                  className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-500 transition duration-300"
                >
                  Delete
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
