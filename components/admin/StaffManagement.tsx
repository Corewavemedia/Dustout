"use client";
import React, { useState } from "react";
import AddStaffSidebar from "./AddStaffSidebar";
import Stafflist from "./Stafflist";

// interface Staff {
//   id: string;
//   staffName: string;
//   role: string;
//   services: string[];
//   salary: string;
//   email: string;
//   phoneNumber: string;
//   address: string;
// }



const StaffManagement: React.FC = () => {
  // const [isEditMode, setIsEditMode] = useState(false);
  // const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isStaffEditMode, setIsStaffEditMode] = useState(false);
 

  // const handleAddStaff = () => {
  //   setSelectedStaff(null);
  //   setIsEditMode(true);
  // };

 

  return (
    <div className="flex flex-col min-h-screen bg-bg-light">
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-2 bg-sky-50">
          {/* Header */}
          {!isStaffEditMode && (
            <div className="bg-gradient-to-r from-[#538FDF] to-[#171AD4] text-white p-6 rounded-lg mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              {/* Search Bar */}
              <div className="flex items-center justify-center gap-4 w-full md:w-full">
                <div className="relative flex-1 md:w-80">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                  <button className="absolute font-majer right-2 top-1/2 transform -translate-y-1/2 bg-[#171AD4] text-white px-4 py-1 rounded-md text-sm hover:bg-blue-700 transition-colors">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center font-majer flex-col sm:flex-row gap-3 mt-4">
              <button
                // onClick={handleAddStaff}
                className="bg-[#12B368] text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                +Add Staff
              </button>
              <button className="bg-white border border-white text-[#538FDF] px-6 py-2 rounded-lg font-medium hover:bg-white hover:text-[#171AD4] transition-colors">
                +Manage Staff
              </button>
            </div>
          </div>
          )}
          

          {/* Staff List Table */}
          <Stafflist onEditModeChange={setIsStaffEditMode} />
        </div>

        {/* Right Sidebar - Only show when not in edit mode */}
        {!isStaffEditMode && <AddStaffSidebar />}
      </div>
    </div>
  );
};


export default StaffManagement;
