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
  route: {
    startLocation: string;
    endLocation: string;
  };
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
  const [flights, setFlights] = useState<Flight[]>([]); // ✅ State for flight list

  const [newFlight, setNewFlight] = useState({
    aircraftNumber: "",
    routeId: "",
    departureDate: "",
    departureTime: "",
    arrivalTime: "",
    economyPrice: "",
    premiumPrice: "",
    status: "OK",
  });

  useEffect(() => {
    fetchAircrafts();
    fetchRoutes();
    fetchFlights(); // ✅ Fetch flights when component loads
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

      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error("❌ Error fetching flights:", error);
    }
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
        fetchFlights(); // ✅ Refresh flights list after adding
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

        <select className="border p-2 w-full mb-2" value={newFlight.aircraftNumber} onChange={(e) => setNewFlight({ ...newFlight, aircraftNumber: e.target.value })}>
          <option value="">Select Aircraft</option>
          {aircrafts.map((aircraft) => (
            <option key={aircraft.aircraftNumber} value={aircraft.aircraftNumber}>{aircraft.aircraftNumber}</option>
          ))}
        </select>

        <select className="border p-2 w-full mb-2" value={newFlight.routeId} onChange={(e) => setNewFlight({ ...newFlight, routeId: e.target.value })}>
          <option value="">Select Route</option>
          {routes.map((route) => (
            <option key={route._id} value={route._id}>{route.startLocation} → {route.endLocation}</option>
          ))}
        </select>

        <input type="date" className="border p-2 w-full mb-2" value={newFlight.departureDate} onChange={(e) => setNewFlight({ ...newFlight, departureDate: e.target.value })} />
        <input type="time" className="border p-2 w-full mb-2" value={newFlight.departureTime} onChange={(e) => setNewFlight({ ...newFlight, departureTime: e.target.value })} />
        <input type="text" className="border p-2 w-full mb-2" value={newFlight.arrivalTime} readOnly />
        <input type="text" placeholder="Economy Price" className="border p-2 w-full mb-2" value={newFlight.economyPrice} onChange={(e) => setNewFlight({ ...newFlight, economyPrice: e.target.value })} />
        <input type="text" placeholder="Premium Price" className="border p-2 w-full mb-2" value={newFlight.premiumPrice} onChange={(e) => setNewFlight({ ...newFlight, premiumPrice: e.target.value })} />

        <button onClick={addFlight} className="bg-blue-500 text-white px-4 py-2 rounded">Add Flight</button>
      </div>

      {/* Flight List Section */}
      <h4 className="text-lg font-semibold mt-4">🛫 Flight List</h4>
      {flights.length === 0 ? (
        <p className="text-gray-600 mt-2">No flights available.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Aircraft</th>
              <th className="border p-2">Route</th>
              <th className="border p-2">Departure</th>
              <th className="border p-2">Arrival</th>
              <th className="border p-2">Economy Price</th>
              <th className="border p-2">Premium Price</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {flights.map((flight) => (
              <tr key={flight._id} className="border">
                <td className="border p-2">{flight.aircraftNumber}</td>
                <td className="border p-2">{flight.route.startLocation} → {flight.route.endLocation}</td>
                <td className="border p-2">{flight.departureTime}</td>
                <td className="border p-2">{flight.arrivalTime}</td>
                <td className="border p-2">${flight.economyPrice}</td>
                <td className="border p-2">${flight.premiumPrice}</td>
                <td className="border p-2">{flight.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FlightManagement;
