"use client";
import React, { useState } from "react";
import UpcomingBookingSidebar from "./UpcomingBookingSidebar";

interface InvoiceItem {
  id: string;
  service: string;
  variable: string;
  amount: number;
}

interface InvoiceHistoryItem {
  id: string;
  clientName: string;
  dateAndTime: string;
  service: string;
  staff: string;
  amount: string;
}

const GenerateInvoice: React.FC = () => {
  // State for form fields
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [staff, setStaff] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedVariable, setSelectedVariable] = useState("");
  const [amount, setAmount] = useState("");

  // State for invoice items
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);

  // Sample invoice history data
  const invoiceHistory: InvoiceHistoryItem[] = [
    {
      id: "0014",
      clientName: "Jacob Doe",
      dateAndTime: "23rd June 2023 3:00-4:00pm",
      service: "Landscaping",
      staff: "Johnson Brantly",
      amount: "$450.00",
    },
  ];

  // Function to add service to invoice
  const handleAddService = () => {
    if (selectedService && selectedVariable && amount) {
      const newItem: InvoiceItem = {
        id: Date.now().toString(),
        service: selectedService,
        variable: selectedVariable,
        amount: parseFloat(amount),
      };
      setInvoiceItems([...invoiceItems, newItem]);

      // Reset fields
      setSelectedService("");
      setSelectedVariable("");
      setAmount("");
    }
  };

  // Function to generate invoice
  const handleGenerateInvoice = () => {
    // This would be implemented with backend integration
    console.log("Generating invoice for", clientName);
    console.log("Invoice items:", invoiceItems);

    // Reset form after submission
    setClientName("");
    setAddress("");
    setStaff("");
    setPhoneNumber("");
    setEmail("");
    setInvoiceItems([]);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-2 bg-sky-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white p-6 rounded-lg mb-6">
            <h1 className="text-2xl font-normal mb-4 text-center font-majer">
              Generate Invoice
            </h1>
          </div>

          {/* Invoice Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium font-majer text-[#538FDF] mb-1">
                  Name of Client
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2 border border-[#538FDF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-majer text-[#538FDF]  mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full p-2 border border-[#538FDF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium font-majer text-[#538FDF]  mb-1">
                  Staff
                </label>
                <input
                  type="text"
                  value={staff}
                  onChange={(e) => setStaff(e.target.value)}
                  className="w-full p-2 border border-[#538FDF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-majer text-[#538FDF]  mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full p-2 border border-[#538FDF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium font-majer text-[#538FDF]  mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-[#538FDF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium font-majer text-[#538FDF]  mb-1">
                  Service
                </label>
                <input
                  type="text"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full p-2 border border-[#538FDF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-majer text-[#538FDF]  mb-1">
                  Variable
                </label>
                <input
                  type="text"
                  value={selectedVariable}
                  onChange={(e) => setSelectedVariable(e.target.value)}
                  className="w-full p-2 border border-[#538FDF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium font-majer text-[#538FDF]  mb-1">
                  Amount
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-2 border border-[#538FDF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-center mb-4">
              <button
                onClick={handleAddService}
                className="bg-[#E8F2FF] text-[#538FDF] px-6 py-2 rounded-lg font-medium font-majer hover:bg-blue-100 transition-colors w-full"
              >
                Add Service
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
              <button
                onClick={handleGenerateInvoice}
                className="bg-[#538FDF] text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-colors w-full"
              >
                Generate Invoice
              </button>
            </div>

            <div>
              <button className="bg-white border border-gray-300 font-majer text-[#538FDF] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors w-full">
                Cancel
              </button>
            </div>
            </div>
          </div>

          {/* Invoice History */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <h2 className="text-lg font-majer text-[#12B368] mb-4">
              Invoice History
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#538FDF] text-white font-majer">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                      Client Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                      Date and Time
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                      Staff
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoiceHistory.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-majer text-[#538FDF]">
                        {invoice.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                        {invoice.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                        {invoice.dateAndTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                        {invoice.service}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                        {invoice.staff}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                        {invoice.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden md:block">
          <UpcomingBookingSidebar />
        </div>
      </div>
    </div>
  );
};

export default GenerateInvoice;
