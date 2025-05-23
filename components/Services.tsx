'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import LandscapingIcon from './icons/LandscapingIcon';
import ResidentialCleaningIcon from './icons/ResidentialCleaningIcon';
import IndustrialCleaningIcon from './icons/IndustrialCleaningIcon';
import FumigationIcon from './icons/FumigationIcon';
import RefuseDisposalIcon from './icons/RefuseDisposalIcon';
import DeepCleaningIcon from './icons/DeepCleaningIcon';

// Updated services array to match the image
const services = [
  {
    id: 1,
    title: 'Landscaping',
    icon: LandscapingIcon,
  },
  {
    id: 2,
    title: 'Residential Cleaning',
    icon: ResidentialCleaningIcon,
  },
  {
    id: 3,
    title: 'Industrial Cleaning',
    icon: IndustrialCleaningIcon,
  },
  {
    id: 4,
    title: 'Fumigation',
    icon: FumigationIcon,
  },
  {
    id: 5,
    title: 'Refuse Disposal',
    icon: RefuseDisposalIcon,
  },
  {
    id: 6,
    title: 'Deep Cleaning',
    icon: DeepCleaningIcon,
  }
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 relative overflow-hidden bg-sky-50">
      {/* Background bubbles */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/bubble.png"
          alt="Bubble"
          width={200}
          height={200}
          className="absolute top-20 left-10 opacity-20"
        />
        <Image
          src="/images/bubble.png"
          alt="Bubble"
          width={100}
          height={100}
          className="absolute top-40 right-20 opacity-15"
        />
        <Image
          src="/images/bubble.png"
          alt="Bubble"
          width={150}
          height={150}
          className="absolute bottom-20 left-1/4 opacity-25"
        />
        <Image
          src="/images/bubble.png"
          alt="Bubble"
          width={80}
          height={80}
          className="absolute bottom-40 right-1/3 opacity-20"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl text-blue-600 mb-4">Our Services</h2>
        </motion.div>

        {/* Mobile view - Vertical cards */}
        <div className="grid grid-cols-1 gap-8 md:hidden">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.1, type: "spring", stiffness: 50 }}
              className="bg-blue-500 rounded-xl p-8 text-center shadow-md"
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-10">
                  <service.icon />
                </div>
                <h3 className="text-white text-lg font-medium">{service.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop view - 3x2 Grid layout */}
        <div className="hidden md:grid md:grid-cols-3 gap-8">
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
