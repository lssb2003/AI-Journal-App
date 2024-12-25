import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const WeekPicker = ({ onWeekSelect, currentWeekStart, maxDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date(currentWeekStart));
  const [showYearSelector, setShowYearSelector] = useState(false);
  const calendarRef = useRef(null);

  // Generate array of selectable years (from 5 years ago to current year)
  const getSelectableYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = currentYear - 5; year <= currentYear; year++) {
      years.push(year);
    }
    return years;
  };

  const handleYearChange = (year) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(year);
    setCurrentMonth(newDate);
    setShowYearSelector(false);
  };

  // Helper to get week start date (Sunday)
  const getWeekStart = (date) => {
    const newDate = new Date(date);
    const day = newDate.getDay();
    newDate.setDate(newDate.getDate() - day);
    return newDate;
  };

  // Get weeks in month
  const getWeeksInMonth = (month) => {
    const weeks = [];
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    let currentWeek = getWeekStart(firstDay);
    
    while (currentWeek <= lastDay) {
      const weekEnd = new Date(currentWeek);
      weekEnd.setDate(weekEnd.getDate() + 6);
      weeks.push({
        start: new Date(currentWeek),
        end: weekEnd
      });
      currentWeek.setDate(currentWeek.getDate() + 7);
    }
    
    return weeks;
  };

  // Format date range for display
  const formatWeekRange = (start, end) => {
    if (start.getFullYear() === end.getFullYear()) {
      // Same year
      return `${start.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      })} - ${end.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric'
      })}`;
    } else {
      // Different years
      return `${start.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      })} - ${end.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric'
      })}`;
    }
  };

  // Format week display in dropdown
  const formatWeekRangeInDropdown = (start, end) => {
    if (start.getMonth() === end.getMonth()) {
      // Same month
      return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString('en-US', { 
        month: 'short'
      })}`;
    } else {
      // Different months
      return `${start.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      })} - ${end.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      })}`;
    }
  };

  // Check if a week is the currently selected week
  const isSelectedWeek = (weekStart) => {
    const currentDate = new Date(currentWeekStart);
    return weekStart.toDateString() === currentDate.toDateString();
  };

  // Check if a week is in the future
  const isFutureWeek = (weekStart) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return weekStart > today;
  };

  // Handle click outside to close calendar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowYearSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigateMonth = (direction) => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  return (
    <div className="relative" ref={calendarRef}>
      {/* Week display button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white 
                  hover:bg-white/10 transition-colors duration-200 flex items-center gap-2 min-w-[280px]"
      >
        <CalendarIcon size={16} className="text-gray-400" />
        <span>
          {formatWeekRange(
            new Date(currentWeekStart),
            new Date(new Date(currentWeekStart).setDate(currentWeekStart.getDate() + 6))
          )}
        </span>
      </button>

      {/* Calendar dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-gray-800/95 backdrop-blur-sm 
                      border border-white/10 rounded-lg shadow-xl z-50 p-4">
          {/* Month/Year navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors duration-200"
            >
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
            
            <button
              onClick={() => setShowYearSelector(!showYearSelector)}
              className="text-white font-medium hover:bg-white/10 px-3 py-1 rounded-lg transition-colors duration-200"
            >
              {currentMonth.toLocaleDateString('en-US', { 
                month: 'long', 
                year: 'numeric' 
              })}
            </button>
            
            <button
              onClick={() => navigateMonth('next')}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors duration-200"
              disabled={new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1) > new Date()}
            >
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Year selector */}
          {showYearSelector ? (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {getSelectableYears().map(year => (
                <button
                  key={year}
                  onClick={() => handleYearChange(year)}
                  className={`p-2 rounded-lg text-sm transition-colors duration-200
                            ${year === currentMonth.getFullYear()
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'hover:bg-white/10 text-white'}`}
                >
                  {year}
                </button>
              ))}
            </div>
          ) : (
            /* Weeks grid */
            <div className="space-y-1">
              {getWeeksInMonth(currentMonth).map((week, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (!isFutureWeek(week.start)) {
                      onWeekSelect(week.start);
                      setIsOpen(false);
                    }
                  }}
                  disabled={isFutureWeek(week.start)}
                  className={`w-full px-3 py-2 rounded-lg text-sm text-left transition-colors duration-200
                            ${isFutureWeek(week.start) 
                              ? 'opacity-50 cursor-not-allowed text-gray-400' 
                              : isSelectedWeek(week.start)
                                ? 'bg-orange-500/20 text-orange-400'
                                : 'hover:bg-white/10 text-white'}`}
                >
                  {formatWeekRangeInDropdown(week.start, week.end)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeekPicker;