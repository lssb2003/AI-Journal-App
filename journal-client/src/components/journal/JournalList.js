import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EmotionsChart from './EmotionsChart';
import LoadingSpinner from '../styles/LoadingSpinner';
import InsightsMenu from './InsightsMenu';
import MonthlyEmotions from './MonthlyEmotions';
import ConfirmDialog from './ConfirmDialog';




function JournalList() {
  // Preserve all original state management
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  const [showEmotionChart, setShowEmotionChart] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showMonthlyEmotions, setShowMonthlyEmotions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState(null);


  // Keep original data fetching logic
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

  // Preserve date filtering logic
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

  // Keep original entry creation logic
  const createEntry = async (e) => {
    e.preventDefault();
    setIsCreating(true);
  
    try {
      const response = await axios.post('/journal_entries', { journal_entry: newEntry });
      setEntries(prevEntries => [response.data, ...prevEntries]);
      setFilteredEntries(prevEntries => [response.data, ...prevEntries]);
      setMessage('Journal entry enhanced and saved successfully!');
      setMessageType('success');
      setNewEntry({ title: '', content: '' });
    } catch (error) {
      console.error('Failed to create entry:', error);
      setMessage('Failed to enhance and save journal entry.');
      setMessageType('error');
    } finally {
      setIsCreating(false);
    }
  };

  // Preserve delete functionality
  const deleteEntry = (id) => {
    setEntryToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/journal_entries/${entryToDelete}`);
      setEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryToDelete));
      setFilteredEntries(prevEntries => prevEntries.filter(entry => entry.id !== entryToDelete));
      setMessage('Journal entry deleted successfully!');
      setMessageType('success');
    } catch (error) {
      console.error('Failed to delete entry:', error);
      setMessage('Failed to delete journal entry.');
      setMessageType('error');
    } finally {
      setShowDeleteConfirm(false);
      setEntryToDelete(null);
    }
  };



  useEffect(() => {
    fetchEntries();
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-orange-900 mb-8">Your Journal</h2>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          messageType === 'success' 
            ? 'bg-green-800/50 text-green-200 border border-green-600'
            : 'bg-red-800/50 text-red-200 border border-red-600'
        }`}>
          {message}
        </div>
      )}

      {/* Create Entry Form */}
      <form onSubmit={createEntry} className="mb-8 bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-gray-200 mb-4">Create New Entry</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            value={newEntry.title}
            onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white
                     placeholder-gray-400 focus:ring-2 focus:ring-orange-300/50 focus:border-orange-400
                     disabled:opacity-50 transition duration-200"
            required
            disabled={isCreating}
          />
          <textarea
            placeholder="Content"
            value={newEntry.content}
            onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white
                     placeholder-gray-400 focus:ring-2 focus:ring-orange-300/50 focus:border-orange-400
                     disabled:opacity-50 transition duration-200 min-h-[120px] resize-y"
            required
            disabled={isCreating}
          />
          <button 
            type="submit" 
            disabled={isCreating}
            className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500
                     hover:from-orange-500 hover:to-orange-600 text-white rounded-lg
                     focus:ring-2 focus:ring-orange-300 disabled:opacity-50
                     transition duration-200 flex items-center justify-center"
          >
            {isCreating ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="small" />
                <span>Enhancing...</span>
              </div>
            ) : (
              'Save Entry'
            )}
          </button>
        </div>
      </form>

      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h3 className="text-xl font-semibold text-gray-200">
          {isFiltered 
            ? `Entries for ${new Date(selectedDate).toLocaleDateString()}` 
            : 'Journal Entries'}
        </h3>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateSearch(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-gray-700 border border-gray-600 
                     rounded-lg text-white focus:ring-2 focus:ring-orange-300/50 
                     focus:border-orange-400 transition duration-200"
          />
          
          {isFiltered && (
            <button
              onClick={resetSearch}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg
                       transition duration-200 border border-gray-600"
            >
              Show All
            </button>
          )}
          
          <InsightsMenu 
            onSelectWeekly={() => setShowEmotionChart(true)}
            onSelectMonthly={() => setShowMonthlyEmotions(true)}
          />
        </div>
      </div>

      {/* Journal Entries List */}
      {filteredEntries.length > 0 ? (
        <ul className="space-y-4">
          {filteredEntries.map((entry) => (
            <li key={entry.id} 
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
              <h4 className="text-xl font-semibold text-orange-400 mb-3">{entry.title}</h4>
              <p className="text-gray-300 mb-4 whitespace-pre-wrap">{entry.content}</p>
              <div className="flex justify-between items-center">
                <small className="text-gray-400">
                  {new Date(entry.created_at).toLocaleString()}
                </small>
                <button 
                  onClick={() => deleteEntry(entry.id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm 
                           rounded-lg transition duration-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400 text-center py-8">
          {isFiltered ? 'No entries found for this date.' : 'No entries yet.'}
        </p>
      )}

      {/* Preserve EmotionsChart functionality */}
      {showEmotionChart && (
        <EmotionsChart onClose={() => setShowEmotionChart(false)} />
      )}
      {showMonthlyEmotions && (
        <MonthlyEmotions onClose={() => setShowMonthlyEmotions(false)} />
      )}

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setEntryToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Journal Entry"
        message="Are you sure you want to delete this journal entry? This action cannot be undone."
      />
    </div>
  );
}

export default JournalList;