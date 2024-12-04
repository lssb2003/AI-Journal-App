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
      const response = await axios.post('http://localhost:3001/password_resets', { email });
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
            Send Temporary Password
          </button>
          <button 
            type="button" 
            onClick={onBackToLogin} 
            style={combineStyles(styles.button, styles.secondaryButton)}
          >
            Back to Login
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
  },
  buttonGroup: {
    ...sharedStyles.buttonGroup,
    marginTop: '20px',
  },
};

export default ForgotPassword;