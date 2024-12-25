import React, { useState, useRef, useEffect } from 'react';
import { BarChart2, ChevronDown } from 'lucide-react';

const InsightsMenu = ({ onSelectWeekly, onSelectMonthly }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    setIsOpen(false);
    if (option === 'weekly') {
      onSelectWeekly();
    } else {
      onSelectMonthly();
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-500
                 hover:from-orange-500 hover:to-orange-600 text-white rounded-lg
                 transition duration-200 flex items-center gap-2"
      >
        <BarChart2 size={18} />
        <span>Insights</span>
        <ChevronDown size={16} className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700/50 overflow-hidden z-50">
          <button
            onClick={() => handleSelect('weekly')}
            className="w-full px-4 py-3 text-left text-white hover:bg-white/5 
                     transition-colors duration-200 flex items-center gap-2"
          >
            Weekly Overview
          </button>
          <button
            onClick={() => handleSelect('monthly')}
            className="w-full px-4 py-3 text-left text-white hover:bg-white/5 
                     transition-colors duration-200 flex items-center gap-2
                     border-t border-gray-700/50"
          >
            Monthly Overview
          </button>
        </div>
      )}
    </div>
  );
};

export default InsightsMenu;