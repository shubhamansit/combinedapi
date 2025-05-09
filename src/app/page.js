"use client";
import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, Filter, Check } from "lucide-react";
import Select from "react-select";
import * as XLSX from "xlsx";

export default function VehicleTrackingDashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [loading, setLoading] = useState(false);
  // Add state for selected vehicles
  const [selectedVehicles, setSelectedVehicles] = useState({});
  // Add state for "select all" checkbox
  const [selectAll, setSelectAll] = useState(false);

  // Modified export function to only export selected vehicles
  const exportToExcel = () => {
    // Get selected vehicles as an array
    const vehiclesToExport = filteredVehicles.filter(
      (vehicle, index) => selectedVehicles[index]
    );

    if (vehiclesToExport.length === 0) {
      alert("Please select at least one vehicle to export");
      return;
    }

    const ws = XLSX.utils.json_to_sheet(vehiclesToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vehicles");

    // Generate and download the file
    XLSX.writeFile(wb, "VehicleData.xlsx");
  };

  // Handle toggling a single checkbox
  const toggleVehicleSelection = (index) => {
    setSelectedVehicles((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Handle "select all" checkbox
  const toggleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const newSelectedVehicles = {};
    filteredVehicles.forEach((_, index) => {
      newSelectedVehicles[index] = newSelectAll;
    });

    setSelectedVehicles(newSelectedVehicles);
  };

  // Reset selections when filters change
  useEffect(() => {
    setSelectedVehicles({});
    setSelectAll(false);
  }, [filteredVehicles.length]);

  useEffect(() => {
    async function getvehicledata() {
      console.log(selectedPlatform, "selectedPlatform");

      const platformURL =
        selectedPlatform === "all"
          ? "https://combinedapi-production.up.railway.app/api/vehicles"
          : `https://combinedapi-production.up.railway.app/api/vehicle/${selectedPlatform}`;

      setLoading(true); // Start loading

      try {
        const res = await fetch(platformURL);
        const data = await res.json();

        let vehicleData = [];

        if (selectedPlatform === "all") {
          vehicleData = data.success.flatMap(
            (domainEntry) => domainEntry.data?.data || []
          );
        } else {
          vehicleData = data?.success[0]?.data?.data || [];
        }

        setVehicles(vehicleData);
        setFilteredVehicles(vehicleData);
      } catch (err) {
        console.error("Failed to fetch vehicles:", err);
        setVehicles([]);
        setFilteredVehicles([]);
      } finally {
        setLoading(false); // Stop loading
      }
    }

    getvehicledata();
  }, [selectedPlatform]);

  console.log(filteredVehicles);

  // Apply filters and search
  useEffect(() => {
    let result = [...vehicles];

    // Apply search query across all fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((vehicle) =>
        Object.values(vehicle).some((value) =>
          value.replace(/\s+/g, "").toLowerCase().includes(query)
        )
      );
    }

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

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const getUniqueValues = (key) => {
    return [...new Set(vehicles.map((vehicle) => vehicle[key]))];
  };

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

  // Get count of selected vehicles
  const selectedCount = Object.values(selectedVehicles).filter(Boolean).length;

  return (
    <div className="flex flex-col w-full p-4 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Vehicle Tracking Dashboard
      </h1>

      {/* Search and filter section */}
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
              onChange={(e) => setSearchQuery(e.target.value)}
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              onClick={exportToExcel}
            >
              Export Selected ({selectedCount})
            </button>
            <button
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              onClick={resetFilters}
            >
              Reset
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Server
              </label>
              <Select
                options={[
                  { label: "All", value: "all" },
                  { label: "One", value: "ansgujarat" },
                  { label: "Coretrack", value: "coretrack" },
                  { label: "Libi35", value: "libi35" },
                  { label: "Smartbus", value: "smartbus" },
                  { label: "Taaskeye", value: "taaseye" },
                  { label: "Advance55", value: "advance55" },
                  { label: "Gujarat Police", value: "gp" },
                  { label: "Prayagraj", value: "praygraj" },
                ]}
                value={{
                  label:
                    selectedPlatform === "all"
                      ? "All"
                      : [
                          { label: "All", value: "all" },
                          { label: "One", value: "ansgujarat" },
                          { label: "Coretrack", value: "coretrack" },
                          { label: "Libi35", value: "libi35" },
                          { label: "Smartbus", value: "smartbus" },
                          { label: "Taaskeye", value: "taaseye" },
                          { label: "Advance55", value: "advance55" },
                          { label: "Gujarat Police", value: "gp" },
                          { label: "Prayagraj", value: "praygraj" },
                        ].find((item) => {
                          return item.value == selectedPlatform;
                        }).label,
                  value: selectedPlatform,
                }}
                onChange={(selected) =>
                  setSelectedPlatform(selected ? selected.value : "all")
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <Select
                options={getUniqueValues("vehicle status").map((status) => ({
                  label: status,
                  value: status,
                }))}
                isClearable
                value={
                  filters.status
                    ? { label: filters.status, value: filters.status }
                    : null
                }
                onChange={(selected) =>
                  handleFilterChange("status", selected ? selected.value : "")
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Platform ({getUniqueValues("Project").length})
              </label>
              <Select
                options={getUniqueValues("Project").map((project) => ({
                  label: project,
                  value: project,
                }))}
                isClearable
                value={
                  filters.project
                    ? { label: filters.project, value: filters.project }
                    : null
                }
                onChange={(selected) =>
                  handleFilterChange("project", selected ? selected.value : "")
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company ({getUniqueValues("Company").length})
              </label>
              <Select
                options={getUniqueValues("Company").map((company) => ({
                  label: company,
                  value: company,
                }))}
                isClearable
                value={
                  filters.company
                    ? { label: filters.company, value: filters.company }
                    : null
                }
                onChange={(selected) =>
                  handleFilterChange("company", selected ? selected.value : "")
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Type
              </label>
              <Select
                options={getUniqueValues("Vehicle name").map((type) => ({
                  label: type,
                  value: type,
                }))}
                isClearable
                value={
                  filters.vehicleType
                    ? { label: filters.vehicleType, value: filters.vehicleType }
                    : null
                }
                onChange={(selected) =>
                  handleFilterChange(
                    "vehicleType",
                    selected ? selected.value : ""
                  )
                }
              />
            </div>
          </div>
        )}
      </div>

      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredVehicles.length} of {vehicles.length} vehicles •{" "}
        {selectedCount} selected
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="text-green-400 text-sm font-medium animate-ping">
            Loading vehicles...
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      checked={selectAll}
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("Server")}
                >
                  <div className="flex items-center">
                    Server
                    {sortConfig.key === "Server" &&
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
                  onClick={() => handleSort("Vehicle Last updated DateTime")}
                >
                  <div className="flex items-center">
                    Imei
                    {sortConfig.key === "Vehicle Last updated DateTime" &&
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
                    Installation Date
                    {sortConfig.key === "Vehicle Last updated DateTime" &&
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
                filteredVehicles?.map((vehicle, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-gray-50 ${
                      selectedVehicles[index] ? "bg-blue-50" : ""
                    }`}
                  >
                    <td className="px-4 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        checked={selectedVehicles[index] || false}
                        onChange={() => toggleVehicleSelection(index)}
                      />
                    </td>
                    {selectedPlatform === "all" ? (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <a
                          className="underline text-purple-500"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={
                            [
                              {
                                value: "ansgujarat",
                                ip: "https://one.ansitindia.com",
                              },
                              {
                                value: "coretrack",
                                ip: "https://coretracksys.com",
                              },
                              { value: "libi35", ip: "http://13.232.250.35" },
                              { value: "smartbus", ip: "http://15.207.194.31" },
                              { value: "taaseye", ip: "http://13.202.116.8" },
                              { value: "advance55", ip: "http://13.127.89.55" },
                              { value: "gp", ip: "http://13.235.92.112" },
                              { value: "praygraj", ip: "http://15.206.7.97" },
                            ]?.find((item) => {
                              return item.value == vehicle["domain"];
                            })?.ip
                          }
                        >
                          {
                            [
                              {
                                label: "One",
                                value: "ansgujarat",
                                ip: "https://one.ansitindia.com",
                              },
                              {
                                label: "Coretrack",
                                value: "coretrack",
                                ip: "https://coretracksys.com",
                              },
                              {
                                label: "Libi35",
                                value: "libi35",
                                ip: "http://13.232.250.35",
                              },
                              {
                                label: "Smartbus",
                                value: "smartbus",
                                ip: "http://15.207.194.31",
                              },
                              {
                                label: "Taaskeye",
                                value: "taaseye",
                                ip: "http://13.202.116.8",
                              },
                              {
                                label: "Advance55",
                                value: "advance55",
                                ip: "http://13.127.89.55",
                              },
                              {
                                label: "Gujarat Police",
                                value: "gp",
                                ip: "http://13.235.92.112",
                              },
                              {
                                label: "Prayagraj",
                                value: "praygraj",
                                ip: "http://15.206.7.97",
                              },
                            ]?.find((item) => {
                              return item.value == vehicle["domain"];
                            })?.label
                          }
                        </a>
                      </td>
                    ) : (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        <a
                          className="underline text-purple-500"
                          target="_blank"
                          rel="noopener noreferrer"
                          href={
                            [
                              {
                                value: "ansgujarat",
                                ip: "https://one.ansitindia.com",
                              },
                              {
                                value: "coretrack",
                                ip: "https://coretracksys.com",
                              },
                              { value: "libi35", ip: "http://13.232.250.35" },
                              { value: "smartbus", ip: "http://15.207.194.31" },
                              { value: "taaseye", ip: "http://13.202.116.8" },
                              { value: "advance55", ip: "http://13.127.89.55" },
                              { value: "gp", ip: "http://13.235.92.112" },
                              { value: "praygraj", ip: "http://15.206.7.97" },
                            ]?.find((item) => {
                              return item.value == selectedPlatform;
                            })?.ip
                          }
                        >
                          {
                            [
                              {
                                label: "One",
                                value: "ansgujarat",
                                ip: "https://one.ansitindia.com",
                              },
                              {
                                label: "Coretrack",
                                value: "coretrack",
                                ip: "https://coretracksys.com",
                              },
                              {
                                label: "Libi35",
                                value: "libi35",
                                ip: "http://13.232.250.35",
                              },
                              {
                                label: "Smartbus",
                                value: "smartbus",
                                ip: "http://15.207.194.31",
                              },
                              {
                                label: "Taaskeye",
                                value: "taaseye",
                                ip: "http://13.202.116.8",
                              },
                              {
                                label: "Advance55",
                                value: "advance55",
                                ip: "http://13.127.89.55",
                              },
                              {
                                label: "Gujarat Police",
                                value: "gp",
                                ip: "http://13.235.92.112",
                              },
                              {
                                label: "Prayagraj",
                                value: "praygraj",
                                ip: "http://15.206.7.97",
                              },
                            ]?.find((item) => {
                              return item.value == selectedPlatform;
                            })?.label
                          }
                        </a>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vehicle["Vehicle no"]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {vehicle["Imei"]}
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
                      {vehicle["Installation date"]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {vehicle["Vehicle Last updated DateTime"]}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No vehicles found matching your criteria
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
