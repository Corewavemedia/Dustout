import React, { useState } from "react";

interface Client {
  id: string;
  clientName: string;
  dateAndTime: string;
  servicesOrdered: string;
  address: string;
  revenue: string;
  email: string;
  phoneNumber: string;
  specialInstructions?: string;
}

interface ClientsListProps {
  onEditModeChange?: (isEditMode: boolean) => void;
  onSelectClient: (client: Client) => void;
  searchTerm: string;
}

const ClientsList: React.FC<ClientsListProps> = ({ 
  onEditModeChange, 
  onSelectClient,
  searchTerm 
}) => {
  // Sample client data based on the image
  const [clientsList, setClientsList] = useState<Client[]>([
    {
      id: "0214",
      clientName: "Janet Doe",
      dateAndTime: "23rd June 2023 1:00-4:00pm",
      servicesOrdered: "Landscaping",
      address: "London Heathrow",
      revenue: "£400.00",
      email: "janet@gmail.com",
      phoneNumber: "+44560123456",
      specialInstructions: ""
    },
    {
      id: "0215",
      clientName: "Janet Doe",
      dateAndTime: "23rd June 2023 1:00-4:00pm",
      servicesOrdered: "Landscaping",
      address: "Johnson Security",
      revenue: "£450.00",
      email: "janet@gmail.com",
      phoneNumber: "+44560123456",
      specialInstructions: ""
    },
    {
      id: "0216",
      clientName: "Janet Doe",
      dateAndTime: "23rd June 2023 1:00-4:00pm",
      servicesOrdered: "Landscaping",
      address: "Johnson Security",
      revenue: "£450.00",
      email: "janet@gmail.com",
      phoneNumber: "+44560123456",
      specialInstructions: ""
    },
    {
      id: "0217",
      clientName: "Janet Doe",
      dateAndTime: "23rd June 2023 1:00-4:00pm",
      servicesOrdered: "Landscaping",
      address: "London Heathrow",
      revenue: "£400.00",
      email: "janet@gmail.com",
      phoneNumber: "+44560123456",
      specialInstructions: ""
    },
    {
      id: "0218",
      clientName: "Janet Doe",
      dateAndTime: "23rd June 2023 1:00-4:00pm",
      servicesOrdered: "Landscaping",
      address: "Johnson Security",
      revenue: "£450.00",
      email: "janet@gmail.com",
      phoneNumber: "+44560123456",
      specialInstructions: ""
    },
    {
      id: "0219",
      clientName: "Janet Doe",
      dateAndTime: "23rd June 2023 1:00-4:00pm",
      servicesOrdered: "Landscaping",
      address: "Johnson Security",
      revenue: "£450.00",
      email: "janet@gmail.com",
      phoneNumber: "+44560123456",
      specialInstructions: ""
    },
  ]);

  const handleDeleteClient = (clientId: string) => {
    setClientsList((prev) => prev.filter((client) => client.id !== clientId));
  };

  const filteredClients = clientsList.filter(
    (client) =>
      client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.servicesOrdered.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Table Header */}
      <div className="bg-[#538FDF] text-white">
        <div className="grid grid-cols-7 font-majer gap-4 p-4 font-medium text-sm">
          <div>ID</div>
          <div>Client Name</div>
          <div>Date and Time</div>
          <div>Services Ordered</div>
          <div>Address</div>
          <div>Revenue</div>
          <div></div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {filteredClients.map((client) => (
          <div
            key={client.id}
            className="grid grid-cols-7 font-majer gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => onSelectClient(client)}
          >
            <div className="flex items-center text-[#538FDF]">
              {client.id}
            </div>
            <div className="font-medium flex items-center text-[#538FDF]">
              {client.clientName}
            </div>
            <div className="flex items-center text-[#538FDF]">
              {client.dateAndTime}
            </div>
            <div className="flex items-center text-[#538FDF]">
              {client.servicesOrdered}
            </div>
            <div className="flex items-center text-[#538FDF]">
              {client.address}
            </div>
            <div className="flex items-center text-[#538FDF]">
              {client.revenue}
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this client?")) {
                    handleDeleteClient(client.id);
                  }
                }}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Client"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12H22L20.7162 23.5545C20.6248 24.3774 19.9291 25 19.1011 25H11.8989C11.0709 25 10.3753 24.3774 10.2838 23.5545L9 12Z"
                    stroke="#538FDF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12.1208 9.14716C12.3959 8.44685 12.9831 8 13.6283 8H18.3717C19.0169 8 19.6041 8.44685 19.8792 9.14716L21 12H11L12.1208 9.14716Z"
                    stroke="#538FDF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M7 12H24"
                    stroke="#538FDF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 16V20"
                    stroke="#538FDF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 16V20"
                    stroke="#538FDF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectClient(client);
                }}
                className="p-2 text-[#538FDF] hover:bg-blue-50 rounded-lg transition-colors"
                title="Edit Client"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_538_169)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 14.6429H15V13.222H0V14.6429ZM7.3815 10.3802H4.5V7.46451L11.8793 0.357178L15 3.29701L7.3815 10.3802Z"
                      fill="#538FDF"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_538_169">
                      <rect width="15" height="15" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsList;