import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: '',
    questions: [],
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`http://localhost:5000/api/admin/quizzes/${quizId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(res.data);
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleTitleChange = (e) => {
    setQuiz({ ...quiz, title: e.target.value });
  };

  const handleQuestionChange = (index, e) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index].questionText = e.target.value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/admin/quizzes/${quizId}`, quiz, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate(`/course/${quiz.course}/quizzes`);
    } catch (error) {
      console.error('Failed to update quiz:', error);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-tr from-gray-900 to-purple-900 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-100 mb-6">Edit Quiz</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={quiz.title}
          onChange={handleTitleChange}
          placeholder="Quiz Title"
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        />
        {quiz.questions.map((question, index) => (
          <div key={index} className="mb-4">
            <input
              type="text"
              value={question.questionText}
              onChange={(e) => handleQuestionChange(index, e)}
              placeholder={`Question ${index + 1}`}
              className="mb-2 w-full p-2 border border-gray-300 rounded"
            />
            {/* You can add options input fields for each question */}
          </div>
        ))}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Update Quiz</button>
      </form>
    </div>
  );
};

export default EditQuiz;
