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




  depDateTime.setHours(depDateTime.getHours() + durationHours);
  depDateTime.setMinutes(depDateTime.getMinutes() + durationMinutes);

  return {


    arrivalDate: depDateTime.toLocaleDateString("en-CA"), // YYYY-MM-DD format
    arrivalTime: depDateTime.toTimeString().slice(0, 5), // HH:MM format

  };
};

const FlightManagement = () => {
  // Inside FlightManagement component
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
    setNewFlight((prev) => ({ ...prev, [name]: value }));
  };

  /** 🔹 Add Flight */
  const addFlight = async () => {
    if (!newFlight.aircraftNumber || !newFlight.routeId || !newFlight.departureDate || !newFlight.departureTime) {
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
    <div className="bg-white p-6 rounded shadow-lg mb-8">
      <h3 className="text-2xl font-bold mb-6 text-blue-700">✈️ Flight Management</h3>
  
      {/* Add Flight Section */}
      <div className="mb-6 p-4 border rounded bg-gray-100">
        <h4 className="text-lg font-semibold mb-4 text-gray-700">➕ Add Flight</h4>
  
        <label className="block mb-1 text-sm text-gray-700">Aircraft</label>
        <select name="aircraftNumber" className="border p-2 w-full rounded mb-3 bg-white text-gray-800" value={newFlight.aircraftNumber} onChange={handleInputChange}>
          <option value="">Select Aircraft</option>
          {aircrafts.map((aircraft) => (
            <option key={aircraft.aircraftNumber} value={aircraft.aircraftNumber}>{aircraft.aircraftNumber}</option>
          ))}
        </select>
  
        <label className="block mb-1 text-sm text-gray-700">Route</label>
        <select name="routeId" className="border p-2 w-full rounded mb-3 bg-white text-gray-800" value={newFlight.routeId} onChange={handleInputChange}>
          <option value="">Select Route</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>{route.startLocation} → {route.endLocation}</option>
          ))}
        </select>
  
        <label className="block mb-1 text-sm text-gray-700">Departure Date</label>
        <input type="date" name="departureDate" className="border p-2 w-full rounded mb-3 bg-white text-gray-800" value={newFlight.departureDate} onChange={handleInputChange} />
  
        <label className="block mb-1 text-sm text-gray-700">Departure Time</label>
        <input type="time" name="departureTime" className="border p-2 w-full rounded mb-3 bg-white text-gray-800" value={newFlight.departureTime} onChange={handleInputChange} />
  
        <label className="block mb-1 text-sm text-gray-700">Economy Price</label>
        <input type="text" name="economyPrice" placeholder="e.g. 100" className="border p-2 w-full rounded mb-3 bg-white placeholder-gray-500 text-gray-800" value={newFlight.economyPrice} onChange={handleInputChange} />
  
        <label className="block mb-1 text-sm text-gray-700">Premium Price</label>
        <input type="text" name="premiumPrice" placeholder="e.g. 200" className="border p-2 w-full rounded mb-4 bg-white placeholder-gray-500 text-gray-800" value={newFlight.premiumPrice} onChange={handleInputChange} />
  
        <button onClick={addFlight} className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition">
          Add Flight
        </button>
      </div>
  
      {/* Search Flights Section */}
      <div className="mb-6 p-4 border rounded bg-gray-100">
        <h4 className="text-lg font-semibold mb-4 text-gray-700">🔍 Search Flights</h4>
  
        <input
          type="text"
          placeholder="Aircraft Number"
          className="border p-2 w-full rounded mb-3 bg-white placeholder-gray-500 text-gray-800"
          value={searchParams.aircraftNumber}
          onChange={(e) => setSearchParams({ ...searchParams, aircraftNumber: e.target.value })}
        />
  
        <select
          className="border p-2 w-full rounded mb-3 bg-white text-gray-800"
          value={searchParams.startLocation}
          onChange={(e) => setSearchParams({ ...searchParams, startLocation: e.target.value })}
        >
          <option value="">Select Start Location</option>
          {routes.map((route) => (
            <option key={route._id} value={route.startLocation}>{route.startLocation}</option>
          ))}
        </select>
  
        <select
          className="border p-2 w-full rounded mb-3 bg-white text-gray-800"
          value={searchParams.endLocation}
          onChange={(e) => setSearchParams({ ...searchParams, endLocation: e.target.value })}
        >
          <option value="">Select End Location</option>
          {routes.map((route) => (
            <option key={route._id} value={route.endLocation}>{route.endLocation}</option>
          ))}
        </select>
  
        <select
          className="border p-2 w-full rounded mb-4 bg-white text-gray-800"
          value={searchParams.type}
          onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}
        >
          <option value="All">All Flights</option>
          <option value="Upcoming">Upcoming Flights</option>
          <option value="Previous">Previous Flights</option>
        </select>
  
        <button onClick={fetchFlights} className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition">
          Search Flights
        </button>
      </div>
  
      {/* Display Flights */}
      <div className="mb-6 p-4 border rounded bg-gray-100">
        <h4 className="text-lg font-semibold mb-4 text-gray-700">🛫 Flight Results</h4>
  
        {flights.length === 0 ? (
          <p className="text-gray-600">No flights found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-300">
              <thead className="bg-blue-100 text-blue-700">
                <tr>
                  <th className="p-3 border">Aircraft</th>
                  <th className="p-3 border">Start Location</th>
                  <th className="p-3 border">End Location</th>
                  <th className="p-3 border">Departure Date</th>
                  <th className="p-3 border">Departure Time</th>
                  <th className="p-3 border">Arrival Date</th>
                  <th className="p-3 border">Arrival Time</th>
                  <th className="p-3 border">Economy Price</th>
                  <th className="p-3 border">Premium Price</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {flights.map((flight) => (
                  <tr key={flight._id} className="hover:bg-gray-50">
                    <td className="p-3 border">{flight.aircraftNumber}</td>
                    <td className="p-3 border">{flight.route?.startLocation || "N/A"}</td>
                    <td className="p-3 border">{flight.route?.endLocation || "N/A"}</td>
                    <td className="p-3 border">{formatDate(flight.departureDate)}</td>
                    <td className="p-3 border">{formatTime(flight.departureTime)}</td>
                    <td className="p-3 border">{formatDate(flight.arrivalDate)}</td>
                    <td className="p-3 border">{formatTime(flight.arrivalTime)}</td>
                    <td className="p-3 border">${flight.economyPrice}</td>
                    <td className="p-3 border">${flight.premiumPrice}</td>
                    <td className="p-3 border">{flight.status}</td>
                    <td className="p-3 border">
                      <button
                        className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600 transition"
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
