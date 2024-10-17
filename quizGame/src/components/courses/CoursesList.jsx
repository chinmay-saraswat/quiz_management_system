// CourseList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  
import axios from 'axios';

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();  

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/courses');
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    
    fetchCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    // Navigate to the quiz dashboard for that course
    navigate(`/courses/${courseId}/quizzes`);
  };

  const handleEditCourseClick = (courseId) => {
    // Navigate to the edit course page
    navigate(`/courses/${courseId}/edit`);
  };

  const handleDelete = async (courseId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/courses/${courseId}`);
      // Update the UI by removing the deleted course from the state
      setCourses(courses.filter(course => course._id !== courseId));
      console.log('Course deleted');
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div>
      <h1>Courses</h1>
      {courses.map(course => (
        <div key={course._id} className="course-card">
          <img 
            src={course.thumbnail} 
            alt="Course Thumbnail" 
            style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
          />
          <h2>{course.title}</h2>
          <p>{course.description}</p>

          <div style={{ display: 'flex', gap: '10px' }}>
            {/* Button to navigate to quiz dashboard */}
            <button onClick={() => handleCourseClick(course._id)}>View Quizzes</button>

            {/* Button to navigate to edit course */}
            <button onClick={() => handleEditCourseClick(course._id)}>Edit Course</button>
            
            {/* Delete button */}
            <button onClick={() => handleDelete(course._id)} style={{ color: 'red' }}>
              Delete Course
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList;
