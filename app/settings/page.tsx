"use client";

import React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Navbar from "@/components/Navbar";
import Image from "next/image";

const EditProfile = () => {
  return (
    <div className="min-h-screen bg-blue-50 relative overflow-hidden">
      <Navbar />

      {/* Cloud Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cloudbg.jpg"
          alt="Cloud background"
          fill
          className="object-cover opacity-30"
        />
      </div>

      {/* bubble */}
      <Image
        src="/images/bubble.png"
        alt="Bubble"
        width={400}
        height={400}
        className="absolute -right-20 top-[20%] transform rotate-12 opacity-30"
      />

      {/* Main Content */}
      <main className="relative z-10 px-4 pt-32 md:pt-48 md:px-8 lg:pt-32 max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl md:text-5xl font-semibold text-[#12B368] font-majer mb-4">
            Edit Profile
          </h1>
          {/* Horizontal line */}
          <div className="w-full h-1 bg-[#538FDF]"></div>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          <div className=" backdrop-blur-sm rounded-lg p-4 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <span className="text-[#12B368] font-normal font-majer">
                Payment Information
              </span>
              <ChevronRightIcon className="h-5 w-5 text-[#12B368] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className=" backdrop-blur-sm rounded-lg p-4 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <span className="text-[#12B368] font-normal font-majer">
                Address
              </span>
              <ChevronRightIcon className="h-5 w-5 text-[#12B368] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className=" backdrop-blur-sm rounded-lg p-4 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <span className="text-[#12B368] font-normal font-majer">
                Password
              </span>
              <ChevronRightIcon className="h-5 w-5 text-[#12B368] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className=" backdrop-blur-sm rounded-lg p-4 transition-colors cursor-pointer group">
            <div className="flex items-center justify-between">
              <span className="text-[#12B368] font-normal font-majer">
                Subscription
              </span>
              <ChevronRightIcon className="h-5 w-5 text-[#12B368] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
