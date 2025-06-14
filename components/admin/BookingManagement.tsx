"use client";
import React, { useState, useEffect } from "react";
import BookingHistory from "./BookingHistory";
import UpcomingBookingSidebar from "./UpcomingBookingSidebar";
import { services } from "../data/ServicesData";
import { toast } from "react-hot-toast";

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  staffAssigned: string;
  date: string;
  startingTime: string;
  endingTime: string;
  services: string;
  specialNote: string;
}

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Service {
  id: string;
  name: string;
  description?: string;
}


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

const BookingManagement: React.FC = () => {
  const [formData, setFormData] = useState<BookingFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    staffAssigned: "",
    date: "",
    startingTime: "",
    endingTime: "",
    services: "",
    specialNote: "",
  });

  const [staff, setStaff] = useState<Staff[]>([]);
  const [dbServices, setDbServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<BookingHistoryItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  // Add a refresh trigger state
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch staff and services on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch staff
        const staffResponse = await fetch('/api/staff');
        if (staffResponse.ok) {
          const staffData = await staffResponse.json();
          setStaff(staffData);
        }

        // Fetch services
        const servicesResponse = await fetch('/api/services');
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setDbServices(servicesData.services || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle booking selection from history
  const handleBookingSelect = (booking: BookingHistoryItem) => {
    setSelectedBooking(booking);
    setIsUpdating(true);
    
    // Parse the client name
    const nameParts = booking.clientName.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    
    // Parse date and time from dateAndTime string
    const dateTimeParts = booking.dateAndTime.split(', ');
    const datePart = dateTimeParts[0] || '';
    const timePart = dateTimeParts[1] || '';
    const [startTime, endTime] = timePart.split(' - ');
    
    // Convert date from MM/dd/yyyy to yyyy-MM-dd format for HTML date input
    let formattedDate = '';
    if (datePart) {
      try {
        const dateObj = new Date(datePart);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split('T')[0];
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
    
    // Convert time from 12-hour format (e.g., "8:00 AM") to 24-hour format (e.g., "08:00")
    const convertTo24Hour = (time12h: string): string => {
      if (!time12h) return '';
      
      const [time, modifier] = time12h.trim().split(' ');
      let [hours, minutes] = time.split(':');
      
      if (hours === '12') {
        hours = '00';
      }
      
      if (modifier === 'PM') {
        hours = (parseInt(hours, 10) + 12).toString();
      }
      
      return `${hours.padStart(2, '0')}:${minutes}`;
    };
    
    // Populate form with booking data (excluding staff and special notes)
    setFormData({
      firstName,
      lastName,
      email: booking.email,
      phone: booking.phone,
      staffAssigned: '', // Don't populate staff - admin will assign new staff
      date: formattedDate,
      startingTime: convertTo24Hour(startTime || ''),
      endingTime: convertTo24Hour(endTime || ''),
      services: booking.service,
      specialNote: '', // Don't populate special notes
    });
    
    setMessage({ type: 'success', text: 'Booking loaded for staff assignment. Assign a staff member and submit to update.' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      // If updating an existing booking (only staff assignment)
      if (isUpdating && selectedBooking) {
        if (!formData.staffAssigned) {
          setMessage({ type: 'error', text: 'Please select a staff member to assign.' });
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/admin/bookings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: selectedBooking.id,
            staffAssigned: formData.staffAssigned,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success(`Staff assigned successfully! ${result.staffAssigned} has been assigned to this booking.`);
          setMessage({ type: 'success', text: `Staff assigned successfully! ${result.staffAssigned} has been assigned to this booking.` });
          // Reset form and state
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            staffAssigned: "",
            date: "",
            startingTime: "",
            endingTime: "",
            services: "",
            specialNote: "",
          });
          setSelectedBooking(null);
          setIsUpdating(false);
          // Trigger a refresh instead of reloading the page
          setRefreshTrigger(prev => prev + 1);
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to assign staff' });
        }
      } else {
        // Creating new booking
        const response = await fetch('/api/admin/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success(`Booking created successfully! Estimated price: $${result.estimatedPrice?.toFixed(2) || '0.00'}`);          
          setMessage({ type: 'success', text: `Booking created successfully! Estimated price: $${result.estimatedPrice?.toFixed(2) || '0.00'}` });
          // Reset form
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            staffAssigned: "",
            date: "",
            startingTime: "",
            endingTime: "",
            services: "",
            specialNote: "",
          });
          // Trigger a refresh instead of reloading the page
          setRefreshTrigger(prev => prev + 1);
        } else {
          setMessage({ type: 'error', text: result.error || 'Failed to create booking' });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ type: 'error', text: 'An error occurred while creating the booking' });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form and clear selection
  const handleClearForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      staffAssigned: "",
      date: "",
      startingTime: "",
      endingTime: "",
      services: "",
      specialNote: "",
    });
    setSelectedBooking(null);
    setIsUpdating(false);
    setMessage(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-2 bg-sky-50">
          {/* Booking Form */}
          <div className="bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-majer font-normal text-center flex-1">
                {isUpdating ? 'Assign Staff to Booking' : 'Schedule Cleaning'}
              </h2>
              {isUpdating && (
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-majer transition-colors"
                >
                  Clear Form
                </button>
              )}
            </div>
            
            {/* Success/Error Message */}
            {message && (
              <div className={`mb-4 p-3 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-red-100 text-red-800 border border-red-300'
              }`}>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Client Name Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <label htmlFor="firstName" className="block text-sm font-majer mb-1">Client First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="lastName" className="block text-sm font-majer mb-1">Client Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>

              {/* Email, Phone Number Staff Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-majer mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="phone" className="block text-sm font-majer mb-1">Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="staffAssigned" className="block text-sm font-majer mb-1">Staff Assigned</label>
                  <select
                    id="staffAssigned"
                    name="staffAssigned"
                    value={formData.staffAssigned}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Select Staff</option>
                    {staff.map((staffMember) => (
                      <option key={staffMember.id} value={`${staffMember.firstName} ${staffMember.lastName}`}>
                        {staffMember.firstName} {staffMember.lastName} - {staffMember.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date and Time Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="relative">
                  <label htmlFor="date" className="block text-sm font-majer mb-1">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="startingTime" className="block text-sm font-majer mb-1">Starting Time</label>
                  <input
                    type="time"
                    id="startingTime"
                    name="startingTime"
                    value={formData.startingTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <div className="relative">
                  <label htmlFor="endingTime" className="block text-sm font-majer mb-1">Ending Time</label>
                  <input
                    type="time"
                    id="endingTime"
                    name="endingTime"
                    value={formData.endingTime}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>

              {/* Services and Special Note Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <label htmlFor="services" className="block text-sm font-majer mb-1">Services</label>
                  <select
                    id="services"
                    name="services"
                    value={formData.services}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <option value="">Select Service</option>
                    {dbServices.length > 0 ? (
                      dbServices.map((service) => (
                        <option key={service.id} value={service.name}>
                          {service.name}
                        </option>
                      ))
                    ) : (
                      services.map((service, index) => (
                        <option key={index} value={service.title}>
                          {service.title}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                <div className="relative">
                  <label htmlFor="specialNote" className="block text-sm font-majer mb-1">Special Note</label>
                  <input
                    type="text"
                    id="specialNote"
                    name="specialNote"
                    value={formData.specialNote}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#12B368] text-white py-3 rounded-lg font-majer hover:bg-green-600 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading 
                  ? (isUpdating ? 'Assigning Staff...' : 'Creating Booking...') 
                  : (isUpdating ? 'Assign Staff' : 'Schedule Cleaning')
                }
              </button>
            </form>
          </div>

          {/* Booking History */}
          <div className="mt-8">
            <BookingHistory onBookingSelect={handleBookingSelect} refreshTrigger={refreshTrigger} />
          </div>
        </div>

        {/* Right Sidebar */}
        <UpcomingBookingSidebar refreshTrigger={refreshTrigger} />
      </div>
    </div>
  );
};

export default BookingManagement;