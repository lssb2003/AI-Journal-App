import React, { useState } from 'react';
import axios from 'axios';
import ForgotPassword from './ForgotPassword';
import LoadingSpinner from '../styles/LoadingSpinner';
import { sharedStyles, combineStyles } from '../styles/shared-styles';

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
      await axios.post('/login', {
        email,
        password,
      });
      setMessage('Login successful!');
      onLogin();  // No longer passing token
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
      <h1 style={styles.title}>JotBot</h1>
      <p style={styles.description}>Your AI Journal</p>
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
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
        <div style={styles.buttonGroup}>
          <button 
            type="submit" 
            style={combineStyles(styles.button, styles.primaryButton)}
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Login'}
          </button>
        </div>
        <button 
          type="button" 
          style={styles.forgotPasswordButton}
          onClick={() => setShowForgotPassword(true)}
          disabled={isLoading}
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
  container: {
    ...sharedStyles.container,
    maxWidth: '500px',
  }  
};

export default Login;