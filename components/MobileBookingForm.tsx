'use client';
import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../lib/auth-context';
import { useBookingForm } from '../lib/hooks/useBookingForm';
import Link from 'next/link';
import CustomDatePicker from './CustomDatePicker';

// This is the mobile version of the form that will be positioned after the About section
export const MobileBookingForm = () => {
  const { user, loading } = useAuth();
  const {
    currentStep,
    formData,
    isSubmitting,
    submitMessage,
    services,
    loadingServices,
    unavailableDates,
    loadingDates,
    handleChange,
    addService,
    removeService,
    updateServiceQuantity,
    nextStep,
    prevStep,
    handleSubmit,
  } = useBookingForm(user);

  // Show loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8 md:hidden">
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
    exit: { opacity: 0, x: -50 }
  };

  return (
    <div className="relative md:hidden">
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
          <div className={`w-3 h-3 rounded-full ${currentStep === 3 ? 'bg-blue-500' : 'bg-blue-200'}`}></div>
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
                    placeholder="Enter your full name"
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
                    placeholder="0000 000 0000"
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
                    placeholder="Enter your email address"
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
                    placeholder="Enter your service address"
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
                    placeholder="Enter city/state"
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
                    placeholder="Enter postal code"
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
                    placeholder="Enter nearby landmark (optional)"
                  />
              </div>

              {submitMessage && submitMessage.includes("successfully") && (
                <div className="p-3 rounded-md text-center font-medium bg-green-100 text-green-800 border border-green-300">
                  {submitMessage}
                </div>
              )}

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
                {loadingServices ? (
                  <div className="text-blue-500 text-sm">Loading services...</div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {services.map((service) => {
                      const isSelected = formData.selectedServices.some(s => s.serviceId === service.id);
                      return (
                        <label key={service.id} className="flex items-center text-blue-500">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                addService(service.id, service.name);
                              } else {
                                const serviceIndex = formData.selectedServices.findIndex(s => s.serviceId === service.id);
                                if (serviceIndex !== -1) {
                                  removeService(serviceIndex);
                                }
                              }
                            }}
                            className="mr-2 accent-blue-500"
                          />
                          <span className="text-xs">{service.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
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

              {/* Dynamic Service Variables */}
              {formData.selectedServices.map((selectedService) => {
                const service = services.find(s => s.id === selectedService.serviceId);
                if (!service || !service.variables || service.variables.length === 0) return null;

                return (
                  <div key={selectedService.serviceId} className="space-y-3">
                    <h4 className="text-blue-500 font-majer text-sm font-medium">{service.name} Details</h4>
                    {service.variables.map((variable) => (
                      <div key={variable.id} className="space-y-2">
                        <label className="block text-blue-500 font-majer text-xs mb-1 font-medium">
                          {variable.name} (${variable.unitPrice} per unit)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={(() => {
                              const quantity = selectedService.variables.find(v => v.variableId === variable.id)?.quantity;
                              return quantity !== undefined ? quantity.toString() : '0';
                            })()}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === '') {
                                updateServiceQuantity(selectedService.serviceId, variable.id, 0);
                              } else {
                                const quantity = parseInt(value, 10);
                                if (!isNaN(quantity) && quantity >= 0) {
                                  updateServiceQuantity(selectedService.serviceId, variable.id, quantity);
                                }
                              }
                            }}
                            
                            placeholder="Enter quantity (0 to exclude)"
                            className="w-full p-2 rounded-md bg-blue-500 text-white placeholder-blue-200 focus:outline-none text-sm"
                          />
                        <div className="text-blue-400 text-xs">
                          {(() => {
                            const quantity = selectedService.variables.find(v => v.variableId === variable.id)?.quantity || 0;
                            return quantity > 0 
                              ? `Subtotal: $${(quantity * variable.unitPrice).toFixed(2)}`
                              : 'Not included (quantity: 0)';
                          })()}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}

              <div>
                <label htmlFor="mobilePreferredDate" className="block text-blue-500 font-majer text-sm mb-1 font-medium">Preferred Date</label>
                <CustomDatePicker
                  value={formData.preferredDate}
                  onChange={(date) => handleChange({ target: { name: 'preferredDate', value: date } } as React.ChangeEvent<HTMLInputElement>)}
                  unavailableDates={unavailableDates}
                  disabled={loadingDates}
                  className="w-full"
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
                    required
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
                    required
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
                  placeholder="Enter any special instructions or notes"
                ></textarea>
              </div>

              

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
                  type="button"
                  onClick={nextStep}
                  disabled={formData.selectedServices.length === 0}
                  className="w-full bg-blue-800 hover:bg-blue-900 disabled:bg-blue-600 disabled:cursor-not-allowed text-white font-majer text-xl font-normal py-3 px-4 rounded-md transition duration-300 flex items-center justify-center"
                >
                  Next
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-blue-800 font-majer text-lg font-medium mb-4">Order Summary</h3>
                
                {/* Customer Information */}
                <div className="mb-4">
                  <h4 className="text-blue-700 font-majer text-sm font-medium mb-2">Customer Information</h4>
                  <div className="text-blue-600 text-sm space-y-1">
                    <p><strong>Name:</strong> {formData.fullName}</p>
                    <p><strong>Phone:</strong> {formData.phone}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Address:</strong> {formData.serviceAddress}, {formData.cityState} {formData.postCode}</p>
                    {formData.landmark && <p><strong>Landmark:</strong> {formData.landmark}</p>}
                  </div>
                </div>

                {/* Selected Services */}
                <div className="mb-4">
                  <h4 className="text-blue-700 font-majer text-sm font-medium mb-2">Selected Services</h4>
                  <div className="space-y-2">
                    {formData.selectedServices.map((selectedService) => {
                      const service = services.find(s => s.id === selectedService.serviceId);
                      if (!service) return null;
                      
                      const serviceTotal = selectedService.variables.reduce((total, variable) => {
                        const serviceVariable = service.variables?.find(v => v.id === variable.variableId);
                        return total + (serviceVariable ? serviceVariable.unitPrice * variable.quantity : 0);
                      }, 0);

                      return (
                        <div key={selectedService.serviceId} className="bg-white p-3 rounded border">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-blue-800 font-medium text-sm">{service.name}</span>
                            <span className="text-blue-800 font-medium text-sm">${serviceTotal.toFixed(2)}</span>
                          </div>
                          <div className="text-blue-600 text-xs space-y-1">
                            {selectedService.variables
                              .filter((variable) => variable.quantity > 0)
                              .map((variable) => {
                                const serviceVariable = service.variables?.find(v => v.id === variable.variableId);
                                if (!serviceVariable) return null;
                                return (
                                  <div key={variable.variableId} className="flex justify-between">
                                    <span>{serviceVariable.name} x {variable.quantity}</span>
                                    <span>${(serviceVariable.unitPrice * variable.quantity).toFixed(2)}</span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pricing Details */}
                <div className="mb-4">
                  <h4 className="text-blue-700 font-majer text-sm font-medium mb-2">Pricing Details</h4>
                  <div className="bg-white p-3 rounded border space-y-2 text-sm">
                    <div className="flex justify-between text-blue-600">
                      <span>Service Frequency:</span>
                      <span>{formData.serviceFrequency}</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>Base Total:</span>
                      <span>${formData.selectedServices.reduce((total, selectedService) => {
                        const service = services.find(s => s.id === selectedService.serviceId);
                        if (!service) return total;
                        
                        return total + selectedService.variables.reduce((serviceTotal, variable) => {
                          const serviceVariable = service.variables?.find(v => v.id === variable.variableId);
                          return serviceTotal + (serviceVariable ? serviceVariable.unitPrice * variable.quantity : 0);
                        }, 0);
                      }, 0).toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between text-blue-800 font-medium">
                      <span>Estimated Total:</span>
                      <span>${(formData.selectedServices.reduce((total, selectedService) => {
                        const service = services.find(s => s.id === selectedService.serviceId);
                        if (!service) return total;
                        
                        return total + selectedService.variables.reduce((serviceTotal, variable) => {
                          const serviceVariable = service.variables?.find(v => v.id === variable.variableId);
                          return serviceTotal + (serviceVariable ? serviceVariable.unitPrice * variable.quantity : 0);
                        }, 0);
                      }, 0) * (formData.serviceFrequency === 'Weekly' ? 4 : formData.serviceFrequency === 'Bi-weekly' ? 2 : formData.serviceFrequency === 'Monthly' ? 12 : 1)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Schedule Information */}
                <div className="mb-4">
                  <h4 className="text-blue-700 font-majer text-sm font-medium mb-2">Schedule</h4>
                  <div className="text-blue-600 text-sm space-y-1">
                    {formData.preferredDate && <p><strong>Date:</strong> {formData.preferredDate}</p>}
                    {formData.startTime && <p><strong>Start Time:</strong> {formData.startTime}</p>}
                    {formData.endTime && <p><strong>End Time:</strong> {formData.endTime}</p>}
                    {formData.urgent && <p><strong>Urgent Request:</strong> {formData.urgent}</p>}
                  </div>
                </div>

                {/* Special Notes */}
                {formData.specialNotes && (
                  <div className="mb-4">
                    <h4 className="text-blue-700 font-majer text-sm font-medium mb-2">Special Notes</h4>
                    <div className="bg-white p-3 rounded border text-blue-600 text-sm">
                      {formData.specialNotes}
                    </div>
                  </div>
                )}
              </div>

              {submitMessage && !submitMessage.includes("successfully") && (
                <div className="p-3 rounded-md text-center font-medium bg-red-100 text-red-800 border border-red-300">
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
                    'Confirm Booking'
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
    {/*  Conditional Overlay if the user isnt signed in yet */}
    {!user && (
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-white/10 p-6 text-center backdrop-blur-sm">
        {/* The Smart Redirect Link to redirect back to the component after signin */}
        <Link 
          href="/signin?redirect=/#MobileBookingForm" 
          className="bg-green-500 text-white px-8 py-3 rounded-lg font-majer font-normal text-lg hover:bg-green-600 transition-colors shadow-lg"
        >
          Sign In to Book
        </Link>
      </div>
    )}
    </div>
  );
};