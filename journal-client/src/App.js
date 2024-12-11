import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import JournalList from './components/journal/JournalList';
import ResetPassword from './components/auth/ResetPassword';
import LoadingSpinner from './components/styles/LoadingSpinner';
import { sharedStyles, combineStyles } from './components/styles/shared-styles';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth_check');
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleResetPassword = () => {
    setShowResetPassword(true);
  };

  const handlePasswordResetComplete = () => {
    setShowResetPassword(false);
  };

  const handleBackToJournal = () => {
    setShowResetPassword(false);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div style={styles.appContainer}>
      {isAuthenticated ? (
        showResetPassword ? (
          <ResetPassword 
            onPasswordReset={handlePasswordResetComplete}
            onBackToJournal={handleBackToJournal}
          />
        ) : (
          <div style={styles.journalContainer}>
            <JournalList />
            <div style={styles.buttonContainer}>
              <button 
                onClick={handleResetPassword} 
                style={combineStyles(styles.button, styles.successButton)}
              >
                Change Password
              </button>
              <button 
                onClick={handleLogout} 
                style={combineStyles(styles.button, styles.dangerButton)}
              >
                Logout
              </button>
            </div>
          </div>
        )
      ) : isRegistering ? (
        <div style={styles.authContainer}>
          <Register onRegister={() => setIsRegistering(false)} />
          <button 
            onClick={() => setIsRegistering(false)}
            style={combineStyles(styles.button, styles.linkButton, styles.switchAuthButton)}
          >
            Already have an account? Login
          </button>
        </div>
      ) : (
        <div style={styles.authContainer}>
          <Login onLogin={() => setIsAuthenticated(true)} />
          <button 
            onClick={() => setIsRegistering(true)}
            style={combineStyles(styles.button, styles.linkButton, styles.switchAuthButton)}
          >
            New here? Register
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  ...sharedStyles,
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    padding: '20px',
    boxSizing: 'border-box',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#ffffff',
  },
  journalContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '1000px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  authContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    maxWidth: '600px',
    margin: '0 auto',
    boxSizing: 'border-box',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    padding: '10px',
  },
  switchAuthButton: {
    fontSize: '14px',
    padding: '10px',
    color: '#7899b7',
    marginTop: '10px',
  },
};

export default App;