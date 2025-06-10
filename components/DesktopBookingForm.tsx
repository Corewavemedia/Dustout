'use client';
import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/auth-context';
import { useBookingForm } from '../lib/hooks/useBookingForm';
import Link from 'next/link';

// This is the desktop version of the form that will be positioned after the About section
export const DesktopBookingForm = () => {
  const { user, loading } = useAuth();
  const {
    currentStep,
    formData,
    isSubmitting,
    submitMessage,
    services,
    loadingServices,
    handleChange,
    addService,
    removeService,
    updateServiceQuantity,
    nextStep,
    prevStep,
    handleSubmit,
    setFormData,
  } = useBookingForm(user);

  // Show loading state
  if (loading) {
    return (
      <div className="justify-center items-center p-8 hidden md:flex">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }


  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 3) {
      handleSubmit(e);
    }
  };



  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className='relative hidden md:block'>
    <section
      id="booking"
      className="w-full py-20 relative overflow-hidden bg-sky-50 hidden md:block"
    >
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
      <div
        className="absolute hidden md:block bottom-0 left-0 right-0 h-80 bg-[#1A2D47]"
        aria-hidden="true"
      ></div>

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
                <div className="flex justify-center mt-6 space-x-3">
                  <div
                    className={`w-4 h-4 rounded-full ${
                      currentStep === 1 ? "bg-white" : "bg-blue-300"
                    }`}
                  ></div>
                  <div
                    className={`w-4 h-4 rounded-full ${
                      currentStep === 2 ? "bg-white" : "bg-blue-300"
                    }`}
                  ></div>
                  <div
                    className={`w-4 h-4 rounded-full ${
                      currentStep === 3 ? "bg-white" : "bg-blue-300"
                    }`}
                  ></div>
                </div>
              </motion.div>

              <div className="relative mt-auto flex transform -translate-y-[40%]">
                <div className="relative transform translate-y-[18%] translate-x-[5%]">
                  <Image
                    src="/images/leftImage.png"
                    alt="Cleaning Staff 1"
                    width={200}
                    height={300}
                    className="object-contain scale-150 scale-x-[-1.5]"
                  />
                </div>
                <div className="relative z-10 -ml-10 mt-6 transform -translate-x-[30%]">
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
              <form onSubmit={handleFormSubmit} className="min-h-[600px]">
                <AnimatePresence mode="wait">
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-white font-majer text-sm mb-1"
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          className="w-full p-3 rounded-md focus:outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-white font-majer text-sm mb-1"
                          >
                            Phone Number *
                          </label>
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
                          <label
                            htmlFor="email"
                            className="block text-white font-majer text-sm mb-1"
                          >
                            Email Address *
                          </label>
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
                      </div>

                      <div>
                        <label
                          htmlFor="serviceAddress"
                          className="block text-white font-majer text-sm mb-1"
                        >
                          Service Address *
                        </label>
                        <input
                          type="text"
                          id="serviceAddress"
                          name="serviceAddress"
                          value={formData.serviceAddress}
                          onChange={handleChange}
                          className="w-full p-3 rounded-md focus:outline-none"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="cityState"
                            className="block text-white font-majer text-sm mb-1"
                          >
                            City/State
                          </label>
                          <input
                            type="text"
                            id="cityState"
                            name="cityState"
                            value={formData.cityState}
                            onChange={handleChange}
                            className="w-full p-3 rounded-md focus:outline-none"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="postCode"
                            className="block text-white font-majer text-sm mb-1"
                          >
                            Post Code
                          </label>
                          <input
                            type="text"
                            id="postCode"
                            name="postCode"
                            value={formData.postCode}
                            onChange={handleChange}
                            className="w-full p-3 rounded-md focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="landmark"
                          className="block text-white font-majer text-sm mb-1"
                        >
                          Landmark or Special Directions
                        </label>
                        <input
                          type="text"
                          id="landmark"
                          name="landmark"
                          value={formData.landmark}
                          onChange={handleChange}
                          className="w-full p-3 rounded-md focus:outline-none"
                        />
                      </div>

                      <div className="pt-4">
                        <button
                          type="button"
                          onClick={nextStep}
                          className="w-full bg-blue-800 hover:bg-blue-900 text-white font-majer text-xl font-normal py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
                        >
                          Next
                          <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
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
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-white font-majer text-sm mb-2">
                          Type of Service *
                        </label>
                        {loadingServices ? (
                          <div className="text-white text-sm">Loading services...</div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {services.map((service) => (
                              <label
                                key={service.id}
                                className="flex items-center text-white text-sm"
                              >
                                <input
                                  type="checkbox"
                                  name="serviceTypes"
                                  value={service.id}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      // Add service with default variable if available
                                      if (service.variables.length > 0) {
                                        addService(service.id, service.variables[0].name);
                                      }
                                    } else {
                                      // Remove all instances of this service
                                      const indicesToRemove = formData.selectedServices
                                        .map((s, index) => s.serviceId === service.id ? index : -1)
                                        .filter(index => index !== -1)
                                        .reverse();
                                      indicesToRemove.forEach(index => removeService(index));
                                    }
                                  }}
                                  checked={formData.selectedServices.some(s => s.serviceId === service.id)}
                                  className="mr-2 accent-blue-300"
                                />
                                {service.name}
                              </label>
                            ))}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-white font-majer text-sm mb-2">
                          Service Frequency *
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {["One-time", "Weekly", "Bi-weekly", "Monthly"].map(
                            (frequency) => (
                              <label
                                key={frequency}
                                className="flex items-center text-white text-sm"
                              >
                                <input
                                  type="radio"
                                  name="serviceFrequency"
                                  value={frequency}
                                  onChange={handleChange}
                                  className="mr-2 accent-blue-300"
                                  required
                                />
                                {frequency}
                              </label>
                            )
                          )}
                        </div>
                      </div>

                      {/* Dynamic Service Variables */}
                      {formData.selectedServices.length > 0 && (
                        <div className="space-y-4">
                          <h3 className="text-white font-majer text-sm mb-2">Service Details</h3>
                          {formData.selectedServices.map((selectedService, index) => {
                            const service = services.find(s => s.id === selectedService.serviceId);
                            if (!service || !service.variables || service.variables.length === 0) return null;

                            return (
                              <div key={selectedService.serviceId} className="bg-blue-600 p-4 rounded-md">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="text-white font-medium">{service.name} Details</h4>
                                  <button
                                    type="button"
                                    onClick={() => removeService(index)}
                                    className="text-red-300 hover:text-red-100"
                                  >
                                    ✕
                                  </button>
                                </div>
                                <div className="space-y-3">
                                  {service.variables.map((variable) => (
                                    <div key={variable.id} className="space-y-2">
                                      <label className="block text-white text-sm mb-1">
                                        {variable.name} (${variable.unitPrice} per unit)
                                      </label>
                                      <input
                                        type="number"
                                        min="1"
                                        value={selectedService.variables.find(v => v.variableId === variable.id)?.quantity || 1}
                                        onChange={(e) => {
                                          const quantity = parseInt(e.target.value) || 1;
                                          updateServiceQuantity(selectedService.serviceId, variable.id, quantity);
                                        }}
                                        className="w-full p-2 rounded-md focus:outline-none text-sm"
                                      />
                                      <div className="text-white text-xs">
                                        Subtotal: ${((selectedService.variables.find(v => v.variableId === variable.id)?.quantity || 1) * variable.unitPrice).toFixed(2)}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="preferredDate"
                            className="block text-white font-majer text-sm mb-1"
                          >
                            Preferred Date
                          </label>
                          <input
                            type="date"
                            id="preferredDate"
                            name="preferredDate"
                            value={formData.preferredDate}
                            onChange={handleChange}
                            className="w-full p-3 rounded-md focus:outline-none"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="startTime"
                            className="block text-white font-majer text-sm mb-1"
                          >
                            Start Time
                          </label>
                          <select
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className="w-full p-3 rounded-md focus:outline-none"
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
                          <label
                            htmlFor="endTime"
                            className="block text-white font-majer text-sm mb-1"
                          >
                            End Time
                          </label>
                          <select
                            id="endTime"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className="w-full p-3 rounded-md focus:outline-none"
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
                        <label className="block text-white font-majer text-sm mb-2">
                          Is this an urgent request?
                        </label>
                        <div className="flex gap-6">
                          <label className="flex items-center text-white">
                            <input
                              type="radio"
                              name="urgent"
                              value="Yes"
                              onChange={handleChange}
                              className="mr-2 accent-blue-300"
                            />
                            Yes
                          </label>
                          <label className="flex items-center text-white">
                            <input
                              type="radio"
                              name="urgent"
                              value="No"
                              onChange={handleChange}
                              className="mr-2 accent-blue-300"
                            />
                            No
                          </label>
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="specialNotes"
                          className="block text-white font-majer text-sm mb-1"
                        >
                          Anything we should know before arriving?
                        </label>
                        <textarea
                          id="specialNotes"
                          name="specialNotes"
                          value={formData.specialNotes}
                          onChange={handleChange}
                          rows={3}
                          className="w-full p-3 rounded-md focus:outline-none resize-none"
                        ></textarea>
                      </div>

                      {submitMessage && (
                        <div
                          className={`p-3 rounded-md text-center font-medium ${
                            submitMessage.includes("successfully")
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-red-100 text-red-800 border border-red-300"
                          }`}
                        >
                          {submitMessage}
                        </div>
                      )}

                      <div className="pt-4 space-y-3">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-majer text-xl font-normal py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          disabled={formData.selectedServices.length === 0}
                          className="w-full bg-blue-800 hover:bg-blue-900 disabled:bg-blue-600 disabled:cursor-not-allowed text-white font-majer text-xl font-normal py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
                        >
                          Next
                          <svg
                            className="w-5 h-5 ml-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      variants={stepVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="text-center mb-6">
                        <h3 className="text-white font-majer text-2xl mb-2">Order Summary</h3>
                        <p className="text-blue-200 text-sm">Please review your booking details before confirming</p>
                      </div>

                      {/* Customer Information */}
                      <div className="bg-blue-600 p-4 rounded-md">
                        <h4 className="text-white font-medium mb-2">Customer Information</h4>
                        <div className="text-blue-200 text-sm space-y-1">
                          <p><span className="font-medium">Name:</span> {formData.fullName}</p>
                          <p><span className="font-medium">Phone:</span> {formData.phone}</p>
                          <p><span className="font-medium">Email:</span> {formData.email}</p>
                          <p><span className="font-medium">Address:</span> {formData.serviceAddress}</p>
                          {formData.cityState && <p><span className="font-medium">City/State:</span> {formData.cityState}</p>}
                          {formData.postCode && <p><span className="font-medium">Post Code:</span> {formData.postCode}</p>}
                        </div>
                      </div>

                      {/* Service Details */}
                      <div className="bg-blue-600 p-4 rounded-md">
                        <h4 className="text-white font-medium mb-2">Selected Services</h4>
                        <div className="space-y-2">
                          {formData.selectedServices.map((selectedService, index) => {
                            const service = services.find(s => s.id === selectedService.serviceId);
                            if (!service) return null;
                            
                            return (
                              <div key={index} className="space-y-1">
                                <div className="text-white font-medium">{selectedService.serviceName}</div>
                                {selectedService.variables.map((variable) => {
                                  const serviceVariable = service.variables.find(v => v.id === variable.variableId);
                                  if (!serviceVariable) return null;
                                  
                                  return (
                                    <div key={variable.variableId} className="flex justify-between items-center text-blue-200 text-sm ml-4">
                                      <span>{serviceVariable.name} × {variable.quantity}</span>
                                      <span className="font-medium">${(serviceVariable.unitPrice * variable.quantity).toFixed(2)}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Frequency and Pricing */}
                      <div className="bg-blue-600 p-4 rounded-md">
                        <h4 className="text-white font-medium mb-2">Pricing Details</h4>
                        <div className="text-blue-200 text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Service Frequency:</span>
                            <span className="font-medium capitalize">{formData.serviceFrequency}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Base Price:</span>
                            <span>${formData.selectedServices.reduce((total, selectedService) => {
                              const service = services.find(s => s.id === selectedService.serviceId);
                              if (!service) return total;
                              
                              return total + selectedService.variables.reduce((serviceTotal, variable) => {
                                const serviceVariable = service.variables.find(v => v.id === variable.variableId);
                                return serviceTotal + (serviceVariable ? serviceVariable.unitPrice * variable.quantity : 0);
                              }, 0);
                            }, 0).toFixed(2)}</span>
                          </div>
                          {formData.serviceFrequency !== 'one-time' && (
                            <div className="flex justify-between">
                              <span>Frequency Multiplier:</span>
                              <span>×{formData.serviceFrequency === 'weekly' ? '4' : formData.serviceFrequency === 'bi-weekly' ? '2' : '12'}</span>
                            </div>
                          )}
                          <hr className="border-blue-400 my-2" />
                          <div className="flex justify-between text-white font-medium text-lg">
                            <span>Total Estimated Price:</span>
                            <span>${formData.estimatedPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Schedule Information */}
                      {(formData.preferredDate || formData.startTime || formData.endTime) && (
                        <div className="bg-blue-600 p-4 rounded-md">
                          <h4 className="text-white font-medium mb-2">Schedule</h4>
                          <div className="text-blue-200 text-sm space-y-1">
                            {formData.preferredDate && <p><span className="font-medium">Date:</span> {formData.preferredDate}</p>}
                            {formData.startTime && <p><span className="font-medium">Start Time:</span> {formData.startTime}</p>}
                            {formData.endTime && <p><span className="font-medium">End Time:</span> {formData.endTime}</p>}
                            {formData.urgent === 'Yes' && <p className="text-yellow-300 font-medium">⚡ Urgent Request</p>}
                          </div>
                        </div>
                      )}

                      {/* Special Notes */}
                      {formData.specialNotes && (
                        <div className="bg-blue-600 p-4 rounded-md">
                          <h4 className="text-white font-medium mb-2">Special Notes</h4>
                          <p className="text-blue-200 text-sm">{formData.specialNotes}</p>
                        </div>
                      )}

                      {submitMessage && (
                        <div
                          className={`p-3 rounded-md text-center font-medium ${
                            submitMessage.includes("successfully")
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : "bg-red-100 text-red-800 border border-red-300"
                          }`}
                        >
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
                          <svg
                            className="w-5 h-5 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white font-majer text-xl font-normal py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
                        >
                          {isSubmitting ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Confirming Booking...
                            </>
                          ) : (
                            "Confirm Booking"
                          )}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
    {/*  Conditional Overlay if the user isnt signed in yet */}
    {!user && (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-white/10 p-6 text-center backdrop-blur-sm">
        {/* The Smart Redirect Link to redirect back to the component after signin */}
        <Link 
          href="/signin?redirect=/#booking" 
          className="bg-green-500 text-white px-8 py-3 rounded-lg font-majer font-normal text-lg hover:bg-green-600 transition-colors shadow-lg"
        >
          Sign In to Book
        </Link>
      </div>
    )}
    </div>
  );
};

