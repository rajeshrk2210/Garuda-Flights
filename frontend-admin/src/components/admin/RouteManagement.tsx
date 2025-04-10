import { useState, useEffect } from "react";
import apiURL from "../../config/config";

// Predefined Canadian Airport Locations (Airport Name + City)
const LOCATIONS = [
  "Toronto Pearson International Airport (YYZ) - Toronto",
  "Vancouver International Airport (YVR) - Vancouver",
  "Montréal-Pierre Elliott Trudeau International Airport (YUL) - Montreal",
  "Calgary International Airport (YYC) - Calgary",
  "Edmonton International Airport (YEG) - Edmonton",
  "Ottawa Macdonald-Cartier International Airport (YOW) - Ottawa",
  "Winnipeg James Armstrong Richardson International Airport (YWG) - Winnipeg",
  "Québec City Jean Lesage International Airport (YQB) - Quebec City",
  "Halifax Stanfield International Airport (YHZ) - Halifax",
  "Victoria International Airport (YYJ) - Victoria",
];

// Route Interface
interface Route {
  _id?: string;
  startLocation: string; // e.g., "Toronto Pearson International Airport (YYZ) - Toronto"
  endLocation: string;   // e.g., "Vancouver International Airport (YVR) - Vancouver"
  distance: number;
  duration: string;
}

const RouteManagement = () => {
  const [newRoute, setNewRoute] = useState<Route>({
    startLocation: "",
    endLocation: "",
    distance: 0,
    duration: "00:00",
  });

  const [routes, setRoutes] = useState<Route[]>([]);
  const [searchStart, setSearchStart] = useState("");
  const [searchEnd, setSearchEnd] = useState("");
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchRoutes();
  }, []);

  /** 🔹 Fetch Routes with Search */
  const fetchRoutes = async () => {
    setIsSearching(true);
    setSearchError(null);
    setRoutes([]);

    try {
      const queryParams = new URLSearchParams();
      if (searchStart) queryParams.append("startLocation", searchStart);
      if (searchEnd) queryParams.append("endLocation", searchEnd);

      const response = await fetch(`${apiURL}/api/routes?${queryParams.toString()}`);
      if (!response.ok) throw new Error(`❌ API Error: ${response.statusText}`);

      const data = await response.json();
      if (Array.isArray(data) && data.length === 0) {
        setSearchError("❌ No matching routes found.");
      } else {
        setRoutes(data);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      setSearchError("❌ Failed to fetch routes. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  /** 🔹 Handle Duration Selection */
  const handleDurationChange = (hours: string, minutes: string) => {
    setNewRoute({ ...newRoute, duration: `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}` });
  };

  /** 🔹 Add Route */
  const addRoute = async () => {
    if (
      !newRoute.startLocation ||
      !newRoute.endLocation ||
      !newRoute.distance ||
      newRoute.duration === "00:00"
    ) {
      alert("⚠️ All fields are required!");
      return;
    }
    if (newRoute.startLocation === newRoute.endLocation) {
      alert("❌ Start and End locations cannot be the same!");
      return;
    }

    try {
      const response = await fetch(`${apiURL}/api/routes/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoute),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Route added successfully!");
        setNewRoute({ startLocation: "", endLocation: "", distance: 0, duration: "00:00" });
        fetchRoutes();
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      alert("❌ Network Error: Failed to connect to backend.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-2xl font-semibold text-teal-700 mb-6">🗺️ Route Management</h3>

      {/* Add Route */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">➕ Add Route</h4>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Start Airport</label>
          <select
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={newRoute.startLocation}
            onChange={(e) => setNewRoute({ ...newRoute, startLocation: e.target.value })}
          >
            <option value="">Select Start Airport</option>
            {LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">End Airport</label>
          <select
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={newRoute.endLocation}
            onChange={(e) => setNewRoute({ ...newRoute, endLocation: e.target.value })}
          >
            <option value="">Select End Airport</option>
            {LOCATIONS.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Distance (km)</label>
          <input
            type="number"
            placeholder="Distance (km)"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={newRoute.distance || ""}
            onChange={(e) => setNewRoute({ ...newRoute, distance: Number(e.target.value) })}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Duration</label>
          <div className="flex gap-2">
            <select
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) =>
                handleDurationChange(e.target.value, newRoute.duration.split(":")[1])
              }
            >
              {[...Array(24).keys()].map((h) => (
                <option key={h} value={h}>
                  {h} hrs
                </option>
              ))}
            </select>
            <select
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) =>
                handleDurationChange(newRoute.duration.split(":")[0], e.target.value)
              }
            >
              {[0, 15, 30, 45].map((m) => (
                <option key={m} value={m}>
                  {m} mins
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={addRoute}
          className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
        >
          Add Route
        </button>
      </div>

      {/* Search Routes */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">🔍 Search Routes</h4>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600">Start Airport</label>
            <select
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchStart}
              onChange={(e) => setSearchStart(e.target.value)}
            >
              <option value="">All Start Airports</option>
              {LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-gray-600">End Airport</label>
            <select
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchEnd}
              onChange={(e) => setSearchEnd(e.target.value)}
            >
              <option value="">All End Airports</option>
              {LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 self-end">
            <button
              onClick={fetchRoutes}
              className="px-5 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
            >
              Search
            </button>
            <button
              onClick={() => {
                setSearchStart("");
                setSearchEnd("");
                fetchRoutes();
              }}
              className="px-5 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Route List */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">📋 Route List</h4>
        {isSearching ? (
          <p className="text-teal-600">🔄 Searching...</p>
        ) : searchError ? (
          <p className="text-red-600">{searchError}</p>
        ) : routes.length === 0 ? (
          <p className="text-gray-600">No routes found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="p-3 border-b">Start Airport</th>
                  <th className="p-3 border-b">End Airport</th>
                  <th className="p-3 border-b">Distance (km)</th>
                  <th className="p-3 border-b">Duration</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route: Route, index) => (
                  <tr key={index} className="hover:bg-teal-50 text-gray-800">
                    <td className="p-3 border-b">{route.startLocation}</td>
                    <td className="p-3 border-b">{route.endLocation}</td>
                    <td className="p-3 border-b">{route.distance}</td>
                    <td className="p-3 border-b">{route.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RouteManagement;