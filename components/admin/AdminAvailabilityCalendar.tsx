'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface AdminAvailabilityCalendarProps {
  className?: string;
}

const AdminAvailabilityCalendar: React.FC<AdminAvailabilityCalendarProps> = ({ className = '' }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [bookingDates, setBookingDates] = useState<{ [key: string]: number }>({});
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch both blocked dates and booking dates on component mount
  useEffect(() => {
    fetchCalendarData();
  }, []);

  const fetchCalendarData = async () => {
    try {
      setLoading(true);
      
      // Fetch blocked dates (admin blacklisted)
      const blockedResponse = await fetch('/api/unavailable-dates');
      if (blockedResponse.ok) {
        const blocked = await blockedResponse.json();
        setBlockedDates(blocked);
      } else {
        console.error('Failed to fetch blocked dates');
      }
      
      // Fetch booking dates (for informational display)
      const bookingResponse = await fetch('/api/booking-dates');
      if (bookingResponse.ok) {
        const bookings = await bookingResponse.json();
        setBookingDates(bookings);
      } else {
        console.error('Failed to fetch booking dates');
      }
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateClick = (dateStr: string) => {
    // Only allow clicking on dates that are not just booking dates
    // Booking dates are read-only for admin information
    const isBookingOnly = bookingDates[dateStr] && !blockedDates.includes(dateStr);
    
    if (isBookingOnly) {
      // Don't allow selection of booking-only dates
      return;
    }
    
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
  };

  const handleSubmit = async () => {
    if (selectedDates.length === 0) {
      alert('Please select at least one date to modify.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      for (const dateStr of selectedDates) {
        const isCurrentlyBlocked = blockedDates.includes(dateStr);
        
        if (isCurrentlyBlocked) {
          // Unblock the date
          const confirmed = window.confirm(`Are you sure you want to make ${dateStr} available again?`);
          if (confirmed) {
            const response = await fetch(`/api/blocked-dates/${dateStr}`, {
              method: 'DELETE',
            });
            
            if (response.ok) {
              setBlockedDates(prev => prev.filter(d => d !== dateStr));
            } else {
              console.error(`Failed to unblock date: ${dateStr}`);
            }
          }
        } else {
          // Block the date
          const confirmed = window.confirm(`Are you sure you want to block ${dateStr}?`);
          if (confirmed) {
            const response = await fetch('/api/blocked-dates', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                date: dateStr,
                reason: 'Admin blocked',
              }),
            });
            
            if (response.ok) {
              setBlockedDates(prev => [...prev, dateStr]);
            } else {
              console.error(`Failed to block date: ${dateStr}`);
            }
          }
        }
      }
      
      // Clear selected dates after processing
      setSelectedDates([]);
      
      // Refresh the calendar data
      await fetchCalendarData();
      
    } catch (error) {
      console.error('Error processing dates:', error);
      alert('An error occurred while processing the dates.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(currentDate.getMonth() - 1);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const days = getDaysInMonth(currentDate);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Loading calendar...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h3 className="text-lg font-semibold text-gray-700 min-w-[140px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 mb-6">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-12"></div>;
          }

          const dateStr = formatDateString(day);
          const isBlocked = blockedDates.includes(dateStr);
          const hasBookings = bookingDates[dateStr] > 0;
          const bookingCount = bookingDates[dateStr] || 0;
          const isBookingOnly = hasBookings && !isBlocked;
          const isSelected = selectedDates.includes(dateStr);
          const isTodayDate = isToday(day);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(dateStr)}
              
              className={`
                h-12 w-full rounded-lg text-sm font-medium transition-all duration-200 relative
                ${isSelected 
                  ? 'ring-2 ring-blue-500 ring-offset-1' 
                  : ''
                }
                ${isBlocked 
                  ? 'bg-blue-500 text-white hover:bg-blue-600' 
                  : isBookingOnly
                  ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }
                ${isTodayDate 
                  ? 'border-2 border-red-500' 
                  : 'border border-gray-200'
                }
              `}
            >
              {day.getDate()}
              {hasBookings && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center">
                  {bookingCount}
                </div>
              )}
              {isTodayDate && (
                <div className="w-1 h-1 bg-red-500 rounded-full mx-auto mt-1"></div>
              )}
            </button>
          );
        })}
      </div>

      

      

      {/* Action buttons */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {selectedDates.length > 0 && (
            <span>{selectedDates.length} date(s) selected</span>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setSelectedDates([])}
            disabled={selectedDates.length === 0}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={selectedDates.length === 0 || isSubmitting}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Processing...' : 'Done'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAvailabilityCalendar;