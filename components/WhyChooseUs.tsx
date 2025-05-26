import React from 'react';
import { motion } from 'framer-motion';
import ExpertiseIcon from './icons/ExpertiseIcon';
import EcoFriendlyIcon from './icons/EcoFriendlyIcon';
import CustomerCareIcon from './icons/CustomerCareIcon';
import HomeHandlingIcon from './icons/HomeHandlingIcon';
import CleaningContainerIcon from './icons/CleaningContainerIcon';

interface WhyChooseUsProps {
  isAboutPage?: boolean;
}

const WhyChooseUs = ({ isAboutPage = false }: WhyChooseUsProps) => {
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

  // Animation variants for staggered children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Animation for each card
  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8, rotateY: 90 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      rotateY: 0,
      transition: { 
        type: "spring", 
        stiffness: 50,
        duration: 0.2
      } 
    },
    hover: { 
      scale: 1.05, 
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="py-16 px-4 md:px-8 bg-white" id="why-choose-us">
      <div className="container mx-auto">
        <motion.h2 
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, type: "spring" }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold font-majer text-center text-blue-600 mb-16"
        >
          Why Choose Us
        </motion.h2>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={`grid ${isAboutPage ? 'grid-cols-2' : 'grid-cols-1'} md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-6`}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              variants={cardVariants}
              whileHover="hover"
              className={`${feature.bgColor} rounded-lg p-4 flex flex-col items-center text-center`}
            >
              <motion.div 
                className="mb-4"
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "linear" }}
              >
                {feature.icon}
              </motion.div>
              <motion.h3 
                className="text-xl font-medium font-majer text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {feature.title}
              </motion.h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;