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
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  // const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPlanChange, setShowPlanChange] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionData();
    fetchSubscriptionPlans();
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
        const subscriptionData = await subscriptionResponse.json();
        setSubscription(subscriptionData.subscription);
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
    if (!subscription || !confirm('Are you sure you want to cancel your subscription? This action cannot be undone.')) {
      return;
    }

    setActionLoading('cancel');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Please log in to cancel your subscription');
        return;
      }

      const response = await fetch(`/api/subscriptions/cancel?subscriptionId=${subscription.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cancelAtPeriodEnd: true })
      });

      if (response.ok) {
        const data = await response.json();
        setSubscription(data.subscription);
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

  const handlePlanChange = async (newPlan: SubscriptionPlan) => {
    if (!subscription || !confirm(`Are you sure you want to change to the ${newPlan.name} plan?`)) {
      return;
    }

    setActionLoading('plan-change');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setError('Please log in to change your plan');
        return;
      }

      // Check if this requires payment (upgrade) or can be processed immediately (downgrade)
      const checkoutResponse = await fetch('/api/subscriptions/change-plan-checkout', {
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

      if (checkoutResponse.ok) {
        const checkoutData = await checkoutResponse.json();
        
        if (checkoutData.requiresPayment) {
          // Redirect to Stripe checkout for upgrade payment
          window.location.href = checkoutData.url;
          return;
        } else {
          // Process downgrade immediately
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
            setSubscription(data.subscription);
            setShowPlanChange(false);
            alert(data.message);
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to change plan');
          }
        }
      } else {
        const errorData = await checkoutResponse.json();
        setError(errorData.error || 'Failed to process plan change');
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

  if (!subscription) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">No Active Subscription</h2>
            <p className="text-gray-600 mt-1">
              You don&apos;t have an active subscription. Choose a plan to get started.
            </p>
          </div>
          <div className="p-6">
            <PricingSection />
          </div>
        </div>
      </div>
    );
  }

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
          {subscriptionPlans && subscription && subscriptionPlans.map((plan) => {
            const isCurrentPlan = subscription.planName.toLowerCase().includes(plan.name.toLowerCase()) && 
                                 subscription.planName.toLowerCase().includes(plan.type.toLowerCase());
            const isUpgrade = plan.price > subscription.revenue;
            
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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Subscription Dashboard</h1>
        {getStatusBadge(subscription.status)}
      </div>

      {/* Current Subscription */}
      <div className="bg-white rounded-lg shadow border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Current Subscription
          </h2>
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
              <p className="text-sm text-gray-600">Next Billing Date</p>
              <p className="font-semibold">{formatDate(subscription.expiryDate)}</p>
            </div>
          </div>
          
          <hr className="border-gray-200" />
          
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setShowPlanChange(true)}
              disabled={subscription.status !== 'active'}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Settings className="w-4 h-4 mr-2 inline" />
              Change Plan
            </button>
            
            <button 
              onClick={handleCancelSubscription}
              disabled={actionLoading === 'cancel' || subscription.status !== 'active'}
              className="px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {actionLoading === 'cancel' ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}