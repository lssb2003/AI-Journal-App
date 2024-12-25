import React, { useState } from 'react';
import axios from 'axios';
import ForgotPassword from './ForgotPassword';
import LoadingSpinner from '../styles/LoadingSpinner';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post('/login', { email, password });
      setMessage('Login successful!');
      onLogin();
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gray-800 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold text-orange-400 text-center mb-2">JotBot</h1>
      <p className="text-gray-300 text-center mb-8">Your AI Journal</p>
      
      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white 
                     focus:border-orange-300 focus:ring-2 focus:ring-orange-300 focus:ring-opacity-50
                     disabled:opacity-50 transition duration-150"
            placeholder="Enter your email"
            required
            disabled={isLoading}
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
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white 
                     focus:border-orange-300 focus:ring-2 focus:ring-orange-300 focus:ring-opacity-50
                     disabled:opacity-50 transition duration-150"
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
        </div>

        <button 
          type="submit" 
          className={`w-full py-2 px-4 rounded-md font-medium text-white
                     bg-gradient-to-r from-orange-400 to-orange-500
                     hover:from-orange-500 hover:to-orange-600
                     focus:outline-none focus:ring-2 focus:ring-orange-300
                     disabled:opacity-50 transition duration-150
                     flex items-center justify-center space-x-2`}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="small" />
              <span>Logging in...</span>
            </div>
          ) : (
            'Login'
          )}
        </button>

        <button 
          type="button" 
          onClick={() => setShowForgotPassword(true)}
          className="w-full text-sm text-gray-400 hover:text-gray-300 
                     focus:outline-none focus:underline transition duration-150"
          disabled={isLoading}
        >
          Forgot Password?
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-md ${
          message.includes('successful')
            ? 'bg-green-800 text-green-200'
            : 'bg-red-800 text-red-200'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Login;