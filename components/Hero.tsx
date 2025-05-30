"use client";

import React from 'react';
import Image from "next/image";
import Link from "next/link";

// Services array for the scrolling ribbons
const services = [
  "Residential Cleaning",
  "Commercial Cleaning",
  "Fumigation",
  "Landscaping",
];

// Client images 
const clients = ["/images/person3.jpg", "/images/person2.jpg", "/images/person1.jpg", "/images/person4.jpg"];

export default function Hero() {
  return (
    <>
      <section className="relative overflow-hidden bg-blue-50 2xl:pt-24 lg:px-24">
        {/* Cloud background overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/cloudbg.jpg"
            alt="Cloud Background"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        
        {/* Background bubbles */}
        <div className="absolute inset-0 pointer-events-none z-5">
          <Image
            src="/images/bubble.png"
            alt="Bubble"
            width={200}
            height={200}
            className="absolute top-20 left-10 opacity-30"
          />
          <Image
            src="/images/bubble.png"
            alt="Bubble"
            width={100}
            height={100}
            className="absolute top-40 right-20 opacity-20"
          />
          <Image
            src="/images/bubble.png"
            alt="Bubble"
            width={150}
            height={150}
            className="absolute bottom-20 left-1/4 opacity-50"
          />
          <Image
            src="/images/bubble.png"
            alt="Bubble"
            width={80}
            height={80}
            className="absolute bottom-40 right-1/3 opacity-30"
          />
          {/* Big bubble center */}
          <Image
            src="/images/bubble.png"
            alt="Bubble"
            width={400}
            height={400}
            className="absolute -right-20 top-[20%] transform rotate-12 opacity-30"
          />
          {/* Smallest bubble */}
          <Image
            src="/images/bubble.png"
            alt="Bubble"
            width={50}
            height={50}
            className="absolute bottom-[25%] left-[20%] opacity-30"
          />
        </div>

        {/* Mobile layout - hidden on medium screens and up */}
        <div className="md:hidden relative z-20 mx-auto px-5 pt-32 pb-16 flex flex-col h-screen">
          {/* Hero Text Content - Centered */}
          <div className="flex-1 flex flex-col justify-center items-center text-center mb-6">
            <h1 className="font-bold leading-tight mb-6 font-majer">
              <span className="text-4xl sm:text-5xl text-green-500 block">
                We Clean;
              </span>
              <span className="text-4xl sm:text-5xl text-blue-700 block mt-1">
                So You Don&apos;t
              </span>
              <span className="text-4xl sm:text-5xl text-blue-700 block mt-1">
                Have To
              </span>
            </h1>

            <div className="flex flex-row gap-4 mt-6 font-majer">
              <Link
                href="#about"
                className="bg-green-500 text-white font-normal px-8 py-3 rounded-xl text-center shadow-lg hover:bg-opacity-90 transition-all"
              >
                Get Started
              </Link>
              <Link
                href="#booking"
                className="bg-white text-blue-500 border-2 border-blue-500 font-normal px-8 py-3 rounded-xl text-center shadow-lg hover:bg-opacity-90 transition-all"
              >
                Book Us
              </Link>
            </div>
          </div>

          {/* Hero Image - Centered and wider */}
          <div className="flex justify-center items-center relative min-h-[280px] w-[1000%] max-w-[450px] mx-auto">
            <Image
              src="/images/rectangle-13.png"
              alt="Cleaning Tools"
              fill
              className="object-contain scale-150 transfrom -translate-y-[40%] -translate-x-[50%]"
              priority
            />
          </div>

          {/* Service Ribbons for Mobile */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden">
            {/* Blue Ribbon */}
            <div className="relative bg-blue-600 py-2 transform -rotate-2 z-10">
              <div className="flex space-x-5 animate-marquee whitespace-nowrap">
                {Array(5)
                  .fill(services)
                  .flat()
                  .map((service, i) => (
                    <span key={i} className="text-white mx-4 font-medium text-sm">
                      <span className="text-white">+</span> {service}
                    </span>
                  ))}
              </div>
            </div>

            {/* Green Ribbon */}
            <div className="relative bg-green-500 py-2 transform rotate-2">
              <div className="flex space-x-5 animate-marquee2 whitespace-nowrap">
                {Array(5)
                  .fill(services)
                  .flat()
                  .map((service, i) => (
                    <span key={i} className="text-white mx-4 font-medium text-sm">
                      <span className="text-white">+</span> {service}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop layout - only visible on medium screens and up */}
        <div className="hidden md:block relative h-screen">
          <div className="relative z-20 mx-auto max-w-7xl px-4 pt-15 pb-10 sm:px-6 lg:px-8 top-48">
            <div className="grid grid-cols-2 gap-8 items-center">
              {/* Left Column - Text Content */}
              <div>
                <h1 className="text-left font-bold leading-tight font-majer">
                  <span className="text-5xl md:text-6xl text-green-500">
                    We Clean;
                  </span>
                  <br />
                  <span className="text-5xl md:text-6xl text-blue-700">
                    So You Don&apos;t
                  </span>
                  <br />
                  <span className="text-5xl md:text-6xl text-blue-700">
                    Have To
                  </span>
                </h1>

                <div className="flex flex-row gap-4 mt-10 font-majer">
                  <Link
                    href="#about"
                    className="bg-green-500 text-white font-normal px-8 py-3 rounded-xl shadow-lg hover:bg-opacity-90 transition-all"
                  >
                    Get Started
                  </Link>
                  <Link
                    href="#booking"
                    className="bg-white border-2 border-blue-500 text-blue-500 font-normal px-8 py-3 rounded-xl shadow-lg hover:bg-opacity-90 transition-all"
                  >
                    Book Us
                  </Link>
                </div>

                {/* Client Avatars */}
                <div className="mt-8">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {clients.map((client, i) => (
                        <div
                          key={i}
                          className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white"
                        >
                          <Image
                            src={client}
                            alt={`Client ${i + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="ml-4 text-sm text-gray-600">
                      5000+ Clients
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column - Image */}
              <div className="relative overflow-visible min-h-[400px]">
                <div className="absolute inset-0 -left-[100%] -top-[90%] w-[200%] h-[200%]">
                  <Image
                    src="/images/rectangle-13.png"
                    alt="Cleaning Tools"
                    fill
                    className="object-contain origin-top-right"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Additional bubbles for desktop */}
          <Image
            src="/images/bubble.png"
            alt="Bubble Large"
            width={600}
            height={600}
            className="absolute -top-[15%] rotate-12 scale-150 transform left-[20%] opacity-60 z-10"
          />
        </div>
      </section>
      
      {/* Service Ribbons Section - Separate section below hero */}
      <section className="hidden md:block relative w-full overflow-hidden bg-blue-50 py-16">
        <div className="flex flex-col justify-center items-center">
          {/* Blue Ribbon */}
          <div className="relative bg-blue-600 py-2 transform -rotate-3 scale-110 z-10 h-11 w-[110%]">
            <div className="flex space-x-5 animate-marquee whitespace-nowrap">
              {Array(5)
                .fill(services)
                .flat()
                .map((service, i) => (
                  <span key={i} className="text-white mx-4 font-medium">
                    <span className="text-white">+</span> {service}
                  </span>
                ))}
            </div>
          </div>
          
          {/* Green Ribbon */}
          <div className="relative bg-green-500 py-2 transform rotate-6 scale-110 h-11 w-[110%] mt-2">
            <div className="flex space-x-5 animate-marquee2 whitespace-nowrap">
              {Array(5)
                .fill(services)
                .flat()
                .map((service, i) => (
                  <span key={i} className="text-white mx-4 font-medium">
                    <span className="text-white">+</span> {service}
                  </span>
                ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}