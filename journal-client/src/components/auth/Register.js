import React, { useState } from 'react';
import axios from 'axios';

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/users', {
        user: {
          username,
          password,
        }
      });
      
      console.log('Registration response:', response);
      
      if (response.data.message) {
        setMessage('Registration successful! Please log in.');
        onRegister();
      }
    } catch (error) {
      console.error('Registration error details:', error.response || error);
      if (error.response?.data?.errors) {
        setMessage('Error: ' + error.response.data.errors.join(', '));
      } else {
        setMessage('An unknown error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-gray-800/30 backdrop-blur-lg rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold text-center text-orange-400 mb-6">Register</h2>
      
      <form onSubmit={handleRegister} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Email address:
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                     placeholder-gray-400 focus:ring-2 focus:ring-orange-300/50 focus:border-orange-400
                     transition duration-200"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Password:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                     placeholder-gray-400 focus:ring-2 focus:ring-orange-300/50 focus:border-orange-400
                     transition duration-200"
            placeholder="Create a password"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-gradient-to-r from-orange-400 to-orange-500
                   hover:from-orange-500 hover:to-orange-600 text-white rounded-lg
                   focus:ring-2 focus:ring-orange-300 transition duration-200"
        >
          Register
        </button>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-lg ${
          message.includes('successful')
            ? 'bg-green-800/50 text-green-200 border border-green-600'
            : 'bg-red-800/50 text-red-200 border border-red-600'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Register;