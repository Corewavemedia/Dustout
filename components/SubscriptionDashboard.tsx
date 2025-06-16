'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Package, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  ArrowUpCircle,
  ArrowDownCircle,
  Settings
} from 'lucide-react';
import  PricingSection  from './PricingSection';

interface Subscription {
  id: string;
  planName: string;
  revenue: number;
  status: string;
  startDate: string;
  expiryDate: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  cancelAtPeriodEnd?: boolean;
  cancelledAt?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

interface SubscriptionData {
  activeSubscription: Subscription | null;
  cancellingSubscription: Subscription | null;
  cancelledSubscriptions: Subscription[];
  pendingSubscriptions: Subscription[];
  subscription: Subscription | null; // For backward compatibility
}

// interface PaymentMethod {
//   id: string;
//   type: string;
//   card?: {
//     brand: string;
//     last4: string;
//     exp_month: number;
//     exp_year: number;
//   };
// }

interface SubscriptionPlan {
  id: string;
  name: string;
  type: string;
  price: number;
  features: string[];
}

export function SubscriptionDashboard() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPlanChange, setShowPlanChange] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedView, setSelectedView] = useState<'all' | 'active' | 'cancelling' | 'pending' | 'cancelled'>('active');

  useEffect(() => {
    fetchSubscriptionData();
    fetchSubscriptionPlans();
    
    // Check if user returned from payment method setup with plan change retry
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_method') === 'updated' && urlParams.get('retry_plan_change') === 'true') {
      const planId = urlParams.get('plan_id');
      if (planId) {
        // Clear URL params first
        window.history.replaceState({}, '', window.location.pathname);
        
        // Automatically retry the plan change
        retryPlanChange(planId);
      }
    }
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Please log in to view your subscription');
        setLoading(false);
        return;
      }

      // Fetch subscription
      const subscriptionResponse = await fetch('/api/subscriptions/current', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (subscriptionResponse.ok) {
        const data = await subscriptionResponse.json();
        console.log('Subscription data received:', data); // Debug log
        setSubscriptionData(data);
      }

      // Fetch payment method
      // const paymentResponse = await fetch('/api/subscriptions/update-payment-method', {
      //   headers: {
      //     'Authorization': `Bearer ${session.access_token}`
      //   }
      // });

      // if (paymentResponse.ok) {
      //   const paymentData = await paymentResponse.json();
      //   setPaymentMethod(paymentData.paymentMethod);
      // }

    } catch (error) {
      console.error('Error fetching subscription data:', error);
      setError('Failed to load subscription data');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await fetch('/api/subscription-plans');
      if (response.ok) {
        const data = await response.json();
        setSubscriptionPlans(data.plans);
      }
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    }
  };

  const handleCancelSubscription = async () => {
    const currentSubscription = subscriptionData?.activeSubscription;
    if (!currentSubscription || !confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      return;
    }

    setActionLoading('cancel');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Please log in to cancel your subscription');
        return;
      }

      const response = await fetch(`/api/subscriptions/cancel?subscriptionId=${currentSubscription.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cancelAtPeriodEnd: true })
      });

      if (response.ok) {
        await fetchSubscriptionData();
        alert('Subscription cancelled successfully. It will remain active until the end of your billing period.');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setError('Failed to cancel subscription');
    } finally {
      setActionLoading(null);
    }
  };

  // const handleUpdatePaymentMethod = async () => {
  //   setActionLoading('payment');
  //   try {
  //     const { data: { session } } = await supabase.auth.getSession();
      
  //     if (!session) {
  //       setError('Please log in to update your payment method');
  //       return;
  //     }

  //     const response = await fetch('/api/subscriptions/update-payment-method', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${session.access_token}`,
  //         'Content-Type': 'application/json'
  //       }
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       window.location.href = data.url;
  //     } else {
  //       const errorData = await response.json();
  //       setError(errorData.error || 'Failed to update payment method');
  //     }
  //   } catch (error) {
  //     console.error('Error updating payment method:', error);
  //     setError('Failed to update payment method');
  //   } finally {
  //     setActionLoading(null);
  //   }
  // };

  const retryPlanChange = async (planId: string) => {
    // Find the plan by ID
    const targetPlan = subscriptionPlans.find(plan => plan.id === planId);
    if (!targetPlan) {
      setError('Plan not found for retry');
      return;
    }

    setActionLoading('plan-change');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Please log in to change your plan');
        return;
      }

      // Process plan change directly (both upgrades and downgrades)
      const response = await fetch('/api/subscriptions/change-plan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newPlanId: targetPlan.id,
          newPlanName: targetPlan.name,
          newPlanType: targetPlan.type,
          newPrice: targetPlan.price
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if payment method setup is still required (shouldn't happen after setup)
        if (data.requiresPaymentMethod && data.setupUrl) {
          setError('Payment method setup failed. Please try again.');
          return;
        }
        
        setSuccess(`Payment method updated successfully! ${data.message}`);
        
        // Refresh subscription data
        await fetchSubscriptionData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to change plan after payment method setup');
      }
    } catch (error) {
      console.error('Error retrying plan change:', error);
      setError('Failed to retry plan change');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePlanChange = async (newPlan: SubscriptionPlan) => {
    const currentSubscription = subscriptionData?.activeSubscription || subscriptionData?.cancellingSubscription;
    if (!currentSubscription || !confirm(`Are you sure you want to change to the ${newPlan.name} plan?`)) {
      return;
    }

    setActionLoading('plan-change');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Please log in to change your plan');
        return;
      }

      // Process plan change directly (both upgrades and downgrades)
      const response = await fetch('/api/subscriptions/change-plan', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newPlanId: newPlan.id,
          newPlanName: newPlan.name,
          newPlanType: newPlan.type,
          newPrice: newPlan.price
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check if payment method setup is required
        if (data.requiresPaymentMethod && data.setupUrl) {
          // Redirect to payment method setup
          window.location.href = data.setupUrl;
          return;
        }
        
        setSuccess(data.message);
        
        // Refresh subscription data
        await fetchSubscriptionData();
        
        // Close modal
        setShowPlanChange(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to change plan');
      }
    } catch (error) {
      console.error('Error changing plan:', error);
      setError('Failed to change plan');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" />Cancelled</span>;
      case 'cancelling':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"><AlertCircle className="w-3 h-3 mr-1" />Cancelling</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><AlertCircle className="w-3 h-3 mr-1" />Pending</span>;
      case 'past_due':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Past Due</span>;
      default:
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4 border border-red-200 rounded-lg bg-red-50">
        <div className="flex items-center">
          <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  // Check if user has no subscriptions at all
  const hasNoSubscriptions = !subscriptionData || (!subscriptionData.activeSubscription && !subscriptionData.cancellingSubscription && subscriptionData.cancelledSubscriptions.length === 0 && subscriptionData.pendingSubscriptions.length === 0);

  if (showPlanChange) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <button 
            onClick={() => setShowPlanChange(false)}
            className="mb-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ← Back to Dashboard
          </button>
          <h2 className="text-2xl font-bold">Change Subscription Plan</h2>
          <p className="text-gray-600">Select a new plan to upgrade or downgrade your subscription.</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subscriptionPlans && subscriptionData && subscriptionPlans.map((plan) => {
            const currentSubscription = subscriptionData.activeSubscription || subscriptionData.cancellingSubscription;
            const isCurrentPlan = currentSubscription && currentSubscription.planName.toLowerCase().includes(plan.name.toLowerCase()) && 
                                 currentSubscription.planName.toLowerCase().includes(plan.type.toLowerCase());
            const isUpgrade = currentSubscription && plan.price > currentSubscription.revenue;
            
            return (
              <div key={plan.id} className={`relative bg-white rounded-lg shadow border p-6 ${isCurrentPlan ? 'ring-2 ring-blue-500' : ''}`}>
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    {isCurrentPlan && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Current Plan</span>}
                  </div>
                  <p className="text-gray-600 capitalize">{plan.type}</p>
                  <div className="text-2xl font-bold">£{plan.price.toFixed(2)}<span className="text-sm font-normal">/month</span></div>
                </div>
                <div>
                  <ul className="space-y-2 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {!isCurrentPlan && (
                    <button 
                      onClick={() => handlePlanChange(plan)}
                      disabled={actionLoading === 'plan-change'}
                      className={`w-full px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isUpgrade 
                          ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500' 
                          : 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-blue-500'
                      }`}
                    >
                      {isUpgrade ? (
                        <><ArrowUpCircle className="w-4 h-4 mr-2 inline" />Upgrade</>
                      ) : (
                        <><ArrowDownCircle className="w-4 h-4 mr-2 inline" />Downgrade</>
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const renderSubscriptionCard = (subscription: Subscription, title: string, description?: string) => (
    <div className="bg-white rounded-lg shadow border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center">
            <Package className="w-5 h-5 mr-2" />
            {title}
          </h2>
          {getStatusBadge(subscription.cancelAtPeriodEnd ? 'cancelling' : subscription.status)}
        </div>
        {description && <p className="text-sm text-gray-600 mt-1">{description}</p>}
      </div>
      <div className="p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Plan</p>
            <p className="font-semibold">{subscription.planName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Monthly Cost</p>
            <p className="font-semibold">£{subscription.revenue ? subscription.revenue.toFixed(2) : '0.00'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="font-semibold">{formatDate(subscription.startDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">
              {subscription.cancelAtPeriodEnd ? 'Cancels On' : subscription.status === 'cancelled' ? 'Cancelled On' : 'Next Billing Date'}
            </p>
            <p className="font-semibold">{formatDate(subscription.expiryDate)}</p>
          </div>
        </div>
        
        {subscription.status === 'active' && (
          <>
            <hr className="border-gray-200" />
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setShowPlanChange(true)}
                disabled={subscription.cancelAtPeriodEnd}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Settings className="w-4 h-4 mr-2 inline" />
                Change Plan
              </button>
              
              {!subscription.cancelAtPeriodEnd && (
                <button 
                  onClick={handleCancelSubscription}
                  disabled={actionLoading === 'cancel'}
                  className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === 'cancel' ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}

      {/* Subscription Overview */}
      <div className="bg-white rounded-lg shadow border p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Subscription Overview</h2>
          {selectedView !== 'all' && (
            <button 
              onClick={() => setSelectedView('all')}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Show All
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button 
            onClick={() => setSelectedView(selectedView === 'active' ? 'all' : 'active')}
            className={`text-center p-4 rounded-lg border transition-all hover:shadow-md ${
              selectedView === 'active' ? 'bg-green-100 border-green-300 ring-2 ring-green-500' : 'bg-green-50 hover:bg-green-100'
            }`}
          >
            <div className="text-2xl font-bold text-green-600">
              {subscriptionData?.activeSubscription ? '1' : '0'}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </button>
          <button 
            onClick={() => setSelectedView(selectedView === 'cancelling' ? 'all' : 'cancelling')}
            className={`text-center p-4 rounded-lg border transition-all hover:shadow-md ${
              selectedView === 'cancelling' ? 'bg-orange-100 border-orange-300 ring-2 ring-orange-500' : 'bg-orange-50 hover:bg-orange-100'
            }`}
          >
            <div className="text-2xl font-bold text-orange-600">
              {subscriptionData?.cancellingSubscription ? '1' : '0'}
            </div>
            <div className="text-sm text-gray-600">Cancelling</div>
          </button>
          <button 
            onClick={() => setSelectedView(selectedView === 'pending' ? 'all' : 'pending')}
            className={`text-center p-4 rounded-lg border transition-all hover:shadow-md ${
              selectedView === 'pending' ? 'bg-blue-100 border-blue-300 ring-2 ring-blue-500' : 'bg-blue-50 hover:bg-blue-100'
            }`}
          >
            <div className="text-2xl font-bold text-blue-600">
              {subscriptionData?.pendingSubscriptions?.length || '0'}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </button>
          <button 
            onClick={() => setSelectedView(selectedView === 'cancelled' ? 'all' : 'cancelled')}
            className={`text-center p-4 rounded-lg border transition-all hover:shadow-md ${
              selectedView === 'cancelled' ? 'bg-red-100 border-red-300 ring-2 ring-red-500' : 'bg-red-50 hover:bg-red-100'
            }`}
          >
            <div className="text-2xl font-bold text-red-600">
              {subscriptionData?.cancelledSubscriptions?.length || '0'}
            </div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </button>
        </div>
      </div>

      {/* No Subscriptions Message */}
      {hasNoSubscriptions && (
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">No Subscriptions Found</h2>
            <p className="text-gray-600 mt-1">
              You don&apos;t have any subscriptions yet. Choose a plan to get started.
            </p>
          </div>
          <div className="p-6">
            <PricingSection />
          </div>
        </div>
      )}

      {/* Active Subscription */}
      {subscriptionData?.activeSubscription && (selectedView === 'all' || selectedView === 'active') && renderSubscriptionCard(
        subscriptionData.activeSubscription,
        "Active Subscription",
        "Your current active subscription"
      )}

      {/* Cancelling Subscription */}
      {subscriptionData?.cancellingSubscription && (selectedView === 'all' || selectedView === 'cancelling') && renderSubscriptionCard(
        subscriptionData.cancellingSubscription,
        "Cancelling Subscription",
        "This subscription will be cancelled at the end of the billing period"
      )}

      {/* Pending Subscriptions */}
      {subscriptionData?.pendingSubscriptions && subscriptionData.pendingSubscriptions.length > 0 && (selectedView === 'all' || selectedView === 'pending') && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Pending Subscriptions</h2>
          {subscriptionData.pendingSubscriptions.map((subscription) => (
            <div key={subscription.id}>
              {renderSubscriptionCard(
                subscription,
                "Pending Subscription",
                "This subscription will become active soon"
              )}
            </div>
          ))}
        </div>
      )}

      {/* Cancelled Subscriptions */}
      {subscriptionData?.cancelledSubscriptions && subscriptionData.cancelledSubscriptions.length > 0 && (selectedView === 'all' || selectedView === 'cancelled') && (
        <div className="space-y-4">
          {subscriptionData.cancelledSubscriptions.slice(0, 3).map((subscription) => (
            <div key={subscription.id}>
              {renderSubscriptionCard(
                subscription,
                "Cancelled Subscription",
                subscription.cancelledAt ? `Cancelled on ${formatDate(subscription.cancelledAt)}` : "This subscription has been cancelled"
              )}
            </div>
          ))}
          {subscriptionData.cancelledSubscriptions.length > 3 && (
            <p className="text-sm text-gray-600 text-center">
              Showing 3 of {subscriptionData.cancelledSubscriptions.length} cancelled subscriptions
            </p>
          )}
        </div>
      )}
    </div>
  );
}