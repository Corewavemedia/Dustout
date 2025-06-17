import React, { useState, useEffect } from "react";

interface Service {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

interface AddStaffSidebarProps {
  onStaffAdded?: () => void;
}

export const AddStaffSidebar: React.FC<AddStaffSidebarProps> = ({ onStaffAdded }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    salary: '',
    email: '',
    phoneNumber: '',
    address: '',
    staffImage: '',
    servicesRendered: [] as string[]
  });
  const [imagePreview, setImagePreview] = useState<string>('');

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      setServicesError(null);
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      } else {
        setServicesError('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setServicesError('Failed to fetch services');
    } finally {
      setServicesLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServiceToggle = (serviceName: string) => {
    setFormData(prev => ({
      ...prev,
      servicesRendered: prev.servicesRendered.includes(serviceName)
        ? prev.servicesRendered.filter(s => s !== serviceName)
        : [...prev.servicesRendered, serviceName]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setImagePreview(base64String);
        setFormData(prev => ({
          ...prev,
          staffImage: base64String
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({
      ...prev,
      staffImage: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newStaff = await response.json();
        console.log('Staff added successfully:', newStaff);
        alert('Staff added successfully!');
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          role: '',
          salary: '',
          email: '',
          phoneNumber: '',
          address: '',
          staffImage: '',
          servicesRendered: []
        });
        setImagePreview('');
        
        // Notify parent component to refresh staff list
        if (onStaffAdded) {
          onStaffAdded();
        }
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      alert('Failed to add staff. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
        <div className="w-72 bg-white shadow-lg overflow-y-auto font-majer hidden md:block">
          <div className="p-6">
            {/* Upload Picture Section */}
            <div className="mb-6">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Staff Preview"
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-200 rounded-lg flex flex-col items-center justify-center">
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
                )}
                
                {/* Upload/Remove buttons */}
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  <label className="bg-blue-600 text-white rounded-full p-1 cursor-pointer shadow-md hover:bg-blue-700 transition-colors">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#538FDF] mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-[#E8F2FF] rounded text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#538FDF] mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-[#E8F2FF] rounded text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#538FDF] mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-[#E8F2FF] rounded text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#538FDF] mb-1">
                    Salary
                  </label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-[#E8F2FF] rounded text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#538FDF] mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-[#E8F2FF] rounded text-sm"
                    required
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
                    onChange={handleInputChange}
                    className="w-full p-2 bg-[#E8F2FF] rounded text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-xs text-[#538FDF] mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 bg-[#E8F2FF] rounded text-sm"
                    required
                  />
                </div>
              </div>

              {/* Services Section */}
              <div>
                <label className="block text-xs text-[#538FDF] mb-2">
                  Services Rendered
                </label>
                
                {/* Services Error Message */}
                {servicesError && (
                  <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-xs">
                    {servicesError}
                    <button 
                      onClick={() => setServicesError(null)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                )}

                {/* Services Loading/Content */}
                {servicesLoading ? (
                  <div className="flex justify-center items-center py-4">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#538FDF]"></div>
                    <span className="ml-2 text-xs text-gray-600">Loading services...</span>
                  </div>
                ) : services.length === 0 ? (
                  <div className="text-center py-4 text-xs text-gray-500">
                    No services available
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs text-[#538FDF]">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-2"
                          checked={formData.servicesRendered.includes(service.name)}
                          onChange={() => handleServiceToggle(service.name)}
                        />
                        <span>{service.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add Staff Button */}
              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#12B368] text-white py-3 rounded-lg font-medium mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {isLoading ? 'Adding Staff...' : '+ Add Staff'}
              </button>
            </form>
          </div>
        </div>
    </>
  )
}

export default AddStaffSidebar