"use client";
import React, { useState } from "react";
import BookingHistory from "./BookingHistory";
import UpcomingBookingSidebar from "./UpcomingBookingSidebar";
import { services } from "../data/ServicesData";

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

// Demo staff data
const demoStaff = [
  {
    id: "2024",
    staffName: "John Doe",
    role: "Cleaner",
  },
  {
    id: "2025",
    staffName: "Jane Doe",
    role: "Cleaner",
  },
  {
    id: "2026",
    staffName: "John Doe 2",
    role: "Cleaner",
  },
  {
    id: "2027",
    staffName: "John Doe 3",
    role: "Cleaner",
  },
  {
    id: "2028",
    staffName: "John Doe 4",
    role: "Cleaner",
  },
];


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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
    // Reset form or show confirmation
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-2 bg-sky-50">
          {/* Booking Form */}
          <div className="bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white p-6 rounded-lg mb-6">
            <h2 className="text-xl font-majer font-normal mb-4 text-center">Schedule Cleaning</h2>
            
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
                    {demoStaff.map((staff) => (
                      <option key={staff.id} value={staff.staffName}>
                        {staff.staffName} - {staff.role}
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
                    {services.map((service, index) => (
                      <option key={index} value={service.title}>
                        {service.title}
                      </option>
                    ))}
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
                className="w-full bg-[#12B368] text-white py-3 rounded-lg font-majer hover:bg-green-600 transition-colors mt-4"
              >
                Schedule Cleaning
              </button>
            </form>
          </div>

          {/* Booking History */}
          <BookingHistory />
        </div>

        {/* Right Sidebar */}
        <UpcomingBookingSidebar />
      </div>
    </div>
  );
};

export default BookingManagement;