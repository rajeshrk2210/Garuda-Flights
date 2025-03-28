import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Flights = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tripType, setTripType] = useState("oneway");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState("Economy");
  const [locations, setLocations] = useState<string[]>([]);
  const [outboundFlights, setOutboundFlights] = useState<any[]>([]);
  const [inboundFlights, setInboundFlights] = useState<any[]>([]);

  // 🔐 Redirect to login if not authenticated
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/routes/locations");
        const data = await res.json();
        setLocations(data);
      } catch (err) {
        console.error("Error fetching locations:", err);
      }
    };
    fetchLocations();
  }, []);

  const searchFlights = async () => {
    if (!startLocation || !endLocation || !departureDate) {
      alert("Please fill required fields");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const query = `start=${startLocation}&end=${endLocation}&date=${departureDate}&class=${flightClass}`;
      const res = await fetch(`http://localhost:5000/api/flights/search?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOutboundFlights(data);

      if (tripType === "roundtrip" && returnDate) {
        const returnQuery = `start=${endLocation}&end=${startLocation}&date=${returnDate}&class=${flightClass}`;
        const returnRes = await fetch(`http://localhost:5000/api/flights/search?${returnQuery}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const returnData = await returnRes.json();
        setInboundFlights(returnData);
      } else {
        setInboundFlights([]);
      }
    } catch (err) {
      console.error("Error searching flights:", err);
    }
  };

  const handleSelectFlight = (flight: any, type: "outbound" | "inbound") => {
    const existing = JSON.parse(localStorage.getItem("selectedFlight") || "{}");

    const updatedSelection = {
      tripType,
      passengers,
      flightClass,
      selectedOutbound: type === "outbound" ? flight : existing.selectedOutbound,
      selectedInbound: type === "inbound" ? flight : existing.selectedInbound,
    };

    localStorage.setItem("selectedFlight", JSON.stringify(updatedSelection));

    // 🛫 Redirect after outbound in oneway OR after inbound in roundtrip
    if (tripType === "oneway" || (tripType === "roundtrip" && type === "inbound")) {
      navigate("/review-flight");
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search Flights</h2>

      {/* Flight Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <select value={tripType} onChange={(e) => setTripType(e.target.value)} className="border p-2 rounded">
          <option value="oneway">One Way</option>
          <option value="roundtrip">Round Trip</option>
        </select>

        <select value={startLocation} onChange={(e) => setStartLocation(e.target.value)} className="border p-2 rounded">
          <option value="">From</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <select value={endLocation} onChange={(e) => setEndLocation(e.target.value)} className="border p-2 rounded">
          <option value="">To</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        <input type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className="border p-2 rounded" />

        {tripType === "roundtrip" && (
          <input type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="border p-2 rounded" />
        )}

        <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} className="border p-2 rounded">
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>{num} Passenger{num > 1 ? "s" : ""}</option>
          ))}
        </select>

        <select value={flightClass} onChange={(e) => setFlightClass(e.target.value)} className="border p-2 rounded">
          <option value="Economy">Economy</option>
          <option value="Premium">Premium</option>
        </select>

        <button onClick={searchFlights} className="col-span-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Search Flights
        </button>
      </div>

      {/* Outbound Flights */}
      {outboundFlights.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-2">Outbound Flights</h3>
          <div className="space-y-4">
            {outboundFlights.map((flight) => (
              <div key={flight._id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p><strong>Aircraft No:</strong> {flight.aircraftNumber}</p>
                  <p><strong>Departure:</strong> {flight.departureTime}</p>
                  <p><strong>Arrival:</strong> {flight.arrivalTime}</p>
                  <p><strong>Duration:</strong> {flight.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₹{flight.price}</p>
                  <button
                    onClick={() => handleSelectFlight(flight, "outbound")}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inbound Flights */}
      {tripType === "roundtrip" && inboundFlights.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Inbound Flights</h3>
          <div className="space-y-4">
            {inboundFlights.map((flight) => (
              <div key={flight._id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p><strong>Aircraft No:</strong> {flight.aircraftNumber}</p>
                  <p><strong>Departure:</strong> {flight.departureTime}</p>
                  <p><strong>Arrival:</strong> {flight.arrivalTime}</p>
                  <p><strong>Duration:</strong> {flight.duration}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₹{flight.price}</p>
                  <button
                    onClick={() => handleSelectFlight(flight, "inbound")}
                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Flights;
