import React, { useState } from 'react';
import axios from 'axios';
import ForgotPassword from './ForgotPassword';
import { sharedStyles, combineStyles } from '../styles/shared-styles';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', {
        email,
        password,
      });
      setMessage('Login successful!');
      onLogin(response.data.token);
    } catch (error) {
      console.error('Login failed:', error);
      setMessage('Invalid email or password.');
    }
  };

  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Login</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            placeholder="Enter your email"
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
            placeholder="Enter your password"
            required
          />
        </div>
        <div style={styles.buttonGroup}>
          <button type="submit" style={combineStyles(styles.button, styles.primaryButton)}>
            Login
          </button>
        </div>
        <button 
          type="button" 
          style={styles.forgotPasswordButton}
          onClick={() => setShowForgotPassword(true)}
        >
          Forgot Password?
        </button>
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
};

const styles = {
  ...sharedStyles,
  forgotPasswordButton: {
    ...sharedStyles.linkButton,
    fontSize: '14px',
    marginTop: '10px',
  },
};

export default Login;