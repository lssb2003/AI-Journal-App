import React, { useState } from 'react';
import axios from 'axios';
import { sharedStyles, combineStyles } from '../styles/shared-styles';

function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/users', {
        user: {
          username,
          password,
        },
      });
      setMessage('Registration successful! Please log in.');
      onRegister();
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response?.data?.errors) {
        setMessage('Error: ' + error.response.data.errors.join(', '));
      } else {
        setMessage('An unknown error occurred. Please try again.');
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Register</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
            placeholder="Choose a username"
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            placeholder="Create a password"
            required
          />
        </div>
        <div style={styles.buttonGroup}>
          <button 
            type="submit" 
            style={combineStyles(styles.button, styles.successButton)}
          >
            Register
          </button>
        </div>
      </form>
      {message && (
        <p style={combineStyles(
          styles.message,
          message.includes('successful') ? styles.successMessage : styles.errorMessage
        )}>
          {message}
        </p>
      )}
    </div>
  );
}

const styles = {
  ...sharedStyles,
  container: {
    ...sharedStyles.container,
    maxWidth: '500px', // Slightly wider than login for better spacing
  },
};

export default Register;







