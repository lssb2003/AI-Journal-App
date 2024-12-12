import React, { useState } from 'react';
import axios from 'axios';
import { sharedStyles, combineStyles } from '../styles/shared-styles';

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
    <div style={styles.container}>
      <style>
        {`
          input:focus {
            outline: none;
            border-color: #ffc5a8 !important;
            box-shadow: 0 0 0 2px rgba(255, 139, 95, 0.2) !important;
          }
        `}
      </style>
      <h2 style={styles.heading}>Forgot Password</h2>
      <form onSubmit={handleForgotPassword} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="Enter your registered email"
            required
          />
        </div>
        <div style={styles.buttonGroup}>
          <button 
            type="submit" 
            style={combineStyles(styles.button, styles.primaryButton)}
          >
            Reset Password
          </button>
          <button 
            type="button" 
            onClick={onBackToLogin} 
            style={combineStyles(styles.button, styles.secondaryButton)}
          >
            Back
          </button>
        </div>
      </form>
      {message && (
        <p style={combineStyles(styles.message, styles.successMessage)}>
          {message}
        </p>
      )}
      {error && (
        <p style={combineStyles(styles.message, styles.errorMessage)}>
          {error}
        </p>
      )}
    </div>
  );
};

const styles = {
  ...sharedStyles,
  container: {
    ...sharedStyles.container,
    maxWidth: '500px',
  }
};

export default ForgotPassword;
