'use client';

import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WhyChooseUs from '../../components/WhyChooseUs';
import OurTeam from '@/components/aboutPageComponents/OurTeam';
import ServicesSection from '@/components/Services';
import AboutSection from '@/components/aboutPageComponents/AboutSection';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* About Section */}
      <AboutSection />

      {/* Services Section */}
      <ServicesSection isAboutPage={true} />

      {/* Why Choose Us Section */}
      <WhyChooseUs isAboutPage={true} />

      {/* Team Section */}
      <OurTeam />
      
      <Footer />
    </div>
  );
};

export default AboutPage;