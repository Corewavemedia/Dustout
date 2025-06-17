"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ServiceVariable {
  id: string;
  name: string;
  unitPrice: number;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  variables: ServiceVariable[];
  createdAt?: string;
  revenueGenerated?: number;
  numberOfBookings?: number;
  staff?: string;
}

interface ServiceData {
  id: string;
  title: string;
  numberOfBookings: number;
  staff: string;
  revenueGenerated: string;
  actions: string;
}

interface DashboardStats {
  revenue: number;
  clients: number;
  bookings: number;
}

const ServicesManagement: React.FC = () => {
  const { session } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceVariables, setServiceVariables] = useState<ServiceVariable[]>([]);
  const [serviceName, setServiceName] = useState<string>("");
  const [serviceDescription, setServiceDescription] = useState<string>("");
  const [serviceIcon, setServiceIcon] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [newVariableName, setNewVariableName] = useState<string>("");
  const [newVariablePrice, setNewVariablePrice] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    revenue: 0,
    clients: 0,
    bookings: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch services and dashboard stats on component mount
  useEffect(() => {
    fetchServices();
    fetchDashboardStats();
  }, []);
  
  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const response = await fetch('/api/admin/dashboard-stats');
      if (response.ok) {
        const data = await response.json();
        setDashboardStats(data);
      } else {
        console.error('Failed to fetch dashboard stats');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/services/analytics');
      if (response.ok) {
        const data = await response.json();
        
        // The analytics API returns the data directly as an array
        setServices(data);
      } else {
        setError('Failed to fetch services');
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to fetch services');
    } finally {
      setLoading(false);
    }
  };

  // Convert services to table data format with real analytics data
  const serviceData: ServiceData[] = services.map(service => ({
    id: service.id,
    title: service.name,
    numberOfBookings: service.numberOfBookings || 0,
    staff: service.staff || "No staff assigned",
    revenueGenerated: `$${(service.revenueGenerated || 0).toFixed(2)}`,
    actions: "",
  }));



  const addVariable = () => {
    if (!newVariableName.trim() || !newVariablePrice.trim()) {
      setMessage('Error: Please enter both variable name and price');
      return;
    }

    const price = parseFloat(newVariablePrice);
    if (isNaN(price) || price <= 0) {
      setMessage('Error: Please enter a valid price greater than 0');
      return;
    }

    const newVariable: ServiceVariable = {
      id: Date.now().toString(),
      name: newVariableName.trim(),
      unitPrice: price
    };
    setServiceVariables([...serviceVariables, newVariable]);
    setNewVariableName('');
    setNewVariablePrice('');
    setMessage('');
  };

  const updateVariable = (index: number, field: 'name' | 'unitPrice', value: string | number) => {
    setServiceVariables(prev => 
      prev.map((variable, i) => 
        i === index 
          ? { ...variable, [field]: value }
          : variable
      )
    );
  };

  const removeVariable = (index: number) => {
    setServiceVariables(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddService = async () => {
    if (!serviceName.trim() || serviceVariables.length === 0) {
      setMessage('Please provide service name and at least one variable');
      return;
    }

    // Validate variables
    const validVariables = serviceVariables.filter(v => v.name.trim() && v.unitPrice > 0);
    if (validVariables.length === 0) {
      setMessage('Please provide valid variable names and unit prices');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        setMessage('Please log in to add services');
        setIsSubmitting(false);
        return;
      }

      const serviceData = {
        name: serviceName.trim(),
        description: serviceDescription.trim() || null,
        icon: serviceIcon.trim() || null,
        variables: validVariables.map(v => ({
          name: v.name.trim(),
          unitPrice: v.unitPrice
        }))
      };

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(serviceData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Service added successfully!');
        // Reset form
        setServiceName("");
        setServiceDescription("");
        setServiceIcon("");
        setServiceVariables([]);
        // Refresh services list
        fetchServices();
      } else {
        setMessage(result.error || 'Failed to add service');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      setMessage('Error adding service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditService = (serviceData: ServiceData) => {
    // Find the original service object from the services array
    const service = services.find(s => s.id === serviceData.id);
    if (!service) return;
    
    setIsEditing(true);
    setEditingServiceId(service.id);
    setServiceName(service.name);
    setServiceDescription(service.description || '');
    setServiceIcon(service.icon || '');
    setServiceVariables(service.variables || []);
  };

  const handleUpdateService = async () => {
    if (!editingServiceId) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const token = session?.access_token;
      if (!token) {
        setMessage('Authentication required');
        return;
      }

      const serviceData = {
        id: editingServiceId,
        name: serviceName,
        description: serviceDescription,
        icon: serviceIcon,
        variables: serviceVariables.map(variable => ({
          name: variable.name,
          unitPrice: variable.unitPrice
        }))
      };

      const response = await fetch('/api/services', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(serviceData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Service updated successfully!');
        // Reset form
        setServiceName('');
        setServiceDescription('');
        setServiceIcon('');
        setServiceVariables([]);
        setIsEditing(false);
        setEditingServiceId(null);
        // Refresh services list
        fetchServices();
      } else {
        setMessage(result.error || 'Failed to update service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      setMessage('Error updating service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const token = session?.access_token;
      if (!token) {
        setMessage('Authentication required');
        return;
      }

      const response = await fetch(`/api/services?id=${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('Service deleted successfully!');
        // Refresh services list
        fetchServices();
      } else {
        setMessage(result.error || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      setMessage('Error deleting service');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingServiceId(null);
    setServiceName('');
    setServiceDescription('');
    setServiceIcon('');
    setServiceVariables([]);
    setMessage('');
  };

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
                    {statsLoading ? 'Loading...' : `$${dashboardStats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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
                    {statsLoading ? 'Loading...' : dashboardStats.clients.toLocaleString()}
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
                    {statsLoading ? 'Loading...' : dashboardStats.bookings.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-majer text-[#12B368]">Services</h2>
            </div>
            
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
                <span className="ml-2 text-gray-600">Loading services...</span>
              </div>
            ) : serviceData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No services found
              </div>
            ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#538FDF]">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium font-majer text-white tracking-wider">
                      Services
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium font-majer text-white tracking-wider">
                      Number of Bookings
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium font-majer text-white tracking-wider">
                      Staff
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium font-majer text-white tracking-wider">
                      Revenue Generated
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium font-majer text-white tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {serviceData.map((service) => (
                    <tr key={service.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-majer font-medium text-[#538FDF]">
                        {service.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                        {service.numberOfBookings}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                        {service.staff}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                        {service.revenueGenerated}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => handleEditService(service)}
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
                          <button 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteService(service.id)}
                          >
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
            )}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white p-4 shadow-md hidden md:block">
          <div className="mb-4">
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <h3 className="text-lg font-normal font-majer text-[#12B368]">
                {isEditing ? 'Edit Service' : 'Add Services'}
              </h3>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium font-majer text-[#171AD4] mb-1">
                Name
              </label>
              <input
                type="text"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                className="w-full px-3 py-2 text-[#538FDF] font-majer bg-[#F0F7FF] border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {/* <div className="mb-4">
              <label className="block text-sm font-medium font-majer text-[#171AD4] mb-1">
                Upload Icon
              </label>
              <div className="flex items-center justify-between bg-[#F0F7FF]">
                <span className="text-sm px-3 py-2 rounded-md font-majer text-[#538FDF]">
                  drag or click to upload
                </span>
                <button className="bg-[#538FDF] text-white px-3 py-2 rounded-md text-sm">
                  Upload
                </button>
              </div>
            </div> */}
            <div className="mb-4">
              <label className="block text-sm font-medium font-majer text-[#171AD4] mb-1">
                Description
              </label>
              <textarea
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                className="w-full px-3 py-2 border font-majer text-[#538FDF] bg-[#F0F7FF] border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              ></textarea>
            </div>
          </div>

          {/* Variable Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium font-majer text-[#171AD4]">Service Variables</h4>
            </div>
            
            {/* Add Variable Form */}
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Variable name (e.g., Bedroom)"
                  value={newVariableName}
                  onChange={(e) => setNewVariableName(e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="number"
                  placeholder="Unit price"
                  value={newVariablePrice}
                  onChange={(e) => setNewVariablePrice(e.target.value)}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <button
                onClick={addVariable}
                className="w-full bg-[#F0F7FF] text-[#538FDF] font-majer border border-[#538FDF] px-2 py-1 rounded-md text-sm transition-colors"
              >
                +Add Variable
              </button>
            </div>

            {/* Variables List */}
            <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
              {serviceVariables.map((variable, index) => (
                <div key={index} className="grid grid-cols-3 gap-1 items-center">
                  <input
                    type="text"
                    value={variable.name}
                    onChange={(e) => updateVariable(index, 'name', e.target.value)}
                    className="px-2 py-2 text-sm bg-[#F0F7FF] border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    value={variable.unitPrice}
                    onChange={(e) => updateVariable(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="px-2 py-2 text-sm bg-[#F0F7FF] border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={() => removeVariable(index)}
                    className="text-red-500 hover:text-red-700 text-sm px-2 py-1"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <button
                onClick={isEditing ? handleUpdateService : handleAddService}
                disabled={isSubmitting}
                className="w-full bg-green-500 text-white font-majer px-3 py-2 rounded-md text-sm hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (isEditing ? 'Updating Service...' : 'Adding Service...') : (isEditing ? 'Update Service' : 'Add Service')}
              </button>
              
              {isEditing && (
                <button
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                  className="w-full bg-gray-500 text-white font-majer px-3 py-2 rounded-md text-sm hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              )}
            </div>
            
            {message && (
              <div className={`mt-2 p-2 rounded-md text-sm ${
                message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default ServicesManagement;
