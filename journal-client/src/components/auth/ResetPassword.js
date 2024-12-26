import React, { useState } from 'react';
import axios from 'axios';

const ResetPassword = ({ onPasswordReset, onBackToJournal }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      setMessageType('error');
      return;
    }

    try {
      await axios.post('/change_password', { 
        current_password: currentPassword, 
        new_password: newPassword 
      });
      setMessage('Password reset successfully');
      setMessageType('success');
      setTimeout(() => {
        onPasswordReset();
      }, 2000);
    } catch (error) {
      console.error('Password reset failed:', error);
      setMessage(error.response?.data?.message || 'Failed to reset password');
      setMessageType('error');
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-gray-800/30 backdrop-blur-lg rounded-xl border border-white/10">
      <h2 className="text-2xl font-bold text-center text-orange-400 mb-6">
        Reset Password
      </h2>
      
      <form onSubmit={handleResetPassword} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Current Password:
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                     placeholder-gray-400 focus:ring-2 focus:ring-orange-300/50 focus:border-orange-400
                     transition duration-200"
            placeholder="Enter current password"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            New Password:
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                     placeholder-gray-400 focus:ring-2 focus:ring-orange-300/50 focus:border-orange-400
                     transition duration-200"
            placeholder="Enter new password"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Confirm New Password:
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white
                     placeholder-gray-400 focus:ring-2 focus:ring-orange-300/50 focus:border-orange-400
                     transition duration-200"
            placeholder="Confirm new password"
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
            onClick={onBackToJournal}
            className="w-full sm:w-1/2 py-2 px-4 bg-gray-700 hover:bg-gray-600 
                     text-white rounded-lg border border-gray-600
                     focus:ring-2 focus:ring-gray-400 transition duration-200"
          >
            Back to Journal
          </button>
        </div>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-lg ${
          messageType === 'success'
            ? 'bg-green-800/50 text-green-200 border border-green-600'
            : 'bg-red-800/50 text-red-200 border border-red-600'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ResetPassword;