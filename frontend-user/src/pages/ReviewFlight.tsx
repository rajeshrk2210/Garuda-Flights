import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../utils/formatTime";

// 📆 Format ISO date safely
const formatDate = (isoDate: string) => {
  if (!isoDate) return "N/A";
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(year, month - 1, day); // Local time
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-center text-gray-600 text-lg">Loading flight details...</p>
      </div>
    );
  }

  const { selectedOutbound, selectedInbound, passengers, flightClass, tripType } = selectedFlights;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        {/* Header */}
        <h2 className="text-3xl font-bold text-teal-800 mb-8 text-center">
          🧾 Review Your Selected Flights
        </h2>

        {/* Outbound Flight */}
        {selectedOutbound && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-teal-700 mb-4">🛫 Outbound Flight</h3>
            <div className="space-y-2 text-left text-gray-800">
              <p>
                <strong>From:</strong> {selectedFlights.from}
              </p>
              <p>
                <strong>To:</strong> {selectedFlights.to}
              </p>
              <p>
                <strong>Aircraft No:</strong> {selectedOutbound.aircraftNumber}
              </p>
              <p>
                <strong>Departure Date:</strong> {formatDate(selectedOutbound.departureDate)}
              </p>
              <p>
                <strong>Departure Time:</strong> {formatTime(selectedOutbound.departureTime)}
              </p>
              <p>
                <strong>Arrival Date:</strong> {formatDate(selectedOutbound.arrivalDate)}
              </p>
              <p>
                <strong>Arrival Time:</strong> {formatTime(selectedOutbound.arrivalTime)}
              </p>
              <p>
                <strong>Duration:</strong> {selectedOutbound.duration} Hrs
              </p>
              <p>
                <strong>Price:</strong> CAD {selectedOutbound.price}
              </p>
            </div>
          </div>
        )}

        {/* Inbound Flight */}
        {tripType === "roundtrip" && selectedInbound && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-teal-700 mb-4">🛬 Inbound Flight</h3>
            <div className="space-y-2 text-left text-gray-800">
              <p>
                <strong>From:</strong> {selectedFlights.to}
              </p>
              <p>
                <strong>To:</strong> {selectedFlights.from}
              </p>
              <p>
                <strong>Aircraft No:</strong> {selectedInbound.aircraftNumber}
              </p>
              <p>
                <strong>Departure Date:</strong> {formatDate(selectedInbound.departureDate)}
              </p>
              <p>
                <strong>Departure Time:</strong> {formatTime(selectedInbound.departureTime)}
              </p>
              <p>
                <strong>Arrival Date:</strong> {formatDate(selectedInbound.arrivalDate)}
              </p>
              <p>
                <strong>Arrival Time:</strong> {formatTime(selectedInbound.arrivalTime)}
              </p>
              <p>
                <strong>Duration:</strong> {selectedInbound.duration} Hrs
              </p>
              <p>
                <strong>Price:</strong> CAD {selectedInbound.price}
              </p>
            </div>
          </div>
        )}

        {/* Trip Details */}
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-teal-700 mb-4">Trip Details</h3>
          <div className="space-y-2 text-left text-gray-800">
            <p>
              <strong>Passengers:</strong> {passengers}
            </p>
            <p>
              <strong>Class:</strong> {flightClass}
            </p>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={() => navigate("/passenger")}
          className="w-full bg-teal-700 text-white py-3 rounded-lg hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-500 transition duration-300 font-semibold shadow-md"
        >
          Continue to Passenger Info
        </button>
      </div>
    </div>
  );
};

export default ReviewFlight;