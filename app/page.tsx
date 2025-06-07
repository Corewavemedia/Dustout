"use client";

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

export default function Home() {
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
    </>
  );
}
