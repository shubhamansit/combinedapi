"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function VehicleTable({ initialVehicles }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState(initialVehicles);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    project: "",
    company: "",
    vehicleType: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // Apply filters and search
  useEffect(() => {
    let result = [...vehicles];

    // Apply search query across all fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((vehicle) =>
        Object.values(vehicle).some((value) =>
          String(value).toLowerCase().includes(query)
        )
      );
    }

    // Apply filters
    if (filters.status) {
      result = result.filter(
        (vehicle) =>
          vehicle["vehicle status"].toLowerCase() ===
          filters.status.toLowerCase()
      );
    }

    if (filters.project) {
      result = result.filter(
        (vehicle) =>
          vehicle.Project.toLowerCase() === filters.project.toLowerCase()
      );
    }

    if (filters.company) {
      result = result.filter(
        (vehicle) =>
          vehicle.Company.toLowerCase() === filters.company.toLowerCase()
      );
    }

    if (filters.vehicleType) {
      result = result.filter(
        (vehicle) =>
          vehicle["Vehicle name"].toLowerCase() ===
          filters.vehicleType.toLowerCase()
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredVehicles(result);
  }, [searchQuery, filters, vehicles, sortConfig]);

  // Handle sorting
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      {/* Results count */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredVehicles.length} of {vehicles.length} vehicles
      </div>

      {/* Data table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("Vehicle no")}
              >
                <div className="flex items-center">
                  Vehicle No
                  {sortConfig.key === "Vehicle no" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp size={16} className="ml-1" />
                    ) : (
                      <ChevronDown size={16} className="ml-1" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("vehicle status")}
              >
                <div className="flex items-center">
                  Status
                  {sortConfig.key === "vehicle status" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp size={16} className="ml-1" />
                    ) : (
                      <ChevronDown size={16} className="ml-1" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("Vehicle name")}
              >
                <div className="flex items-center">
                  Type
                  {sortConfig.key === "Vehicle name" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp size={16} className="ml-1" />
                    ) : (
                      <ChevronDown size={16} className="ml-1" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("Company")}
              >
                <div className="flex items-center">
                  Company
                  {sortConfig.key === "Company" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp size={16} className="ml-1" />
                    ) : (
                      <ChevronDown size={16} className="ml-1" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("Branch")}
              >
                <div className="flex items-center">
                  Branch
                  {sortConfig.key === "Branch" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp size={16} className="ml-1" />
                    ) : (
                      <ChevronDown size={16} className="ml-1" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("Project")}
              >
                <div className="flex items-center">
                  Project
                  {sortConfig.key === "Project" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp size={16} className="ml-1" />
                    ) : (
                      <ChevronDown size={16} className="ml-1" />
                    ))}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("Vehicle Last updated DateTime")}
              >
                <div className="flex items-center">
                  Last Updated
                  {sortConfig.key === "Vehicle Last updated DateTime" &&
                    (sortConfig.direction === "ascending" ? (
                      <ChevronUp size={16} className="ml-1" />
                    ) : (
                      <ChevronDown size={16} className="ml-1" />
                    ))}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {vehicle["Vehicle no"]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${
                        vehicle["vehicle status"] === "RUNNING"
                          ? "bg-green-100 text-green-800"
                          : vehicle["vehicle status"] === "STOPPED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {vehicle["vehicle status"]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle["Vehicle name"]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle["Company"]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle["Branch"]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle["Project"]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {vehicle["Vehicle Last updated DateTime"]}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No vehicles found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
