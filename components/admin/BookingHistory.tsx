import React from 'react'

interface BookingHistoryItem {
    id: string;
    clientName: string;
    dateAndTime: string;
    service: string;
    address: string;
    amount: string;
  }

// Sample data for booking history
const bookingHistory: BookingHistoryItem[] = [
    {
      id: "001",
      clientName: "Janet Doe",
      dateAndTime: "23rd June 2023, 9:00 - 11:00am",
      service: "Landscaping",
      address: "Johnson County",
      amount: "$450.00",
    },
    {
      id: "002",
      clientName: "Janet Doe",
      dateAndTime: "22nd June 2023, 2:00 - 4:00pm",
      service: "Landscaping",
      address: "Johnson County",
      amount: "$450.00",
    },
    {
      id: "003",
      clientName: "Janet Doe",
      dateAndTime: "21st June 2023, 10:00 - 12:00pm",
      service: "Landscaping",
      address: "Johnson County",
      amount: "$450.00",
    },
  ];

const BookingHistory = () => {
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
              <table className="w-full">
                {/* Header */}
                <thead>
                  <tr className="bg-[#538FDF] text-white">
                    <th className="px-4 py-3 text-left text-sm font-normal font-majer">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-normal font-majer">Client Name</th>
                    <th className="px-4 py-3 text-left text-sm font-normal font-majer">Date and Time</th>
                    <th className="px-4 py-3 text-left text-sm font-normal font-majer">Services</th>
                    <th className="px-4 py-3 text-left text-sm font-normal font-majer">Staff</th>
                    <th className="px-4 py-3 text-left text-sm font-normal font-majer">Amount</th>
                  </tr>
                </thead>
                
                {/* Data Rows */}
                <tbody className="divide-y divide-gray-200">
                  {bookingHistory.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-[#5B9BD5] font-normal font-majer">
                        {booking.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5B9BD5] font-normal font-majer">
                        {booking.clientName}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5B9BD5] font-normal font-majer">
                        {booking.dateAndTime}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5B9BD5] font-normal font-majer">
                        {booking.service}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5B9BD5] font-normal font-majer">
                        {booking.address}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5B9BD5] font-normal font-majer">
                        {booking.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </>
  )
}

export default BookingHistory