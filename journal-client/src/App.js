import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import JournalList from './components/journal/JournalList';
import ResetPassword from './components/auth/ResetPassword';
import LoadingSpinner from './components/styles/LoadingSpinner';
import { sharedStyles, combineStyles } from './components/styles/shared-styles';

// Move configuration to a separate config file in practice
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
};

// Configure axios with the API settings
axios.defaults.withCredentials = true;
axios.defaults.baseURL = API_CONFIG.baseURL;
Object.entries(API_CONFIG.headers).forEach(([key, value]) => {
  axios.defaults.headers.common[key] = value;
});

function App() {
  // Group related state together
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isRegistering: false,
    showResetPassword: false
  });
  const [loading, setLoading] = useState(true);

  // Memoize handlers with useCallback to prevent unnecessary re-renders
  const handleAuthStateChange = useCallback((updates) => {
    setAuthState(prev => ({ ...prev, ...updates }));
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await axios.post('/logout');
      handleAuthStateChange({ isAuthenticated: false });
      localStorage.removeItem('isAuthenticated');
    } catch (error) {
      console.error('Logout failed:', error);
      // Add user feedback for errors
      alert('Failed to logout. Please try again.');
    }
  }, [handleAuthStateChange]);

  // Separate authentication logic
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('/auth_check');
        const isAuthenticated = response.data.authenticated;
        handleAuthStateChange({ isAuthenticated });
        localStorage.setItem('isAuthenticated', isAuthenticated.toString());
      } catch (error) {
        handleAuthStateChange({ isAuthenticated: false });
        localStorage.removeItem('isAuthenticated');
      } finally {
        setLoading(false);
      }
    };

    // Check stored auth first, then verify with server
    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (storedAuth) {
      handleAuthStateChange({ isAuthenticated: true });
      setLoading(false);
    } else {
      checkAuth();
    }

    // Handle logout across tabs
    const handleStorageChange = (event) => {
      if (event.key === 'isAuthenticated' && event.newValue === null) {
        handleAuthStateChange({ isAuthenticated: false });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [handleAuthStateChange]);

  // Early return for loading state
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Render different views based on auth state
  const renderAuthenticatedContent = () => {
    if (authState.showResetPassword) {
      return (
        <ResetPassword 
          onPasswordReset={() => handleAuthStateChange({ showResetPassword: false })}
          onBackToJournal={() => handleAuthStateChange({ showResetPassword: false })}
        />
      );
    }

    return (
      <div style={styles.mainContent}>
        <JournalList />
        <div style={styles.buttonContainer}>
          <button 
            onClick={() => handleAuthStateChange({ showResetPassword: true })}
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
    );
  };

  const renderAuthContent = () => (
    <div style={styles.authContainer}>
      {authState.isRegistering ? (
        <>
          <Register onRegister={() => handleAuthStateChange({ isRegistering: false })} />
          <button 
            onClick={() => handleAuthStateChange({ isRegistering: false })}
            style={combineStyles(styles.button, styles.linkButton, styles.switchAuthButton)}
          >
            Already have an account? Login
          </button>
        </>
      ) : (
        <>
          <Login onLogin={() => handleAuthStateChange({ isAuthenticated: true })} />
          <button 
            onClick={() => handleAuthStateChange({ isRegistering: true })}
            style={combineStyles(styles.button, styles.linkButton, styles.switchAuthButton)}
          >
            New here? Register
          </button>
        </>
      )}
    </div>
  );

  return (
    <div style={styles.appContainer}>
      {authState.isAuthenticated ? renderAuthenticatedContent() : renderAuthContent()}
    </div>
  );
}

// Separate styles into their own file in practice
const styles = {
  ...sharedStyles,
  appContainer: {
    minHeight: '100vh',
    backgroundColor: '#1a1a1a',
    padding: '20px',
  },
  mainContent: {
    maxWidth: '1000px',
    margin: '0 auto',
    paddingBottom: '100px',
    position: 'relative',
    minHeight: 'calc(100vh - 40px)',
  },
  buttonContainer: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    gap: '8px',          // Reduced gap
    padding: '10px 15px', // Reduced padding
    borderRadius: '6px',  // Smaller border radius
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    backgroundColor: 'rgba(26, 26, 26, 0.3)',
    maxWidth: '1000px',
    width: 'fit-content',
    zIndex: 10,
    transition: 'background-color 0.2s ease',
    ':hover': {
      backgroundColor: 'rgba(26, 26, 26, 0.4)',
    }
  },
  button: {
    padding: '6px 12px',  // Smaller padding
    fontSize: '13px',     // Smaller font size
    borderRadius: '4px',  // Smaller border radius
    cursor: 'pointer'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#ffffff',
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
  switchAuthButton: {
    fontSize: '14px',
    padding: '10px',
    color: '#7899b7',
    marginTop: '10px',
    // Add hover effect
    transition: 'color 0.2s ease',
    ':hover': {
      color: '#9ab9d7',
    }
  },
};

export default App;
