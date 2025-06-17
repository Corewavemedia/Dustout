import React, { useState, useEffect } from 'react';

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

interface EditClientSidebarProps {
  client: Client | null;
  isEditMode: boolean;
  onSave: (client: Client) => void;
}

const EditClientSidebar: React.FC<EditClientSidebarProps> = ({ client, isEditMode, onSave }) => {
  const [formData, setFormData] = useState<Client>({
    id: '',
    clientName: '',
    dateAndTime: '',
    servicesOrdered: '',
    address: '',
    revenue: '',
    email: '',
    phoneNumber: '',
    specialInstructions: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Update form data when client changes
  useEffect(() => {
    if (client) {
      setFormData(client);
    } else if (isEditMode) {
      // Reset form for new client
      setFormData({
        id: (Math.floor(Math.random() * 9000) + 1000).toString(), // Generate random ID
        clientName: '',
        dateAndTime: '',
        servicesOrdered: '',
        address: '',
        revenue: '',
        email: '',
        phoneNumber: '',
        specialInstructions: ''
      });
    }
  }, [client, isEditMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const response = await fetch('/api/admin/clients', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: formData.id,
          clientName: formData.clientName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          address: formData.address,
          specialInstructions: formData.specialInstructions,
          revenue: formData.revenue
        }),
      });
      
      if (response.ok) {
        setSuccessMessage('Client updated successfully!');
        setTimeout(() => setSuccessMessage(null), 3000); // Clear success message after 3 seconds
        onSave(formData); // Call the parent callback to update UI
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update client');
      }
    } catch {
      setError('An error occurred while updating the client');
    } finally {
      setSubmitting(false);
    }
  };

  // Split the client name into first and last name for the form
  const nameParts = formData.clientName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const updateName = (first: string, last: string) => {
    setFormData(prev => ({
      ...prev,
      clientName: `${first} ${last}`.trim()
    }));
  };

  return (
    <div className="w-72 bg-white shadow-lg overflow-y-auto font-majer hidden md:block">
      <div className="p-6">
        {/* Upload Picture Section */}
        {/* <div className="mb-6">
          <div className="w-24 h-24 bg-blue-200 rounded-lg flex flex-col items-center justify-center mx-auto mb-4">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M19.5556 42H28.4444C34.6866 42 37.8076 42 40.0496 40.5292C41.02 39.8924 41.8534 39.0742 42.502 38.1214C44 35.9202 44 32.8558 44 26.7272C44 20.5988 44 17.5344 42.502 15.3332C41.8534 14.3803 41.02 13.5621 40.0496 12.9254C38.6088 11.9803 36.8054 11.6425 34.044 11.5217C32.7262 11.5217 31.5918 10.5414 31.3334 9.27272C30.9456 7.36978 29.2438 6 27.2674 6H20.7326C18.7561 6 17.0543 7.36978 16.6667 9.27272C16.4082 10.5414 15.2737 11.5217 13.956 11.5217C11.1947 11.6425 9.3911 11.9803 7.95048 12.9254C6.9799 13.5621 6.14656 14.3803 5.49804 15.3332C4 17.5344 4 20.5988 4 26.7272C4 32.8558 4 35.9202 5.49804 38.1214C6.14656 39.0742 6.9799 39.8924 7.95048 40.5292C10.1925 42 13.3135 42 19.5556 42ZM24 18.5455C19.3976 18.5455 15.6667 22.2086 15.6667 26.7272C15.6667 31.246 19.3976 34.909 24 34.909C28.6024 34.909 32.3334 31.246 32.3334 26.7272C32.3334 22.2086 28.6024 18.5455 24 18.5455ZM24 21.8182C21.2386 21.8182 19 24.016 19 26.7272C19 29.4384 21.2386 31.6364 24 31.6364C26.7614 31.6364 29 29.4384 29 26.7272C29 24.016 26.7614 21.8182 24 21.8182ZM33.4444 20.1818C33.4444 19.2781 34.1906 18.5455 35.1112 18.5455H37.3334C38.2538 18.5455 39 19.2781 39 20.1818C39 21.0856 38.2538 21.8182 37.3334 21.8182H35.1112C34.1906 21.8182 33.4444 21.0856 33.4444 20.1818Z"
                fill="white"
              />
            </svg>
            <p className="text-center text-xs text-white">
              Upload Picture
            </p>
          </div>
        </div> */}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#538FDF] mb-1">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => updateName(e.target.value, lastName)}
                className="w-full p-2 bg-[#E8F2FF] text-[#538FDF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-[#538FDF] mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => updateName(firstName, e.target.value)}
                className="w-full p-2 bg-[#E8F2FF] text-[#538FDF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#538FDF] mb-1">
              Revenue
            </label>
            <input
              type="text"
              name="revenue"
              value={formData.revenue}
              onChange={handleChange}
              className="w-full p-2 bg-[#E8F2FF] text-[#538FDF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-[#538FDF] mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 bg-[#E8F2FF] text-[#538FDF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-[#538FDF] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 bg-[#E8F2FF] text-[#538FDF] rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-[#538FDF] mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-full p-2 bg-[#E8F2FF] text-[#538FDF] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-[#538FDF] mb-1">
              Special Instructions
            </label>
            <textarea
              name="specialInstructions"
              value={formData.specialInstructions}
              onChange={handleChange}
              className="w-full p-2 bg-[#E8F2FF] text-[#538FDF] focus:outline-none focus:ring-2 focus:ring-blue-500 rounded text-sm"
              rows={3}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-600 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-3 mt-6">
            <button 
              disabled={submitting}
              type="submit"
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                submitting 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-[#12B368] text-white hover:bg-green-600'
              }`}
            >
              {submitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Saving Changes...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientSidebar;