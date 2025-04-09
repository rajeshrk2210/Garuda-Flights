import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Confirmation = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [passengerData, setPassengerData] = useState<any>(null);

  useEffect(() => {
    const isPaymentSuccess = localStorage.getItem("paymentSuccess");
    const flight = localStorage.getItem("selectedFlight");
    const passengers = localStorage.getItem("passengerDetails");

    if (!isPaymentSuccess || !flight || !passengers) {
      navigate("/flights");
      return;
    }

    setBooking(JSON.parse(flight));
    setPassengerData(JSON.parse(passengers));

    // 🧹 Clean up AFTER rendering
    setTimeout(() => {
      localStorage.removeItem("selectedFlight");
      localStorage.removeItem("passengerDetails");
      localStorage.removeItem("paymentSuccess");
    }, 1000); // wait 1 second after rendering
  }, [navigate]);

  if (!booking || !passengerData) {
    return <p className="text-center mt-10 text-gray-600">Loading confirmation...</p>;
  }

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      weekday: "short", year: "numeric", month: "short", day: "numeric"
    });
  };

  const {
    selectedOutbound,
    selectedInbound,
    from,
    to,
    tripType,
    flightClass,
    passengers,
  } = booking;

  const totalPrice =
    (selectedOutbound?.price || 0) + (tripType === "roundtrip" ? selectedInbound?.price || 0 : 0);

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-white shadow-lg rounded text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Booking Confirmed!</h2>

      <p className="text-gray-700 text-lg mb-6">
        Thank you for booking with <span className="font-semibold text-blue-600">GarudaFlights</span>.
      </p>

      {/* Booking Summary */}
      <div className="text-left mb-6 bg-gray-50 p-4 rounded border">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">🛫 Outbound Flight</h3>
        <p><strong>From:</strong> {from}</p>
        <p><strong>To:</strong> {to}</p>
        <p><strong>Departure:</strong> {formatDate(selectedOutbound.departureDate)} at {selectedOutbound.departureTime}</p>
        <p><strong>Arrival:</strong> {formatDate(selectedOutbound.arrivalDate)} at {selectedOutbound.arrivalTime}</p>
        <p><strong>Duration:</strong> {selectedOutbound.duration}</p>
        <p><strong>Class:</strong> {flightClass}</p>
        <p><strong>Price:</strong> ₹{selectedOutbound.price}</p>
      </div>

      {tripType === "roundtrip" && selectedInbound && (
        <div className="text-left mb-6 bg-gray-50 p-4 rounded border">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">🛬 Return Flight</h3>
          <p><strong>From:</strong> {to}</p>
          <p><strong>To:</strong> {from}</p>
          <p><strong>Departure:</strong> {formatDate(selectedInbound.departureDate)} at {selectedInbound.departureTime}</p>
          <p><strong>Arrival:</strong> {formatDate(selectedInbound.arrivalDate)} at {selectedInbound.arrivalTime}</p>
          <p><strong>Duration:</strong> {selectedInbound.duration}</p>
          <p><strong>Class:</strong> {flightClass}</p>
          <p><strong>Price:</strong> ₹{selectedInbound.price}</p>
        </div>
      )}

      {/* Passenger Info */}
      <div className="text-left mb-6 bg-gray-50 p-4 rounded border">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">👥 Passengers</h3>
        {passengerData.passengers.map((p: any, idx: number) => (
          <p key={idx}>
            <strong>Passenger {idx + 1}:</strong> {p.firstName} {p.lastName} | {p.gender} | DOB: {formatDate(p.dateOfBirth)}
          </p>
        ))}
      </div>

      {/* Summary */}
      <div className="text-xl font-semibold mb-6 text-right">
        <p>Total Passengers: {passengers}</p>
        <p>Total Amount Paid: ₹{totalPrice}</p>
      </div>

      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Back to Home
      </button>
    </div>
  );
};

export default Confirmation;
