import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/admin/courses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDeleteCourse = async (courseId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this course?');
    if (!confirmDelete) return;
  
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/admin/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Update the courses state to reflect the deletion
      setCourses(courses.filter(course => course._id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
      <Link to="/create-course" className="bg-blue-500 text-white p-2 rounded mb-4">Create Course</Link>
      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div key={course._id} className="bg-white shadow-md p-4 rounded">
              <h3 className="text-xl font-bold mb-2">{course.title}</h3>
              <p>{course.description}</p>
              <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover my-2" />
              <div className="flex justify-between mt-2">
                <button 
                  onClick={() => navigate(`/course/${course._id}`)}  // Navigate to Quiz Dashboard
                  className="bg-green-500 text-white p-2 rounded mr-2"
                >
                  Go to Quiz Dashboard
                </button>
                <button 
                  onClick={() => navigate(`/courses/${course._id}/edit`)} 
                  className="bg-yellow-500 text-white p-2 rounded mr-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeleteCourse(course._id)} 
                  className="bg-red-500 text-white p-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default Dashboard;
