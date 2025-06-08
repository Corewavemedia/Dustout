"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import DashboardOverview from "@/components/admin/DashboardOverview";
import Footer from "@/components/Footer";

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  // Function to render the active component based on the selected tab
  const renderActiveComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardOverview />;
      case "manage-staff":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Manage Staff</h1>
            <p>Staff management functionality will be implemented here.</p>
          </div>
        );
      case "booking":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Booking</h1>
            <p>Booking functionality will be implemented here.</p>
          </div>
        );
      case "clients":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Clients</h1>
            <p>Client management functionality will be implemented here.</p>
          </div>
        );
      case "profile":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Profile</h1>
            <p>Profile management functionality will be implemented here.</p>
          </div>
        );
      case "settings":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p>Settings functionality will be implemented here.</p>
          </div>
        );
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50 p-10">
      {/* Cloud Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/cloudbg.jpg"
          alt="Cloud background"
          fill
          className="object-cover opacity-10"
        />
      </div>

      {/* bubble */}
      <Image
        src="/images/bubble.png"
        alt="Bubble"
        width={400}
        height={400}
        className="absolute -right-20 top-[20%] hidden transform rotate-12 opacity-30"
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 shadow-md z-10 flex-shrink-0 hidden md:flex flex-col h-screen sticky top-0 left-0">
          {/* Logo */}
          <div className="p-4 md:p-8 bg-white rounded-xl">
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src="/images/dustoutcolor.png"
                  alt="DustOut Logo"
                  width={150}
                  height={40}
                  className="object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 mt-11 overflow-y-auto py-2 bg-[#C9E0FE] rounded-xl">
            <ul className="space-y-2 px-2 font-majer">
              <li>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center p-4 text-sm rounded-md transition-colors ${
                    activeTab === "dashboard"
                      ? "bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white"
                      : "text-[#538FDF] hover:bg-gray-100 bg-white"
                  }`}
                >
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-3"
                  >
                    <path
                      d="M19.25 3.5V6.125C19.25 6.58913 19.0656 7.03425 18.7374 7.36244C18.4092 7.69062 17.9641 7.875 17.5 7.875H13.125C12.6609 7.875 12.2158 7.69062 11.8876 7.36244C11.5594 7.03425 11.375 6.58913 11.375 6.125V3.5C11.375 3.03587 11.5594 2.59075 11.8876 2.26256C12.2158 1.93437 12.6609 1.75 13.125 1.75H17.5C17.9641 1.75 18.4092 1.93437 18.7374 2.26256C19.0656 2.59075 19.25 3.03587 19.25 3.5ZM7.875 13.125H3.5C3.03587 13.125 2.59075 13.3094 2.26256 13.6376C1.93437 13.9658 1.75 14.4109 1.75 14.875V17.5C1.75 17.9641 1.93437 18.4092 2.26256 18.7374C2.59075 19.0656 3.03587 19.25 3.5 19.25H7.875C8.33913 19.25 8.78425 19.0656 9.11244 18.7374C9.44062 18.4092 9.625 17.9641 9.625 17.5V14.875C9.625 14.4109 9.44062 13.9658 9.11244 13.6376C8.78425 13.3094 8.33913 13.125 7.875 13.125Z"
                      fill="white"
                    />
                    <path
                      d="M9.625 3.5V9.625C9.625 10.0891 9.44062 10.5342 9.11244 10.8624C8.78425 11.1906 8.33913 11.375 7.875 11.375H3.5C3.03587 11.375 2.59075 11.1906 2.26256 10.8624C1.93437 10.5342 1.75 10.0891 1.75 9.625V3.5C1.75 3.03587 1.93437 2.59075 2.26256 2.26256C2.59075 1.93437 3.03587 1.75 3.5 1.75H7.875C8.33913 1.75 8.78425 1.93437 9.11244 2.26256C9.44062 2.59075 9.625 3.03587 9.625 3.5ZM17.5 9.625H13.125C12.6609 9.625 12.2158 9.80937 11.8876 10.1376C11.5594 10.4658 11.375 10.9109 11.375 11.375V17.5C11.375 17.9641 11.5594 18.4092 11.8876 18.7374C12.2158 19.0656 12.6609 19.25 13.125 19.25H17.5C17.9641 19.25 18.4092 19.0656 18.7374 18.7374C19.0656 18.4092 19.25 17.9641 19.25 17.5V11.375C19.25 10.9109 19.0656 10.4658 18.7374 10.1376C18.4092 9.80937 17.9641 9.625 17.5 9.625Z"
                      fill="white"
                    />
                  </svg>
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("manage-staff")}
                  className={`w-full flex items-center p-4 text-sm rounded-md transition-colors ${
                    activeTab === "manage-staff"
                      ? "bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white"
                      : "text-[#538FDF] hover:bg-gray-100 bg-white"
                  }`}
                >
                  <svg
                    width="20"
                    height="23"
                    viewBox="0 0 20 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-3"
                  >
                    <path
                      d="M5.95817 12.0312C4.56646 12.0312 3.43734 13.0451 3.43734 14.2946C3.43734 15.5442 4.56646 16.558 5.95817 16.558C7.34988 16.558 8.479 15.5442 8.479 14.2946C8.479 13.0451 7.34988 12.0312 5.95817 12.0312ZM4.69775 17.3125C2.60362 17.3125 0.916504 18.8273 0.916504 20.7076V21.0848C0.916504 21.9218 1.66488 22.5938 2.59706 22.5938H9.31928C10.2515 22.5938 10.9998 21.9218 10.9998 21.0848V20.7076C10.9998 18.8273 9.31272 17.3125 7.21859 17.3125H4.69775Z"
                      fill="#538FDF"
                    />
                    <path
                      d="M15.5 4C14.2578 4 13.25 5.0558 13.25 6.35714C13.25 7.65848 14.2578 8.71429 15.5 8.71429C16.7422 8.71429 17.75 7.65848 17.75 6.35714C17.75 5.0558 16.7422 4 15.5 4ZM14.375 9.5C12.5059 9.5 11 11.0776 11 13.0357V13.4286C11 14.3002 11.668 15 12.5 15H18.5C19.332 15 20 14.3002 20 13.4286V13.0357C20 11.0776 18.4941 9.5 16.625 9.5H14.375Z"
                      fill="#538FDF"
                    />
                  </svg>
                  Manage Staff
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("booking")}
                  className={`w-full flex items-center p-4 text-sm rounded-md transition-colors ${
                    activeTab === "booking"
                      ? "bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white"
                      : "text-[#538FDF] hover:bg-gray-100 bg-white"
                  }`}
                >
                  <svg
                    width="23"
                    height="24"
                    viewBox="0 0 23 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M19.7225 3.60001H7.0075C6.23048 3.60001 5.59473 4.26273 5.59473 5.07273V18.3273C5.59473 19.1373 6.23048 19.8 7.0075 19.8H19.7225C20.4995 19.8 21.1353 19.1373 21.1353 18.3273V5.07273C21.1353 4.26273 20.4995 3.60001 19.7225 3.60001ZM8.42028 7.28182C8.42028 7.06091 8.56156 6.91364 8.77347 6.91364H12.3054C12.5173 6.91364 12.6586 7.06091 12.6586 7.28182V10.9636C12.6586 11.1846 12.5173 11.3318 12.3054 11.3318H8.77347C8.56156 11.3318 8.42028 11.1846 8.42028 10.9636V7.28182ZM16.8969 16.8546C16.8969 17.0755 16.7557 17.2227 16.5437 17.2227H8.77347C8.56156 17.2227 8.42028 17.0755 8.42028 16.8546V16.1182C8.42028 15.8973 8.56156 15.75 8.77347 15.75H16.5437C16.7557 15.75 16.8969 15.8973 16.8969 16.1182V16.8546ZM18.3097 13.9091C18.3097 14.13 18.1684 14.2773 17.9565 14.2773H8.77347C8.56156 14.2773 8.42028 14.13 8.42028 13.9091V13.1727C8.42028 12.9518 8.56156 12.8046 8.77347 12.8046H17.9565C18.1684 12.8046 18.3097 12.9518 18.3097 13.1727V13.9091ZM18.3097 10.9636C18.3097 11.1846 18.1684 11.3318 17.9565 11.3318H14.4246C14.2127 11.3318 14.0714 11.1846 14.0714 10.9636V10.2273C14.0714 10.0064 14.2127 9.8591 14.4246 9.8591H17.9565C18.1684 9.8591 18.3097 10.0064 18.3097 10.2273V10.9636ZM18.3097 8.01819C18.3097 8.2391 18.1684 8.38637 17.9565 8.38637H14.4246C14.2127 8.38637 14.0714 8.2391 14.0714 8.01819V7.28182C14.0714 7.06091 14.2127 6.91364 14.4246 6.91364H17.9565C18.1684 6.91364 18.3097 7.06091 18.3097 7.28182V8.01819Z"
                      fill="#538FDF"
                    />
                  </svg>
                  Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("clients")}
                  className={`w-full flex items-center p-4 text-sm rounded-md transition-colors ${
                    activeTab === "clients"
                      ? "bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white"
                      : "text-[#538FDF] hover:bg-gray-100 bg-white"
                  }`}
                >
                  <svg
                    width="20"
                    height="25"
                    viewBox="0 0 20 25"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-3"
                  >
                    <path
                      d="M10.3332 16.5625C9.32102 16.5625 8.49984 17.3424 8.49984 18.3036C8.49984 19.2648 9.32102 20.0446 10.3332 20.0446C11.3453 20.0446 12.1665 19.2648 12.1665 18.3036C12.1665 17.3424 11.3453 16.5625 10.3332 16.5625ZM9.4165 20.625C7.8935 20.625 6.6665 21.7902 6.6665 23.2366V23.5268C6.6665 24.1706 7.21077 24.6875 7.88873 24.6875H12.7776C13.4556 24.6875 13.9998 24.1706 13.9998 23.5268V23.2366C13.9998 21.7902 12.7728 20.625 11.2498 20.625H9.4165Z"
                      fill="#538FDF"
                    />
                    <path
                      d="M16.3332 11.4062C15.321 11.4062 14.4998 12.1081 14.4998 12.9732C14.4998 13.8383 15.321 14.5402 16.3332 14.5402C17.3453 14.5402 18.1665 13.8383 18.1665 12.9732C18.1665 12.1081 17.3453 11.4062 16.3332 11.4062ZM15.4165 15.0625C13.8935 15.0625 12.6665 16.1112 12.6665 17.4129V17.6741C12.6665 18.2536 13.2108 18.7187 13.8887 18.7187H18.7776C19.4556 18.7187 19.9998 18.2536 19.9998 17.6741V17.4129C19.9998 16.1112 18.7728 15.0625 17.2498 15.0625H15.4165Z"
                      fill="#538FDF"
                    />
                    <path
                      d="M7.5 6C6.53385 6 5.75 6.76786 5.75 7.71429C5.75 8.66071 6.53385 9.42857 7.5 9.42857C8.46615 9.42857 9.25 8.66071 9.25 7.71429C9.25 6.76786 8.46615 6 7.5 6ZM6.625 10C5.17122 10 4 11.1473 4 12.5714V12.8571C4 13.4911 4.51953 14 5.16667 14H9.83333C10.4805 14 11 13.4911 11 12.8571V12.5714C11 11.1473 9.82878 10 8.375 10H6.625Z"
                      fill="#538FDF"
                    />
                  </svg>
                  Clients
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center p-4 text-sm rounded-md transition-colors ${
                    activeTab === "profile"
                      ? "bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white"
                      : "text-[#538FDF] hover:bg-gray-100 bg-white"
                  }`}
                >
                  <svg
                    width="20"
                    height="27"
                    viewBox="0 0 20 27"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-3"
                  >
                    <path
                      d="M11 0C8.51562 0 6.5 2.11161 6.5 4.71429C6.5 7.31696 8.51562 9.42857 11 9.42857C13.4844 9.42857 15.5 7.31696 15.5 4.71429C15.5 2.11161 13.4844 0 11 0ZM8.75 11C5.01172 11 2 14.1551 2 18.0714V18.8571C2 20.6004 3.33594 22 5 22H17C18.6641 22 20 20.6004 20 18.8571V18.0714C20 14.1551 16.9883 11 13.25 11H8.75Z"
                      fill="#538FDF"
                    />
                  </svg>
                  Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center p-4 text-sm rounded-md transition-colors ${
                    activeTab === "settings"
                      ? "bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white"
                      : "text-[#538FDF] hover:bg-gray-100 bg-white"
                  }`}
                >
                  <svg
                    width="28"
                    height="23"
                    viewBox="0 0 28 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M13.4211 1.97924C13.073 1.83923 12.6317 1.83923 11.7492 1.83923C10.8666 1.83923 10.4253 1.83923 10.0772 1.97924C9.61307 2.16591 9.24432 2.52396 9.05208 2.97461C8.96432 3.18034 8.92997 3.41959 8.91653 3.76857C8.89678 4.28143 8.62592 4.75614 8.16818 5.01275C7.71044 5.26935 7.15162 5.25977 6.68433 5.01995C6.36634 4.85676 6.13579 4.76601 5.90842 4.73695C5.41035 4.67328 4.90663 4.80433 4.50809 5.10128C4.20917 5.324 3.98852 5.69508 3.54723 6.43723C3.10595 7.1794 2.88531 7.55047 2.83613 7.91319C2.77055 8.39681 2.90552 8.88591 3.21135 9.27292C3.35094 9.44958 3.54711 9.59801 3.85158 9.78377C4.29919 10.0569 4.58719 10.5221 4.58716 11.0354C4.58713 11.5486 4.29914 12.0137 3.85158 12.2868C3.54706 12.4726 3.35085 12.6211 3.21126 12.7978C2.90543 13.1848 2.77047 13.6738 2.83604 14.1574C2.88521 14.5201 3.10586 14.8913 3.54714 15.6334C3.98843 16.3756 4.20908 16.7467 4.50799 16.9693C4.90654 17.2663 5.41026 17.3973 5.90833 17.3337C6.13569 17.3046 6.36622 17.2139 6.68418 17.0507C7.1515 16.8109 7.71037 16.8013 8.16813 17.0579C8.6259 17.3146 8.89677 17.7893 8.91653 18.3022C8.92997 18.6511 8.96432 18.8904 9.05208 19.0961C9.24432 19.5467 9.61307 19.9048 10.0772 20.0915C10.4253 20.2315 10.8666 20.2315 11.7492 20.2315C12.6317 20.2315 13.073 20.2315 13.4211 20.0915C13.8852 19.9048 14.254 19.5467 14.4462 19.0961C14.534 18.8904 14.5684 18.6511 14.5818 18.3021C14.6016 17.7893 14.8723 17.3146 15.3301 17.0579C15.7878 16.8012 16.3467 16.8109 16.8141 17.0507C17.132 17.2139 17.3625 17.3045 17.5899 17.3336C18.0879 17.3973 18.5916 17.2663 18.9902 16.9693C19.2892 16.7466 19.5098 16.3756 19.9511 15.6333C20.3924 14.8912 20.613 14.5201 20.6622 14.1574C20.7277 13.6738 20.5928 13.1847 20.287 12.7977C20.1473 12.621 19.9512 12.4725 19.6466 12.2868C19.1991 12.0137 18.9111 11.5485 18.9111 11.0353C18.9111 10.522 19.1991 10.057 19.6466 9.78395C19.9513 9.5981 20.1474 9.44967 20.2871 9.27292C20.5928 8.88598 20.7278 8.39687 20.6623 7.91325C20.6131 7.55053 20.3925 7.17945 19.9512 6.4373C19.5099 5.69514 19.2893 5.32406 18.9903 5.10135C18.5917 4.8044 18.088 4.67334 17.59 4.73702C17.3626 4.76608 17.132 4.85681 16.8141 5.01999C16.3468 5.25982 15.7879 5.26941 15.3302 5.01278C14.8724 4.75616 14.6016 4.28141 14.5817 3.76853C14.5683 3.41957 14.534 3.18033 14.4462 2.97461C14.254 2.52396 13.8852 2.16591 13.4211 1.97924ZM11.7492 13.7942C13.3184 13.7942 14.5904 12.5591 14.5904 11.0354C14.5904 9.51165 13.3184 8.27652 11.7492 8.27652C10.1799 8.27652 8.90789 9.51165 8.90789 11.0354C8.90789 12.5591 10.1799 13.7942 11.7492 13.7942Z"
                      fill="#538FDF"
                    />
                  </svg>
                  Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <button
            className="bg-primary-blue text-white p-3 rounded-full shadow-lg"
            onClick={() => {
              const sidebar = document.getElementById("mobile-sidebar");
              if (sidebar) {
                sidebar.classList.toggle("translate-x-0");
                sidebar.classList.toggle("-translate-x-full");
              }
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Sidebar */}
        <div
          id="mobile-sidebar"
          className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-md transform -translate-x-full transition-transform duration-300 ease-in-out md:hidden"
        >
          {/* Logo */}
          <div className="p-4 border-b flex justify-between items-center">
            <Link href="/">
              <div className="flex items-center">
                <Image
                  src="/images/dustoutcolor.png"
                  alt="DustOut Logo"
                  width={150}
                  height={40}
                  className="object-contain"
                />
              </div>
            </Link>
            <button
              className="text-gray-500"
              onClick={() => {
                const sidebar = document.getElementById("mobile-sidebar");
                if (sidebar) {
                  sidebar.classList.toggle("translate-x-0");
                  sidebar.classList.toggle("-translate-x-full");
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-4">
              <li>
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    const sidebar = document.getElementById("mobile-sidebar");
                    if (sidebar) {
                      sidebar.classList.toggle("translate-x-0");
                      sidebar.classList.toggle("-translate-x-full");
                    }
                  }}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeTab === "dashboard"
                      ? "bg-primary-blue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("manage-staff");
                    const sidebar = document.getElementById("mobile-sidebar");
                    if (sidebar) {
                      sidebar.classList.toggle("translate-x-0");
                      sidebar.classList.toggle("-translate-x-full");
                    }
                  }}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeTab === "manage-staff"
                      ? "bg-primary-blue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Manage Staff
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("booking");
                    const sidebar = document.getElementById("mobile-sidebar");
                    if (sidebar) {
                      sidebar.classList.toggle("translate-x-0");
                      sidebar.classList.toggle("-translate-x-full");
                    }
                  }}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeTab === "booking"
                      ? "bg-primary-blue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  Booking
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("clients");
                    const sidebar = document.getElementById("mobile-sidebar");
                    if (sidebar) {
                      sidebar.classList.toggle("translate-x-0");
                      sidebar.classList.toggle("-translate-x-full");
                    }
                  }}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeTab === "clients"
                      ? "bg-primary-blue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  Clients
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    const sidebar = document.getElementById("mobile-sidebar");
                    if (sidebar) {
                      sidebar.classList.toggle("translate-x-0");
                      sidebar.classList.toggle("-translate-x-full");
                    }
                  }}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeTab === "profile"
                      ? "bg-primary-blue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab("settings");
                    const sidebar = document.getElementById("mobile-sidebar");
                    if (sidebar) {
                      sidebar.classList.toggle("translate-x-0");
                      sidebar.classList.toggle("-translate-x-full");
                    }
                  }}
                  className={`w-full flex items-center px-4 py-2 text-sm rounded-lg transition-colors ${
                    activeTab === "settings"
                      ? "bg-primary-blue text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                </button>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Render the active component */}
          <main className="flex-1 overflow-y-auto">
            {renderActiveComponent()}
          </main>   
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminPage;
