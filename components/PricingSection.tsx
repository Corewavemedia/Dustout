"use client";

import React, { useState, useEffect } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SubscriptionModal from "./SubscriptionModal";
import { useAuth } from "@/lib/auth-context";

interface Plan {
  id: string;
  name: string;
  type: string;
  price: number;
  features: string[];
  isActive: boolean;
}



const PricingSection = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("residential");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchSubscriptionPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/subscription-plans');
        
        if (!response.ok) {
          throw new Error('Failed to fetch subscription plans');
        }
        
        const data = await response.json();
        setSubscriptionPlans(data.plans || []);
      } catch (err) {
        console.error('Error fetching subscription plans:', err);
        setError('Failed to load subscription plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubscriptionPlans();
  }, []);

  // Filter plans based on active tab
  const plans = Array.isArray(subscriptionPlans) ? subscriptionPlans.filter(plan => 
    plan.isActive && plan.type.toLowerCase() === activeTab
  ) : [];

  // Add to the handleChoosePlan function
  const handleChoosePlan = (plan: Plan) => {
    if (!user) {
      router.push('/signin?redirect=/#pricing');
      return;
    }
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <section
      id="pricing"
      className={`py-16 relative overflow-hidden ${activeTab === "residential" ? "bg-blue-50" : "bg-white"}`}
    >
      {/* Background bubbles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <Image
          src="/images/bubble.png"
          alt="Background Bubble"
          width={600}
          height={600}
          className="absolute top-0 right-0 opacity-20 translate-x-1/2 -translate-y-1/4"
        />
      </div>

       {/* Dark blue background at the bottom */}
       <div className="absolute hidden md:block bottom-0 left-0 right-0 h-80 bg-[#020223]" aria-hidden="true"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Toggle buttons */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-xl overflow-hidden">
            <button
              className={`px-8 py-2 font-medium font-majer transition-all duration-300 ease-in-out ${
                activeTab === "residential"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
              onClick={() => setActiveTab("residential")}
            >
              Residential
            </button>
            <button
              className={`px-8 py-2 font-medium font-majer transition-all duration-300 ease-in-out ${
                activeTab === "industrial"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
              onClick={() => setActiveTab("industrial")}
            >
              Industrial
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-blue-600 font-medium">Loading subscription plans...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md mx-auto">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Pricing cards container */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-600 text-lg">No {activeTab} plans available at the moment.</p>
                <p className="text-gray-500 text-sm mt-2">Please check back later or contact support.</p>
              </div>
            ) : (
              plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className="bg-gradient-to-b from-[#176FD4] to-[#0C3A6E] text-white rounded-xl overflow-hidden flex flex-col"
                >
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-bold text-[#CDFFE8] mb-4">
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center mb-1">
                      <span className="text-2xl">£</span>
                      <span className="text-6xl font-bold font-majer mx-1">{Math.floor(plan.price)}</span>
                      <span className="text-xl font-majer">{(plan.price % 1 > 0) ? 
                        `.${Math.round((plan.price % 1) * 100)}` : 
                        '.00'}</span>
                    </div>
                    <p className="mt-0 mb-4 text-sm opacity-80 font-majer">Monthly</p>
                    
                    <ul className="text-left space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <div className="bg-green-200 rounded-md p-1 mr-2">
                            <Check className="h-4 w-4 text-blue-600" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 mt-auto">
                    <button 
                      onClick={() => handleChoosePlan(plan)}
                      className="w-full bg-green-500 text-white font-majer font-medium py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
                    >
                      Choose
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlan={selectedPlan}
        planType={activeTab as "residential" | "industrial"}
      />
    </section>
  );
};

export default PricingSection;
