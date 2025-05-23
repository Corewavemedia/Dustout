"use client";

import React, { useState } from "react";
import { Check, Briefcase, Zap, Shield } from "lucide-react";
import Image from "next/image";

const residentialPlans = [
  {
    name: "BASIC CLEANING",
    price: "39",
    features: [
      "Professional Cleaning",
      "3 Bedrooms, 3 toilets",
      "Rug and Carpet",
      "Landscaping 200sqm",
      "Moping and Cleaning",
    ],
    bgColor: "bg-blue-600",
    buttonColor: "bg-green-500",
    hoverButtonColor: "hover:bg-green-600",
    textColor: "text-white",
    checkIconColor: "text-blue-600",
    checkBgColor: "bg-green-200",
  },
  {
    name: "PROFESSIONAL",
    price: "59",
    features: [
      "Professional Cleaning",
      "3 Bedrooms, 3 toilets",
      "Rug and Carpet",
      "Landscaping 200sqm",
      "Moping and Cleaning",
    ],
    bgColor: "bg-blue-600",
    buttonColor: "bg-green-500",
    hoverButtonColor: "hover:bg-green-600",
    textColor: "text-white",
    checkIconColor: "text-blue-600",
    checkBgColor: "bg-green-200",
  },
  {
    name: "PREMIUM",
    price: "79",
    features: [
      "Professional Cleaning",
      "3 Bedrooms, 3 toilets",
      "Rug and Carpet",
      "Landscaping 200sqm",
      "Moping and Cleaning",
    ],
    bgColor: "bg-blue-600",
    buttonColor: "bg-green-500",
    hoverButtonColor: "hover:bg-green-600",
    textColor: "text-white",
    checkIconColor: "text-blue-600",
    checkBgColor: "bg-green-200",
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
    bgColor: "bg-slate-800",
    buttonColor: "bg-yellow-500",
    hoverButtonColor: "hover:bg-yellow-400",
    textColor: "text-gray-100",
    checkIconColor: "text-yellow-500",
    checkBgColor: "bg-slate-700",
    Icon: Briefcase,
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
    bgColor: "bg-gray-900",
    buttonColor: "bg-amber-500",
    hoverButtonColor: "hover:bg-amber-400",
    textColor: "text-gray-50",
    checkIconColor: "text-amber-500",
    checkBgColor: "bg-gray-800",
    Icon: Zap,
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
    bgColor: "bg-black",
    buttonColor: "bg-orange-500",
    hoverButtonColor: "hover:bg-orange-400",
    textColor: "text-white",
    checkIconColor: "text-orange-500",
    checkBgColor: "bg-neutral-800",
    Icon: Shield,
  },
];

const PricingSection = () => {
  const [activeTab, setActiveTab] = useState("residential");

  const plans = activeTab === "residential" ? residentialPlans : industrialPlans;

  return (
    <section
      id="pricing"
      className={`py-16 relative overflow-hidden bg-gradient-to-b  ${activeTab !== "residential" ? "dark:from-neutral-900 dark:to-neutral-950" : "from-white to-gray-100"}`}
    >
      {/* Background image */}
      <div className="absolute -top-40 right-0 w-full h-full opacity-50 z-0 pointer-events-none">
        <Image
          src="/images/bubble.png"
          alt="background pattern"
          layout="fill"
          objectFit="cover"
          className="translate-x-[70%] rotate-12"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${activeTab !== "residential" ? "text-white" : "text-gray-800"}`}>
            Our Pricing Plans
          </h2>
        </div>

        {/* Toggle buttons */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-200 dark:bg-neutral-800 rounded-full p-1 shadow-md">
            <button
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out text-sm md:text-base ${
                activeTab === "residential"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-700"
              }`}
              onClick={() => setActiveTab("residential")}
            >
              Residential
            </button>
            <button
              className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ease-in-out text-sm md:text-base ${
                activeTab === "industrial"
                  ? "bg-slate-700 text-white shadow-lg"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-neutral-700"
              }`}
              onClick={() => setActiveTab("industrial")}
            >
              Industrial
            </button>
          </div>
        </div>

        {/* Pricing cards container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`
                ${plan.bgColor} ${plan.textColor} 
                rounded-xl shadow-2xl overflow-hidden 
                transform transition-all duration-300 hover:scale-105 hover:shadow-blue-400/50 dark:hover:shadow-yellow-400/40
                flex flex-col
              `}
            >
              <div className="p-6 md:p-8 text-center flex-grow">
                <h3 className="text-xl lg:text-2xl font-bold uppercase mb-4 tracking-wider">
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center mb-1">
                  <span className={`text-2xl font-medium ${plan.textColor === 'text-white' || plan.textColor === 'text-gray-50' || plan.textColor === 'text-gray-100' ? 'opacity-80' : 'opacity-70'}`}>£</span>
                  <span className="text-6xl lg:text-7xl font-extrabold mx-1">{plan.price}</span>
                  <span className={`text-xl lg:text-2xl font-bold ${plan.textColor === 'text-white' || plan.textColor === 'text-gray-50' || plan.textColor === 'text-gray-100' ? 'opacity-80' : 'opacity-70'}`}>.99</span>
                </div>
                <p className={`mt-0 mb-6 text-sm ${plan.textColor === 'text-white' || plan.textColor === 'text-gray-50' || plan.textColor === 'text-gray-100' ? 'opacity-70' : 'opacity-60'}`}>Per Month</p>
                
                <ul className="text-left space-y-3 mb-8 text-sm md:text-base">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className={`rounded-md p-1 mr-3 flex-shrink-0 ${plan.checkBgColor} shadow-sm`}>
                        <Check className={`h-4 w-4 ${plan.checkIconColor}`} />
                      </div>
                      <span className={`${plan.textColor === 'text-white' || plan.textColor === 'text-gray-50' || plan.textColor === 'text-gray-100' ? 'opacity-90' : ''}`}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 md:p-8 mt-auto">
                <button 
                  className={`w-full ${plan.buttonColor} ${plan.hoverButtonColor} 
                  ${plan.textColor === "text-white" || plan.textColor === "text-gray-50" || plan.textColor === "text-gray-100" ? "text-white" : "text-gray-800"} 
                  font-semibold py-3 rounded-lg transition-colors duration-300 text-base md:text-lg shadow-md hover:shadow-lg_UPPERCASE}$
                  uppercase tracking-wider
                  `}
                >
                  Choose
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
