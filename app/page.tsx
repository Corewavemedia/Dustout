'use client'

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/Services";
import AboutSection from "@/components/About";
import ContactSection from "@/components/TestimonialSection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import { DesktopBookingForm } from "@/components/DesktopBookingForm";
import { MobileBookingForm } from "@/components/MobileBookingForm";
import PricingSection from "@/components/PricingSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import HowToBookUs from "@/components/HowToBookUs";
import PaymentStatus from "@/components/PaymentStatus";

function HomeContent() {
  const searchParams = useSearchParams();
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success' || paymentStatus === 'cancelled') {
      setShowPaymentStatus(true);
    }
  }, [searchParams]);

  const handleClosePaymentStatus = () => {
    setShowPaymentStatus(false);
    // Clear URL parameters
    window.history.replaceState({}, '', window.location.pathname);
  };

  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        <Hero />
        <AboutSection />
        {/* Mobile Booking Form - shows only on mobile right after About section */}
        <MobileBookingForm />
        <ServicesSection />
        {/* Desktop Booking Form - shows only on desktop */}
        <DesktopBookingForm />
        <PricingSection />
        <WhyChooseUs />
        <HowToBookUs />
        <ContactSection />
      </main>
      <Footer />
      
      {/* Payment Status Modal */}
      {showPaymentStatus && (
        <PaymentStatus onClose={handleClosePaymentStatus} />
      )}
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div></div>}>
      <HomeContent />
    </Suspense>
  );
}
