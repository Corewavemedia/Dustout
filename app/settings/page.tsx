"use client";

import React, { useEffect } from "react";
import { ChevronRightIcon, ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useAuth } from '@/lib/auth-context';

const EditProfile = () => {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

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

        {/* User Info */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-[#538FDF] mb-2">Account Information</h2>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Username:</span> {user.username}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Email:</span> {user.email}
            </p>
            {user.fullname && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Full Name:</span> {user.fullname}
              </p>
            )}
            {user.address && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Address:</span> {user.address}
              </p>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 transition-colors cursor-pointer group hover:bg-white/90">
            <div className="flex items-center justify-between">
              <span className="text-[#12B368] font-normal font-majer">
                Payment Information
              </span>
              <ChevronRightIcon className="h-5 w-5 text-[#12B368] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 transition-colors cursor-pointer group hover:bg-white/90">
            <div className="flex items-center justify-between">
              <span className="text-[#12B368] font-normal font-majer">
                Address
              </span>
              <ChevronRightIcon className="h-5 w-5 text-[#12B368] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 transition-colors cursor-pointer group hover:bg-white/90">
            <div className="flex items-center justify-between">
              <span className="text-[#12B368] font-normal font-majer">
                Password
              </span>
              <ChevronRightIcon className="h-5 w-5 text-[#12B368] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 transition-colors cursor-pointer group hover:bg-white/90">
            <div className="flex items-center justify-between">
              <span className="text-[#12B368] font-normal font-majer">
                Subscription
              </span>
              <ChevronRightIcon className="h-5 w-5 text-[#12B368] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Sign Out Button */}
          <div 
            onClick={handleSignOut}
            className="bg-red-50 border border-red-200 rounded-lg p-4 transition-colors cursor-pointer group hover:bg-red-100"
          >
            <div className="flex items-center justify-between">
              <span className="text-red-600 font-normal font-majer">
                Sign Out
              </span>
              <ArrowLeftOnRectangleIcon className="h-5 w-5 text-red-600 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditProfile;
