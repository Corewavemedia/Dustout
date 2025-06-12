import React, { useState, useEffect } from 'react';
import BookingHistory from "./BookingHistory";
import UpcomingBookingSidebar from "./UpcomingBookingSidebar";
import ServicesManagement from "./ServicesManagement";
import BookingManagement from "./BookingManagement";
import SubscriptionManagement from "./SubscriptionManagement";
import UserManagement from './UserManagement';

interface DashboardStats {
  revenue: number;
  clients: number;
  bookings: number;
}

const DashboardOverview: React.FC = () => {
  const [activeTab, setActiveTab] = useState("");
  const [stats, setStats] = useState<DashboardStats>({
    revenue: 0,
    clients: 0,
    bookings: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats on component mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error('Failed to fetch dashboard stats');
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  switch (activeTab) {
    case "services":
      return <ServicesManagement />;
    case "user_management":
      return <UserManagement />
      case "schedule":
      return <BookingManagement />;
      case "subscription":
      return <SubscriptionManagement />;
    default:
      return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-2 bg-sky-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white p-6 rounded-lg mb-6">
            <h1 className="text-2xl font-normal mb-4 text-center font-majer">
              Welcome Admin!
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#DEEDFF] backdrop-blur-sm p-2 rounded-lg flex items-center">
                <div className="rounded-lg mr-2">
                  <svg
                    width="37"
                    height="37"
                    viewBox="0 0 37 37"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_552_505)">
                      <path
                        d="M13.625 22.3539C14.2692 21.8701 15.0698 21.5833 15.9375 21.5833C18.0661 21.5833 19.7917 23.3089 19.7917 25.4375C19.7917 26.3051 19.505 27.1059 19.0211 27.75M32.125 22.3539C31.4809 21.8701 30.6801 21.5833 29.8125 21.5833C27.6839 21.5833 25.9583 23.3089 25.9583 25.4375C25.9583 26.3051 26.2451 27.1059 26.7289 27.75M32.1248 10.7916C33.6486 10.7904 34.4474 10.7711 35.0665 10.4556C35.6466 10.16 36.1184 9.68831 36.4139 9.10814C36.75 8.44858 36.75 7.58515 36.75 5.85833V4.93333C36.75 3.20651 36.75 2.34309 36.4139 1.68353C36.1184 1.10336 35.6466 0.631667 35.0665 0.336068C34.407 -1.14863e-07 33.5435 0 31.8167 0H13.9333C12.2065 0 11.3431 -1.14863e-07 10.6835 0.336068C10.1034 0.631667 9.63167 1.10336 9.33607 1.68353C9 2.34309 9 3.20651 9 4.93333V5.85833C9 7.58515 9 8.44858 9.33607 9.10814C9.63167 9.68831 10.1034 10.16 10.6835 10.4556C11.3026 10.7711 12.1013 10.7904 13.6251 10.7916M32.1248 10.7916C32.125 10.8913 32.125 10.9939 32.125 11.1V22.8167C32.125 24.5435 32.125 25.407 31.7889 26.0665C31.4934 26.6466 31.0216 27.1184 30.4415 27.4139C29.782 27.75 28.9185 27.75 27.1917 27.75H18.5583C16.8315 27.75 15.9681 27.75 15.3085 27.4139C14.7284 27.1184 14.2567 26.6466 13.9611 26.0665C13.625 25.407 13.625 24.5435 13.625 22.8167V11.1C13.625 10.9939 13.625 10.8913 13.6251 10.7916M32.1248 10.7916C32.1238 9.26793 32.1043 8.46927 31.7889 7.8502C31.4934 7.27002 31.0216 6.79833 30.4415 6.50273C29.782 6.16667 28.9185 6.16667 27.1917 6.16667H18.5583C16.8315 6.16667 15.9681 6.16667 15.3085 6.50273C14.7284 6.79833 14.2567 7.27002 13.9611 7.8502C13.6456 8.46927 13.6263 9.26793 13.6251 10.7916M25.9583 13.875C25.9583 15.5779 24.5779 16.9583 22.875 16.9583C21.1721 16.9583 19.7917 15.5779 19.7917 13.875C19.7917 12.1721 21.1721 10.7917 22.875 10.7917C24.5779 10.7917 25.9583 12.1721 25.9583 13.875Z"
                        stroke="#538FDF"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_552_505">
                        <rect width="37" height="37" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#171AD4] font-majer opacity-80">
                    Revenue
                  </p>
                  <p className="text-xl font-normal font-majer text-[#12B368]">
                    {loading ? 'Loading...' : `$${stats.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  </p>
                </div>
              </div>

              <div className="bg-[#DEEDFF] backdrop-blur-sm p-2 rounded-lg flex items-center">
                <div className="rounded-lg mr-2">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 5C17.9635 5 15.5 7.49554 15.5 10.5714C15.5 13.6473 17.9635 16.1429 21 16.1429C24.0365 16.1429 26.5 13.6473 26.5 10.5714C26.5 7.49554 24.0365 5 21 5ZM18.25 18C13.681 18 10 21.7288 10 26.3571V27.2857C10 29.346 11.6328 31 13.6667 31H28.3333C30.3672 31 32 29.346 32 27.2857V26.3571C32 21.7288 28.319 18 23.75 18H18.25Z"
                      fill="#538FDF"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-[#171AD4] font-majer opacity-80">
                    Clients
                  </p>
                  <p className="text-xl font-normal font-majer text-[#12B368]">
                    {loading ? 'Loading...' : stats.clients.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-[#DEEDFF] backdrop-blur-sm p-2 rounded-lg flex items-center">
                <div className="rounded-lg mr-2">
                  <svg
                    width="40"
                    height="43"
                    viewBox="0 0 40 43"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M34.2995 6.45H12.1865C10.8351 6.45 9.72949 7.63738 9.72949 9.08863V32.8364C9.72949 34.2876 10.8351 35.475 12.1865 35.475H34.2995C35.6509 35.475 36.7565 34.2876 36.7565 32.8364V9.08863C36.7565 7.63738 35.6509 6.45 34.2995 6.45ZM14.6435 13.0466C14.6435 12.6508 14.8892 12.3869 15.2577 12.3869H21.4003C21.7688 12.3869 22.0145 12.6508 22.0145 13.0466V19.6432C22.0145 20.039 21.7688 20.3028 21.4003 20.3028H15.2577C14.8892 20.3028 14.6435 20.039 14.6435 19.6432V13.0466ZM29.3855 30.1977C29.3855 30.5935 29.1398 30.8574 28.7713 30.8574H15.2577C14.8892 30.8574 14.6435 30.5935 14.6435 30.1977V28.8784C14.6435 28.4826 14.8892 28.2187 15.2577 28.2187H28.7713C29.1398 28.2187 29.3855 28.4826 29.3855 28.8784V30.1977ZM31.8425 24.9205C31.8425 25.3162 31.5968 25.5801 31.2283 25.5801H15.2577C14.8892 25.5801 14.6435 25.3162 14.6435 24.9205V23.6011C14.6435 23.2053 14.8892 22.9415 15.2577 22.9415H31.2283C31.5968 22.9415 31.8425 23.2053 31.8425 23.6011V24.9205ZM31.8425 19.6432C31.8425 20.039 31.5968 20.3028 31.2283 20.3028H25.0858C24.7172 20.3028 24.4715 20.039 24.4715 19.6432V18.3239C24.4715 17.9281 24.7172 17.6642 25.0858 17.6642H31.2283C31.5968 17.6642 31.8425 17.9281 31.8425 18.3239V19.6432ZM31.8425 14.3659C31.8425 14.7617 31.5968 15.0256 31.2283 15.0256H25.0858C24.7172 15.0256 24.4715 14.7617 24.4715 14.3659V13.0466C24.4715 12.6508 24.7172 12.3869 25.0858 12.3869H31.2283C31.5968 12.3869 31.8425 12.6508 31.8425 13.0466V14.3659Z"
                      fill="#538FDF"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm opacity-80 text-[#171AD4] font-majer">
                    Bookings
                  </p>
                  <p className="text-xl font-normal text-[#12B368] font-majer">
                    {loading ? 'Loading...' : stats.bookings.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-2  gap-4 mb-6">
            <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <button 
              onClick={() => setActiveTab("services")}
              className="flex items-center text-center">
                <div className="bg-green-100 p-3 rounded-lg mb-3 mr-4">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.75 19.25H6.875V15.125H2.75V19.25ZM15.125 19.25H19.25V15.125H15.125V19.25ZM2.75 6.875H6.875V2.75H2.75V6.875ZM15.125 2.75V6.875H19.25V2.75H15.125ZM8.9375 6.875H13.0625V2.75H8.9375V6.875ZM8.9375 19.25H13.0625V15.125H8.9375V19.25ZM15.125 13.0625H19.25V8.9375H15.125V13.0625ZM8.9375 13.0625H13.0625V8.9375H8.9375V13.0625ZM2.75 13.0625H6.875V8.9375H2.75V13.0625Z"
                      fill="#12B368"
                    />
                  </svg>
                </div>
                <p className="text-[#538FDF] font-normal font-majer">
                  Services
                </p>
              </button>
            </div>

            <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <button 
              onClick={() => setActiveTab("schedule")}
              className="flex items-center text-center">
                <div className="bg-green-100 p-3 rounded-lg mb-3 mr-4">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_552_646)">
                      <path
                        d="M18.6667 3.5C19.311 3.5 19.8333 4.02234 19.8333 4.66667V5.83333H22.1667C23.3968 5.83333 24.4045 6.78519 24.4936 7.99253L24.5 8.16667V22.1667C24.5 23.3968 23.5482 24.4045 22.3408 24.4936L22.1667 24.5H5.83333C4.60324 24.5 3.59547 23.5482 3.5064 22.3408L3.5 22.1667V8.16667C3.5 6.93658 4.45186 5.92881 5.65919 5.83973L5.83333 5.83333H8.16667V4.66667C8.16667 4.02234 8.68901 3.5 9.33333 3.5C9.97766 3.5 10.5 4.02234 10.5 4.66667V5.83333H17.5V4.66667C17.5 4.02234 18.0223 3.5 18.6667 3.5ZM17.2948 10.9419L12.3451 15.8916L10.6951 14.2417C10.2395 13.7861 9.50084 13.7861 9.04524 14.2417C8.58962 14.6973 8.58962 15.436 9.04524 15.8916L11.5119 18.3583C11.972 18.8184 12.7181 18.8184 13.1783 18.3583L18.9447 12.5918C19.4004 12.1362 19.4004 11.3975 18.9447 10.9419C18.4891 10.4863 17.7504 10.4863 17.2948 10.9419Z"
                        fill="#12B368"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_552_646">
                        <rect width="28" height="28" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
                <p className="text-[#538FDF] font-normal font-majer">
                  Schedule Cleaning
                </p>
              </button>
            </div>

            <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <button 
              onClick={() => setActiveTab("user_management")}
              className="flex items-center text-center">
                <div className="bg-green-100 p-3 rounded-lg mb-3 mr-4">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.929 3.14296H16.5004V9.42865H18.0717V1.57138H2.35742V20.4286H11.0004V18.8571H3.929V3.14296Z"
                      fill="#12B368"
                    />
                    <path
                      d="M15.3214 10.3452L11 12.5061V14.4018C11 16.7713 12.3387 18.9374 14.4579 19.997L15.3214 20.4286L16.1848 19.997C18.304 18.9374 19.6427 16.7713 19.6427 14.4018V12.5061L15.3214 10.3452ZM18.0714 14.4016C18.0714 16.1874 17.0792 17.7927 15.4821 18.5913L15.3214 18.6716L15.1607 18.5913C13.5635 17.7927 12.5714 16.1872 12.5714 14.4016V13.4771L15.3214 12.1021L18.0714 13.4771V14.4016Z"
                      fill="#12B368"
                    />
                    <path
                      d="M14.1339 14.6783L13.3534 15.5616L15.3568 17.3325L17.8045 14.5161L16.9153 13.7427L15.2472 15.6621L14.1339 14.6783ZM5.5 5.5H14.9286V7.07137H5.5V5.5ZM5.5 9.42863H11.7857V11H5.5V9.42863ZM5.5 13.3571H8.64295V14.9284H5.5V13.3571Z"
                      fill="#12B368"
                    />
                  </svg>
                </div>
                <p className="text-[#538FDF] font-normal font-majer">
                  User Management
                </p>
              </button>
            </div>

            <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <button 
              onClick={() => setActiveTab("subscription")}
              className="flex items-center text-center">
                <div className="bg-green-100 p-3 rounded-lg mb-3 mr-4">
                  <svg
                    width="23"
                    height="23"
                    viewBox="0 0 23 23"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.03893 14.9383C4.92389 14.9383 4.01953 15.8422 4.01953 16.9586C4.01953 18.0736 4.92389 18.9784 6.03893 18.9784C7.15558 18.9784 8.05925 18.0736 8.05925 16.9586C8.05925 15.8419 7.15558 14.9383 6.03893 14.9383Z"
                      fill="#12B368"
                    />
                    <path
                      d="M5.41312 9.38422C5.40254 9.38422 5.39242 9.3856 5.38207 9.38583V9.38422H4.58535V9.39319C4.19481 9.43758 3.89052 9.76188 3.88247 10.1623H3.88086V11.5789H3.89029C3.93399 11.9425 4.2208 12.2279 4.58512 12.2693V12.2783H5.38184V12.2673C5.39219 12.2675 5.40254 12.2689 5.41289 12.2689C8.35045 12.2689 10.7427 14.6427 10.7744 17.5729H10.7668V18.3696H10.7758C10.8202 18.7602 11.1445 19.0645 11.5449 19.0725V19.0741H12.9613V19.0647C13.3249 19.021 13.6103 18.7342 13.6517 18.3699H13.6607V17.5731H13.6593C13.6278 13.052 9.94113 9.38422 5.41312 9.38422Z"
                      fill="#12B368"
                    />
                    <path
                      d="M19.1172 17.5727C19.0852 10.0427 12.9507 3.92609 5.41312 3.92609C5.40254 3.92609 5.39242 3.92747 5.38207 3.9277V3.92609H4.58535V3.93506C4.19481 3.97945 3.89052 4.30375 3.88247 4.70418H3.88086V6.12075H3.89029C3.93399 6.48461 4.2208 6.76981 4.58512 6.81121V6.82018H5.38184V6.80914C5.39219 6.80937 5.40254 6.81075 5.41289 6.81075C11.36 6.81075 16.2003 11.6332 16.2323 17.5729H16.2243V18.3696H16.2332C16.2776 18.7602 16.6019 19.0645 17.0024 19.0725V19.0741H18.4189V19.0647C18.7826 19.021 19.068 18.7342 19.1094 18.3699H19.1184V17.5731H19.1172V17.5727Z"
                      fill="#12B368"
                    />
                  </svg>
                </div>
                <p className="text-[#538FDF] font-normal font-majer">
                  Subscriptions
                </p>
              </button>
            </div>
          </div>

          {/* Booking History */}
          <BookingHistory />
        </div>

        {/* Right Sidebar */}
        <UpcomingBookingSidebar />
      </div>
    </div>
  );
  }

  
};

export default DashboardOverview;
