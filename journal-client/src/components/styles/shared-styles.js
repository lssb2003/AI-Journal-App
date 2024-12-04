// shared-styles.js
export const sharedStyles = {
    container: {
      maxWidth: '800px',
      margin: '50px auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px',
    },
    heading: {
      textAlign: 'left',
      color: '#006D77',
      fontSize: '24px',
      marginBottom: '20px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
    },
    label: {
      color: '#555',
      fontSize: '14px',
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      minHeight: '100px',
      resize: 'vertical',
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
    },
    button: {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'background-color 0.3s',
    },
    primaryButton: {
      backgroundColor: '#007bff',
      color: '#fff',
    },
    secondaryButton: {
      backgroundColor: '#6c757d',
      color: '#fff',
    },
    dangerButton: {
      backgroundColor: '#dc3545',
      color: '#fff',
    },
    successButton: {
      backgroundColor: '#28a745',
      color: '#fff',
    },
    linkButton: {
      background: 'none',
      border: 'none',
      color: '#007bff',
      cursor: 'pointer',
      textDecoration: 'underline',
      padding: '5px',
    },
    message: {
      padding: '10px',
      borderRadius: '4px',
      marginTop: '10px',
      textAlign: 'center',
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
    },
    description: {
        fontSize: '16px',
        textAlign: 'center',
        marginBottom: '20px',
        color: '#008080',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '10px',
        color: '#003366',
    },
  };
  
  export const combineStyles = (...styles) => {
    return styles.reduce((combined, style) => ({ ...combined, ...style }), {});
  };