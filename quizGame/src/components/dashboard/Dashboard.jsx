import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// Sample logo URL, replace with your actual logo
const logoUrl = "https://via.placeholder.com/150?text=Quiz+Game";

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
    <div className="bg-gradient-to-tr from-gray-900 to-purple-900 min-h-screen p-6 text-gray-100">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-4 bg-gray-800 rounded-lg mb-6 shadow-lg">
        <div className="flex items-center">
          <img src={logoUrl} alt="Quiz Game Logo" className="w-10 h-10 mr-3 rounded-full" />
          <h1 className="text-2xl font-bold">Quiz Game</h1>
        </div>
        <div>
          <Link to="/course/create" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg mr-4 hover:from-blue-500 hover:to-purple-500 transition duration-300">
            Create Course
          </Link>
          <Link to="/signin" className="text-white py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 transition duration-300">
            Sign In
          </Link>
        </div>
      </nav>

      <h2 className="text-4xl font-bold mb-6 text-center">Courses</h2>

      {loading ? (
        <p className="text-lg text-gray-300">Loading courses...</p>
      ) : courses.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <img src={course.thumbnail} alt={course.title} className="w-full h-32 object-cover rounded-t-lg" />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 truncate">{course.title}</h3> {/* truncate ensures the title fits in one line */}
                <p className="text-gray-300 mb-4 line-clamp-3 overflow-hidden">{course.description}</p> {/* Ensure the description stays within 3 lines */}
                <div className="flex justify-between mt-4">
                  {/* Navigate to Course Detail page */}
                  <button 
                    onClick={() => navigate(`/course/${course._id}`)}  // Navigate to Course Detail page
                    className="bg-green-600 text-white py-2 px-3 rounded-lg transition duration-300 hover:bg-green-500"
                  >
                    View Course
                  </button>
                  <button 
                    onClick={() => navigate(`/courses/${course._id}/edit`)} 
                    className="bg-yellow-600 text-white py-2 px-3 rounded-lg transition duration-300 hover:bg-yellow-500"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteCourse(course._id)} 
                    className="bg-red-600 text-white py-2 px-3 rounded-lg transition duration-300 hover:bg-red-500"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-300">No courses available.</p>
      )}
    </div>
  );
};

export default Dashboard;
