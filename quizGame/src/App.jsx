import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignUp from './components/auth/SignUp';
import SignIn from './components/auth/SignIn';
import Dashboard from './components/dashboard/Dashboard';
import CreateCourse from './components/courses/CreateCourse';

import CreateQuiz from './components/quiz/CreateQuiz';  // To create a new quiz
import EditCourse from './components/courses/EditCourse';  // To edit a course
import CourseList from './components/courses/CoursesList';  // Component for displaying all courses
import QuizDashboard from './components/quiz/QuizDashboard';  // Component for managing quizzes
import EditQuiz from './components/quiz/EditQuiz';  // Component for managing quizzes
import QuizAttempt from './components/quiz/QuizAttempt';
import CourseDetail from './components/courses/CourseDetail';
// Import the component
// In your main routing file (App.jsx or Routes.jsx)



const App = () => {
  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Course-related routes */}
        <Route path="/courses" element={<CourseList />} />
        <Route path="/course/create" element={<CreateCourse />} />
        <Route path="/courses/:courseId/edit" element={<EditCourse />} />
        <Route path="/course-details/:id" element={<CourseDetail />} />

        {/* Quiz-related routes */}
        <Route path="/course/:courseId" element={<QuizDashboard />} />
        <Route path="/course/:courseId/quizzes/create" element={<CreateQuiz />} />
        <Route path="/quiz/:quizId/edit" element={<EditQuiz />} />
        <Route path="/quiz/:quizId" element={<QuizAttempt />} />


      </Routes>
    </Router>
  );
};

export default App;
