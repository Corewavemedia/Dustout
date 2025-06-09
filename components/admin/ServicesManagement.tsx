"use client";
import React, { useState, useEffect } from "react";
import { services } from "../data/ServicesData";

interface ServiceVariable {
  id: string;
  variable: string;
  amount: number;
}

interface ServiceData {
  id: number;
  title: string;
  numberOfBookings: number;
  staff: string;
  revenueGenerated: string;
  actions: string;
}

const ServicesManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [serviceVariables, setServiceVariables] = useState<ServiceVariable[]>([
    { id: "1", variable: "1 bedroom", amount: 30 },
    { id: "2", variable: "2 bedroom", amount: 60 },
  ]);
  const [newVariable, setNewVariable] = useState<string>("");
  const [newAmount, setNewAmount] = useState<string>("");
  const [serviceName, setServiceName] = useState<string>("");
  const [serviceDescription, setServiceDescription] = useState<string>("");
  const [selectedServiceForVariables, setSelectedServiceForVariables] = useState<string>("");

  // Sample service data for the table
  const serviceData: ServiceData[] = [
    {
      id: 1,
      title: "Fumigation",
      numberOfBookings: 648,
      staff: "James Jackson",
      revenueGenerated: "$400.00",
      actions: "",
    },
    {
      id: 2,
      title: "Residential Cleaning",
      numberOfBookings: 532,
      staff: "Sarah Johnson",
      revenueGenerated: "$350.00",
      actions: "",
    },
    {
      id: 3,
      title: "Industrial Cleaning",
      numberOfBookings: 421,
      staff: "Michael Brown",
      revenueGenerated: "$620.00",
      actions: "",
    },
    {
      id: 4,
      title: "Landscaping",
      numberOfBookings: 389,
      staff: "Emily Davis",
      revenueGenerated: "$480.00",
      actions: "",
    },
    {
      id: 5,
      title: "Deep Cleaning",
      numberOfBookings: 275,
      staff: "Robert Wilson",
      revenueGenerated: "$520.00",
      actions: "",
    },
  ];

  // Update the selected service for variables when a service is selected
  useEffect(() => {
    if (selectedService) {
      setSelectedServiceForVariables(selectedService);
    }
  }, [selectedService]);

  const handleAddVariable = () => {
    if (newVariable && newAmount) {
      const newId = (serviceVariables.length + 1).toString();
      setServiceVariables([
        ...serviceVariables,
        { id: newId, variable: newVariable, amount: parseFloat(newAmount) },
      ]);
      setNewVariable("");
      setNewAmount("");
    }
  };

  const handleRemoveVariable = (id: string) => {
    setServiceVariables(serviceVariables.filter(variable => variable.id !== id));
  };

  const handleAddService = () => {
    // This function will be implemented when backend integration is done
    // For now, just reset the form
    setServiceName("");
    setServiceDescription("");
    setServiceVariables([
      { id: "1", variable: "1 bedroom", amount: 30 },
      { id: "2", variable: "2 bedroom", amount: 60 },
    ]);
  };

  const filteredServices = serviceData.filter(service =>
    service.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-2 bg-sky-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white p-6 rounded-lg mb-6">
            <h1 className="text-2xl font-normal mb-4 text-center font-majer">
              Manage Services
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#DEEDFF] backdrop-blur-sm p-2 rounded-lg flex items-center">
                <div className="rounded-lg mr-2">
                  <svg
                    width="37"
                    height="37"
                    viewBox="0 0 37 37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_552_505)">
                      <path
                        d="M13.625 22.3539C14.2692 21.8701 15.0698 21.5833 15.9375 21.5833C18.0661 21.5833 19.7917 23.3089 19.7917 25.4375C19.7917 26.3051 19.505 27.1059 19.0211 27.75M32.125 22.3539C31.4809 21.8701 30.6801 21.5833 29.8125 21.5833C27.6839 21.5833 25.9583 23.3089 25.9583 25.4375C25.9583 26.3051 26.2451 27.1059 26.7289 27.75M32.1248 10.7916C33.6486 10.7904 34.4474 10.7711 35.0665 10.4556C35.6466 10.16 36.1184 9.68831 36.4139 9.10814C36.75 8.44858 36.75 7.58515 36.75 5.85833V4.93333C36.75 3.20651 36.75 2.34309 36.4139 1.68353C36.1184 1.10336 35.6466 0.631667 35.0665 0.336068C34.407 -1.14863e-07 33.5435 0 31.8167 0H13.9333C12.2065 0 11.3431 -1.14863e-07 10.6835 0.336068C10.1034 0.631667 9.63167 1.10336 9.33607 1.68353C9 2.34309 9 3.20651 9 4.93333V5.85833C9 7.58515 9 8.44858 9.33607 9.10814C9.63167 9.68831 10.1034 10.16 10.6835 10.4556C11.3026 10.7711 12.1013 10.7904 13.6251 10.7916M32.1248 10.7916C32.125 10.8913 32.125 10.9939 32.125 11.1V22.8167C32.125 24.5435 32.125 25.407 31.7889 26.0665C31.4934 26.6466 31.0216 27.1184 30.4415 27.4139C29.782 27.75 28.9185 27.75 27.1917 27.75H18.5583C16.8315 27.75 15.9681 27.75 15.3085 27.4139C14.7284 27.1184 14.2567 26.6466 13.9611 26.0665C13.625 25.407 13.625 24.5435 13.625 22.8167V11.1C13.625 10.9939 13.625 10.8913 13.6251 10.7916M32.1248 10.7916C32.1238 9.26793 32.1043 8.46927 31.7889 7.8502C31.4934 7.27002 31.0216 6.79833 30.4415 6.50273C29.782 6.16667 28.9185 6.16667 27.1917 6.16667H18.5583C16.8315 6.16667 15.9681 6.16667 15.3085 6.50273C14.7284 6.79833 14.2567 7.27002 13.9611 7.8502C13.6456 8.46927 13.6263 9.26793 13.6251 10.7916M25.9583 13.875C25.9583 15.5779 24.5779 16.9583 22.875 16.9583C21.1721 16.9583 19.7917 13.875 19.7917 13.875C19.7917 12.1721 21.1721 10.7917 22.875 10.7917C24.5779 10.7917 25.9583 12.1721 25.9583 13.875Z"
                        stroke="#538FDF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_552_505">
                        <rect width="37" height="37" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#171AD4] font-majer opacity-80">
                    Revenue
                  </p>
                  <p className="text-xl font-normal font-majer text-[#12B368]">
                    230,548.00
                  </p>
                </div>
              </div>

              <div className="bg-[#DEEDFF] backdrop-blur-sm p-2 rounded-lg flex items-center">
                <div className="rounded-lg mr-2">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 5C17.9635 5 15.5 7.49554 15.5 10.5714C15.5 13.6473 17.9635 16.1429 21 16.1429C24.0365 16.1429 26.5 13.6473 26.5 10.5714C26.5 7.49554 24.0365 5 21 5ZM18.25 18C13.681 18 10 21.7288 10 26.3571V27.2857C10 29.346 11.6328 31 13.6667 31H28.3333C30.3672 31 32 29.346 32 27.2857V26.3571C32 21.7288 28.319 18 23.75 18H18.25Z"
                      fill="#538FDF"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#171AD4] font-majer opacity-80">
                    Clients
                  </p>
                  <p className="text-xl font-normal font-majer text-[#12B368]">
                    230,548.00
                  </p>
                </div>
              </div>

              <div className="bg-[#DEEDFF] backdrop-blur-sm p-2 rounded-lg flex items-center">
                <div className="rounded-lg mr-2">
                  <svg
                    width="40"
                    height="43"
                    viewBox="0 0 40 43"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.2995 6.45H12.1865C10.8351 6.45 9.72949 7.63738 9.72949 9.08863V32.8364C9.72949 34.2876 10.8351 35.475 12.1865 35.475H34.2995C35.6509 35.475 36.7565 34.2876 36.7565 32.8364V9.08863C36.7565 7.63738 35.6509 6.45 34.2995 6.45ZM14.6435 13.0466C14.6435 12.6508 14.8892 12.3869 15.2577 12.3869H21.4003C21.7688 12.3869 22.0145 12.6508 22.0145 13.0466V19.6432C22.0145 20.039 21.7688 20.3028 21.4003 20.3028H15.2577C14.8892 20.3028 14.6435 20.039 14.6435 19.6432V13.0466ZM29.3855 30.1977C29.3855 30.5935 29.1398 30.8574 28.7713 30.8574H15.2577C14.8892 30.8574 14.6435 30.5935 14.6435 30.1977V28.8784C14.6435 28.4826 14.8892 28.2187 15.2577 28.2187H28.7713C29.1398 28.2187 29.3855 28.4826 29.3855 28.8784V30.1977ZM31.8425 24.9205C31.8425 25.3162 31.5968 25.5801 31.2283 25.5801H15.2577C14.8892 25.5801 14.6435 25.3162 14.6435 24.9205V23.6011C14.6435 23.2053 14.8892 22.9415 15.2577 22.9415H31.2283C31.5968 22.9415 31.8425 23.2053 31.8425 23.6011V24.9205ZM31.8425 19.6432C31.8425 20.039 31.5968 20.3028 31.2283 20.3028H25.0858C24.7172 20.3028 24.4715 20.039 24.4715 19.6432V18.3239C24.4715 17.9281 24.7172 17.6642 25.0858 17.6642H31.2283C31.5968 17.6642 31.8425 17.9281 31.8425 18.3239V19.6432ZM31.8425 14.3659C31.8425 14.7617 31.5968 15.0256 31.2283 15.0256H25.0858C24.7172 15.0256 24.4715 14.7617 24.4715 14.3659V13.0466C24.4715 12.6508 24.7172 12.3869 25.0858 12.3869H31.2283C31.5968 12.3869 31.8425 12.6508 31.8425 13.0466V14.3659Z"
                      fill="#538FDF"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-80 text-[#171AD4] font-majer">
                    Bookings
                  </p>
                  <p className="text-xl font-normal text-[#12B368] font-majer">
                    230,548.00
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-majer text-[#538FDF]">Services</h2>
             
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Number of Bookings
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Staff
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue Generated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.map((service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.numberOfBookings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.staff}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {service.revenueGenerated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button 
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => setSelectedService(service.title)}
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M11.3333 2.00004C11.5084 1.82494 11.7163 1.68605 11.9451 1.59129C12.1739 1.49653 12.4191 1.44775 12.6667 1.44775C12.9143 1.44775 13.1595 1.49653 13.3883 1.59129C13.617 1.68605 13.825 1.82494 14 2.00004C14.1751 2.17513 14.314 2.38308 14.4088 2.61187C14.5035 2.84066 14.5523 3.08581 14.5523 3.33337C14.5523 3.58094 14.5035 3.82609 14.4088 4.05488C14.314 4.28367 14.1751 4.49162 14 4.66671L5 13.6667L1.33333 14.6667L2.33333 11L11.3333 2.00004Z"
                                stroke="#538FDF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M2 4H3.33333H14"
                                stroke="#538FDF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M5.33334 4.00004V2.66671C5.33334 2.31309 5.47381 1.97395 5.7239 1.7239C5.97399 1.47385 6.31311 1.33337 6.66668 1.33337H9.33334C9.68691 1.33337 10.026 1.47385 10.2761 1.7239C10.5262 1.97395 10.6667 2.31309 10.6667 2.66671V4.00004M12.6667 4.00004V13.3334C12.6667 13.687 12.5262 14.0261 12.2761 14.2762C12.026 14.5262 11.6869 14.6667 11.3333 14.6667H4.66668C4.31311 14.6667 3.97399 14.5262 3.7239 14.2762C3.47381 14.0261 3.33334 13.687 3.33334 13.3334V4.00004H12.6667Z"
                                stroke="#538FDF"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white p-4 shadow-md hidden md:block">
          <div className="mb-4">
            <h2 className="text-lg font-majer text-red-500 mb-2">• Add Services</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Fumigation"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Icon</label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">drag or click to upload</span>
                <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">Upload</button>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Service description..."
              ></textarea>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">Variables</h3>
              {selectedServiceForVariables && (
                <div className="text-sm text-blue-500">
                  For: {selectedServiceForVariables}
                </div>
              )}
            </div>
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {serviceVariables.map((variable) => (
                <div key={variable.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium">{variable.variable}</p>
                    <p className="text-sm text-gray-500">${variable.amount}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveVariable(variable.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Add Variable</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newVariable}
                  onChange={(e) => setNewVariable(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="3 bedroom"
                />
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="$"
                />
              </div>
              <button
                onClick={handleAddVariable}
                className="mt-2 w-full bg-blue-500 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-600 transition-colors"
              >
                + Add Variable
              </button>
            </div>
            <button
              onClick={handleAddService}
              className="w-full bg-green-500 text-white px-3 py-2 rounded-md text-sm hover:bg-green-600 transition-colors"
            >
              Add Service
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Service Selection (only visible on mobile) */}
      <div className="md:hidden bg-white p-4 shadow-md mb-4 rounded-lg">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Service</label>
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.id} value={service.title}>
              {service.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ServicesManagement;