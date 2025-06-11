"use client";
import React, { useState, useEffect } from "react";

interface BookingHistoryItem {
    id: string;
    clientName: string;
    email: string;
    phone: string;
    dateAndTime: string;
    service: string;
    staff: string;
    amount: string;
    status: string;
    address: string;
    createdAt: string;
  }

interface BookingHistoryProps {
  onBookingSelect?: (booking: BookingHistoryItem) => void;
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ onBookingSelect }) => {
  const [bookingHistory, setBookingHistory] = useState<BookingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Format booking ID to be more user-friendly
  const formatBookingId = (id: string, index: number) => {
    return String(index + 1).padStart(3, '0');
  };

  // Fetch booking data on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/bookings');
        
        if (response.ok) {
          const data = await response.json();
          setBookingHistory(data);
        } else {
          setError('Failed to fetch booking history');
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('An error occurred while fetching booking history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);



  return (
    <>
        <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-majer font-normal text-[#12B368]">
                  Booking History
                </h2>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mx-4 mt-4">
                {error}
                <button 
                  onClick={() => setError(null)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#538FDF]"></div>
                <span className="ml-2 text-gray-600">Loading booking history...</span>
              </div>
            ) : bookingHistory.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No booking history found
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                {/* Header */}
                <thead className="bg-[#538FDF] text-white font-majer">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">Client Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">Date and Time</th>
                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">Services</th>
                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">Staff</th>
                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">Amount</th>
                
                  </tr>
                </thead>
                
                {/* Data Rows */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookingHistory.map((booking, index) => (
                      <tr 
                        key={booking.id} 
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => onBookingSelect && onBookingSelect(booking)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-majer text-[#538FDF]">
                          {formatBookingId(booking.id, index)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                          {booking.clientName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                          {booking.dateAndTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                          {booking.service}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                          {booking.staff}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                          {booking.amount}
                        </td>
                       
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
            )}
          </div>
    </>
  )
}

export default BookingHistory