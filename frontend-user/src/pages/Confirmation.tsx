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
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
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
    <div className="max-w-3xl mx-auto p-6 my-10 bg-white rounded-xl shadow-sm border border-gray-200 text-center">
      <h2 className="text-2xl font-semibold text-teal-700 mb-8">🎉 Booking Confirmed!</h2>

      <p className="text-gray-800 text-lg mb-8">
        Thank you for booking with <span className="font-semibold text-teal-600">GarudaFlights</span>.
      </p>

      {/* Booking Summary */}
      <div className="text-left mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🛫 Outbound Flight</h3>
        <div className="space-y-2 text-gray-800">
          <p><span className="font-medium">From:</span> {from}</p>
          <p><span className="font-medium">To:</span> {to}</p>
          <p>
            <span className="font-medium">Departure:</span> {formatDate(selectedOutbound.departureDate)} at{" "}
            {selectedOutbound.departureTime}
          </p>
          <p>
            <span className="font-medium">Arrival:</span> {formatDate(selectedOutbound.arrivalDate)} at{" "}
            {selectedOutbound.arrivalTime}
          </p>
          <p><span className="font-medium">Duration:</span> {selectedOutbound.duration}</p>
          <p><span className="font-medium">Class:</span> {flightClass}</p>
          <p><span className="font-medium">Price:</span> ₹{selectedOutbound.price}</p>
        </div>
      </div>

      {tripType === "roundtrip" && selectedInbound && (
        <div className="text-left mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🛬 Return Flight</h3>
          <div className="space-y-2 text-gray-800">
            <p><span className="font-medium">From:</span> {to}</p>
            <p><span className="font-medium">To:</span> {from}</p>
            <p>
              <span className="font-medium">Departure:</span> {formatDate(selectedInbound.departureDate)} at{" "}
              {selectedInbound.departureTime}
            </p>
            <p>
              <span className="font-medium">Arrival:</span> {formatDate(selectedInbound.arrivalDate)} at{" "}
              {selectedInbound.arrivalTime}
            </p>
            <p><span className="font-medium">Duration:</span> {selectedInbound.duration}</p>
            <p><span className="font-medium">Class:</span> {flightClass}</p>
            <p><span className="font-medium">Price:</span> ₹{selectedInbound.price}</p>
          </div>
        </div>
      )}

      {/* Passenger Info */}
      <div className="text-left mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">👥 Passengers</h3>
        <div className="space-y-2 text-gray-800">
          {passengerData.passengers.map((p: any, idx: number) => (
            <p key={idx}>
              <span className="font-medium">Passenger {idx + 1}:</span> {p.firstName} {p.lastName} | {p.gender} | DOB:{" "}
              {formatDate(p.dateOfBirth)}
            </p>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="text-xl font-semibold mb-8 text-right text-gray-800">
        <p>Total Passengers: {passengers}</p>
        <p>Total Amount Paid: ₹{totalPrice}</p>
      </div>

      <div>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-200"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Confirmation;