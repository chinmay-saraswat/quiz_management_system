import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for navigation

const SignIn = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/signin', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Invalid credentials');
      setError('Invalid email or password'); 
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <form className="w-full max-w-md p-8 bg-gray-800 shadow-md rounded-lg" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-white mb-6 text-center">Admin Sign In</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>} {/* Display error message */}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="mb-4 w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="mb-4 w-full p-2 bg-gray-700 text-white border border-gray-600 rounded focus:outline-none focus:border-blue-500"
        />

        <button type="submit" className="bg-blue-600 w-full text-white p-2 rounded hover:bg-blue-500 transition duration-300">
          Sign In
        </button>

        <div className="mt-4 text-center">
          <p className="text-gray-400">Don't have an account? 
            <Link to="/signup" className="text-blue-400 hover:underline ml-2">Sign Up</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
