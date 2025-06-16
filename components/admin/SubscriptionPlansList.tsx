"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../lib/auth-context';

interface SubscriptionPlan {
  id: string;
  name: string;
  type: string;
  price: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface SubscriptionPlansListProps {
  onSelectPlan: (plan: SubscriptionPlan) => void;
  searchTerm: string;
  refreshTrigger: number;
}

const SubscriptionPlansList: React.FC<SubscriptionPlansListProps> = ({
  onSelectPlan,
  searchTerm,
  refreshTrigger
}) => {
  const { session } = useAuth();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlans();
  }, [refreshTrigger]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/subscription-plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data.plans || []); // Access plans from the data object and provide a fallback empty array
      } else {
        setError('Failed to fetch subscription plans');
      }
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      setError('Failed to fetch subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this subscription plan?')) {
      return;
    }

    try {
      const token = session?.access_token;
      if (!token) {
        alert('Authentication required');
        return;
      }

      const response = await fetch(`/api/subscription-plans?id=${planId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Subscription plan deleted successfully');
        fetchPlans(); // Refresh the list
      } else {
        const result = await response.json();
        alert(result.error || 'Failed to delete subscription plan');
      }
    } catch (error) {
      console.error('Error deleting subscription plan:', error);
      alert('Error deleting subscription plan');
    }
  };

  // Filter plans based on search term
  const filteredPlans = plans.filter(plan =>
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plan.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchPlans}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subscription Features
              </th>
              <th className="px-6 py-3 text-left text-xs hidden md:block font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPlans.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  {searchTerm ? 'No subscription plans found matching your search.' : 'No subscription plans available.'}
                </td>
              </tr>
            ) : (
              filteredPlans.map((plan) => (
                <tr key={plan.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {plan.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      plan.type === 'residential' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {plan.type.charAt(0).toUpperCase() + plan.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {plan.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${plan.price.toFixed(2)}/month
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    <div className="truncate" title={plan.features.join(', ')}>
                      {plan.features.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap hidden md:block text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onSelectPlan(plan)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(plan.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionPlansList;