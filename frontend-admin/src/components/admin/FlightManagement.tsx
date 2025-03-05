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
  aircraftNumber: string;
  routeId: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  economyPrice: string;
  premiumPrice: string;
  status: string;
}

const FlightManagement = () => {
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [newFlight, setNewFlight] = useState<Flight>({
    aircraftNumber: "",
    routeId: "",
    departureDate: "",
    departureTime: "",
    arrivalTime: "",
    economyPrice: "",
    premiumPrice: "",
    status: "OK", // ✅ Status is always "OK"
  });

  useEffect(() => {
    fetchAircrafts();
    fetchRoutes();
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

  /** 🔹 Convert to 12-hour format */
  const formatTime12Hour = (hours: number, minutes: number): string => {
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 → 12 AM
    return `${formattedHours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };

  /** 🔹 Correct Arrival Time Calculation */
  const calculateArrivalTime = (departureTime: string, duration: string): string => {
    if (!departureTime) return "";

    const [depHours, depMinutes] = departureTime.split(":").map(Number);
    const [durHours, durMinutes] = duration.split(":").map(Number);

    let arrivalHours = depHours + durHours;
    let arrivalMinutes = depMinutes + durMinutes;

    // ✅ Correct overflow from minutes to hours
    if (arrivalMinutes >= 60) {
      arrivalHours += Math.floor(arrivalMinutes / 60);
      arrivalMinutes %= 60;
    }

    arrivalHours %= 24; // Ensure 24-hour format wraps correctly

    return formatTime12Hour(arrivalHours, arrivalMinutes);
  };

  /** 🔹 Handle Route Selection */
  const handleRouteChange = (routeId: string) => {
    const selectedRoute = routes.find((route) => route._id === routeId);
    if (!selectedRoute) return;

    setNewFlight((prev) => ({
      ...prev,
      routeId,
      arrivalTime: prev.departureTime ? calculateArrivalTime(prev.departureTime, selectedRoute.duration) : "",
    }));
  };

  /** 🔹 Handle Departure Time Change */
  const handleDepartureTimeChange = (time: string) => {
    setNewFlight((prev) => {
      const selectedRoute = routes.find((route) => route._id === prev.routeId);
      return {
        ...prev,
        departureTime: time,
        arrivalTime: selectedRoute ? calculateArrivalTime(time, selectedRoute.duration) : "",
      };
    });
  };

  /** 🔹 Handle Price Input */
  const handlePriceChange = (field: "economyPrice" | "premiumPrice", value: string) => {
    if (/^\d*$/.test(value)) { // ✅ Only allow numbers
      setNewFlight((prev) => ({ ...prev, [field]: value.replace(/^0+/, "") })); // ✅ Remove leading zeros
    }
  };

  /** 🔹 Add Flight */
  const addFlight = async () => {
    if (!newFlight.aircraftNumber || !newFlight.routeId || !newFlight.departureDate || !newFlight.departureTime) {
      alert("⚠️ All fields are required!");
      return;
    }
  
    const token = localStorage.getItem("token"); // ✅ Get the token
    if (!token) {
      alert("❌ No token found! Please log in again.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/flights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // ✅ Send token in request headers
        },
        body: JSON.stringify({ ...newFlight, status: "OK" }),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert("✅ Flight added successfully!");
        setNewFlight({
          aircraftNumber: "",
          routeId: "",
          departureDate: "",
          departureTime: "",
          arrivalTime: "",
          economyPrice: "",
          premiumPrice: "",
          status: "OK",
        });
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

      <div className="mb-6 p-4 border rounded bg-gray-50">
        <h4 className="text-lg font-semibold mb-2">➕ Add Flight</h4>

        <select className="border p-2 w-full mb-2" value={newFlight.aircraftNumber} onChange={(e) => setNewFlight({ ...newFlight, aircraftNumber: e.target.value })}>
          <option value="">Select Aircraft</option>
          {aircrafts.map((aircraft) => (
            <option key={aircraft.aircraftNumber} value={aircraft.aircraftNumber}>{aircraft.aircraftNumber}</option>
          ))}
        </select>

        <select className="border p-2 w-full mb-2" value={newFlight.routeId} onChange={(e) => handleRouteChange(e.target.value)}>
          <option value="">Select Route</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>{route.startLocation} → {route.endLocation}</option>
          ))}
        </select>

        <input type="date" className="border p-2 w-full mb-2" value={newFlight.departureDate} onChange={(e) => setNewFlight({ ...newFlight, departureDate: e.target.value })} />

        <input type="time" className="border p-2 w-full mb-2" value={newFlight.departureTime} onChange={(e) => handleDepartureTimeChange(e.target.value)} />

        <input type="text" className="border p-2 w-full mb-2" value={newFlight.arrivalTime} readOnly />

        <input type="text" placeholder="Economy Price" className="border p-2 w-full mb-2" value={newFlight.economyPrice} onChange={(e) => handlePriceChange("economyPrice", e.target.value)} />

        <input type="text" placeholder="Premium Price" className="border p-2 w-full mb-2" value={newFlight.premiumPrice} onChange={(e) => handlePriceChange("premiumPrice", e.target.value)} />

        <button onClick={addFlight} className="bg-blue-500 text-white px-4 py-2 rounded">Add Flight</button>
      </div>
    </div>
  );
};

export default FlightManagement;
