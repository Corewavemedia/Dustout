"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MapPinIcon } from "@heroicons/react/24/outline";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import EditprofileIcon from "@/components/icons/EditProfileicon";
import BookUsIcon from "@/components/icons/BookUsIcon";
import SubscriptionIcon from "@/components/icons/SubscriptionIcon";
import LocationIcon from "@/components/icons/Locationicon";
import DateIcon from "@/components/icons/DateIcon";
import TimeRange from "@/components/icons/TimeRange";
import SubscriptionManagement from "@/components/SubscriptionManagement";
import Image from "next/image";
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';

interface OrderData {
  id: string;
  service: string;
  location: string;
  date: string;
  time: string;
  price: string;
  status?: string;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const [orderHistory, setOrderHistory] = useState<OrderData[]>([]);
  const [showSubscription, setShowSubscription] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  // Check for subscription success
  useEffect(() => {
    const subscription = searchParams.get('subscription');
    if (subscription === 'success') {
      setSubscriptionSuccess(true);
      setShowSubscription(true);
      // Clear the URL parameter
      const url = new URL(window.location.href);
      url.searchParams.delete('subscription');
      url.searchParams.delete('session_id');
      window.history.replaceState({}, '', url.toString());
    }
  }, [searchParams]);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  // Load order history
  useEffect(() => {
    const fetchOrderHistory = async () => {
      if (user) {
        try {
          // Get the session to access the token
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session?.access_token) {
            const response = await fetch('/api/bookings', {
              headers: {
                'Authorization': `Bearer ${session.access_token}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              
              // Define booking interface
              interface BookingData {
                id: string;
                services?: Array<{service: {name: string}}> | null;
                address: string;
                preferredDate?: string;
                preferredTime?: string;
                estimatedPrice?: number;
                status?: string;
              }
              
              // Transform booking data to match OrderData interface
              const transformedOrders: OrderData[] = data.bookings.map((booking: BookingData, index: number) => ({
                id: booking.id || `booking-${index}`,
                service: booking.services && booking.services.length > 0 ? booking.services[0].service.name : 'Service',
                location: booking.address,
                date: booking.preferredDate || 'Date TBD',
                time: booking.preferredTime || 'Time not specified',
                price: booking.estimatedPrice 
                  ? `£${booking.estimatedPrice.toFixed(2)}` 
                  : 'Price Not Set',
                status: booking.status
              }));
              
              setOrderHistory(transformedOrders);
            } else {
              console.error('Failed to fetch bookings');
            }
          }
        } catch (error) {
          console.error('Error fetching order history:', error);
        }
      }
    };
    
    fetchOrderHistory();
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }



  return (
      <div className="min-h-screen bg-blue-50 relative overflow-hidden">
        <Navbar />

      {/* Cloud Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cloudbg.jpg"
          alt="Cloud background"
          fill
          className="object-cover opacity-10"
        />
      </div>

      {/* bubble */}
      <Image
        src="/images/bubble.png"
        alt="Bubble"
        width={400}
        height={400}
        className="absolute -right-20 top-[20%] transform rotate-12 opacity-30"
      />

      {/* Main Content */}
      <main className="relative z-10 px-4 pt-32 md:pt-48 md:px-8 lg:pt-32 lg:px-24 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="relative mb-16">
          {/* Background Green Card */}
          <div className="absolute inset-0 bg-green-500 rounded-2xl transform -rotate-6 md:-rotate-2 translate-x-2 translate-y-2"></div>

          {/* Main Blue Card */}
          <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-4 translate-x-4"></div>
            <div className="absolute top-8 right-8 w-16 h-16 bg-white/3 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-4 -translate-x-4"></div>

            <div className="relative z-10">
              {/* Location */}
              <div className="flex items-center mb-3">
                <MapPinIcon className="h-4 w-4 mr-2" />
                <span className="text-sm font-medium">{user.address || 'London'}</span>
              </div>

              {/* Welcome Text */}
              <h1 className="text-3xl font-normal mb-8 font-majer break-words">
                Welcome, <span className="text-5xl">{user.fullname || user.username}!</span>
              </h1>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push('/settings')}
                  className="bg-white/90 text-blue-600 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center shadow-sm hover:bg-white transition-colors"
                >
                  <EditprofileIcon />
                  Edit Profile
                </button>

                <button 
                  onClick={() => {
                    const isMobile = window.innerWidth <= 768;

                    if (isMobile) {
                      router.push('/#MobileBookingForm');
                    } else {
                      router.push('/#booking');
                    }
                  }}
                  className="bg-white/90 text-blue-600 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center shadow-sm hover:bg-white transition-colors"
                >
                  <BookUsIcon />
                  Book Us
                </button>

                <button 
                onClick={() => setShowSubscription(!showSubscription)}
                className="bg-white/90 text-blue-600 px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center shadow-sm hover:bg-white transition-colors">
                  <SubscriptionIcon />
                  Subscription
                </button>
              </div>
            </div>
          </div>
        </div>

        

        {/* Subscription Success Message */}
        {subscriptionSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Subscription Created Successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your subscription has been activated. You can now manage it below.</p>
                </div>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setSubscriptionSuccess(false)}
                  className="inline-flex text-green-400 hover:text-green-600"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Subscription Management */}
        {showSubscription && (
          <div className="rounded-lg p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#538FDF] md:text-xl">
                Subscription History
              </h2>
              <button 
                onClick={() => setShowSubscription(false)}
                className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors"
              >
                Hide
              </button>
            </div>
            <SubscriptionManagement />
          </div>
        )}

        <div className="">
          {/* Order History */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-[#538FDF] md:text-xl">
                Order History
              </h2>
              <button className="text-blue-500 text-sm font-medium hover:text-blue-600 transition-colors">
                See All
              </button>
            </div>
            <div className="space-y-3">
              {orderHistory.length > 0 ? (
                orderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-2 h-10 bg-blue-500 rounded-full mr-3"></div>
                        <div>
                          <h3 className="font-medium font-majer text-[#538FDF]">
                            {order.service}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mt-1 space-y-1 sm:space-y-0 sm:space-x-4">
                            <div className="flex items-center">
                              <LocationIcon />
                              <span className="text-[#538FDF] font-majer">
                                {order.location}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <DateIcon />
                              <span className="text-[#538FDF] font-majer">
                                {order.date}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <TimeRange />
                              <span className="text-[#538FDF] font-majer">
                                {order.time}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold font-majer text-[#538FDF]">
                          {order.price}
                        </div>
                        
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-100 text-center">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No orders yet</h3>
                  <p className="text-gray-500 mb-4">Start by booking your first service with us!</p>
                  <button 
                    onClick={() => {
                      const isMobile = window.innerWidth <= 768;
                      if (isMobile) {
                        router.push('/#MobileBookingForm');
                      } else {
                        router.push('/#booking');
                      }
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </main>
      </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
