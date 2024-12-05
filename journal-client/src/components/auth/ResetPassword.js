import React, { useState } from 'react';
import axios from 'axios';
import { sharedStyles, combineStyles } from '../styles/shared-styles';

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
    <div style={styles.container}>
      <h2 style={styles.heading}>Reset Password</h2>
      <form onSubmit={handleResetPassword} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Current Password:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter current password"
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
            placeholder="Enter new password"
            required
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Confirm New Password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
            placeholder="Confirm new password"
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
            onClick={onBackToJournal}
            style={combineStyles(styles.button, styles.secondaryButton)}
          >
            Back to Journal
          </button>
        </div>
      </form>
      {message && (
        <p style={combineStyles(
          styles.message,
          messageType === 'success' ? styles.successMessage : styles.errorMessage
        )}>
          {message}
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

export default ResetPassword;
