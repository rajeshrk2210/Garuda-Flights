import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../utils/formatTime";

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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-sm border border-gray-200 my-10">
      <h2 className="text-2xl font-semibold text-teal-700 mb-8 text-center">📋 Review Your Booking</h2>

      {/* Outbound Flight */}
      {selectedOutbound && (
        <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🛫 Outbound Flight</h3>
          <div className="space-y-2 text-left text-gray-800">
            <p><span className="font-medium">From:</span> {from}</p>
            <p><span className="font-medium">To:</span> {to}</p>
            <p><span className="font-medium">Departure Date:</span> {formatDate(selectedOutbound.departureDate)}</p>
            <p><span className="font-medium">Departure Time:</span> {formatTime(selectedOutbound.departureTime)}</p>
            <p><span className="font-medium">Arrival Date:</span> {formatDate(selectedOutbound.arrivalDate)}</p>
            <p><span className="font-medium">Arrival Time:</span> {formatTime(selectedOutbound.arrivalTime)}</p>
            <p><span className="font-medium">Duration:</span> {selectedOutbound.duration} Hrs</p>
            <p><span className="font-medium">Class:</span> {flightClass}</p>
            <p><span className="font-medium">Price:</span> ₹{selectedOutbound.price}</p>
          </div>
        </div>
      )}

      {/* Inbound Flight */}
      {tripType === "roundtrip" && selectedInbound && (
        <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🛬 Return Flight</h3>
          <div className="space-y-2 text-left text-gray-800">
            <p><span className="font-medium">From:</span> {to}</p>
            <p><span className="font-medium">To:</span> {from}</p>
            <p><span className="font-medium">Departure Date:</span> {formatDate(selectedInbound.departureDate)}</p>
            <p><span className="font-medium">Departure Time:</span> {formatTime(selectedInbound.departureTime)}</p>
            <p><span className="font-medium">Arrival Date:</span> {formatDate(selectedInbound.arrivalDate)}</p>
            <p><span className="font-medium">Arrival Time:</span> {formatTime(selectedInbound.arrivalTime)}</p>
            <p><span className="font-medium">Duration:</span> {selectedInbound.duration} Hrs</p>
            <p><span className="font-medium">Class:</span> {flightClass}</p>
            <p><span className="font-medium">Price:</span> ₹{selectedInbound.price}</p>
          </div>
        </div>
      )}

      {/* Passenger Details */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">👤 Passenger Details</h3>
        <div className="space-y-2 text-left text-gray-800">
          {passengerData.passengers.map((p: any, idx: number) => (
            <p key={idx}>
              <span className="font-medium">Passenger {idx + 1}:</span> {p.firstName} {p.lastName} | {p.gender} | DOB: {formatDate(p.dateOfBirth)}
            </p>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8 text-right text-lg font-semibold text-gray-800">
        <p>Total Passengers: {passengers}</p>
        <p>Total Price: ₹{totalPrice}</p>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate("/payment")}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
};

export default ReviewBooking;