'use client';
import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/auth-context';
import { useBookingForm } from '../lib/hooks/useBookingForm';

// This is the mobile version of the form that will be positioned after the About section
export const MobileBookingForm = () => {
  const { user, loading } = useAuth();
  const {
    currentStep,
    formData,
    isSubmitting,
    submitMessage,
    handleChange,
    nextStep,
    prevStep,
    handleSubmit
  } = useBookingForm(user);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 md:hidden">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mx-4 my-8 md:hidden">
        <div className="text-center">
          <h3 className="text-xl font-normal text-blue-500 mb-4 font-majer">Please Log In</h3>
          <p className="text-gray-600 mb-6">You need to be logged in to submit a booking request.</p>
          <a 
            href="/signin" 
            className="bg-green-500 text-white font-majer px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const handleFormSubmit = handleSubmit;

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="md:hidden w-full px-4 py-8 bg-white relative overflow-hidden" id='MobileBookingForm'>
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
      
      <form onSubmit={handleFormSubmit} className="relative z-10 min-h-[600px]">
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-blue-500 font-majer text-sm mb-2 font-medium">Start Time</label>
                  <select
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-blue-500 text-white focus:outline-none"
                  >
                    <option value="">Select start time</option>
                    <option value="6:00 AM">6:00 AM</option>
                    <option value="7:00 AM">7:00 AM</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-blue-500 font-majer text-sm mb-2 font-medium">End Time</label>
                  <select
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full p-3 rounded-md bg-blue-500 text-white focus:outline-none"
                  >
                    <option value="">Select end time</option>
                    <option value="8:00 AM">8:00 AM</option>
                    <option value="9:00 AM">9:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="1:00 PM">1:00 PM</option>
                    <option value="2:00 PM">2:00 PM</option>
                    <option value="3:00 PM">3:00 PM</option>
                    <option value="4:00 PM">4:00 PM</option>
                    <option value="5:00 PM">5:00 PM</option>
                    <option value="6:00 PM">6:00 PM</option>
                    <option value="7:00 PM">7:00 PM</option>
                  </select>
                </div>
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

              {submitMessage && (
                <div className={`p-3 rounded-md text-center font-medium ${
                  submitMessage.includes('successfully') 
                    ? 'bg-green-100 text-green-800 border border-green-300' 
                    : 'bg-red-100 text-red-800 border border-red-300'
                }`}>
                  {submitMessage}
                </div>
              )}

              <div className="pt-4 space-y-3">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={isSubmitting}
                  className="w-full bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-majer text-xl font-normal py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-800 hover:bg-blue-900 disabled:bg-blue-600 disabled:cursor-not-allowed text-white font-majer text-xl font-normal py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Book Us'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
};