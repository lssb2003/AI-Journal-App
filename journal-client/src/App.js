import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import JournalList from './components/journal/JournalList';
import ResetPassword from './components/auth/ResetPassword';
import LoadingSpinner from './components/styles/LoadingSpinner';
import SettingsMenu from './components/SettingsMenu';

// Configure axios defaults (keeping your existing configuration)
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

function App() {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    isRegistering: false,
    showResetPassword: false
  });
  const [loading, setLoading] = useState(true);

  // Keep your existing auth logic
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
      alert('Failed to logout. Please try again.');
    }
  }, [handleAuthStateChange]);

  useEffect(() => {
    // Your existing useEffect logic
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

    const storedAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (storedAuth) {
      handleAuthStateChange({ isAuthenticated: true });
      setLoading(false);
    } else {
      checkAuth();
    }

    const handleStorageChange = (event) => {
      if (event.key === 'isAuthenticated' && event.newValue === null) {
        handleAuthStateChange({ isAuthenticated: false });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [handleAuthStateChange]);

  const renderAuthenticatedContent = () => {
    if (authState.showResetPassword) {
      return (
        <div className="container mx-auto px-4 py-6">
          <ResetPassword 
            onPasswordReset={() => handleAuthStateChange({ showResetPassword: false })}
            onBackToJournal={() => handleAuthStateChange({ showResetPassword: false })}
          />
        </div>
      );
    }

    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-gray-800/30 backdrop-blur-lg rounded-xl border border-white/10 p-8 mb-16 shadow-lg">
          <JournalList />
          <SettingsMenu 
            onLogout={handleLogout}
            onResetPassword={() => handleAuthStateChange({ showResetPassword: true })}
          />
        </div>
      </div>
    );
  };

  const renderAuthContent = () => (
    <div className="min-h-[calc(100vh-40px)] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated background gradients */}
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-orange-500 opacity-30 blur-3xl animate-blob"></div>
        <div className="absolute top-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-500 opacity-30 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 left-1/4 w-1/2 h-1/2 bg-blue-500 opacity-30 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-blue-500 opacity-20 blur-3xl transform rotate-12"></div>
        <div className="relative">
          {authState.isRegistering ? (
            <>
              <Register onRegister={() => handleAuthStateChange({ isRegistering: false })} />
              <button 
                onClick={() => handleAuthStateChange({ isRegistering: false })}
                className="w-full mt-4 py-2 text-gray-200 hover:text-gray-300 text-sm transition-colors duration-200"
              >
                Already have an account? Login
              </button>
            </>
          ) : (
            <>
              <Login onLogin={() => handleAuthStateChange({ isAuthenticated: true })} />
              <button 
                onClick={() => handleAuthStateChange({ isRegistering: true })}
                className="w-full mt-4 py-2 text-gray-200 hover:text-gray-300 text-sm transition-colors duration-200"
              >
                New here? Register
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-400 to-gray-900"></div>
        <div className="relative">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Main background */}
      <div className="fixed inset-0 bg-gradient-to-b from-blue-900 via-orange-300 to-blue-700"></div>
      
      {/* Animated mesh gradient */}
      <div className="fixed inset-0">
        {/* Sunset/Sunrise animated layers */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-500/20 via-pink-500/10 to-transparent animate-gradient-y"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-700/30 via-transparent to-transparent animate-gradient-y animation-delay-2000"></div>
        
        {/* Moving clouds effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 animate-gradient-x"></div>
        
        {/* Warm glow */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-orange-500/10 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {authState.isAuthenticated ? renderAuthenticatedContent() : renderAuthContent()}
      </div>
    </div>
  );
}

export default App;