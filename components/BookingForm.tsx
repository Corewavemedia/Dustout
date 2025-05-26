'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

// This is the mobile version of the form that will be positioned after the About section
export const MobileBookingForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rooms: '',
    restrooms: '',
    landscape: '',
    instructions: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form or show success message
  };

  return (
    <div className="md:hidden w-full px-4 py-8 bg-white relative overflow-hidden">
      {/* Big bubble center */}
      <Image 
        src="/images/bubble.png" 
        alt="Bubble" 
        width={400} 
        height={400} 
        className="absolute -right-20 top-[20%] transform rotate-12 opacity-30" 
      />
      
      <div className="text-center mb-6 relative z-10">
        <h2 className="text-4xl font-bold font-majer text-blue-500">Book Us</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="mobileFirstName" className="block text-blue-500 text-sm font-majer mb-1 font-medium">First name</label>
            <input
              type="text"
              id="mobileFirstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-blue-500 text-white focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="mobileLastName" className="block text-blue-500 font-majer text-sm mb-1 font-medium">Last</label>
            <input
              type="text"
              id="mobileLastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-blue-500 text-white focus:outline-none"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="mobileEmail" className="block text-blue-500 font-majer text-sm mb-1 font-medium">Email address</label>
          <input
            type="email"
            id="mobileEmail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-md bg-blue-500 text-white focus:outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="mobilePhone" className="block text-blue-500 font-majer text-sm mb-1 font-medium">Phone number</label>
            <input
              type="tel"
              id="mobilePhone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-blue-500 text-white focus:outline-none"
              required
            />
          </div>
          <div>
            <label htmlFor="mobileRooms" className="block text-blue-500 font-majer text-sm mb-1 font-medium">No. of Rooms</label>
            <input
              type="number"
              id="mobileRooms"
              name="rooms"
              value={formData.rooms}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-blue-500 text-white focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="mobileRestrooms" className="block text-blue-500 font-majer text-sm mb-1 font-medium">No. of bathrooms</label>
            <input
              type="number"
              id="mobileRestrooms"
              name="restrooms"
              value={formData.restrooms}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-blue-500 text-white focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="mobileLandscape" className="block text-blue-500 font-majer text-sm mb-1 font-medium">Number of landscape</label>
            <input
              type="number"
              id="mobileLandscape"
              name="landscape"
              value={formData.landscape}
              onChange={handleChange}
              className="w-full p-3 rounded-md bg-blue-500 text-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="mobileInstructions" className="block text-blue-500 font-majer text-sm mb-1 font-medium">Special instructions</label>
          <textarea
            id="mobileInstructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 rounded-md bg-blue-500 text-white focus:outline-none resize-none"
          ></textarea>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-majer text-xl font-normal py-3 px-4 rounded-md transition duration-300"
          >
            Book Us
          </button>
        </div>
      </form>
    </div>
  );
};

// This is the original BookingForm component that will be shown on desktop
const BookingForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    rooms: '',
    restrooms: '',
    landscape: '',
    instructions: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    // Reset form or show success message
  };

  return (
    <section id="booking" className="w-full py-20 relative overflow-hidden bg-white hidden md:block">
      {/* Background bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/bubble.png"
          alt="Bubble"
          width={200}
          height={200}
          className="absolute top-20 left-10 opacity-20"
        />
        <Image
          src="/images/bubble.png"
          alt="Bubble"
          width={100}
          height={100}
          className="absolute top-40 right-20 opacity-15"
        />
        <Image
          src="/images/bubble.png"
          alt="Bubble"
          width={150}
          height={150}
          className="absolute bottom-20 left-1/4 opacity-25"
        />
        <Image
          src="/images/bubble.png"
          alt="Bubble"
          width={80}
          height={80}
          className="absolute bottom-40 right-1/3 opacity-20"
        />
      </div>

      {/* Dark blue background at the bottom */}
      <div className="absolute hidden md:block bottom-0 left-0 right-0 h-80 bg-[#1A2D47]" aria-hidden="true"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-blue-500 rounded-xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left Section - Text and Image (hidden on mobile) */}
            <div className="hidden md:flex md:w-5/12 bg-blue-500 p-12 relative flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-white mb-8 text-center"
              >
                <h2 className="text-6xl font-bold font-majer mb-2">Get in</h2>
                <h2 className="text-7xl font-bold">TOUCH</h2>
              </motion.div>
              
              <div className="relative mt-auto flex transform -translate-y-[40%]">
                <div className="relative z-10 transform translate-y-[18%] translate-x-[10%]">
                  <Image
                    src="/images/leftImage.png" 
                    alt="Cleaning Staff 1"
                    width={200}
                    height={300}
                    className="object-contain scale-150 scale-x-[-1]"
                  />
                </div>
                <div className="relative -ml-10 mt-6 transform -translate-x-[30%]">
                  <Image
                    src="/images/rightImage.png" 
                    alt="Cleaning Staff 2"
                    width={220}
                    height={300}
                    className="object-contain scale-150"
                  />
                </div>
              </div>
            </div>

            {/* Right Section - Form */}
            <div className="w-full md:w-7/12 bg-blue-500 p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-white font-majer text-sm mb-1">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full p-3 rounded-md focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-white font-majer text-sm mb-1">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full p-3 rounded-md focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-white font-majer text-sm mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md focus:outline-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-white font-majer text-sm mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 rounded-md focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="rooms" className="block text-white font-majer text-sm mb-1">No. of Rooms</label>
                    <input
                      type="number"
                      id="rooms"
                      name="rooms"
                      value={formData.rooms}
                      onChange={handleChange}
                      className="w-full p-3 rounded-md focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="restrooms" className="block text-white font-majer text-sm mb-1">No. of RestRooms</label>
                    <input
                      type="number"
                      id="restrooms"
                      name="restrooms"
                      value={formData.restrooms}
                      onChange={handleChange}
                      className="w-full p-3 rounded-md focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="landscape" className="block text-white font-majer text-sm mb-1">Number of Landscape</label>
                    <input
                      type="number"
                      id="landscape"
                      name="landscape"
                      value={formData.landscape}
                      onChange={handleChange}
                      className="w-full p-3 rounded-md focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="instructions" className="block text-white font-majer text-sm mb-1">Special Instructions</label>
                  <textarea
                    id="instructions"
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 rounded-md focus:outline-none resize-none"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-800 hover:bg-blue-900 text-white font-majer text-xl font-normal py-3 px-4 rounded-md transition duration-300"
                  >
                    Book Us
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;