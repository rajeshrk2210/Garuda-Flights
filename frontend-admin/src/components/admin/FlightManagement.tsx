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



/** 🔹 Convert Date to Readable Format */
const formatDate = (dateStr: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateStr).toLocaleDateString("en-US", options);
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
      <h3 className="text-xl font-semibold mb-4">✈️ Flight Management</h3>

      {/* Add Flight Section */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h4 className="text-lg font-semibold mb-2">➕ Add Flight</h4>

        <label>Aircraft</label>
        <select name="aircraftNumber" className="border p-2 w-full mb-2" value={newFlight.aircraftNumber} onChange={handleInputChange}>
          <option value="">Select Aircraft</option>
          {aircrafts.map((aircraft) => (
            <option key={aircraft.aircraftNumber} value={aircraft.aircraftNumber}>{aircraft.aircraftNumber}</option>
          ))}
        </select>

        <label>Route</label>
        <select name="routeId" className="border p-2 w-full mb-2" value={newFlight.routeId} onChange={handleInputChange}>
          <option value="">Select Route</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>{route.startLocation} → {route.endLocation}</option>
          ))}
        </select>

        <label>Departure Date</label>
        <input type="date" name="departureDate" className="border p-2 w-full mb-2" value={newFlight.departureDate} onChange={handleInputChange} />

        <label>Departure Time</label>
        <input type="time" name="departureTime" className="border p-2 w-full mb-2" value={newFlight.departureTime} onChange={handleInputChange} />

        <label>Economy Price</label>
        <input type="text" name="economyPrice" className="border p-2 w-full mb-2" value={newFlight.economyPrice} onChange={handleInputChange} />

        <label>Premium Price</label>
        <input type="text" name="premiumPrice" className="border p-2 w-full mb-2" value={newFlight.premiumPrice} onChange={handleInputChange} />

        <button onClick={addFlight} className="bg-blue-500 text-white px-4 py-2 rounded">Add Flight</button>
      </div>

      {/* Search Flights Section */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h4 className="text-lg font-semibold mb-2">🔍 Search Flights</h4>

        <input type="text" placeholder="Aircraft Number" className="border p-2 w-full mb-2"
          value={searchParams.aircraftNumber} onChange={(e) => setSearchParams({ ...searchParams, aircraftNumber: e.target.value })} />

        <select className="border p-2 w-full mb-2" value={searchParams.startLocation}
          onChange={(e) => setSearchParams({ ...searchParams, startLocation: e.target.value })}>
          <option value="">Select Start Location</option>
          {routes.map((route) => (
            <option key={route._id} value={route.startLocation}>{route.startLocation}</option>
          ))}
        </select>

        <select className="border p-2 w-full mb-2" value={searchParams.endLocation}
          onChange={(e) => setSearchParams({ ...searchParams, endLocation: e.target.value })}>
          <option value="">Select End Location</option>
          {routes.map((route) => (
            <option key={route._id} value={route.endLocation}>{route.endLocation}</option>
          ))}
        </select>

        <select className="border p-2 w-full mb-2" value={searchParams.type}
          onChange={(e) => setSearchParams({ ...searchParams, type: e.target.value })}>
          <option value="All">All Flights</option>
          <option value="Upcoming">Upcoming Flights</option>
          <option value="Previous">Previous Flights</option>
        </select>

        <button onClick={fetchFlights} className="bg-green-500 text-white px-4 py-2 rounded">Search Flights</button>
      </div>

      {/* Display Flights */}
      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h4 className="text-lg font-semibold mb-4">🛫 Flight Results</h4>

        {flights.length === 0 ? (
          <p className="text-gray-500">No flights found.</p>
        ) : (
          <table className="w-full text-left border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Aircraft</th>
                <th className="p-2 border">Start Location</th>
                <th className="p-2 border">End Location</th>
                <th className="p-2 border">Departure Date</th>
                <th className="p-2 border">Departure Time</th>
                <th className="p-2 border">Arrival Date</th>
                <th className="p-2 border">Arrival Time</th>
                <th className="p-2 border">Economy Price</th>
                <th className="p-2 border">Premium Price</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight._id}>
                  <td className="p-2 border">{flight.aircraftNumber}</td>
                  <td className="p-2 border">{flight.route?.startLocation || "N/A"}</td>
                  <td className="p-2 border">{flight.route?.endLocation || "N/A"}</td>
                  <td className="p-2 border">{formatDate(flight.departureDate)}</td>
                  <td className="p-2 border">{formatTime(flight.departureTime)}</td>
                  <td className="p-2 border">{formatDate(flight.arrivalDate)}</td>
                  <td className="p-2 border">{formatTime(flight.arrivalTime)}</td>
                  <td className="p-2 border">${flight.economyPrice}</td>
                  <td className="p-2 border">${flight.premiumPrice}</td>
                  <td className="p-2 border">{flight.status}</td>
                  <td className="p-2 border">
                    <button
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                      onClick={() => navigate(`/flights/${flight._id}`)}
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default FlightManagement;
