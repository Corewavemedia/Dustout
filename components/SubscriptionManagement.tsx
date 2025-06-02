'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, CheckCircle, XCircle, AlertCircle, Settings } from 'lucide-react';

interface Subscription {
  id: number;
  planName: string;
  planType: string;
  price: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'expired';
  features: string[];
}

const SubscriptionManagement = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubscription = () => {
      try {
        // Load from localStorage for demo purposes
        // In production, this would be an API call
        const storedSubscription = localStorage.getItem('activeSubscription');
        if (storedSubscription) {
          setSubscription(JSON.parse(storedSubscription));
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubscription();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'expired':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleCancelSubscription = async () => {
    if (!subscription) return;

    const confirmed = window.confirm(
      'Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period.'
    );

    if (confirmed) {
      try {
        // In production, this would be an API call
        const updatedSubscription = {
          ...subscription,
          status: 'cancelled' as const
        };
        
        localStorage.setItem('activeSubscription', JSON.stringify(updatedSubscription));
        setSubscription(updatedSubscription);
        
        alert('Your subscription has been cancelled. You will continue to have access until ' + formatDate(subscription.endDate));
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        alert('Failed to cancel subscription. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-4">
            You don&apos;t have an active subscription yet. Choose a plan to get started with our services.
          </p>
          <button
            onClick={() => window.location.href = '/#pricing'}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Active Subscription</h2>
            <p className="text-blue-100 text-sm">{subscription.planName} - {subscription.planType}</p>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(subscription.status)}
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscription.status)}`}>
              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Subscription Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Plan Details</h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">£{subscription.price}</span>
                <span className="text-gray-500 ml-1">.99/month</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Start Date</h3>
              <div className="flex items-center text-gray-900">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {formatDate(subscription.startDate)}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Next Billing Date</h3>
              <div className="flex items-center text-gray-900">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {formatDate(subscription.endDate)}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Included Features</h3>
            <ul className="space-y-2">
              {subscription.features.map((feature, index) => (
                <li key={index} className="flex items-center text-sm text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.location.href = '/#pricing'}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-4 w-4 mr-2" />
              Change Plan
            </button>
            
            {subscription.status === 'active' && (
              <button
                onClick={handleCancelSubscription}
                className="flex items-center justify-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Subscription
              </button>
            )}
            
            <button
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Update Payment Method
            </button>
          </div>
        </div>

        {/* Billing Information */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Billing Information</h3>
          <div className="text-sm text-gray-600">
            <p>Your subscription will automatically renew on {formatDate(subscription.endDate)}.</p>
            {subscription.status === 'cancelled' && (
              <p className="text-red-600 mt-1">
                Your subscription is cancelled and will end on {formatDate(subscription.endDate)}.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManagement;