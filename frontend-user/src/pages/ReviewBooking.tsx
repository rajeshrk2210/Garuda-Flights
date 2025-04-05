import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ReviewBooking = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [passengerData, setPassengerData] = useState<any>(null);

  useEffect(() => {
    const flightData = localStorage.getItem("selectedFlight");
    const passengerData = localStorage.getItem("passengerDetails");

    if (!flightData || !passengerData) {
      navigate("/flights");
      return;
    }

    setBooking(JSON.parse(flightData));
    setPassengerData(JSON.parse(passengerData));
  }, [navigate]);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  if (!booking || !passengerData) {
    return <p className="text-center mt-10 text-gray-600">Loading booking details...</p>;
  }

  const {
    tripType,
    passengers,
    flightClass,
    selectedOutbound,
    selectedInbound,
    from,
    to,
  } = booking;

  const totalPrice =
    (selectedOutbound?.price || 0) +
    (tripType === "roundtrip" ? selectedInbound?.price || 0 : 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-6 text-blue-700">📋 Review Your Booking</h2>

      {/* Outbound Flight */}
      {selectedOutbound && (
        <div className="mb-6 border rounded p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">🛫 Outbound Flight</h3>
          <p><strong>From:</strong> {from}</p>
          <p><strong>To:</strong> {to}</p>
          <p><strong>Departure Date:</strong> {formatDate(selectedOutbound.departureDate)}</p>
          <p><strong>Departure Time:</strong> {selectedOutbound.departureTime}</p>
          <p><strong>Arrival Date:</strong> {formatDate(selectedOutbound.arrivalDate)}</p>
          <p><strong>Arrival Time:</strong> {selectedOutbound.arrivalTime}</p>
          <p><strong>Duration:</strong> {selectedOutbound.duration}</p>
          <p><strong>Class:</strong> {flightClass}</p>
          <p><strong>Price:</strong> ₹{selectedOutbound.price}</p>
        </div>
      )}

      {/* Inbound Flight */}
      {tripType === "roundtrip" && selectedInbound && (
        <div className="mb-6 border rounded p-4 bg-gray-50">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">🛬 Return Flight</h3>
          <p><strong>From:</strong> {to}</p>
          <p><strong>To:</strong> {from}</p>
          <p><strong>Departure Date:</strong> {formatDate(selectedInbound.departureDate)}</p>
          <p><strong>Departure Time:</strong> {selectedInbound.departureTime}</p>
          <p><strong>Arrival Date:</strong> {formatDate(selectedInbound.arrivalDate)}</p>
          <p><strong>Arrival Time:</strong> {selectedInbound.arrivalTime}</p>
          <p><strong>Duration:</strong> {selectedInbound.duration}</p>
          <p><strong>Class:</strong> {flightClass}</p>
          <p><strong>Price:</strong> ₹{selectedInbound.price}</p>
        </div>
      )}

      {/* Passenger Details */}
      <div className="mb-6 border rounded p-4 bg-gray-50">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">👤 Passenger Details</h3>
        {passengerData.passengers.map((p: any, idx: number) => (
          <div key={idx} className="mb-2">
            <p><strong>Passenger {idx + 1}:</strong> {p.firstName} {p.lastName} | {p.gender} | DOB: {formatDate(p.dateOfBirth)}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mb-6 text-right text-lg font-semibold">
        <p>Total Passengers: {passengers}</p>
        <p>Total Price: ₹{totalPrice}</p>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate("/payment")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default ReviewBooking;
