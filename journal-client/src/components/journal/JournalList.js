import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { sharedStyles, journalStyles, combineStyles } from '../styles/shared-styles';
import EmotionsChart from './EmotionsChart';


function JournalList() {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  const [showEmotionChart, setShowEmotionChart] = useState(false);

  const fetchEntries = async () => {
    try {
      const response = await axios.get('/journal_entries');
      setEntries(response.data);
      setFilteredEntries(response.data);
    } catch (error) {
      console.error('Failed to fetch entries:', error);
      setMessage('Failed to load journal entries.');
      setMessageType('error');
    }
  };

  const handleDateSearch = (date) => {
    setSelectedDate(date);
    if (date) {
      const searchDate = new Date(date).toISOString().split('T')[0];
      const filtered = entries.filter(entry => {
        const entryDate = new Date(entry.created_at).toISOString().split('T')[0];
        return entryDate === searchDate;
      });
      setFilteredEntries(filtered);
      setIsFiltered(true);
    }
  };

  const resetSearch = () => {
    setSelectedDate('');
    setFilteredEntries(entries);
    setIsFiltered(false);
  };

  const createEntry = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        '/journal_entries',
        { journal_entry: newEntry }
      );
  
      // Update both entries and filteredEntries
      setEntries((prevEntries) => [response.data, ...prevEntries]);
      setFilteredEntries((prevEntries) => [response.data, ...prevEntries]); // Add this line
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
      setFilteredEntries((prevEntries) => prevEntries.filter((entry) => entry.id !== id));
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
      <h2 style={styles.title}>Your Journal</h2>

      {message && (
        <p style={combineStyles(
          styles.message,
          messageType === 'success' ? styles.successMessage : styles.errorMessage
        )}>
          {message}
        </p>
      )}

      <form onSubmit={createEntry} style={styles.form}>
        <h3 style={styles.heading}>Create New Entry</h3>
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

      <div style={styles.headerContainer}>
        <style>
          {`
            @media (max-width: 600px) {
              .header-container {
                flex-direction: column;
                gap: 12px;
                align-items: stretch;
              }
              
              .date-search-group {
                justify-content: space-between;
                align-items: center;
              }
              
              .subheading {
                text-align: center;
                margin-bottom: 8px;
              }
            }

            input[type="date"]::-webkit-calendar-picker-indicator:hover {
              background-color: transparent;
              filter: invert(100%);
            }


            input[type="date"]::-webkit-calendar-picker-indicator {
              background-color: #f5b27f;
              padding: 2px;
              cursor: pointer;
              border-radius: 3px;
              position: absolute;
              right: 8px;
              top: 50%;
              transform: translateY(-50%);
              margin: 0;
              width: 16px;
              height: 16px;
              transition: all 0.2s ease;
            }

            input[type="date"]::-webkit-calendar-picker-indicator:hover {
              background-color: transparent;
              filter: invert(100%);
            }

            input, textarea {
              width: 100%;
              padding: 12px;
              border: 1px solid #7899b7;
              border-radius: 4px;
              font-size: 0.875rem;
              background-color: #333333;
              color: #ffffff;
              box-sizing: border-box;
              transition: border-color 0.2s ease;
            }

            input:focus, textarea:focus {
              outline: none;
              border-color: #ffc5a8 !important;
              box-shadow: 0 0 0 2px rgba(255, 139, 95, 0.2) !important;
            }
          `}
        </style>
        <div className="header-container" style={styles.headerWrapper}>
          <h3 className="subheading" style={styles.heading}>
            {isFiltered ? `Entries for ${new Date(selectedDate).toLocaleDateString()}` : 'Journal Entries'}
          </h3>
          <div className="date-search-group" style={styles.dateSearchGroup}>
            <div style={styles.dateInputContainer}>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateSearch(e.target.value)}
                style={styles.dateInput}
              />
            </div>
            {isFiltered && (
              <button
                onClick={resetSearch}
                style={combineStyles(styles.button, styles.secondaryButton)}
              >
                Show All
              </button>
            )}
            <button
              onClick={() => setShowEmotionChart(true)}
              style={combineStyles(styles.button, styles.primaryButton)}
            >
              Insights
            </button>
          </div>
        </div>
      </div>

      {filteredEntries.length > 0 ? (
        <ul style={styles.entryList}>
          {filteredEntries.map((entry) => (
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
        <p style={styles.noEntries}>
          {isFiltered ? 'No entries found for this date.' : 'No entries yet.'}
        </p>
      )}

      {showEmotionChart && (
        <EmotionsChart onClose={() => setShowEmotionChart(false)} />
      )}

    </div>
  );
}

const styles = {
  ...sharedStyles,
  ...journalStyles,
};

export default JournalList;
