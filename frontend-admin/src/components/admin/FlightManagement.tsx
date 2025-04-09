import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Interfaces
interface Aircraft {
  aircraftNumber: string;
}

interface Route {
  _id: string;
  startLocation: string;
  endLocation: string;
  duration: string; // Format "HH:MM"
}

interface Flight {
  _id: string;
  aircraftNumber: string;
  route: Route;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  economyPrice: string;
  premiumPrice: string;
  status: string;
}

/** 🔹 Convert YYYY-MM-DD to readable format without time zone issues */
const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day)); // UTC-safe
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC", // Ensure no local time zone affects it
  });
};

/** 🔹 Convert Time to 12-hour Format */
const formatTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

/** 🔹 Calculate Arrival Date & Time */
const calculateArrivalDetails = (departureDate: string, departureTime: string, routeDuration: string) => {
  if (!departureDate || !departureTime || !routeDuration) return { arrivalDate: "", arrivalTime: "" };

  const [year, month, day] = departureDate.split("-").map(Number);
  const [depHours, depMinutes] = departureTime.split(":").map(Number);
  const [durationHours, durationMinutes] = routeDuration.split(":").map(Number);

  const depDateTime = new Date(year, month - 1, day, depHours, depMinutes);
  const durationInMs = (durationHours * 60 + durationMinutes) * 60 * 1000;
  const arrivalDateTime = new Date(depDateTime.getTime() + durationInMs);

  return {
    arrivalDate: arrivalDateTime.toISOString().split("T")[0], // YYYY-MM-DD
    arrivalTime: arrivalDateTime.toTimeString().slice(0, 5),   // HH:MM
  };
};

const FlightManagement = () => {
  const navigate = useNavigate();

  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [searchParams, setSearchParams] = useState({
    aircraftNumber: "",
    startLocation: "",
    endLocation: "",
    type: "All", // Upcoming, Previous, or All
  });

  const [newFlight, setNewFlight] = useState({
    aircraftNumber: "",
    routeId: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    economyPrice: "",
    premiumPrice: "",
    status: "OK",
  });

  useEffect(() => {
    fetchAircrafts();
    fetchRoutes();
    fetchFlights();
  }, []);

  /** 🔹 Fetch Aircrafts */
  const fetchAircrafts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/aircrafts");
      const data = await response.json();
      setAircrafts(data);
    } catch (error) {
      console.error("❌ Error fetching aircrafts:", error);
    }
  };

  /** 🔹 Fetch Routes */
  const fetchRoutes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/routes");
      const data = await response.json();
      setRoutes(data);
    } catch (error) {
      console.error("❌ Error fetching routes:", error);
    }
  };

  /** 🔹 Fetch Flights */
  const fetchFlights = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("❌ No token found! Please log in again.");
        return;
      }

      const queryParams = new URLSearchParams();
      if (searchParams.aircraftNumber) queryParams.append("aircraftNumber", searchParams.aircraftNumber);
      if (searchParams.startLocation) queryParams.append("startLocation", searchParams.startLocation);
      if (searchParams.endLocation) queryParams.append("endLocation", searchParams.endLocation);
      if (searchParams.type !== "All") queryParams.append("type", searchParams.type);

      const response = await fetch(`http://localhost:5000/api/flights?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("🔐 Token used in request:", token);

      let data: Flight[] = await response.json();
      setFlights(data);
    } catch (error) {
      console.error("❌ Error fetching flights:", error);
    }
  };

  /** 🔹 Handle Input Changes */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewFlight((prev) => {
      const updatedFlight = { ...prev, [name]: value };

      // If routeId, departureDate, or departureTime changes, recalculate arrival
      if (name === "routeId" || name === "departureDate" || name === "departureTime") {
        const selectedRoute = routes.find((route) => route._id === updatedFlight.routeId);
        if (selectedRoute && updatedFlight.departureDate && updatedFlight.departureTime) {
          const { arrivalDate, arrivalTime } = calculateArrivalDetails(
            updatedFlight.departureDate,
            updatedFlight.departureTime,
            selectedRoute.duration
          );
          return { ...updatedFlight, arrivalDate, arrivalTime };
        }
      }
      return updatedFlight;
    });
  };

  /** 🔹 Add Flight */
  const addFlight = async () => {
    if (
      !newFlight.aircraftNumber ||
      !newFlight.routeId ||
      !newFlight.departureDate ||
      !newFlight.departureTime ||
      !newFlight.economyPrice ||
      !newFlight.premiumPrice
    ) {
      alert("⚠️ All fields are required!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("❌ No token found! Please log in again.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newFlight),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Flight added successfully!");
        setNewFlight({
          aircraftNumber: "",
          routeId: "",
          departureDate: "",
          departureTime: "",
          arrivalDate: "",
          arrivalTime: "",
          economyPrice: "",
          premiumPrice: "",
          status: "OK",
        });
        fetchFlights();
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("❌ Network Error:", error);
      alert("❌ Failed to connect to backend.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="text-2xl font-semibold text-teal-700 mb-6">✈️ Flight Management</h3>

      {/* Add Flight Section */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">➕ Add Flight</h4>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Aircraft</label>
          <select
            name="aircraftNumber"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={newFlight.aircraftNumber}
            onChange={handleInputChange}
          >
            <option value="">Select Aircraft</option>
            {aircrafts.map((aircraft) => (
              <option key={aircraft.aircraftNumber} value={aircraft.aircraftNumber}>
                {aircraft.aircraftNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Route</label>
          <select
            name="routeId"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={newFlight.routeId}
            onChange={handleInputChange}
          >
            <option value="">Select Route</option>
            {routes.map((route) => (
              <option key={route._id} value={route._id}>
                {route.startLocation} → {route.endLocation}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Departure Date</label>
          <input
            type="date"
            name="departureDate"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={newFlight.departureDate}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Departure Time</label>
          <input
            type="time"
            name="departureTime"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={newFlight.departureTime}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Economy Price ($)</label>
          <input
            type="text"
            name="economyPrice"
            placeholder="e.g., 100"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={newFlight.economyPrice}
            onChange={handleInputChange}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Premium Price ($)</label>
          <input
            type="text"
            name="premiumPrice"
            placeholder="e.g., 200"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={newFlight.premiumPrice}
            onChange={handleInputChange}
          />
        </div>

        <button
          onClick={addFlight}
          className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
        >
          Add Flight
        </button>
      </div>

      {/* Search Flights Section */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">🔍 Search Flights</h4>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Aircraft Number</label>
          <input
            type="text"
            placeholder="Aircraft Number"
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 placeholder-gray-400"
            value={searchParams.aircraftNumber}
            onChange={(e) => setSearchParams({ ...searchParams, aircraftNumber: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Start Airport</label>
          <select
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchParams.startLocation}
            onChange={(e) => setSearchParams({ ...searchParams, startLocation: e.target.value })}
          >
            <option value="">Select Start Airport</option>
            {routes.map((route) => (
              <option key={route._id} value={route.startLocation}>
                {route.startLocation}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">End Airport</label>
          <select
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchParams.endLocation}
            onChange={(e) => setSearchParams({ ...searchParams, endLocation: e.target.value })}
          >
            <option value="">Select End Airport</option>
            {routes.map((route) => (
              <option key={route._id} value={route.endLocation}>
                {route.endLocation}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-600">Flight Type</label>
          <select
            className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            value={searchParams.type}
            onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
          >
            <option value="All">All Flights</option>
            <option value="Upcoming">Upcoming Flights</option>
            <option value="Previous">Previous Flights</option>
          </select>
        </div>

        <button
          onClick={fetchFlights}
          className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
        >
          Search Flights
        </button>
      </div>

      {/* Display Flights */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="text-xl font-semibold text-gray-800 mb-4">🛫 Flight Results</h4>

        {flights.length === 0 ? (
          <p className="text-gray-600">No flights found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200">
              <thead className="bg-teal-600 text-white">
                <tr>
                  <th className="p-3 border-b">Aircraft</th>
                  <th className="p-3 border-b">Start Airport</th>
                  <th className="p-3 border-b">End Airport</th>
                  <th className="p-3 border-b">Departure Date</th>
                  <th className="p-3 border-b">Departure Time</th>
                  <th className="p-3 border-b">Arrival Date</th>
                  <th className="p-3 border-b">Arrival Time</th>
                  <th className="p-3 border-b">Economy Price</th>
                  <th className="p-3 border-b">Premium Price</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {flights.map((flight) => (
                  <tr key={flight._id} className="hover:bg-teal-50">
                    <td className="p-3 border-b">{flight.aircraftNumber}</td>
                    <td className="p-3 border-b">{flight.route?.startLocation || "N/A"}</td>
                    <td className="p-3 border-b">{flight.route?.endLocation || "N/A"}</td>
                    <td className="p-3 border-b">{formatDate(flight.departureDate)}</td>
                    <td className="p-3 border-b">{formatTime(flight.departureTime)}</td>
                    <td className="p-3 border-b">{formatDate(flight.arrivalDate)}</td>
                    <td className="p-3 border-b">{formatTime(flight.arrivalTime)}</td>
                    <td className="p-3 border-b">${flight.economyPrice}</td>
                    <td className="p-3 border-b">${flight.premiumPrice}</td>
                    <td className="p-3 border-b">{flight.status}</td>
                    <td className="p-3 border-b">
                      <button
                        className="px-4 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
                        onClick={() => navigate(`/flights/${flight._id}`)}
                      >
                        Select
                      </button>
                    </td>
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

export default FlightManagement;