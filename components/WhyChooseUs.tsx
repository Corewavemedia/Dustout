import React from 'react';
import ExpertiseIcon from './icons/ExpertiseIcon';
import EcoFriendlyIcon from './icons/EcoFriendlyIcon';
import CustomerCareIcon from './icons/CustomerCareIcon';
import HomeHandlingIcon from './icons/HomeHandlingIcon';
import CleaningContainerIcon from './icons/CleaningContainerIcon';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <ExpertiseIcon className="w-20 h-20 text-white" />,
      title: "Exceptional Expertise",
      bgColor: "bg-blue-700",
    },
    {
      icon: <EcoFriendlyIcon className="w-20 h-20 text-white" />,
      title: "Eco-friendly Cleaning Chemicals",
      bgColor: "bg-blue-500",
    },
    {
      icon: <CustomerCareIcon className="w-20 h-20 text-white" />,
      title: "Excellent Customer Care",
      bgColor: "bg-blue-700",
    },
    {
      icon: <CleaningContainerIcon className="w-20 h-20 text-white" />,
      title: "Professional Equipment",
      bgColor: "bg-blue-500",
    },
    {
      icon: <HomeHandlingIcon className="w-20 h-20 text-white" />,
      title: "Exquisite Home Handling",
      bgColor: "bg-blue-700",
    },
    {
      icon: <CleaningContainerIcon className="w-20 h-20 text-white" />,
      title: "Timely Service Delivery",
      bgColor: "bg-blue-500",
    },
  ];

  return (
    <section className="py-16 px-4 md:px-8 bg-white" id="why-choose-us">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-blue-600 mb-16">
          Why Choose Us
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`${feature.bgColor} rounded-lg p-8 flex flex-col items-center text-center transform transition duration-300 hover:scale-105 hover:shadow-xl`}
            >
              <div className="mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs; 