import { useState, useEffect } from "react";

// Predefined Canadian Locations
const LOCATIONS = [
  "Toronto", "Vancouver", "Montreal", "Calgary", "Edmonton",
  "Ottawa", "Winnipeg", "Quebec City", "Halifax", "Victoria"
];

// Route Interface
interface Route {
  _id?: string;
  startLocation: string;
  endLocation: string;
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

      const response = await fetch(`http://localhost:5000/api/routes?${queryParams.toString()}`);

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
    if (!newRoute.startLocation || !newRoute.endLocation || !newRoute.distance || newRoute.duration === "00:00") {
      alert("⚠️ All fields are required!");
      return;
    }
    if (newRoute.startLocation === newRoute.endLocation) {
      alert("❌ Start and End locations cannot be the same!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/routes/add", {
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
    <div className="bg-white p-6 rounded shadow-lg mb-8">
      <h3 className="text-xl font-semibold mb-4">🛤 Route Management</h3>

      {/* Add Route */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h4 className="text-lg font-semibold mb-2">➕ Add Route</h4>
        <select
          className="border p-2 w-full mb-2"
          value={newRoute.startLocation}
          onChange={(e) => setNewRoute({ ...newRoute, startLocation: e.target.value })}
        >
          <option value="">Select Start Location</option>
          {LOCATIONS.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <select
          className="border p-2 w-full mb-2"
          value={newRoute.endLocation}
          onChange={(e) => setNewRoute({ ...newRoute, endLocation: e.target.value })}
        >
          <option value="">Select End Location</option>
          {LOCATIONS.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Distance (km)"
          className="border p-2 w-full mb-2"
          value={newRoute.distance || ""}
          onChange={(e) => setNewRoute({ ...newRoute, distance: Number(e.target.value) })}
        />

        {/* Digital Timer for Duration */}
        <div className="flex space-x-2 mb-2">
          <select
            className="border p-2 flex-1"
            onChange={(e) => handleDurationChange(e.target.value, newRoute.duration.split(":")[1])}
          >
            {[...Array(24).keys()].map((h) => (
              <option key={h} value={h}>{h} hrs</option>
            ))}
          </select>

          <select
            className="border p-2 flex-1"
            onChange={(e) => handleDurationChange(newRoute.duration.split(":")[0], e.target.value)}
          >
            {[0, 15, 30, 45].map((m) => (
              <option key={m} value={m}>{m} mins</option>
            ))}
          </select>
        </div>

        <button onClick={addRoute} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Route
        </button>
      </div>

      {/* Route List */}
      <h4 className="text-lg font-semibold mt-4">Route List</h4>
      {isSearching ? (
        <p className="text-blue-500 mt-2">🔄 Searching...</p>
      ) : searchError ? (
        <p className="text-red-500 mt-2">{searchError}</p>
      ) : routes.length === 0 ? (
        <p className="text-gray-600 mt-2">No routes found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Start Location</th>
              <th className="border p-2">End Location</th>
              <th className="border p-2">Distance (km)</th>
              <th className="border p-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route: Route, index) => (
              <tr key={index} className="border">
                <td className="border p-2">{route.startLocation}</td>
                <td className="border p-2">{route.endLocation}</td>
                <td className="border p-2">{route.distance}</td>
                <td className="border p-2">{route.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RouteManagement;
