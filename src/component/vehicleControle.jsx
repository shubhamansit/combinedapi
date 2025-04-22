"use client";

import { useState } from "react";
import { Search, Filter } from "lucide-react";

export default function FilterControls({
  statusOptions,
  projectOptions,
  companyOptions,
  vehicleTypeOptions,
  vehicles,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    project: "",
    company: "",
    vehicleType: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      status: "",
      project: "",
      company: "",
      vehicleType: "",
    });
    setSearchQuery("");
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // This function will be called when search or filters change
  // The actual filtering logic is now in the VehicleTable component
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mb-6 bg-white p-4 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full pl-10 p-2.5"
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex space-x-2">
          <button
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} className="mr-2" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            onClick={resetFilters}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Filter options */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">All Statuses</option>
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              value={filters.project}
              onChange={(e) => handleFilterChange("project", e.target.value)}
            >
              <option value="">All Projects</option>
              {projectOptions.map((project) => (
                <option key={project} value={project}>
                  {project}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              value={filters.company}
              onChange={(e) => handleFilterChange("company", e.target.value)}
            >
              <option value="">All Companies</option>
              {companyOptions.map((company) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Type
            </label>
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
              value={filters.vehicleType}
              onChange={(e) =>
                handleFilterChange("vehicleType", e.target.value)
              }
            >
              <option value="">All Types</option>
              {vehicleTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
