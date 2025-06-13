'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface PaymentStatusProps {
  onClose: () => void;
}

export default function PaymentStatus({ onClose }: PaymentStatusProps) {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'success' | 'cancelled' | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    const stripeSessionId = searchParams.get('session_id');
    
    if (paymentStatus === 'success') {
      setStatus('success');
      setSessionId(stripeSessionId);
    } else if (paymentStatus === 'cancelled') {
      setStatus('cancelled');
    }
  }, [searchParams]);

  if (!status) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        {status === 'success' ? (
          <div className="text-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your booking! Your payment has been processed successfully.
              You will receive a confirmation email shortly with all the details.
            </p>
            {sessionId && (
              <p className="text-sm text-gray-500 mb-6">
                Transaction ID: {sessionId}
              </p>
            )}
            <p className="text-gray-600 mb-6">
              Our team will contact you soon to confirm the final details and schedule your cleaning service.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="text-center">
            <XCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Payment Cancelled
            </h2>
            <p className="text-gray-600 mb-6">
              Your payment was cancelled. No charges have been made to your account.
              You can try again or contact us if you need assistance.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}