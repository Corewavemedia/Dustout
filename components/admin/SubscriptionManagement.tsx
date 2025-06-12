import React, { useState } from "react";
import SubscriptionsList from "./SubscriptionsList";
import EditSubscriptionSidebar from "./EditSubscriptionSidebar";

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

const SubscriptionManagement: React.FC = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubscriptionEditMode, setIsSubscriptionEditMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSubscription = () => {
    setSelectedSubscription(null);
    setIsEditMode(true);
  };

  const handleSaveSubscription = () => {
    setIsEditMode(false);
    setSelectedSubscription(null);
    setRefreshTrigger(prev => prev + 1); // Trigger refresh
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-2 bg-sky-50">
          {/* Header */}
          {!isSubscriptionEditMode && (
            <div className="bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white p-6 rounded-lg mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Search Bar */}
                <div className="flex items-center justify-center gap-4 w-full md:w-full">
                  <div className="relative flex-1 md:w-80">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search subscriptions..."
                      className="w-full px-4 py-2 pl-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <button
                    onClick={handleAddSubscription}
                    className="bg-white text-[#538FDF] px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Add Subscription
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Subscriptions List */}
          <SubscriptionsList
            onSelectSubscription={(subscription) => {
              setSelectedSubscription(subscription);
              setIsSubscriptionEditMode(true);
            }}
            searchTerm={searchTerm}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* Edit Subscription Sidebar */}
        {(isEditMode || isSubscriptionEditMode) && (
          <EditSubscriptionSidebar
            subscription={selectedSubscription}
            isEditMode={isEditMode || isSubscriptionEditMode}
            onSave={handleSaveSubscription}
            onClose={() => {
              setIsEditMode(false);
              setIsSubscriptionEditMode(false);
              setSelectedSubscription(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SubscriptionManagement;