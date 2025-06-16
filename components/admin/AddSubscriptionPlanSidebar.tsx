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

interface AddSubscriptionPlanSidebarProps {
  plan: SubscriptionPlan | null;
  onSave: () => void;
  onClose: () => void;
}

const AddSubscriptionPlanSidebar: React.FC<AddSubscriptionPlanSidebarProps> = ({
  plan,
  onSave,
  onClose
}) => {
  const { session } = useAuth();
  const [planName, setPlanName] = useState('');
  const [planType, setPlanType] = useState('residential');
  const [planPrice, setPlanPrice] = useState('');
  const [planFeatures, setPlanFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (plan) {
      setPlanName(plan.name);
      setPlanType(plan.type);
      setPlanPrice(plan.price.toString());
      setPlanFeatures([...plan.features]);
    } else {
      // Reset form for new plan
      setPlanName('');
      setPlanType('residential');
      setPlanPrice('');
      setPlanFeatures([]);
    }
    setMessage('');
  }, [plan]);

  const addFeature = () => {
    if (!newFeature.trim()) {
      setMessage('Error: Please enter a feature name');
      return;
    }

    if (planFeatures.includes(newFeature.trim())) {
      setMessage('Error: Feature already exists');
      return;
    }

    setPlanFeatures([...planFeatures, newFeature.trim()]);
    setNewFeature('');
    setMessage('');
  };

  const removeFeature = (index: number) => {
    setPlanFeatures(prev => prev.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, value: string) => {
    setPlanFeatures(prev => 
      prev.map((feature, i) => 
        i === index ? value : feature
      )
    );
  };

  const handleSubmit = async () => {
    if (!planName.trim() || !planPrice.trim() || planFeatures.length === 0) {
      setMessage('Please provide plan name, price, and at least one feature');
      return;
    }

    const price = parseFloat(planPrice);
    if (isNaN(price) || price <= 0) {
      setMessage('Please enter a valid price greater than 0');
      return;
    }

    // Validate features
    const validFeatures = planFeatures.filter(f => f.trim());
    if (validFeatures.length === 0) {
      setMessage('Please provide at least one valid feature');
      return;
    }

    setIsSubmitting(true);
    setMessage('');

    try {
      const token = session?.access_token;
      if (!token) {
        setMessage('Authentication required');
        setIsSubmitting(false);
        return;
      }

      const planData = {
        name: planName.trim(),
        type: planType,
        price: price,
        features: validFeatures
      };

      let response;
      if (plan) {
        // Update existing plan
        response = await fetch('/api/subscription-plans', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ ...planData, id: plan.id })
        });
      } else {
        // Create new plan
        response = await fetch('/api/subscription-plans', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(planData)
        });
      }

      const result = await response.json();

      if (response.ok) {
        setMessage(plan ? 'Plan updated successfully!' : 'Plan added successfully!');
        setTimeout(() => {
          onSave();
        }, 1000);
      } else {
        setMessage(result.error || 'Failed to save plan');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      setMessage('Error saving plan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-96 bg-white shadow-lg border-l border-gray-200 md:flex flex-col h-full hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {plan ? 'Edit Subscription Plan' : 'Add New Subscription Plan'}
        </h2>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Plan Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subscription Name *
          </label>
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter plan name"
          />
        </div>

        {/* Plan Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subscription Type *
          </label>
          <select
            value={planType}
            onChange={(e) => setPlanType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="residential">Residential</option>
            <option value="industrial">Industrial</option>
          </select>
        </div>

        {/* Plan Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subscription Price ($/month) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={planPrice}
            onChange={(e) => setPlanPrice(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter price"
          />
        </div>

        {/* Plan Features */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subscription Features *
          </label>
          
          {/* Add new feature */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter feature"
              onKeyPress={(e) => e.key === 'Enter' && addFeature()}
            />
            <button
              onClick={addFeature}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add
            </button>
          </div>

          {/* Features list */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {planFeatures.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() => removeFeature(index)}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {planFeatures.length === 0 && (
            <p className="text-gray-500 text-sm italic">No features added yet</p>
          )}
        </div>

        {/* Message */}
        {message && (
          <div className={`p-3 rounded-md text-sm ${
            message.includes('Error') || message.includes('Failed')
              ? 'bg-red-50 text-red-600 border border-red-200'
              : 'bg-green-50 text-green-600 border border-green-200'
          }`}>
            {message}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : (plan ? 'Update Plan' : 'Add Plan')}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddSubscriptionPlanSidebar;