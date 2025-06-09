import { useState } from "react";
import UpcomingBookingSidebar from "./UpcomingBookingSidebar";

interface EditStaffViewProps {
    staff: Staff | null;
    onSave: (staff: Staff) => void;
    onCancel: () => void;
    onDelete?: () => void;
  }

  interface Staff {
    id: string;
    staffName: string;
    role: string;
    services: string[];
    salary: string;
    email: string;
    phoneNumber: string;
    address: string;
  }
  
export  const EditStaff: React.FC<EditStaffViewProps> = ({
    staff,
    onSave,
    onCancel,
    onDelete,
  }) => {
    const [formData, setFormData] = useState<Staff>({
      id: staff?.id || "",
      staffName: staff?.staffName || "",
      role: staff?.role || "Head Cleaner",
      services: staff?.services || [],
      salary: staff?.salary || "£40,000",
      email: staff?.email || "",
      phoneNumber: staff?.phoneNumber || "",
      address: staff?.address || "",
    });
  
    const serviceOptions = [
      "Landscaping",
      "CarWashing",
      "Residential Cleaning",
      "Industrial Cleaning",
      "Fumigation",
      "Refuse Disposal",
    ];
  
    const handleServiceToggle = (service: string) => {
      setFormData((prev) => ({
        ...prev,
        services: prev.services.includes(service)
          ? prev.services.filter((s) => s !== service)
          : [...prev.services, service],
      }));
    };
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave(formData);
    };
  
    return (
      <div className="flex flex-col min-h-screen bg-bg-light">
        <div className="flex flex-1 overflow-hidden">
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto px-3 bg-sky-50">
            {/* Staff Info Card */}
            <div className="bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white p-8 rounded-lg mb-6 flex items-center">
              {/* Profile Picture Placeholder */}
              <div className="w-24 h-24 bg-blue-300 rounded-lg mr-8 flex items-center justify-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <span className="text-2xl font-bold font-majer text-white">
                    {formData.staffName ? formData.staffName.charAt(0) : 'S'}
                  </span>
                </div>
              </div>
              
              {/* Staff Info */}
              <div>
                <h1 className="text-3xl font-normal font-majer mb-2">
                  {formData.staffName || 'Staff Name'}
                </h1>
                <p className="text-blue-100 font-majer text-lg">
                  {formData.role}
                </p>
              </div>
            </div>
  
            {/* Edit Form */}
            <form onSubmit={handleSubmit} className="bg-white font-majer rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium text-[#538FDF] mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, role: e.target.value }))
                    }
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
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
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
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#E8F2FF] text-[#538FDF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="headcleaner@dustout.com"
                  />
                </div>
  
                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-[#538FDF] mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 bg-[#E8F2FF] text-[#538FDF] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="23 Elmsworth Southampton"
                  />
                </div>
              </div>
  
              {/* Services Section */}
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  {serviceOptions.map((service) => (
                    <label key={service} className="flex items-center text-sm text-blue-600">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      {service}
                    </label>
                  ))}
                </div>
              </div>
  
              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-[#12B368] text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={onDelete}
                  className="bg-[#538FDF] text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  Delete Staff
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
  