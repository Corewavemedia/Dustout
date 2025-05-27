'use client';

import { motion } from 'framer-motion';
import {services} from './data/ServicesData';

interface ServicesProps {
  isAboutPage?: boolean;
}

const ServicesSection = ({ isAboutPage = false } : ServicesProps) => {
  return (
    <section id="services" className="py-20 relative overflow-hidden bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
           <div className='pt-16 flex justify-center items-center text-center'>
                <span className="text-4xl sm:text-5xl text-blue-700 font-bold font-majer leading-tight block">
                Our Services
              </span>
            </div>
        </motion.div>

        {/* Mobile view - Vertical cards */}
        <div className={`grid ${isAboutPage ? 'grid-cols-2' : 'grid-cols-1'} gap-8 md:hidden ${isAboutPage ? 'px-2' : 'px-6'} `}>
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1, type: "spring", stiffness: 50 }}
              className={`bg-blue-500 rounded-xl ${isAboutPage ? 'p-4' : 'p-8'}  text-center shadow-md border-2 border-dashed border-r-white`}
            >
              <div className="flex flex-col items-center justify-center">
                <div className="w-16 h-16 mb-4 flex justify-center items-center">
                  <service.icon />
                </div>
                <h3 className="text-white text-lg font-medium">{service.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop view - 3x2 Grid layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 lg:px-40">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1, type: "spring", stiffness: 50 }}
              className="bg-blue-500 rounded-2xl p-8 text-center shadow-md border-2 border-dashed border-white"
            >
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 mb-4">
                  <service.icon />
                </div>
                <h3 className="text-white text-xl font-medium">{service.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
