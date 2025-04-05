import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// 📆 Format ISO date safely
const formatDate = (isoDate: string) => {
  if (!isoDate) return "N/A";
  const parts = isoDate.split("-");
  if (parts.length !== 3) return "N/A";
  const [year, month, day] = parts.map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
};



const ReviewFlight = () => {
  const [selectedFlights, setSelectedFlights] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("selectedFlight");
    if (data) {
      console.log("✅ Found selectedFlight:", JSON.parse(data));
      setSelectedFlights(JSON.parse(data));
    } else {
      navigate("/flights");
    }
  }, [navigate]);

  if (!selectedFlights) {
    return <p className="text-center mt-10 text-gray-600">Loading flight details...</p>;
  }

  const { selectedOutbound, selectedInbound, passengers, flightClass, tripType } = selectedFlights;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">🧾 Review Your Selected Flights</h2>

      {selectedOutbound && (
        <div className="mb-6 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">🛫 Outbound Flight</h3>
          <p><strong>From:</strong> {selectedFlights.from}</p>
          <p><strong>To:</strong> {selectedFlights.to}</p>
          <p><strong>Aircraft No:</strong> {selectedOutbound.aircraftNumber}</p>
          <p><strong>Departure Date:</strong> {formatDate(selectedOutbound.departureDate)}</p>
          <p><strong>Departure Time:</strong> {selectedOutbound.departureTime}</p>
          <p><strong>Arrival Date:</strong> {formatDate(selectedOutbound.arrivalDate)}</p>
          <p><strong>Arrival Time:</strong> {selectedOutbound.arrivalTime}</p>
          <p><strong>Duration:</strong> {selectedOutbound.duration}</p>
          <p><strong>Price:</strong> ₹{selectedOutbound.price}</p>
        </div>
      )}

      {tripType === "roundtrip" && selectedInbound && (
        <div className="mb-6 p-4 border rounded bg-gray-100">
          <h3 className="text-lg font-semibold mb-2">🛬 Inbound Flight</h3>
          <p><strong>From:</strong> {selectedFlights.from}</p>
          <p><strong>To:</strong> {selectedFlights.to}</p>
          <p><strong>Aircraft No:</strong> {selectedInbound.aircraftNumber}</p>
          <p><strong>Departure Date:</strong> {formatDate(selectedInbound.departureDate)}</p>
          <p><strong>Departure Time:</strong> {selectedInbound.departureTime}</p>
          <p><strong>Arrival Date:</strong> {formatDate(selectedInbound.arrivalDate)}</p>
          <p><strong>Arrival Time:</strong> {selectedInbound.arrivalTime}</p>
          <p><strong>Duration:</strong> {selectedInbound.duration}</p>
          <p><strong>Price:</strong> ₹{selectedInbound.price}</p>
        </div>
      )}

      <div className="mb-6">
        <p><strong>Passengers:</strong> {passengers}</p>
        <p><strong>Class:</strong> {flightClass}</p>
      </div>

      <button
        onClick={() => navigate("/passenger")}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Continue to Passenger Info
      </button>
    </div>
  );
};

export default ReviewFlight;
