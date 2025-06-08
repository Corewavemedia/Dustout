interface BookingHistoryItem {
  id: string;
  clientName: string;
  dateAndTime: string;
  service: string;
  address: string;
  amount: string;
}

const DashboardOverview: React.FC = () => {
  // Sample data for booking history
  const bookingHistory: BookingHistoryItem[] = [
    {
      id: "001",
      clientName: "Janet Doe",
      dateAndTime: "23rd June 2023, 9:00 - 11:00am",
      service: "Landscaping",
      address: "Johnson County",
      amount: "$450.00",
    },
    {
      id: "002",
      clientName: "Janet Doe",
      dateAndTime: "22nd June 2023, 2:00 - 4:00pm",
      service: "Landscaping",
      address: "Johnson County",
      amount: "$450.00",
    },
    {
      id: "003",
      clientName: "Janet Doe",
      dateAndTime: "21st June 2023, 10:00 - 12:00pm",
      service: "Landscaping",
      address: "Johnson County",
      amount: "$450.00",
    },
  ];

  // Sample data for upcoming bookings
  const upcomingBookings = [
    {
      id: "1",
      clientName: "Johnson Doe",
      service: "Landscaping",
      date: "5/5/2023",
      time: "2:30-2:45pm",
      staff: "Heather & Jones",
      address:
        "42 Elmbridge Road, Sutton Coldfield WestMidlands, B75 6JR, United Kingdom",
    },
  ];

  // Current month for calendar
  const currentMonth = "June";

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
                    230,548.00
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
                    230,548.00
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
                    230,548.00
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards */}
          <div className="grid grid-cols-2  gap-4 mb-6">
            <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center text-center">
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
              </div>
            </div>

            <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center text-center">
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
              </div>
            </div>

            <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center text-center">
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
                  Generate Invoice
                </p>
              </div>
            </div>

            <div className="bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center text-center">
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
              </div>
            </div>
          </div>

          {/* Booking History */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-majer font-normal text-[#12B368]">
                  Booking History
                </h2>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                {/* Header */}
                <thead>
                  <tr className="bg-[#538FDF] text-white">
                    <th className="px-4 py-3 text-left text-sm font-normal font-majer">ID</th>
                    <th className="px-4 py-3 text-left text-sm font-normal font-majer">Client Name</th>
                    <th className="px-4 py-3 text-left text-sm font-normal font-majer">Date and Time</th>
                    <th className="px-4 py-3 text-left text-sm font-normal font-majer">Services</th>
                    <th className="px-4 py-3 text-left text-sm font-normal font-majer">Staff</th>
                    <th className="px-4 py-3 text-left text-sm font-normal font-majer">Amount</th>
                  </tr>
                </thead>
                
                {/* Data Rows */}
                <tbody className="divide-y divide-gray-200">
                  {bookingHistory.map((booking, index) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-[#5B9BD5] font-normal font-majer">
                        {booking.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5B9BD5] font-normal font-majer">
                        {booking.clientName}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5B9BD5] font-normal font-majer">
                        {booking.dateAndTime}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5B9BD5] font-normal font-majer">
                        {booking.service}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5B9BD5] font-normal font-majer">
                        {booking.address}
                      </td>
                      <td className="px-4 py-3 text-sm text-[#5B9BD5] font-normal font-majer">
                        {booking.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white p-4 overflow-y-auto border-l">
          {/* Upcoming Bookings */}
          <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <h3 className="text-lg font-normal font-majer text-[#12B368]">
                Upcoming Booking
              </h3>
            </div>

            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="mb-4 font-majer">
                {/* Name section */}
                <div className="flex items-center mb-3 bg-[#F5F8FF] p-3 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#F5F8FF] flex items-center justify-center text-[#0000FF] mr-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 1.25C7.92969 1.25 6.25 2.92969 6.25 5C6.25 7.07031 7.92969 8.75 10 8.75C12.0703 8.75 13.75 7.07031 13.75 5C13.75 2.92969 12.0703 1.25 10 1.25ZM8.125 10C5.00977 10 2.5 12.5098 2.5 15.625V16.25C2.5 17.6367 3.61328 18.75 5 18.75H15C16.3867 18.75 17.5 17.6367 17.5 16.25V15.625C17.5 12.5098 14.9902 10 11.875 10H8.125Z"
                        fill="#12B368"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#171AD4] text-sm font-medium">Name</p>
                    <p className="text-[#538FDF] text-sm">
                      {booking.clientName}
                    </p>
                  </div>
                </div>

                {/* Service section */}
                <div className="flex items-center mb-3 bg-[#F5F8FF] p-3 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#F5F8FF] flex items-center justify-center text-[#0000FF] mr-2">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.6155 1.69231H3.38469C2.45392 1.69231 1.69238 2.45384 1.69238 3.38461V18.6154C1.69238 19.5462 2.45392 20.3077 3.38469 20.3077H18.6155C19.5462 20.3077 20.3078 19.5462 20.3078 18.6154V3.38461C20.3078 2.45384 19.5462 1.69231 18.6155 1.69231ZM5.077 5.92308C5.077 5.66923 5.24623 5.5 5.50007 5.5H9.73084C9.98469 5.5 10.1539 5.66923 10.1539 5.92308V10.1538C10.1539 10.4077 9.98469 10.5769 9.73084 10.5769H5.50007C5.24623 10.5769 5.077 10.4077 5.077 10.1538V5.92308ZM15.2308 16.9231C15.2308 17.1769 15.0616 17.3462 14.8078 17.3462H5.50007C5.24623 17.3462 5.077 17.1769 5.077 16.9231V16.0769C5.077 15.8231 5.24623 15.6538 5.50007 15.6538H14.8078C15.0616 15.6538 15.2308 15.8231 15.2308 16.0769V16.9231ZM16.9232 13.5385C16.9232 13.7923 16.7539 13.9615 16.5001 13.9615H5.50007C5.24623 13.9615 5.077 13.7923 5.077 13.5385V12.6923C5.077 12.4385 5.24623 12.2692 5.50007 12.2692H16.5001C16.7539 12.2692 16.9232 12.4385 16.9232 12.6923V13.5385ZM16.9232 10.1538C16.9232 10.4077 16.7539 10.5769 16.5001 10.5769H12.2693C12.0155 10.5769 11.8462 10.4077 11.8462 10.1538V9.30769C11.8462 9.05384 12.0155 8.88461 12.2693 8.88461H16.5001C16.7539 8.88461 16.9232 9.05384 16.9232 9.30769V10.1538ZM16.9232 6.76923C16.9232 7.02308 16.7539 7.19231 16.5001 7.19231H12.2693C12.0155 7.19231 11.8462 7.02308 11.8462 6.76923V5.92308C11.8462 5.66923 12.0155 5.5 12.2693 5.5H16.5001C16.7539 5.5 16.9232 5.66923 16.9232 5.92308V6.76923Z"
                        fill="#12B368"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#171AD4] text-sm font-medium">
                      Service
                    </p>
                    <p className="text-[#538FDF] text-sm">{booking.service}</p>
                  </div>
                </div>

                {/* Date/Time section */}
                <div className="flex items-center mb-3 bg-[#F5F8FF] p-3 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#F5F8FF] flex items-center justify-center text-[#0000FF] mr-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_552_594)">
                        <path
                          d="M15.6796 10.6706C13.2933 10.6706 11.3584 12.6061 11.3584 14.9918C11.3584 17.3768 13.2933 19.3112 15.6796 19.3112C18.0647 19.3112 19.9996 17.3769 19.9996 14.9918C19.9996 12.6061 18.0647 10.6706 15.6796 10.6706ZM15.9568 18.1853V17.8122C15.9568 17.6579 15.8324 17.5332 15.6796 17.5332C15.5253 17.5332 15.4011 17.6582 15.4011 17.8122V18.1853C13.854 18.0523 12.6182 16.8161 12.4851 15.2693H12.8593C13.0122 15.2693 13.1372 15.1448 13.1372 14.992C13.1372 14.8365 13.0122 14.7136 12.8593 14.7136H12.4851C12.6181 13.1661 13.8543 11.9312 15.4011 11.7976V12.1712C15.4011 12.3249 15.5256 12.4497 15.6796 12.4497C15.8324 12.4497 15.9568 12.3246 15.9568 12.1712V11.7976C17.5045 11.9312 18.7404 13.1661 18.8728 14.7136H18.4986C18.3449 14.7136 18.2208 14.8368 18.2208 14.992C18.2208 15.1452 18.3452 15.2693 18.4986 15.2693H18.8728C18.7407 16.8161 17.5045 18.0519 15.9568 18.1853Z"
                          fill="#12B368"
                        />
                        <path
                          d="M17.2894 14.5741H16.2871C16.1535 14.3813 15.9315 14.2534 15.6796 14.2534C15.6758 14.2534 15.6717 14.2545 15.6672 14.2545L14.7539 12.9687C14.6209 12.7816 14.3602 12.7382 14.1725 12.8706C13.9853 13.0042 13.9404 13.2655 14.0743 13.4532L14.9883 14.7396C14.9602 14.8185 14.9422 14.9025 14.9422 14.992C14.9422 15.3993 15.2718 15.7289 15.6796 15.7289C15.9315 15.7289 16.1546 15.6021 16.2871 15.4088H17.2894C17.5194 15.4088 17.7065 15.2229 17.7065 14.9923C17.7065 14.7606 17.5194 14.5741 17.2894 14.5741Z"
                          fill="#12B368"
                        />
                        <path
                          d="M4.15811 6.39193C4.91422 6.39193 5.52608 5.77948 5.52608 5.02425V2.05654C5.52608 1.30101 4.91422 0.688858 4.15811 0.688858C3.40258 0.688858 2.79102 1.30101 2.79102 2.05654V5.02454C2.79102 5.77948 3.40255 6.39193 4.15811 6.39193Z"
                          fill="#12B368"
                        />
                        <path
                          d="M12.535 6.39193C13.2912 6.39193 13.903 5.77948 13.903 5.02425V2.05654C13.903 1.30101 13.2911 0.688858 12.535 0.688858C11.7801 0.688858 11.168 1.30101 11.168 2.05654V5.02454C11.1676 5.77948 11.7801 6.39193 12.535 6.39193Z"
                          fill="#12B368"
                        />
                        <path
                          d="M6.01143 10.1893C6.01143 9.79886 5.69574 9.48259 5.30437 9.48259H3.99375C3.60329 9.48259 3.28613 9.79886 3.28613 10.1893V11.4994C3.28613 11.8904 3.60329 12.2076 3.99375 12.2076H5.30437C5.69541 12.2076 6.01143 11.8904 6.01143 11.4994V10.1893Z"
                          fill="#12B368"
                        />
                        <path
                          d="M9.71019 10.1902C9.71019 9.79975 9.39362 9.48376 9.00404 9.48376H7.6928C7.30234 9.48376 6.98633 9.79975 6.98633 10.1902V11.5006C6.98633 11.8904 7.30231 12.2076 7.6928 12.2076H9.00404C9.39391 12.2076 9.71019 11.8904 9.71019 11.5006V10.1902Z"
                          fill="#12B368"
                        />
                        <path
                          d="M11.3903 9.48259C10.9992 9.48259 10.6826 9.79886 10.6826 10.1893V11.4994C10.6826 11.8532 10.9463 12.1322 11.2844 12.1851C11.8029 11.3776 12.5371 10.7237 13.4065 10.3011V10.1893C13.4065 9.79886 13.0905 9.48259 12.6994 9.48259H11.3903Z"
                          fill="#12B368"
                        />
                        <path
                          d="M3.99476 13.0338C3.6043 13.0338 3.28711 13.3497 3.28711 13.7402V15.0508C3.28711 15.4413 3.6043 15.7573 3.99476 15.7573H5.306C5.69646 15.7573 6.01214 15.4413 6.01214 15.0508V13.7402C6.01214 13.3497 5.69646 13.0338 5.306 13.0338H3.99476Z"
                          fill="#12B368"
                        />
                        <path
                          d="M9.0028 13.0343H7.69277C7.30231 13.0343 6.98633 13.3509 6.98633 13.7414V15.0509C6.98633 15.4413 7.30231 15.7573 7.69277 15.7573H9.0028C9.39267 15.7573 9.70927 15.4413 9.70927 15.0509V13.7414C9.70927 13.3509 9.39267 13.0343 9.0028 13.0343Z"
                          fill="#12B368"
                        />
                        <path
                          d="M10.913 17.1108H4.26386C3.11935 17.1108 2.18794 16.1794 2.18794 15.0361V8.09124H14.5068V9.90849C14.8843 9.8216 15.2754 9.77075 15.68 9.77075C16.027 9.77075 16.3658 9.80653 16.6942 9.87186V3.34H14.7238V5.02424C14.7238 6.23081 13.7427 7.21219 12.5352 7.21219C11.3284 7.21219 10.3473 6.23085 10.3473 5.02424V3.34H6.34683V5.02424C6.34683 6.23081 5.36516 7.21219 4.1583 7.21219C2.95199 7.21219 1.97036 6.23085 1.97036 5.02424V3.34H0V15.0358C0 17.3898 1.90889 19.2996 4.26386 19.2996H12.43C12.527 19.2996 12.6227 19.2917 12.7179 19.2854C11.9334 18.7433 11.3068 17.991 10.913 17.1108Z"
                          fill="#12B368"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_552_594">
                          <rect width="20" height="20" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#171AD4]  text-sm font-medium">
                      Date/Time
                    </p>
                    <p className="text-[#538FDF] text-sm">
                      {booking.date}, {booking.time}
                    </p>
                  </div>
                </div>

                {/* Staff section */}
                <div className="flex items-center mb-3 bg-[#F5F8FF] p-3 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#F5F8FF] flex items-center justify-center text-[#0000FF] mr-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 1.25C7.92969 1.25 6.25 2.92969 6.25 5C6.25 7.07031 7.92969 8.75 10 8.75C12.0703 8.75 13.75 7.07031 13.75 5C13.75 2.92969 12.0703 1.25 10 1.25ZM8.125 10C5.00977 10 2.5 12.5098 2.5 15.625V16.25C2.5 17.6367 3.61328 18.75 5 18.75H15C16.3867 18.75 17.5 17.6367 17.5 16.25V15.625C17.5 12.5098 14.9902 10 11.875 10H8.125Z"
                        fill="#12B368"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#171AD4] text-sm font-medium">Staff</p>
                    <p className="text-[#538FDF] text-sm">{booking.staff}</p>
                  </div>
                </div>

                {/* Address section */}
                <div className="flex items-center mb-3 bg-[#F5F8FF] p-3 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#F5F8FF] flex items-center justify-center text-[#0000FF] mr-2">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 13 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M6.375 5.16383C5.49472 5.16383 4.78125 5.84343 4.78125 6.68194C4.78125 7.52044 5.49472 8.20005 6.375 8.20005C7.25528 8.20005 7.96875 7.52044 7.96875 6.68194C7.96875 5.84343 7.25528 5.16383 6.375 5.16383ZM6.375 9.21212C4.90822 9.21212 3.71875 8.07961 3.71875 6.68194C3.71875 5.28426 4.90822 4.15175 6.375 4.15175C7.84178 4.15175 9.03125 5.28426 9.03125 6.68194C9.03125 8.07961 7.84178 9.21212 6.375 9.21212ZM6.375 0.609497C2.85441 0.609497 0 3.32843 0 6.68194C0 9.22123 5.31516 16.8082 6.375 16.8027C7.41838 16.8082 12.75 9.18682 12.75 6.68194C12.75 3.32843 9.89559 0.609497 6.375 0.609497Z"
                        fill="#12B368"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#171AD4]  text-sm font-medium">
                      Address
                    </p>
                    <p className="text-[#538FDF] text-sm">{booking.address}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-4">
              <button className="w-full font-majer bg-[#0000FF] text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                See Full Details
              </button>
            </div>
          </div>

          {/* Calendar */}
          <div>
            {/* <div className="flex justify-between items-center mb-4">
              <button className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h3 className="text-sm font-medium">{currentMonth}</h3>
              <button className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div> */}

            {/* <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
              <div className="text-gray-500">S</div>
              <div className="text-gray-500">M</div>
              <div className="text-gray-500">T</div>
              <div className="text-gray-500">W</div>
              <div className="text-gray-500">T</div>
              <div className="text-gray-500">F</div>
              <div className="text-gray-500">S</div>
            </div> */}

            {/* <div className="grid grid-cols-7 gap-1 text-center"> */}
              {/* First row */}
              {/* <div className="text-gray-400 text-xs py-1">28</div>
              <div className="text-gray-400 text-xs py-1">29</div>
              <div className="text-gray-400 text-xs py-1">30</div>
              <div className="text-gray-400 text-xs py-1">31</div>
              <div className="text-xs py-1">1</div>
              <div className="text-xs py-1">2</div>
              <div className="text-xs py-1">3</div> */}

              {/* Second row */}
              {/* <div className="text-xs py-1">4</div>
              <div className="text-xs py-1">5</div>
              <div className="text-xs py-1">6</div>
              <div className="text-xs py-1">7</div>
              <div className="text-xs py-1">8</div>
              <div className="text-xs py-1">9</div>
              <div className="text-xs py-1">10</div> */}

              {/* Third row */}
              {/* <div className="text-xs py-1">11</div>
              <div className="text-xs py-1">12</div>
              <div className="text-xs py-1">13</div>
              <div className="text-xs py-1">14</div>
              <div className="text-xs py-1">15</div>
              <div className="text-xs py-1">16</div>
              <div className="text-xs py-1">17</div> */}

              {/* Fourth row */}
              {/* <div className="text-xs py-1">18</div>
              <div className="text-xs py-1">19</div>
              <div className="text-xs py-1">20</div>
              <div className="text-xs py-1">21</div>
              <div className="text-xs py-1">22</div>
              <div className="text-xs py-1">23</div>
              <div className="text-xs py-1">24</div> */}

              {/* Fifth row */}
              {/* <div className="text-xs py-1">25</div>
              <div className="text-xs py-1">26</div>
              <div className="text-xs py-1">27</div>
              <div className="text-xs py-1">28</div>
              <div className="text-xs py-1">29</div>
              <div className="text-xs py-1">30</div>
              <div className="text-gray-400 text-xs py-1">1</div>
            </div> */}

            {/* <div className="mt-4 flex justify-between">
              <button className="text-xs border border-gray-300 rounded-md px-3 py-1 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button className="text-xs bg-primary-blue text-white rounded-md px-3 py-1 hover:bg-primary-blue/90 transition-colors">
                Done
              </button> */}
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
