export const COLORS = {
  primary: '#7899b7',
  primaryDark: '#6788a6',
  secondary: '#ff8b5f',
  secondaryDark: '#ff7a4e',
  danger: '#ff5f5f',
  dangerDark: '#ff4e4e',
  accent: '#f7c59f',
  background: '#1a1a1a',
  backgroundLight: '#2a2a2a',
  backgroundInput: '#333333',
  text: '#ffffff',
  border: '#7899b7',
  spinnerBg: '#f3f3f3',
  spinnerPrimary: '#7899b7',
};

export const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  laptop: '1024px',
  desktop: '1200px'
};

export const sharedStyles = {
  container: {
    width: '95%', // Changed from 90% to 95%
    maxWidth: '1000px',
    margin: '50px auto',
    padding: '30px',
    backgroundColor: COLORS.background,
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    color: COLORS.text,
    boxSizing: 'border-box',
    [`@media (max-width: ${BREAKPOINTS.mobile})`]: {
      width: '98%', // Added to maximize width on mobile
      padding: '15px', // Reduced from 20px to 15px
      margin: '15px auto', // Reduced from 20px to 15px
    }
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    backgroundColor: COLORS.backgroundLight,
    padding: '30px',
    borderRadius: '8px',
    marginBottom: '20px',
    boxSizing: 'border-box',
    [`@media (max-width: ${BREAKPOINTS.mobile})`]: {
      padding: '15px', // Reduced from 20px to 15px
    }
  },
  heading: {
    textAlign: 'left',
    color: COLORS.text,
    fontSize: '1.25rem',
    marginBottom: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: COLORS.text,
    fontSize: '0.875rem',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '4px',
    fontSize: '0.875rem',
    backgroundColor: COLORS.backgroundInput,
    color: COLORS.text,
    boxSizing: 'border-box',
    height: '36px',
    transition: 'border-color 0.2s ease',
    '&:focus': {
      outline: 'none',
      borderColor: COLORS.secondary,
      boxShadow: `0 0 0 2px ${COLORS.secondary}33`,
    }
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: `1px solid ${COLORS.border}`,
    borderRadius: '4px',
    fontSize: '0.875rem',
    minHeight: '120px',
    resize: 'vertical',
    backgroundColor: COLORS.backgroundInput,
    color: COLORS.text,
    boxSizing: 'border-box',
    transition: 'border-color 0.2s ease',
    '&:focus': {
      outline: 'none',
      borderColor: COLORS.secondary,
      boxShadow: `0 0 0 2px ${COLORS.secondary}33`,
    }
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    [`@media (max-width: ${BREAKPOINTS.mobile})`]: {
      flexDirection: 'column',
    }
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    height: '36px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
    },
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 2px ${COLORS.primary}33`,
    }
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    color: COLORS.text,
    '&:hover:not(:disabled)': {
      backgroundColor: COLORS.primaryDark,
    }
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    color: COLORS.text,
    '&:hover:not(:disabled)': {
      backgroundColor: COLORS.secondaryDark,
    }
  },
  dangerButton: {
    backgroundColor: COLORS.danger,
    color: COLORS.text,
    '&:hover:not(:disabled)': {
      backgroundColor: COLORS.dangerDark,
    }
  },
  successButton: {
    backgroundColor: COLORS.primary,
    color: COLORS.text,
    '&:hover:not(:disabled)': {
      backgroundColor: COLORS.primaryDark,
    }
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: COLORS.primary,
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: '5px',
    transition: 'color 0.2s ease',
    '&:hover': {
      color: COLORS.primaryDark,
    }
  },
  message: {
    padding: '12px',
    borderRadius: '4px',
    marginTop: '10px',
    textAlign: 'center',
    animation: 'fadeIn 0.3s ease',
  },
  successMessage: {
    backgroundColor: `${COLORS.primary}1A`,
    color: COLORS.text,
    border: `1px solid ${COLORS.primary}`,
  },
  errorMessage: {
    backgroundColor: `${COLORS.danger}1A`,
    color: COLORS.text,
    border: `1px solid ${COLORS.danger}`,
  },
  description: {
    fontSize: '1rem',
    textAlign: 'center',
    marginBottom: '20px',
    color: COLORS.accent,
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '10px',
    color: COLORS.primary,
    fontFamily: "'Pacifico', cursive",
    [`@media (max-width: ${BREAKPOINTS.mobile})`]: {
      fontSize: '2rem',
    }
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(-10px)' },
    to: { opacity: 1, transform: 'translateY(0)' }
  },
};

export const journalStyles = {
  headerContainer: {
    width: '100%',
    marginBottom: '20px',
  },
  headerWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    [`@media (max-width: ${BREAKPOINTS.mobile})`]: {
      flexDirection: 'column',
      gap: '15px',
    }
  },
  dateSearchGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    [`@media (max-width: ${BREAKPOINTS.mobile})`]: {
      width: '100%',
      justifyContent: 'space-between',
    }
  },
  dateInputContainer: {
    position: 'relative',
    width: 'auto',
  },
  dateInput: {
    padding: '8px 32px 8px 12px',
    borderRadius: '4px',
    border: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.backgroundInput,
    color: COLORS.text,
    fontSize: '0.875rem',
    cursor: 'pointer',
    minWidth: '140px',
    height: '36px',
    '&::-webkit-calendar-picker-indicator': {
      filter: 'invert(1)',
      cursor: 'pointer',
      padding: '4px',
    }
  },
  entryList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  entryItem: {
    backgroundColor: COLORS.backgroundLight,
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    border: `1px solid ${COLORS.border}`,
    width: '100%',
    boxSizing: 'border-box',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
    }
  },
  entryTitle: {
    fontSize: '1.125rem',
    color: COLORS.accent,
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  entryContent: {
    color: COLORS.text,
    fontSize: '0.875rem',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  entryFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [`@media (max-width: ${BREAKPOINTS.mobile})`]: {
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'flex-start',
    }
  },
  entryDate: {
    color: COLORS.accent,
    fontSize: '0.75rem',
  },
  deleteButton: {
    padding: '6px 12px',
    fontSize: '0.75rem',
    height: '32px',
  },
  noEntries: {
    textAlign: 'center',
    color: COLORS.accent,
    fontStyle: 'italic',
    marginTop: '20px',
    padding: '20px',
  },
};

export const combineStyles = (...styles) => {
  return styles.reduce((combined, style) => {
    const result = { ...combined };
    for (const [key, value] of Object.entries(style)) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        result[key] = { ...result[key], ...value };
      } else {
        result[key] = value;
      }
    }
    return result;
  }, {});
};


