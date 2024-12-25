import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const MonthPicker = ({ currentDate, onMonthSelect, maxDate = new Date() }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());
  const [showYearSelect, setShowYearSelect] = useState(false);
  const pickerRef = useRef(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getSelectableYears = () => {
    const currentYear = maxDate.getFullYear();
    const years = [];
    for (let year = currentYear - 5; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowYearSelect(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isFutureMonth = (year, month) => {
    const currentDate = new Date();
    return (
      year > currentDate.getFullYear() ||
      (year === currentDate.getFullYear() && month > currentDate.getMonth())
    );
  };

  const handleMonthSelect = (monthIndex) => {
    if (!isFutureMonth(viewYear, monthIndex)) {
      const newDate = new Date(viewYear, monthIndex, 1);
      onMonthSelect(newDate);
      setIsOpen(false);
    }
  };

  const changeYear = (delta) => {
    const newYear = viewYear + delta;
    if (newYear <= maxDate.getFullYear() && newYear >= maxDate.getFullYear() - 5) {
      setViewYear(newYear);
    }
  };

  return (
    <div className="relative" ref={pickerRef}>
      {/* Current month display */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                  hover:bg-white/10 transition-colors duration-200 flex items-center gap-2 min-w-[200px]"
      >
        <Calendar size={18} className="text-gray-400" />
        <span className="flex-1 text-center">
          {currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </span>
        <ChevronDown 
          size={16} 
          className={`transform transition-transform duration-200 
                     ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-64 bg-gray-800/95 backdrop-blur-sm 
                      border border-white/10 rounded-lg shadow-xl z-50 p-4">
          {/* Year navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => changeYear(-1)}
              className="p-1 text-gray-400 hover:text-white hover:bg-white/10 
                       rounded transition-colors duration-200"
              disabled={viewYear <= maxDate.getFullYear() - 5}
            >
              <ChevronLeft size={20} />
            </button>
            
            <button
              onClick={() => setShowYearSelect(!showYearSelect)}
              className="px-3 py-1 text-white font-medium hover:bg-white/10 rounded-lg 
                       transition-colors duration-200"
            >
              {viewYear}
            </button>
            
            <button
              onClick={() => changeYear(1)}
              className="p-1 text-gray-400 hover:text-white hover:bg-white/10 
                       rounded transition-colors duration-200"
              disabled={viewYear >= maxDate.getFullYear()}
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {showYearSelect ? (
            // Year selection grid
            <div className="grid grid-cols-3 gap-2">
              {getSelectableYears().map(year => (
                <button
                  key={year}
                  onClick={() => {
                    setViewYear(year);
                    setShowYearSelect(false);
                  }}
                  className={`py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors duration-200
                            ${year === viewYear
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'text-white hover:bg-white/10'}`}
                >
                  {year}
                </button>
              ))}
            </div>
          ) : (
            // Month grid
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(index)}
                  disabled={isFutureMonth(viewYear, index)}
                  className={`py-2 px-3 rounded-lg text-sm font-medium text-center transition-colors duration-200
                            ${isFutureMonth(viewYear, index)
                              ? 'opacity-50 cursor-not-allowed text-gray-500'
                              : viewYear === currentDate.getFullYear() && 
                                index === currentDate.getMonth()
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'text-white hover:bg-white/10'}`}
                >
                  {month.slice(0, 3)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MonthPicker;