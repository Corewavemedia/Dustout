import React, { useState, useEffect } from "react";
import UpcomingBookingSidebar from "./UpcomingBookingSidebar";

interface EditStaffViewProps {
  staff: DatabaseStaff | null;
  onSave: (staff: DatabaseStaff) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

interface DatabaseStaff {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  servicesRendered: string[];
  salary: string;
  email: string;
  phoneNumber: string;
  address: string;
  staffImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
}

export const EditStaff: React.FC<EditStaffViewProps> = ({
  staff,
  onSave,
  // onCancel,
  onDelete,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<DatabaseStaff>({
    id: staff?.id || "",
    firstName: staff?.firstName || "",
    lastName: staff?.lastName || "",
    role: staff?.role || "",
    servicesRendered: staff?.servicesRendered || [],
    salary: staff?.salary || "",
    email: staff?.email || "",
    phoneNumber: staff?.phoneNumber || "",
    address: staff?.address || "",
    staffImage: staff?.staffImage || "",
    createdAt: staff?.createdAt || "",
    updatedAt: staff?.updatedAt || "",
  });
  const [imagePreview, setImagePreview] = useState<string>(staff?.staffImage || "");

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    if (staff) {
      setFormData({
        id: staff.id,
        firstName: staff.firstName,
        lastName: staff.lastName,
        role: staff.role,
        servicesRendered: staff.servicesRendered || [],
        salary: staff.salary,
        email: staff.email,
        phoneNumber: staff.phoneNumber,
        address: staff.address,
        staffImage: staff.staffImage || "",
        createdAt: staff.createdAt,
        updatedAt: staff.updatedAt,
      });
      setImagePreview(staff.staffImage || "");
    }
  }, [staff]);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data.services || []);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      servicesRendered: prev.servicesRendered.includes(service)
        ? prev.servicesRendered.filter((s) => s !== service)
        : [...prev.servicesRendered, service],
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
    setImagePreview("");
    setFormData(prev => ({
      ...prev,
      staffImage: ""
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/staff', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedStaff = await response.json();
        onSave(updatedStaff);
        alert('Staff updated successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating staff:', error);
      alert('Failed to update staff. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!staff?.id) return;
    
    if (confirm('Are you sure you want to delete this staff member?')) {
      setIsLoading(true);
      
      try {
        const response = await fetch(`/api/staff?id=${staff.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          if (onDelete) {
            onDelete();
          }
          alert('Staff deleted successfully!');
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.error}`);
        }
      } catch (error) {
        console.error('Error deleting staff:', error);
        alert('Failed to delete staff. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-3 bg-sky-50">
          {/* Staff Info Card */}
          <div className="bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white p-8 rounded-lg mb-6 flex items-center">
            {/* Profile Picture */}
            <div className="relative w-24 h-24 mr-8">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Staff Profile"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-blue-300 rounded-lg flex items-center justify-center">
                  <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold font-majer text-white">
                      {formData.firstName ? formData.firstName.charAt(0) : "S"}
                    </span>
                  </div>
                </div>
              )}
              
              {/* Upload/Remove buttons */}
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <label className="bg-white text-blue-600 rounded-full p-1 cursor-pointer shadow-md hover:bg-blue-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Staff Info */}
            <div>
              <h1 className="text-3xl font-normal font-majer mb-2">
                {`${formData.firstName} ${formData.lastName}` || "Staff Name"}
              </h1>
              <p className="text-blue-100 font-majer text-lg">
                {formData.role}
              </p>
            </div>
          </div>

          {/* Edit Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white font-majer rounded-lg shadow-sm p-6"
          >
            <div className="grid grid-cols-2 gap-6 mb-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-[#538FDF] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#E8F2FF] text-[#538FDF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John"
                />
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-[#538FDF] mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#E8F2FF] text-[#538FDF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Doe"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-[#538FDF] mb-2">
                  Role
                </label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#E8F2FF] text-[#538FDF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Head Cleaner"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-[#538FDF] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#E8F2FF] text-[#538FDF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="123456789"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#538FDF] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#E8F2FF] text-[#538FDF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="headcleaner@dustout.com"
                />
              </div>

              {/* Salary */}
              <div>
                <label className="block text-sm font-medium text-[#538FDF] mb-2">
                  Salary
                </label>
                <input
                  type="text"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#E8F2FF] text-[#538FDF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#538FDF] mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-[#E8F2FF] text-[#538FDF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Services Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-[#538FDF] mb-2">
                Services Rendered
              </label>
              <div className="grid grid-cols-2 gap-4">
                {services.map((service) => (
                  <label
                    key={service.id}
                    className="flex items-center text-sm text-blue-600"
                  >
                    <input
                      type="checkbox"
                      checked={formData.servicesRendered.includes(service.name)}
                      onChange={() => handleServiceToggle(service.name)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    {service.name}
                  </label>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#12B368] text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading}
                className="bg-red-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Deleting...' : 'Delete Staff'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Sidebar - UpcomingBookingSidebar */}
        <UpcomingBookingSidebar />
      </div>
    </div>
  );
};
