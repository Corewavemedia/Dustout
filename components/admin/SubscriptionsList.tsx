import React, { useState, useEffect } from "react";

interface Subscription {
  id: string;
  clientName: string;
  planName: string;
  startDate: string;
  expiryDate: string;
  address: string;
  revenue: string;
  email: string;
  phone: string;
  status: string;
}

interface SubscriptionsListProps {
  onEditModeChange?: (isEditMode: boolean) => void;
  onSelectSubscription: (subscription: Subscription) => void;
  searchTerm: string;
  refreshTrigger: number;
}

const SubscriptionsList: React.FC<SubscriptionsListProps> = ({ 
  onSelectSubscription,
  searchTerm,
  refreshTrigger
}) => {
  const [subscriptionsList, setSubscriptionsList] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch subscriptions data from API
  useEffect(() => {
    fetchSubscriptions();
  }, [refreshTrigger]);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/subscriptions');

      if (!response.ok) {
        throw new Error('Failed to fetch subscriptions');
      }

      const data = await response.json();
      setSubscriptionsList(data.subscriptions || []);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    try {
      setDeleteLoading(subscriptionId);
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch(`/api/admin/subscriptions?id=${subscriptionId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setSubscriptionsList((prev) => prev.filter((subscription) => subscription.id !== subscriptionId));
        setSuccessMessage('Subscription deleted successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete subscription');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error deleting subscription');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredSubscriptions = subscriptionsList.filter(
    (subscription) =>
      subscription.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-majer text-[#12B368] mb-4">
        Subscriptions List
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
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#538FDF]"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">ID</th>
                <th scope="col" className="px-6 py-3">Client Name</th>
                <th scope="col" className="px-6 py-3">Plan</th>
                <th scope="col" className="px-6 py-3">Start Date</th>
                <th scope="col" className="px-6 py-3">Expiry Date</th>
                <th scope="col" className="px-6 py-3">Address</th>
                <th scope="col" className="px-6 py-3">Revenue</th>
                <th scope="col" className="px-6 py-3">Status</th>
                <th scope="col" className="px-6 py-3 hidden md:block">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                    No subscriptions found
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((subscription) => (
                  <tr key={subscription.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      #{subscription.id.slice(-6)}
                    </td>
                    <td className="px-6 py-4">{subscription.clientName}</td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {subscription.planName}
                      </span>
                    </td>
                    <td className="px-6 py-4">{subscription.startDate}</td>
                    <td className="px-6 py-4">{subscription.expiryDate}</td>
                    <td className="px-6 py-4">{subscription.address}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      ${subscription.revenue}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded ${getStatusColor(subscription.status)}`}>
                        {subscription.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:block">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectSubscription(subscription)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSubscription(subscription.id)}
                          disabled={deleteLoading === subscription.id}
                          className="text-red-600 hover:text-red-900 font-medium disabled:opacity-50"
                        >
                          {deleteLoading === subscription.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            'Delete'
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsList;