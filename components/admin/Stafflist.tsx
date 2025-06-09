import Image from "next/image";
import React, { useState } from "react";
import { EditStaff } from "./EditStaff";

interface Staff {
  id: string;
  staffName: string;
  role: string;
  services: string[];
  salary: string;
  email: string;
  phoneNumber: string;
  address: string;
}


interface StafflistProps {
  onEditModeChange?: (isEditMode: boolean) => void;
}

const Stafflist: React.FC<StafflistProps> = ({ onEditModeChange }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Sample staff data
const [staffList, setStaffList] = useState<Staff[]>([
    {
      id: "2024",
      staffName: "John Doe",
      role: "Cleaner",
      services: ["Landscaping", "Cleaning"],
      salary: "£40,000",
      email: "john@dustout.com",
      phoneNumber: "+44560299226",
      address: "42 Oakwood Drive, Hampton, Middlesex",
    },
    {
      id: "2025",
      staffName: "Jane Doe",
      role: "Cleaner",
      services: ["Landscaping", "Cleaning"],
      salary: "£40,000",
      email: "jane@dustout.com",
      phoneNumber: "+44560299227",
      address: "43 Oakwood Drive, Hampton, Middlesex",
    },
    {
      id: "2026",
      staffName: "John Doe",
      role: "Cleaner",
      services: ["Landscaping", "Cleaning"],
      salary: "£40,000",
      email: "john2@dustout.com",
      phoneNumber: "+44560299228",
      address: "44 Oakwood Drive, Hampton, Middlesex",
    },
    {
      id: "2027",
      staffName: "John Doe",
      role: "Cleaner",
      services: ["Landscaping", "Cleaning"],
      salary: "£40,000",
      email: "john3@dustout.com",
      phoneNumber: "+44560299229",
      address: "45 Oakwood Drive, Hampton, Middlesex",
    },
    {
      id: "2028",
      staffName: "John Doe",
      role: "Cleaner",
      services: ["Landscaping", "Cleaning"],
      salary: "£40,000",
      email: "john4@dustout.com",
      phoneNumber: "+44560299230",
      address: "46 Oakwood Drive, Hampton, Middlesex",
    },
  ]);

  const handleSaveStaff = (staffData: Staff) => {
    if (selectedStaff) {
      // Update existing staff
      setStaffList((prev) =>
        prev.map((staff) => (staff.id === selectedStaff.id ? staffData : staff))
      );
    } else {
      // Add new staff
      const newStaff = {
        ...staffData,
        id: Date.now().toString(),
      };
      setStaffList((prev) => [...prev, newStaff]);
    }
    setIsEditMode(false);
    setSelectedStaff(null);
  };

  const handleDeleteStaff = (staffId: string) => {
    setStaffList((prev) => prev.filter((staff) => staff.id !== staffId));
    setIsEditMode(false);
    setSelectedStaff(null);
  };

  

  if (isEditMode) {
    return (
      <EditStaff
        staff={selectedStaff}
        onSave={handleSaveStaff}
        onCancel={() => {
          setIsEditMode(false);
          onEditModeChange?.(false);
        }}
        onDelete={
          selectedStaff ? () => handleDeleteStaff(selectedStaff.id) : undefined
        }
      />
    );
  }
  

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setIsEditMode(true);
    onEditModeChange?.(true);
  };

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.services.some((service) =>
        service.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-[#538FDF] text-white">
          <div className="grid grid-cols-7 font-majer gap-4 p-4 font-medium text-sm">
            <div>ID</div>
            <div></div>
            <div>Staff Name</div>
            <div>Role</div>
            <div>Services Rendered</div>
            <div>Salary</div>
            <div></div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {filteredStaff.map((staff) => (
            <div
              key={staff.id}
              className="grid grid-cols-7 font-majer gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center text-[#538FDF] ">
                {staff.id}
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Image
                    src="/images/dustoutcolor.png"
                    alt="DustOut Logo"
                    width={50}
                    height={50}
                    className="h-8 w-auto"
                  />
                </div>
              </div>
              <div className="font-medium flex items-center justify-center text-[#538FDF]">
                {staff.staffName}
              </div>
              <div className="flex items-center text-[#538FDF]">
                {staff.role}
              </div>
              <div className="flex flex-1 items-center text-[#538FDF]  overflow-clip">
                {staff.services.join(", ")}
              </div>
              <div className="flex items-center text-[#538FDF]">
                {staff.salary}
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => {
                    if (
                      confirm("Are you sure you want to delete this staff?")
                    ) {
                      setStaffList(staffList.filter((s) => s.id !== staff.id));
                    }
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Staff"
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 12H22L20.7162 23.5545C20.6248 24.3774 19.9291 25 19.1011 25H11.8989C11.0709 25 10.3753 24.3774 10.2838 23.5545L9 12Z"
                      stroke="#538FDF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12.1208 9.14716C12.3959 8.44685 12.9831 8 13.6283 8H18.3717C19.0169 8 19.6041 8.44685 19.8792 9.14716L21 12H11L12.1208 9.14716Z"
                      stroke="#538FDF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 12H24"
                      stroke="#538FDF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M14 16V20"
                      stroke="#538FDF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 16V20"
                      stroke="#538FDF"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleEditStaff(staff)}
                  className="p-2 text-[#538FDF] hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Staff"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 15 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_538_169)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M0 14.6429H15V13.222H0V14.6429ZM7.3815 10.3802H4.5V7.46451L11.8793 0.357178L15 3.29701L7.3815 10.3802Z"
                        fill="#538FDF"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_538_169">
                        <rect width="15" height="15" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
              <div></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Stafflist;
