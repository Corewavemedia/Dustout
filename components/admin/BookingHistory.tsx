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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-majer font-normal text-[#12B368]">
              Booking History
            </h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="text-gray-500 font-majer">Loading booking history...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-majer font-normal text-[#12B368]">
              Booking History
            </h2>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="text-red-500 font-majer">{error}</div>
        </div>
      </div>
    );
  }

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
                  {bookingHistory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-gray-500 font-majer">
                        No booking history found
                      </td>
                    </tr>
                  ) : (
                    bookingHistory.map((booking, index) => (
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
                  )}
                </tbody>
              </table>
            </div>
          </div>
    </>
  )
}

export default BookingHistory