import React, { useState } from "react";
import SubscriptionsList from "./SubscriptionsList";
import EditSubscriptionSidebar from "./EditSubscriptionSidebar";
import SubscriptionPlansList from "./SubscriptionPlansList";
import AddSubscriptionPlanSidebar from "./AddSubscriptionPlanSidebar";

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

type ViewMode = 'manage' | 'add';

const SubscriptionManagement: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('manage');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubscriptionEditMode, setIsSubscriptionEditMode] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleAddSubscription = () => {
    if (viewMode === 'manage') {
      setSelectedSubscription(null);
      setIsEditMode(true);
    } else {
      setSelectedPlan(null);
      setIsEditMode(true);
    }
  };

  const handleSaveSubscription = () => {
    setIsEditMode(false);
    setSelectedSubscription(null);
    setSelectedPlan(null);
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
                      placeholder={viewMode === 'manage' ? "Search subscriptions..." : "Search subscription plans..."}
                      className="w-full px-4 py-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    />
                    <button className="absolute font-majer right-2 top-1/2 transform -translate-y-1/2 bg-[#171AD4] text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors">
                      Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center font-majer flex-col sm:flex-row gap-3 mt-4">
                <button
                  onClick={() => {
                    setViewMode('add');
                    setIsEditMode(false);
                    setIsSubscriptionEditMode(false);
                    setSelectedSubscription(null);
                    setSelectedPlan(null);
                  }}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    viewMode === 'add'
                      ? 'bg-[#12B368] text-white hover:bg-green-600'
                      : 'bg-white text-[#538FDF] hover:bg-gray-50'
                  }`}
                >
                  Subscription Plans
                </button>
                <button
                  onClick={() => {
                    setViewMode('manage');
                    setIsEditMode(false);
                    setIsSubscriptionEditMode(false);
                    setSelectedSubscription(null);
                    setSelectedPlan(null);
                  }}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'manage'
                      ? 'bg-[#12B368] text-white hover:bg-green-600'
                      : 'bg-white border border-white text-[#538FDF] hover:bg-white hover:text-[#171AD4]'
                  }`}
                >
                  Manage Subscriptions
                </button>
              </div>

              {/* Add Button for current view */}
              {viewMode === 'add' && (
                <div className="hidden md:flex justify-center mt-4">
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
                    Add New Plan
                  </button>
                </div>
              )}

              {viewMode === 'manage' && (
                <div className="hidden md:flex justify-center mt-4">
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
              )}
            </div>
          )}

          {/* Content based on view mode */}
          {viewMode === 'manage' ? (
            <SubscriptionsList
              onSelectSubscription={(subscription) => {
                setSelectedSubscription(subscription);
                setIsSubscriptionEditMode(true);
              }}
              searchTerm={searchTerm}
              refreshTrigger={refreshTrigger}
            />
          ) : (
            <SubscriptionPlansList
              onSelectPlan={(plan) => {
                setSelectedPlan(plan);
                setIsEditMode(true);
              }}
              searchTerm={searchTerm}
              refreshTrigger={refreshTrigger}
            />
          )}
        </div>

        {/* Sidebar based on view mode and edit state */}
        {viewMode === 'manage' && (isEditMode || isSubscriptionEditMode) && (
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

        {viewMode === 'add' && isEditMode && (
          <AddSubscriptionPlanSidebar
            plan={selectedPlan}
            onSave={handleSaveSubscription}
            onClose={() => {
              setIsEditMode(false);
              setSelectedPlan(null);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SubscriptionManagement;