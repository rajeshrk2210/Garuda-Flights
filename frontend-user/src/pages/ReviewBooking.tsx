import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReviewBooking = () => {
  const navigate = useNavigate();
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [passengerData, setPassengerData] = useState<any>(null);

  useEffect(() => {
    const flight = localStorage.getItem("selectedFlight");
    const passengers = localStorage.getItem("passengerDetails");

    if (!flight || !passengers) {
      navigate("/flights");
      return;
    }

    setSelectedFlight(JSON.parse(flight));
    setPassengerData(JSON.parse(passengers));
  }, [navigate]);

  if (!selectedFlight || !passengerData) {
    return <p className="text-center mt-10 text-gray-600">Loading booking details...</p>;
  }

  const { tripType, flightClass, passengers, selectedOutbound, selectedInbound } = selectedFlight;
  const { passengers: passengerList } = passengerData;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const totalAmount =
    (selectedOutbound?.price || 0) +
    (tripType === "roundtrip" ? selectedInbound?.price || 0 : 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">📋 Review Your Booking</h2>

      {/* Outbound Flight */}
      {selectedOutbound && (
        <div className="mb-6 border border-gray-300 p-4 rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">🛫 Outbound Flight</h3>
          <p><strong>From:</strong> {selectedOutbound.startLocation}</p>
          <p><strong>To:</strong> {selectedOutbound.endLocation}</p>
          <p><strong>Date:</strong> {formatDate(selectedOutbound.departureDate)}</p>
          <p><strong>Departure Time:</strong> {selectedOutbound.departureTime}</p>
          <p><strong>Arrival Time:</strong> {selectedOutbound.arrivalTime}</p>
          <p><strong>Duration:</strong> {selectedOutbound.duration}</p>
          <p><strong>Class:</strong> {flightClass}</p>
          <p><strong>Price:</strong> ₹{selectedOutbound.price}</p>
        </div>
      )}

      {/* Inbound Flight */}
      {tripType === "roundtrip" && selectedInbound && (
        <div className="mb-6 border border-gray-300 p-4 rounded bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">🛬 Return Flight</h3>
          <p><strong>From:</strong> {selectedInbound.startLocation}</p>
          <p><strong>To:</strong> {selectedInbound.endLocation}</p>
          <p><strong>Date:</strong> {formatDate(selectedInbound.departureDate)}</p>
          <p><strong>Departure Time:</strong> {selectedInbound.departureTime}</p>
          <p><strong>Arrival Time:</strong> {selectedInbound.arrivalTime}</p>
          <p><strong>Duration:</strong> {selectedInbound.duration}</p>
          <p><strong>Class:</strong> {flightClass}</p>
          <p><strong>Price:</strong> ₹{selectedInbound.price}</p>
        </div>
      )}

      {/* Passenger Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">👥 Passenger Details</h3>
        {passengerList.map((p: any, idx: number) => (
          <div key={idx} className="mb-3 p-3 border rounded bg-gray-100">
            <p><strong>Name:</strong> {p.firstName} {p.lastName}</p>
            <p><strong>Gender:</strong> {p.gender}</p>
            <p><strong>Date of Birth:</strong> {p.dateOfBirth}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="text-lg font-semibold mb-6">
        Total Amount to be Paid: ₹{totalAmount}
      </div>

      <button
        onClick={() => navigate("/payment")}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Continue to Payment
      </button>
    </div>
  );
};

export default ReviewBooking;
