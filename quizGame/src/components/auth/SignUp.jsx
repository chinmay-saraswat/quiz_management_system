import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(''); // State to hold error messages
  const [loading, setLoading] = useState(false); // State for loading
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/signup', formData);
      setLoading(false);
      navigate('/signin');
    } catch (error) {
      console.error(error);
      setError('Something went wrong. Please try again.'); // Display error message
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form className="w-full max-w-md p-8 bg-gray-800 shadow-lg rounded-lg" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Sign Up</h2>
        
        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Error message */}
        
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="mb-4 w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4 w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mb-4 w-full p-3 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 rounded bg-blue-600 text-white hover:bg-blue-500 transition duration-300 focus:outline-none ${loading ? 'cursor-not-allowed' : ''}`}
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-400">Already have an account? 
            <span className="text-blue-400 hover:underline ml-2 cursor-pointer" onClick={() => navigate('/signin')}>
              Sign In
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
