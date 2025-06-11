import Image from "next/image";
import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { EditStaff } from "./EditStaff";

interface DatabaseStaff {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  servicesRendered: string[];
  salary: string;
  email: string;
  phoneNumber: string;
  address: string;
  staffImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface StafflistProps {
  onEditModeChange: (isEditMode: boolean) => void;
}

interface StafflistRef {
  refreshStaffData: () => void;
}

const Stafflist = forwardRef<StafflistRef, StafflistProps>(
  ({ onEditModeChange }, ref) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<DatabaseStaff | null>(
      null
    );
    const [staffList, setStaffList] = useState<DatabaseStaff[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch staff data on component mount
    useEffect(() => {
      fetchStaffData();
    }, []);

    // Expose refreshStaffData method to parent component
    useImperativeHandle(ref, () => ({
      refreshStaffData: fetchStaffData,
    }));

    const fetchStaffData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/staff");
        if (response.ok) {
          const data = await response.json();
          setStaffList(data);
        } else {
          setError("Failed to fetch staff data");
        }
      } catch (error) {
        console.error("Error fetching staff:", error);
        setError("Failed to fetch staff data");
      } finally {
        setIsLoading(false);
      }
    };

    const handleSaveStaff = (staffData: DatabaseStaff) => {
      if (selectedStaff) {
        // Update existing staff
        setStaffList((prev) =>
          prev.map((staff) =>
            staff.id === selectedStaff.id ? staffData : staff
          )
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
            selectedStaff
              ? () => handleDeleteStaff(selectedStaff.id)
              : undefined
          }
        />
      );
    }



    const handleEditStaff = (staff: DatabaseStaff) => {
      setSelectedStaff(staff);
      setIsEditMode(true);
      onEditModeChange?.(true);
    };

    // Helper function to format staff ID
    const formatStaffId = (id: string, index: number) => {
      return String(index + 1).padStart(3, "0");
    };

    return (
      <>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-majer text-[#12B368] mb-4">Staff List</h2>
          
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
              <button 
                onClick={() => setError(null)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#538FDF]"></div>
              <span className="ml-2 text-gray-600">Loading staff data...</span>
            </div>
          ) : staffList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No staff members found
            </div>
          ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#538FDF] text-white font-majer">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium tracking-wider"></th>
                  <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                    Staff Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                    Services Rendered
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffList.map((staff, index) => (
                  <tr
                    key={staff.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-majer text-[#538FDF]">
                      {formatStaffId(staff.id, index)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <Image
                          src="/images/dustoutcolor.png"
                          alt="DustOut Logo"
                          width={50}
                          height={50}
                          className="h-8 w-auto"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                      {`${staff.firstName} ${staff.lastName}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                      {staff.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                      {staff.servicesRendered.join(", ")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-majer text-[#538FDF]">
                      ${staff.salary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={async () => {
                            if (
                              confirm(
                                "Are you sure you want to delete this staff?"
                              )
                            ) {
                              try {
                                const response = await fetch(
                                  `/api/staff?id=${staff.id}`,
                                  {
                                    method: "DELETE",
                                  }
                                );

                                if (response.ok) {
                                  setStaffList(
                                    staffList.filter((s) => s.id !== staff.id)
                                  );
                                  alert("Staff deleted successfully!");
                                } else {
                                  const errorData = await response.json();
                                  alert(`Error: ${errorData.error}`);
                                }
                              } catch (error) {
                                console.error("Error deleting staff:", error);
                                alert(
                                  "Failed to delete staff. Please try again."
                                );
                              }
                            }
                          }}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleEditStaff(staff)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </>
    );
  }
);

Stafflist.displayName = "Stafflist";

export default Stafflist;
