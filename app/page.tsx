"use client";

import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/Services";
import AboutSection from "@/components/About";
import ContactSection from "@/components/TestimonialSection";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import BookingForm from "@/components/BookingForm";
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
        <ServicesSection />
        <BookingForm />
        <PricingSection />
        <WhyChooseUs />
        <HowToBookUs />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
