import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CourseDetail = () => {
  const { id } = useParams();  // Get course ID from URL
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch course details by ID from the new route
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/course-details/${id}`);
        setCourse(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching course:', error);
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found!</p>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
      <p className="mb-4">{course.description}</p>

      {course.thumbnail && (
        <img 
          src={course.thumbnail} 
          alt="Course Thumbnail" 
          className="mb-6 w-full max-w-md mx-auto rounded" 
        />
      )}

      {/* Tutorials and Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {course.tutorials.map((tutorial, index) => (
          <div key={index} className="bg-white shadow-md p-4 rounded">
            <h3 className="text-xl font-semibold mb-2">Tutorial {index + 1}</h3>
            <p className="mb-4">{tutorial}</p>

            {/* Video associated with this tutorial */}
            {course.videos[index] && (
              <div className="video-container">
                <video 
                  src={course.videos[index]} 
                  controls 
                  className="w-full rounded"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseDetail;
