// import React, { useState, useEffect } from 'react';
// import Login from './components/Login';
// import Register from './components/Register';
// import JournalList from './components/JournalList';

// function App() {
//   const [token, setToken] = useState(null); // Token state to manage user login status
//   const [isRegistering, setIsRegistering] = useState(false); // Toggle registration state
//   const [loading, setLoading] = useState(true); // Loading state to handle token check delay

//   useEffect(() => {
//     // Check for token in localStorage when the component mounts
//     const storedToken = localStorage.getItem('token');
//     if (storedToken) {
//       setToken(storedToken); // Set the token if found
//     }
//     setLoading(false); // Once token is checked, set loading to false
//   }, []);

//   // Logout function to clear token and reset state
//   const handleLogout = () => {
//     setToken(null); // Clear token state
//     localStorage.removeItem('token'); // Remove token from localStorage
//   };

//   // Show loading screen if loading is true
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       {token ? (
//         // Render journal list and logout button if the user is authenticated
//         <>
//           <JournalList token={token} />
//           <button onClick={handleLogout} style={styles.logoutButton}>
//             Logout
//           </button>
//         </>
//       ) : isRegistering ? (
//         // Show registration form if registering is true
//         <>
//           <Register onRegister={() => setIsRegistering(false)} />
//           <button onClick={() => setIsRegistering(false)}>
//             Already have an account? Login
//           </button>
//         </>
//       ) : (
//         // Show login form if no token and not registering
//         <>
//           <Login onLogin={(newToken) => { setToken(newToken); localStorage.setItem('token', newToken); }} />
//           <button onClick={() => setIsRegistering(true)}>
//             New here? Register
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

// // Basic styles for the logout button
// const styles = {
//   logoutButton: {
//     marginTop: '10px',
//     padding: '10px 20px',
//     backgroundColor: '#f44',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     fontWeight: 'bold',
//   },
// };

// export default App;

import React, { useState, useEffect } from 'react';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import JournalList from './components/journal/JournalList';
import ResetPassword from './components/auth/ResetPassword';
import { sharedStyles, combineStyles } from './components/styles/shared-styles';

function App() {
  const [token, setToken] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
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
    return <div style={styles.loadingContainer}>Loading...</div>;
  }

  return (
    <div style={styles.appContainer}>
      {token ? (
        showResetPassword ? (
          <ResetPassword 
            token={token} 
            onPasswordReset={handlePasswordResetComplete}
            onBackToJournal={handleBackToJournal}
          />
        ) : (
          <div style={styles.journalContainer}>
            <JournalList token={token} />
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
          <Login onLogin={(newToken) => { 
            setToken(newToken); 
            localStorage.setItem('token', newToken); 
          }} />
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
    backgroundColor: '#f5f6f8',
    padding: '20px',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    fontSize: '18px',
    color: '#666',
  },
  journalContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  authContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '15px',
    maxWidth: '500px',
    margin: '0 auto',
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
    color: '#007bff',
    marginTop: '10px',
  },
};

export default App;