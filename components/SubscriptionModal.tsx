'use client';

import React, { useState } from 'react';
import { X, Check, Calendar, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Plan {
  id: string;
  name: string;
  type: string;
  price: number;
  features: string[];
  isActive: boolean;
}

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: Plan | null;
  planType: 'residential' | 'industrial';
}

// interface PaymentFormData {
//   cardNumber: string;
//   expiryDate: string;
//   cvv: string;
//   cardholderName: string;
//   billingAddress: {
//     street: string;
//     city: string;
//     postalCode: string;
//     country: string;
//   };
// }

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  planType
}) => {
  const [step, setStep] = useState<'plan' | 'processing' | 'success'>('plan');
  // const [paymentData, setPaymentData] = useState<PaymentFormData>({
  //   cardNumber: '',
  //   expiryDate: '',
  //   cvv: '',
  //   cardholderName: '',
  //   billingAddress: {
  //     street: '',
  //     city: '',
  //     postalCode: '',
  //     country: 'United Kingdom'
  //   }
  // });
  // const [errors, setErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // const handleInputChange = (field: string, value: string) => {
  //   if (field.includes('.')) {
  //     const [parent, child] = field.split('.');
  //     setPaymentData(prev => ({
  //       ...prev,
  //       [parent]: {
  //         ...(prev[parent as keyof PaymentFormData] as Record<string, string>),
  //         [child]: value
  //       }
  //     }));
  //   } else {
  //     setPaymentData(prev => ({
  //       ...prev,
  //       [field]: value
  //     }));
  //   }
  //   
  //   // Clear error when user starts typing
  //   if (errors[field]) {
  //     setErrors(prev => ({ ...prev, [field]: '' }));
  //   }
  // };

  // const formatCardNumber = (value: string) => {
  //   const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  //   const matches = v.match(/\d{4,16}/g);
  //   const match = matches && matches[0] || '';
  //   const parts = [];
  //   for (let i = 0, len = match.length; i < len; i += 4) {
  //     parts.push(match.substring(i, i + 4));
  //   }
  //   if (parts.length) {
  //     return parts.join(' ');
  //   } else {
  //     return v;
  //   }
  // };

  // const formatExpiryDate = (value: string) => {
  //   const v = value.replace(/\D/g, '');
  //   if (v.length >= 2) {
  //     return v.substring(0, 2) + '/' + v.substring(2, 4);
  //   }
  //   return v;
  // };




  const handleSubscribe = async () => {
    setIsProcessing(true);
    setStep('processing');
    // setErrors({});

    try {
      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Please log in to subscribe');
      }

      // Create Stripe checkout session
      const response = await fetch('/api/subscriptions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          planId: selectedPlan?.id,
          planName: selectedPlan?.name,
          planType: planType,
          price: selectedPlan?.price
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;

    } catch (error) {
      console.error('Subscription error:', error);
      // setErrors({ general: error instanceof Error ? error.message : 'An unexpected error occurred' });
      setStep('plan');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setStep('plan');
    // setPaymentData({
    //   cardNumber: '',
    //   expiryDate: '',
    //   cvv: '',
    //   cardholderName: '',
    //   billingAddress: {
    //     street: '',
    //     city: '',
    //     postalCode: '',
    //     country: 'United Kingdom'
    //   }
    // });
    // setErrors({});
    onClose();
  };

  const handleSuccessClose = () => {
    handleClose();
    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  if (!isOpen || !selectedPlan) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 'plan' && 'Confirm Your Plan'}
              {step === 'processing' && 'Processing...'}
              {step === 'success' && 'Subscription Successful!'}
            </h2>
            <button
              title='close'
              onClick={step === 'success' ? handleSuccessClose : handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Plan Confirmation Step */}
          {step === 'plan' && (
            <div className="p-6">
              <div className="bg-gradient-to-b from-[#176FD4] to-[#0C3A6E] text-white rounded-xl p-6 mb-6">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-[#CDFFE8] mb-2">
                    {selectedPlan.name}
                  </h3>
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-2xl">£</span>
                    <span className="text-5xl font-bold font-majer mx-1">{Math.floor(selectedPlan.price)}</span>
                    <span className="text-xl font-majer">{(selectedPlan.price % 1 > 0) ? 
                      `.${Math.round((selectedPlan.price % 1) * 100)}` : 
                      '.00'}</span>
                  </div>
                  <p className="text-sm opacity-80 font-majer">Monthly</p>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-[#CDFFE8]">Included Features:</h4>
                  {selectedPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="bg-green-200 rounded-md p-1 mr-3">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Subscription Terms</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Monthly billing cycle</li>
                      <li>• Cancel anytime</li>
                      <li>• 24/7 customer support</li>
                      <li>• No setup fees</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? 'Processing...' : `Subscribe for £${Math.floor(selectedPlan.price)}${(selectedPlan.price % 1 > 0) ? 
                    `.${Math.round((selectedPlan.price % 1) * 100)}` : 
                    '.00'}/month`}
                </button>
              </div>
            </div>
          )}



          {/* Processing Step */}
          {step === 'processing' && (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Processing Your Subscription</h3>
              <p className="text-gray-600">Please wait while we set up your subscription...</p>
            </div>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Subscription Successful!</h3>
              <p className="text-gray-600 mb-6">
                Welcome to {selectedPlan.name}! Your subscription is now active and you can start enjoying all the benefits.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Next Billing Date</span>
                </div>
                <p className="text-blue-800">
                  {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <button
                onClick={handleSuccessClose}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SubscriptionModal;