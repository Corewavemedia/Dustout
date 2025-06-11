import React, { useState, useEffect } from "react";

interface UpcomingBooking {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  staff: string;
  address: string;
}

const UpcomingBookingSidebar = () => {
  const [upcomingBooking, setUpcomingBooking] = useState<UpcomingBooking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the most recent unassigned booking
  useEffect(() => {
    const fetchUpcomingBooking = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/admin/bookings/upcoming');
        
        if (response.ok) {
          const data = await response.json();
          setUpcomingBooking(data);
        } else if (response.status === 404) {
          // No unassigned bookings found
          setUpcomingBooking(null);
        } else {
          setError('Failed to fetch upcoming booking');
        }
      } catch (error) {
        console.error('Error fetching upcoming booking:', error);
        setError('An error occurred while fetching upcoming booking');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUpcomingBooking();
  }, []);
  return (
    <>
        <div className="w-80 bg-white py-4 overflow-y-auto border-l">
          {/* Upcoming Bookings */}
          <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              <h3 className="text-lg font-normal font-majer text-[#12B368]">
                Upcoming Booking
              </h3>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="text-gray-500 font-majer">Loading upcoming booking...</div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-500 font-majer">{error}</div>
              </div>
            ) : upcomingBooking ? (
              <div className="mb-4 font-majer">
    {/* First row: Name and Service */}
    <div className="grid grid-cols-2 gap-3 mb-3">
      {/* Name section */}
      <div className="flex items-center bg-[#F5F8FF] p-3 rounded-lg">
        <div className="w-8 h-8 rounded-full bg-[#F5F8FF] flex items-center text-[#0000FF] mr-2">
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
                  {upcomingBooking.clientName}
                </p>
        </div>
      </div>

      {/* Service section */}
      <div className="flex items-center bg-[#F5F8FF] p-3 rounded-lg">
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
          <p className="text-[#538FDF] text-sm">{upcomingBooking.service}</p>
        </div>
      </div>
    </div>

    {/* Second row: Date/Time and Staff */}
    <div className="grid grid-cols-2 gap-3 mb-3">
      {/* Date/Time section */}
      <div className="flex items-center bg-[#F5F8FF] p-3 rounded-lg">
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
          <p className="text-[#171AD4] text-sm font-medium">
            Date/Time
          </p>
          <p className="text-[#538FDF] text-sm">
            {upcomingBooking.date}, {upcomingBooking.time}
          </p>
        </div>
      </div>

      {/* Staff section */}
      <div className="flex items-center bg-[#F5F8FF] p-3 rounded-lg">
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
          <p className="text-[#538FDF] text-sm">{upcomingBooking.staff}</p>
        </div>
      </div>
    </div>

    {/* Third row: Address (full width) */}
    <div className="flex items-center bg-[#F5F8FF] p-3 rounded-lg">
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
        <p className="text-[#171AD4] text-sm font-medium">
          Address
        </p>
        <p className="text-[#538FDF] text-sm">{upcomingBooking.address}</p>
      </div>
    </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-500 font-majer">No unassigned bookings found</div>
                <p className="text-sm text-gray-400 mt-2">All current bookings have been assigned to staff members.</p>
              </div>
            )}

            {/* <div className="mt-4">
              <button className="w-full font-majer bg-[#0000FF] text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                See Full Details
              </button>
            </div> */}
            
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
    </>
  )
}

export default UpcomingBookingSidebar