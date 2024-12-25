import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/password_resets', { email });
      setMessage(response.data.message);
      setError('');
      setTimeout(() => {
        onBackToLogin();
      }, 5000);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to process your request. Please try again later.');
      setMessage('');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-gray-800/30 backdrop-blur-lg rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold text-center text-orange-400 mb-6">
        Forgot Password
      </h2>
      
      <form onSubmit={handleForgotPassword} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                     placeholder-gray-400 focus:ring-2 focus:ring-orange-300/50 focus:border-orange-400
                     transition duration-200"
            placeholder="Enter your registered email"
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            type="submit" 
            className="w-full sm:w-1/2 py-2 px-4 bg-gradient-to-r from-orange-400 to-orange-500
                     hover:from-orange-500 hover:to-orange-600 text-white rounded-lg
                     focus:ring-2 focus:ring-orange-300 transition duration-200"
          >
            Reset Password
          </button>
          <button 
            type="button" 
            onClick={onBackToLogin}
            className="w-full sm:w-1/2 py-2 px-4 bg-gray-700 hover:bg-gray-600 
                     text-white rounded-lg border border-gray-600
                     focus:ring-2 focus:ring-gray-400 transition duration-200"
          >
            Back
          </button>
        </div>
      </form>

      {message && (
        <div className="mt-6 p-4 rounded-lg bg-green-800/50 text-green-200 border border-green-600">
          {message}
        </div>
      )}
      
      {error && (
        <div className="mt-6 p-4 rounded-lg bg-red-800/50 text-red-200 border border-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;