import React, { useState, useEffect } from "react";

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
  refreshTrigger: number;
}

const ClientsList: React.FC<ClientsListProps> = ({ 
  onSelectClient,
  searchTerm,
  refreshTrigger
}) => {
  const [clientsList, setClientsList] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch clients data from API
  useEffect(() => {
    fetchClients();
  }, [refreshTrigger]);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/clients');

      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      const data = await response.json();
      setClientsList(data.clients || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch clients');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      setDeleteLoading(clientId);
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch(`/api/admin/clients?id=${clientId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setClientsList((prev) => prev.filter((client) => client.id !== clientId));
        setSuccessMessage('Client deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete client');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error deleting client');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredClients = clientsList.filter(
    (client) =>
      client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.servicesOrdered.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-majer text-[#12B368] mb-4">
        Clients List
      </h2>
      
      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
          <button 
            onClick={() => setError(null)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}
      
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#538FDF]"></div>
          <span className="ml-2 text-gray-600">Loading clients...</span>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No clients found
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-[#538FDF] text-white font-majer">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">Client Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">Date and Time</th>
              <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">Services Ordered</th>
              <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">Address</th>
              <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">Revenue</th>
              <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredClients.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onSelectClient(client)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-majer text-[#538FDF]">
                  {client.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                  {client.clientName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                  {client.dateAndTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                  {client.servicesOrdered}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                  {client.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                  {client.revenue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Are you sure you want to delete this client?")) {
                          handleDeleteClient(client.id);
                        }
                      }}
                      disabled={deleteLoading === client.id}
                      className={`p-2 rounded-lg transition-colors ${
                        deleteLoading === client.id 
                          ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                          : 'text-red-500 hover:bg-red-50'
                      }`}
                      title={deleteLoading === client.id ? "Deleting..." : "Delete Client"}
                    >
                      {deleteLoading === client.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400"></div>
                      ) : (
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
                      )}
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
                </td>
              </tr>
             ))}
           </tbody>
         </table>
       </div>
      )}
     </div>
   );
};

export default ClientsList;