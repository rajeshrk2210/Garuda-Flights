import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReviewFlight = () => {
  const [selectedFlights, setSelectedFlights] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem("selectedFlights");
    if (data) {
      setSelectedFlights(JSON.parse(data));
    } else {
      navigate("/flights");
    }
  }, [navigate]);

  if (!selectedFlights) return null;

  const { outbound, inbound, passengers, flightClass, tripType } = selectedFlights;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Review Your Selected Flights</h2>

      {outbound && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Outbound Flight</h3>
          <p><strong>Aircraft No:</strong> {outbound.aircraftNumber}</p>
          <p><strong>Departure:</strong> {outbound.departureTime}</p>
          <p><strong>Arrival:</strong> {outbound.arrivalTime}</p>
          <p><strong>Duration:</strong> {outbound.duration}</p>
          <p><strong>Price:</strong> ₹{outbound.price}</p>
        </div>
      )}

      {tripType === "roundtrip" && inbound && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Inbound Flight</h3>
          <p><strong>Aircraft No:</strong> {inbound.aircraftNumber}</p>
          <p><strong>Departure:</strong> {inbound.departureTime}</p>
          <p><strong>Arrival:</strong> {inbound.arrivalTime}</p>
          <p><strong>Duration:</strong> {inbound.duration}</p>
          <p><strong>Price:</strong> ₹{inbound.price}</p>
        </div>
      )}

      <p className="mb-2"><strong>Passengers:</strong> {passengers}</p>
      <p className="mb-4"><strong>Class:</strong> {flightClass}</p>

      <button
        onClick={() => navigate("/passenger")}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Continue to Passenger Info
      </button>
    </div>
  );
};

export default ReviewFlight;
