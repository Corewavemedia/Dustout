'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

// This is the mobile version of the form that will be positioned after the About section
export const MobileBookingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    serviceAddress: '',
    cityState: '',
    postCode: '',
    landmark: '',
    serviceTypes: [] as string[],
    serviceFrequency: '',
    bedrooms: '',
    bathrooms: '',
    preferredDate: '',
    preferredTime: '',
    urgent: '',
    specialNotes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        serviceTypes: checked
          ? [...prev.serviceTypes, value]
          : prev.serviceTypes.filter(item => item !== value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const nextStep = () => setCurrentStep(2);
  const prevStep = () => setCurrentStep(1);

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
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
        <div className="flex justify-center mt-4 space-x-2">
          <div className={`w-3 h-3 rounded-full ${currentStep === 1 ? 'bg-blue-500' : 'bg-blue-200'}`}></div>
          <div className={`w-3 h-3 rounded-full ${currentStep === 2 ? 'bg-blue-500' : 'bg-blue-200'}`}></div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="relative z-10 min-h-[600px]">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div>
                <label htmlFor="mobileFullName" className="block text-blue-500 text-sm font-majer mb-1 font-medium">Full Name *</label>
                <input
                  type="text"
                  id="mobileFullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-blue-500 text-white placeholder-blue-200 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="mobilePhone" className="block text-blue-500 font-majer text-sm mb-1 font-medium">Phone Number *</label>
                  <input
                    type="tel"
                    id="mobilePhone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-blue-500 text-white placeholder-blue-200 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="mobileEmail" className="block text-blue-500 font-majer text-sm mb-1 font-medium">Email Address *</label>
                  <input
                    type="email"
                    id="mobileEmail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-blue-500 text-white placeholder-blue-200 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobileServiceAddress" className="block text-blue-500 font-majer text-sm mb-1 font-medium">Service Address *</label>
                <input
                  type="text"
                  id="mobileServiceAddress"
                  name="serviceAddress"
                  value={formData.serviceAddress}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-blue-500 text-white placeholder-blue-200 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="mobileCityState" className="block text-blue-500 font-majer text-sm mb-1 font-medium">City/State</label>
                  <input
                    type="text"
                    id="mobileCityState"
                    name="cityState"
                    value={formData.cityState}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-blue-500 text-white placeholder-blue-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="mobilePostCode" className="block text-blue-500 font-majer text-sm mb-1 font-medium">Post Code</label>
                  <input
                    type="text"
                    id="mobilePostCode"
                    name="postCode"
                    value={formData.postCode}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-blue-500 text-white placeholder-blue-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobileLandmark" className="block text-blue-500 font-majer text-sm mb-1 font-medium">Landmark or Special Directions</label>
                <input
                  type="text"
                  id="mobileLandmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-blue-500 text-white placeholder-blue-200 focus:outline-none"
                />
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-majer text-xl font-normal py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
                >
                  Next
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              variants={stepVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <div>
                <label className="block text-blue-500 font-majer text-sm mb-2 font-medium">Type of Service *</label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['Home Cleaning', 'Office Cleaning', 'Deep Cleaning', 'Post-Construction', 'Move-In/Move-Out', 'Carpet/Upholstery Cleaning'].map((service) => (
                    <label key={service} className="flex items-center text-blue-500">
                      <input
                        type="checkbox"
                        name="serviceTypes"
                        value={service}
                        onChange={handleChange}
                        className="mr-2 accent-blue-500"
                      />
                      <span className="text-xs">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-blue-500 font-majer text-sm mb-2 font-medium">Service Frequency *</label>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {['One-time', 'Weekly', 'Bi-weekly', 'Monthly'].map((frequency) => (
                    <label key={frequency} className="flex items-center text-blue-500">
                      <input
                        type="radio"
                        name="serviceFrequency"
                        value={frequency}
                        onChange={handleChange}
                        className="mr-2 accent-blue-500"
                        required
                      />
                      <span className="text-xs">{frequency}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="mobileBedrooms" className="block text-blue-500 font-majer text-sm mb-1 font-medium">No. of Bedrooms</label>
                  <input
                    type="number"
                    id="mobileBedrooms"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-blue-500 text-white placeholder-blue-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="mobileBathrooms" className="block text-blue-500 font-majer text-sm mb-1 font-medium">No. of Bathrooms</label>
                  <input
                    type="number"
                    id="mobileBathrooms"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-blue-500 text-white placeholder-blue-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="mobilePreferredDate" className="block text-blue-500 font-majer text-sm mb-1 font-medium">Preferred Date</label>
                <input
                  type="date"
                  id="mobilePreferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-blue-500 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-blue-500 font-majer text-sm mb-2 font-medium">Preferred Time Slot</label>
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className="w-full p-3 rounded-md bg-blue-500 text-white focus:outline-none"
                >
                  <option value="">Select time slot</option>
                  <option value="8:00 AM – 10:00 AM">8:00 AM – 10:00 AM</option>
                  <option value="10:00 AM – 12:00 PM">10:00 AM – 12:00 PM</option>
                  <option value="12:00 PM – 2:00 PM">12:00 PM – 2:00 PM</option>
                  <option value="2:00 PM – 4:00 PM">2:00 PM – 4:00 PM</option>
                  <option value="4:00 PM – 6:00 PM">4:00 PM – 6:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-blue-500 font-majer text-sm mb-2 font-medium">Is this an urgent request?</label>
                <div className="flex gap-4">
                  <label className="flex items-center text-blue-500">
                    <input
                      type="radio"
                      name="urgent"
                      value="Yes"
                      onChange={handleChange}
                      className="mr-2 accent-blue-500"
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center text-blue-500">
                    <input
                      type="radio"
                      name="urgent"
                      value="No"
                      onChange={handleChange}
                      className="mr-2 accent-blue-500"
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="mobileSpecialNotes" className="block text-blue-500 font-majer text-sm mb-1 font-medium">Anything we should know before arriving?</label>
                <textarea
                  id="mobileSpecialNotes"
                  name="specialNotes"
                  value={formData.specialNotes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 rounded-md bg-blue-500 text-white placeholder-blue-200 focus:outline-none resize-none"
                ></textarea>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  type="button"
                  onClick={prevStep}
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white font-majer text-xl font-normal py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-majer text-xl font-normal py-3 px-4 rounded-md transition duration-300"
                >
                  Book Us
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};