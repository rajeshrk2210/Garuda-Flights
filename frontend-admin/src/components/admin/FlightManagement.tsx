import { useState, useEffect } from "react";

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
/** 🔹 Calculate Arrival Date & Time (Ensuring Correct Local Time) */
const calculateArrivalDetails = (departureDate: string, departureTime: string, routeDuration: string) => {
  if (!departureDate || !departureTime || !routeDuration) return { arrivalDate: "", arrivalTime: "" };

  // ✅ Parse date and time as local time
  const [year, month, day] = departureDate.split("-").map(Number);
  const [depHours, depMinutes] = departureTime.split(":").map(Number);
  const [durationHours, durationMinutes] = routeDuration.split(":").map(Number);

  // ✅ Create a new Date object without automatic UTC conversion
  const depDateTime = new Date(year, month - 1, day, depHours, depMinutes);

  console.log("📅 Departure DateTime (Before Adding Duration):", depDateTime.toLocaleString());

  // ✅ Add duration correctly (ensuring local time handling)
  depDateTime.setHours(depDateTime.getHours() + durationHours);
  depDateTime.setMinutes(depDateTime.getMinutes() + durationMinutes);

  console.log("🛬 Arrival DateTime (After Adding Duration):", depDateTime.toLocaleString());

  // ✅ Format arrival date and time correctly
  const arrivalDate = depDateTime.toISOString().split("T")[0]; // YYYY-MM-DD format
  const arrivalTime = depDateTime.toTimeString().slice(0, 5); // HH:MM format

  return { arrivalDate, arrivalTime };
};

const FlightManagement = () => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [flights, setFlights] = useState<Flight[]>([]);

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

      const response = await fetch("http://localhost:5000/api/flights", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data: Flight[] = await response.json();

      const updatedFlights: Flight[] = data.map((flight) => ({
        ...flight,
        route: flight.route || { startLocation: "Unknown", endLocation: "Unknown", duration: "00:00" },
      }));

      setFlights(updatedFlights);
    } catch (error) {
      console.error("❌ Error fetching flights:", error);
    }
  };

  /** 🔹 Handle Input Changes */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const updatedFlight = { ...newFlight, [name]: value };

    // Update Arrival Date & Time if Departure Date/Time or Route changes
    if (name === "departureDate" || name === "departureTime" || name === "routeId") {
      const selectedRoute = routes.find((route) => route._id === updatedFlight.routeId);
      if (selectedRoute) {
        const { arrivalDate, arrivalTime } = calculateArrivalDetails(
          updatedFlight.departureDate,
          updatedFlight.departureTime,
          selectedRoute.duration
        );
        updatedFlight.arrivalDate = arrivalDate;
        updatedFlight.arrivalTime = arrivalTime;
      }
    }    
    setNewFlight(updatedFlight);
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
    </div>
  );
};

export default FlightManagement;
