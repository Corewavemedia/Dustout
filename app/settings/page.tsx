"use client";

import React, { useEffect, useState } from "react";
import { ChevronRightIcon, ArrowLeftOnRectangleIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import { useAuth } from '@/lib/auth-context';
import toast, { Toaster } from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

interface UserSettings {
  user: {
    id: string;
    username: string;
    email: string;
    fullname?: string;
    address?: string;
    phone?: string;
  };
  paymentMethod: PaymentMethod | null;
  hasActiveSubscription: boolean;
}

type DropdownType = 'payment' | 'username' | 'password' | null;

const EditProfile = () => {
  const router = useRouter();
  const { user, loading: authLoading, signOut, token } = useAuth();
  
  // State management
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [newUsername, setNewUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/signin');
    }
  }, [user, authLoading, router]);
  
  // Fetch user settings on component mount
  useEffect(() => {
    if (user && token) {
      fetchUserSettings();
    }
  }, [user, token]);
  
  // Check for payment method update success
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment_method') === 'updated') {
      toast.success('Payment method updated successfully!');
      fetchUserSettings(); // Refresh data
      // Clean up URL
      window.history.replaceState({}, '', '/settings');
    } else if (urlParams.get('payment_method') === 'cancelled') {
      toast.error('Payment method update was cancelled.');
      // Clean up URL
      window.history.replaceState({}, '', '/settings');
    }
  }, []);

  // API Functions
  const fetchUserSettings = async () => {
    try {
      const response = await fetch('/api/user/settings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserSettings(data);
      } else {
        toast.error('Failed to load user settings');
      }
    } catch (error) {
      console.error('Error fetching user settings:', error);
      toast.error('Failed to load user settings');
    }
  };
  
  const updateUsername = async () => {
    if (!newUsername.trim()) {
      toast.error('Please enter a new username');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          updateType: 'username',
          username: newUsername.trim()
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Username updated successfully!');
        setUserSettings(prev => prev ? { ...prev, user: data.user } : null);
        setNewUsername('');
        setActiveDropdown(null);
      } else {
        toast.error(data.error || 'Failed to update username');
      }
    } catch (error) {
      console.error('Error updating username:', error);
      toast.error('Failed to update username');
    } finally {
      setLoading(false);
    }
  };
  
  const updatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          updateType: 'password',
          currentPassword,
          newPassword
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('Password updated successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setActiveDropdown(null);
      } else {
        toast.error(data.error || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
    } finally {
      setLoading(false);
    }
  };
  
  const updatePaymentMethod = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/user/settings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Redirect to Stripe checkout session
        window.location.href = data.url;
      } else {
        toast.error(data.error || 'Failed to setup payment method update');
      }
    } catch (error) {
      console.error('Error setting up payment method update:', error);
      toast.error('Failed to setup payment method update');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };
  
  const closeDropdown = () => {
    setActiveDropdown(null);
    setNewUsername('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };
  
  const formatCardBrand = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
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
              <span className="font-medium">Username:</span> {userSettings?.user.username || user.username}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Email:</span> {userSettings?.user.email || user.email}
            </p>
            {userSettings?.user.fullname && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Full Name:</span> {userSettings.user.fullname}
              </p>
            )}
            {userSettings?.paymentMethod && (
              <p className="text-sm text-gray-600">
                <span className="font-medium">Payment Method:</span> {formatCardBrand(userSettings.paymentMethod.card?.brand || '')} ending in {userSettings.paymentMethod.card?.last4}
              </p>
            )}
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 transition-colors cursor-pointer group hover:bg-white/90" onClick={() => setActiveDropdown(activeDropdown === 'payment' ? null : 'payment')}>
            <div className="flex items-center justify-between">
              <span className="text-[#12B368] font-normal font-majer">
                Payment Information
              </span>
              <ChevronRightIcon className={`h-5 w-5 text-[#12B368] group-hover:translate-x-1 transition-transform ${activeDropdown === 'payment' ? 'rotate-180' : ''}`} />
            </div>
            
            {activeDropdown === 'payment' && (
              <div className="mt-4 space-y-4">
                {userSettings?.paymentMethod ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700">Current Payment Method</p>
                      <p className="text-sm text-gray-600">
                        {formatCardBrand(userSettings.paymentMethod.card?.brand || '')} •••• •••• •••• {userSettings.paymentMethod.card?.last4}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expires {userSettings.paymentMethod.card?.exp_month}/{userSettings.paymentMethod.card?.exp_year}
                      </p>
                    </div>
                    
                    <button
                      onClick={updatePaymentMethod}
                      disabled={loading}
                      className="w-full bg-[#538FDF] text-white py-2 px-4 rounded-lg hover:bg-[#4a7bc8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Setting up...' : 'Update Payment Method'}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">No payment method on file</p>
                    <button
                      onClick={updatePaymentMethod}
                      disabled={loading}
                      className="w-full bg-[#538FDF] text-white py-2 px-4 rounded-lg hover:bg-[#4a7bc8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Setting up...' : 'Add Payment Method'}
                    </button>
                  </div>
                )}
                
                <button
                  onClick={closeDropdown}
                  className="w-full text-gray-500 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 transition-colors cursor-pointer group hover:bg-white/90">
             <div className="flex items-center justify-between" onClick={() => setActiveDropdown(activeDropdown === 'username' ? null : 'username')}>
               <span className="text-[#12B368] font-normal font-majer">
                 Username
               </span>
               <ChevronRightIcon className={`h-5 w-5 text-[#12B368] group-hover:translate-x-1 transition-transform ${activeDropdown === 'username' ? 'rotate-90' : ''}`} />
             </div>
             
             {activeDropdown === 'username' && (
               <div className="mt-4 space-y-4">
                 <div className="space-y-3">
                   <div className="p-3 bg-gray-50 rounded-lg">
                     <p className="text-sm font-medium text-gray-700">Current Username</p>
                     <p className="text-sm text-gray-600">{userSettings?.user.username || user.username}</p>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">New Username</label>
                     <input
                       type="text"
                       value={newUsername}
                       onChange={(e) => setNewUsername(e.target.value)}
                       placeholder="Enter new username"
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#538FDF] focus:border-transparent"
                     />
                   </div>
                   
                   <button
                     onClick={updateUsername}
                     disabled={loading || !newUsername.trim()}
                     className="w-full bg-[#538FDF] text-white py-2 px-4 rounded-lg hover:bg-[#4a7bc8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {loading ? 'Updating...' : 'Update Username'}
                   </button>
                 </div>
                 
                 <button
                   onClick={closeDropdown}
                   className="w-full text-gray-500 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                 >
                   Cancel
                 </button>
               </div>
             )}
           </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 transition-colors cursor-pointer group hover:bg-white/90">
             <div className="flex items-center justify-between" onClick={() => setActiveDropdown(activeDropdown === 'password' ? null : 'password')}>
               <span className="text-[#12B368] font-normal font-majer">
                 Password
               </span>
               <ChevronRightIcon className={`h-5 w-5 text-[#12B368] group-hover:translate-x-1 transition-transform ${activeDropdown === 'password' ? 'rotate-90' : ''}`} />
             </div>
             
             {activeDropdown === 'password' && (
               <div className="mt-4 space-y-4">
                 <div className="space-y-3">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                     <div className="relative">
                       <input
                         type={showCurrentPassword ? 'text' : 'password'}
                         value={currentPassword}
                         onChange={(e) => setCurrentPassword(e.target.value)}
                         placeholder="Enter current password"
                         className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#538FDF] focus:border-transparent"
                       />
                       <button
                         type="button"
                         onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                         className="absolute inset-y-0 right-0 pr-3 flex items-center"
                       >
                         {showCurrentPassword ? (
                           <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                         ) : (
                           <EyeIcon className="h-5 w-5 text-gray-400" />
                         )}
                       </button>
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                     <div className="relative">
                       <input
                         type={showNewPassword ? 'text' : 'password'}
                         value={newPassword}
                         onChange={(e) => setNewPassword(e.target.value)}
                         placeholder="Enter new password"
                         className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#538FDF] focus:border-transparent"
                       />
                       <button
                         type="button"
                         onClick={() => setShowNewPassword(!showNewPassword)}
                         className="absolute inset-y-0 right-0 pr-3 flex items-center"
                       >
                         {showNewPassword ? (
                           <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                         ) : (
                           <EyeIcon className="h-5 w-5 text-gray-400" />
                         )}
                       </button>
                     </div>
                   </div>
                   
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                     <div className="relative">
                       <input
                         type={showConfirmPassword ? 'text' : 'password'}
                         value={confirmPassword}
                         onChange={(e) => setConfirmPassword(e.target.value)}
                         placeholder="Confirm new password"
                         className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#538FDF] focus:border-transparent"
                       />
                       <button
                         type="button"
                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                         className="absolute inset-y-0 right-0 pr-3 flex items-center"
                       >
                         {showConfirmPassword ? (
                           <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                         ) : (
                           <EyeIcon className="h-5 w-5 text-gray-400" />
                         )}
                       </button>
                     </div>
                   </div>
                   
                   <button
                     onClick={updatePassword}
                     disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                     className="w-full bg-[#538FDF] text-white py-2 px-4 rounded-lg hover:bg-[#4a7bc8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     {loading ? 'Updating...' : 'Update Password'}
                   </button>
                 </div>
                 
                 <button
                   onClick={closeDropdown}
                   className="w-full text-gray-500 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                 >
                   Cancel
                 </button>
               </div>
             )}
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
      
      {/* Toast Notifications */}
      <Toaster
         position="top-right"
         toastOptions={{
           duration: 4000,
           style: {
             background: '#363636',
             color: '#fff',
           },
           success: {
             duration: 3000,
             style: {
               background: '#4aed88',
               color: '#fff',
             },
           },
         }}
       />
    </div>
  );
};

export default EditProfile;
