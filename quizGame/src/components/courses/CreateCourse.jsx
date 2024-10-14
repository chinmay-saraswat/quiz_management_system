import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCourse = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState({ url: '', file: null });
  const [videos, setVideos] = useState([{ url: '', file: null }]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to handle file uploads
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    
    // Check if a file is uploaded for thumbnail
    if (thumbnail.file) {
      formData.append('thumbnail', thumbnail.file); // Append the thumbnail file
    } else {
      formData.append('thumbnailUrl', thumbnail.url); // Append the thumbnail URL
    }
    
    // Check if videos have files or URLs and append them accordingly
    videos.forEach((video) => {
      if (video.file) {
        formData.append('videos', video.file); // Append video file
      } else {
        formData.append('videoUrls', video.url); // Append video URL
      }
    });

    try {
      const response = await axios.post('http://localhost:5000/api/admin/courses', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Course created:', response.data);
      navigate('/dashboard'); // Navigate to the dashboard
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  const addVideoField = () => {
    setVideos([...videos, { url: '', file: null }]);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4">Create Course</h2>

      <div className="mb-4">
        <label className="block mb-1">Title:</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Description:</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1">Thumbnail:</label>
        <input 
          type="text" 
          placeholder="Thumbnail URL"
          value={thumbnail.url}
          onChange={(e) => setThumbnail({ ...thumbnail, url: e.target.value, file: null })}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        
      </div>

      <div className="mb-4">
        <label className="block mb-1">Video(s):</label>
        {videos.map((video, index) => (
          <div key={index} className="mb-2">
            <input 
              type="text" 
              placeholder="Video URL "
              value={video.url}
              onChange={(e) => {
                const newVideos = [...videos];
                newVideos[index] = { ...newVideos[index], url: e.target.value, file: null };
                setVideos(newVideos);
              }}
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
           
          </div>
        ))}
        <button type="button" onClick={addVideoField} className="text-blue-500">Add Another Video</button>
      </div>

      <button type="submit" className="bg-blue-500 text-white w-full p-2 rounded">Create Course</button>
    </form>
  );
};

export default CreateCourse;
