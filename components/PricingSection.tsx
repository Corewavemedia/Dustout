"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SubscriptionModal from "./SubscriptionModal";

const residentialPlans = [
  {
    name: "BASIC CLEANING",
    price: "39",
    features: [
      "Professional Cleaning",
      "3 bedrooms, 3 toilets",
      "Rug and Carpet",
      "Landscaping 200sqm",
      "Moping and Cleaning",
    ],
  },
  {
    name: "PROFESSIONAL",
    price: "59",
    features: [
      "Professional Cleaning",
      "3 bedrooms, 3 toilets",
      "Rug and Carpet",
      "Landscaping 200sqm",
      "Moping and Cleaning",
    ],
  },
  {
    name: "PREMIUM",
    price: "79",
    features: [
      "Professional Cleaning",
      "3 bedrooms, 3 toilets",
      "Rug and Carpet",
      "Landscaping 200sqm",
      "Moping and Cleaning",
    ],
  },
];

const industrialPlans = [
  {
    name: "STANDARD DUTY",
    price: "199",
    features: [
      "Factory Floor Cleaning",
      "Heavy Machinery Degreasing",
      "Waste Disposal Management",
      "High-Pressure Surface Cleaning",
      "Safety Compliance Checks",
    ],
  },
  {
    name: "HEAVY DUTY",
    price: "349",
    features: [
      "All Standard Duty Features",
      "Chemical Spill Cleanup",
      "Ventilation System Cleaning",
      "Confined Space Cleaning",
      "24/7 Emergency Support",
    ],
  },
  {
    name: "CRITICAL RESPONSE",
    price: "599",
    features: [
      "All Heavy Duty Features",
      "Hazardous Material Handling",
      "Post-Incident Decontamination",
      "Specialized Equipment Cleaning",
      "Dedicated Site Supervisor",
    ],
  },
];

const PricingSection = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("residential");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);

  const plans = activeTab === "residential" ? residentialPlans : industrialPlans;

  const handleChoosePlan = (plan: any) => {
    // Check if user is signed in
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to signin if not authenticated
      router.push('/signin');
      return;
    }

    // Open subscription modal with selected plan
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

        {/* Pricing cards container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-b from-[#176FD4] to-[#0C3A6E] text-white rounded-xl overflow-hidden flex flex-col"
            >
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold text-[#CDFFE8] mb-4">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center mb-1">
                  <span className="text-2xl">£</span>
                  <span className="text-6xl font-bold font-majer mx-1">{plan.price}</span>
                  <span className="text-xl font-majer">.99</span>
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
          ))}
        </div>
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
