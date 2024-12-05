import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { sharedStyles, combineStyles } from '../styles/shared-styles';

function JournalList() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const fetchEntries = async () => {
    try {
      const response = await axios.get('/journal_entries');
      setEntries(response.data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      setMessage('Failed to load journal entries.');
      setMessageType('error');
    }
  };

  const createEntry = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        '/journal_entries',
        { journal_entry: newEntry }
      );
  
      setEntries((prevEntries) => [response.data, ...prevEntries]);
      setMessage('Journal entry enhanced and saved successfully!');
      setMessageType('success');
      setNewEntry({ title: '', content: '' });
    } catch (error) {
      console.error('Failed to create entry:', error);
      setMessage('Failed to enhance and save journal entry.');
      setMessageType('error');
    }
  };

  const deleteEntry = async (id) => {
    try {
      await axios.delete(`/journal_entries/${id}`);
      setEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
      setMessage('Journal entry deleted successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Failed to delete entry:', error);
      setMessage('Failed to delete journal entry.');
      setMessageType('error');
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Your Journal</h2>

      {message && (
        <p style={combineStyles(
          styles.message,
          messageType === 'success' ? styles.successMessage : styles.errorMessage
        )}>
          {message}
        </p>
      )}

      <form onSubmit={createEntry} style={styles.form}>
        <h3 style={styles.subHeading}>Create New Entry</h3>
        <div style={styles.inputGroup}>
          <input
            type="text"
            placeholder="Title"
            value={newEntry.title}
            onChange={(e) => setNewEntry((prev) => ({ ...prev, title: e.target.value }))}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Content"
            value={newEntry.content}
            onChange={(e) => setNewEntry((prev) => ({ ...prev, content: e.target.value }))}
            style={styles.textarea}
            required
          />
          <button type="submit" style={combineStyles(styles.button, styles.successButton)}>
            Save Entry
          </button>
        </div>
      </form>

      <h3 style={styles.subHeading}>Journal Entries</h3>
      {entries.length > 0 ? (
        <ul style={styles.entryList}>
          {entries.map((entry) => (
            <li key={entry.id} style={styles.entryItem}>
              <h4 style={styles.entryTitle}>{entry.title}</h4>
              <p style={styles.entryContent}>{entry.content}</p>
              <div style={styles.entryFooter}>
                <small style={styles.entryDate}>
                  {new Date(entry.created_at).toLocaleString()}
                </small>
                <button 
                  onClick={() => deleteEntry(entry.id)}
                  style={combineStyles(styles.button, styles.dangerButton, styles.deleteButton)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.noEntries}>No entries yet.</p>
      )}
    </div>
  );
}

const styles = {
  ...sharedStyles,
  container: {
    ...sharedStyles.container,
    maxWidth: '800px',
  },
  subHeading: {
    color: '#333',
    fontSize: '20px',
    marginBottom: '15px',
  },
  entryList: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  entryItem: {
    backgroundColor: '#fff',
    padding: '20px',
    marginBottom: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  entryTitle: {
    fontSize: '18px',
    color: '#333',
    marginBottom: '10px',
    fontWeight: 'bold',
  },
  entryContent: {
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '15px',
  },
  entryFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryDate: {
    color: '#999',
    fontSize: '12px',
  },
  deleteButton: {
    padding: '5px 10px',
    fontSize: '12px',
  },
  textarea: {
    ...sharedStyles.textarea,
    minHeight: '120px',
  },
  noEntries: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginTop: '20px',
  },
};

export default JournalList;



