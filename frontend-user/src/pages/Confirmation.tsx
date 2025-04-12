import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Confirmation = () => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<any>(null);
  const [passengerData, setPassengerData] = useState<any>(null);
  const [pnr, setPnr] = useState<string | null>(null);

  useEffect(() => {
    const isPaymentSuccess = localStorage.getItem("paymentSuccess");
    const flight = localStorage.getItem("selectedFlight");
    const passengers = localStorage.getItem("passengerDetails");
    const pnrStored = localStorage.getItem("pnr");

    if (!isPaymentSuccess || !flight || !passengers) {
      navigate("/flights");
      return;
    }

    setBooking(JSON.parse(flight));
    setPassengerData(JSON.parse(passengers));
    setPnr(pnrStored);

    // Cleanup localStorage
    setTimeout(() => {
      localStorage.removeItem("selectedFlight");
      localStorage.removeItem("passengerDetails");
      localStorage.removeItem("paymentSuccess");
      localStorage.removeItem("pnr");
    }, 1000);
  }, [navigate]);

  const formatDate = (iso: string) => {
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!booking || !passengerData) {
    return (
      <div className="min-h-screen flex justify-center items-center text-gray-600 text-lg">
        Loading confirmation...
      </div>
    );
  }

  const {
    selectedOutbound,
    selectedInbound,
    from,
    to,
    tripType,
    flightClass,
    passengers,
  } = booking;

  const passengerCount = passengerData.passengers.length;

  const totalPrice =
    ((selectedOutbound?.price || 0) + (tripType === "roundtrip" ? selectedInbound?.price || 0 : 0)) * passengerCount;

  const formatCAD = (amount: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 2,
    }).format(amount);
  };


  return (
    <div className="max-w-3xl mx-auto p-6 my-10 bg-white rounded-xl shadow-sm border border-gray-200 text-center">
      <h2 className="text-2xl font-semibold text-teal-700 mb-4">🎉 Booking Confirmed!</h2>

      {pnr && (
        <p className="text-lg font-medium text-gray-700 mb-4">
          ✈️ <strong>Your PNR:</strong> <span className="text-blue-700">{pnr}</span>
        </p>
      )}

      <p className="text-gray-800 text-base mb-8">
        Thank you for booking with <span className="font-semibold text-teal-600">GarudaFlights</span>.
      </p>

      {/* Outbound */}
      <div className="text-left mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">🛫 Outbound Flight</h3>
        <div className="space-y-1 text-gray-800">
          <p><strong>From:</strong> {from}</p>
          <p><strong>To:</strong> {to}</p>
          <p><strong>Departure:</strong> {formatDate(selectedOutbound.departureDate)} at {selectedOutbound.departureTime}</p>
          <p><strong>Arrival:</strong> {formatDate(selectedOutbound.arrivalDate)} at {selectedOutbound.arrivalTime}</p>
          <p><strong>Duration:</strong> {selectedOutbound.duration}</p>
          <p><strong>Class:</strong> {flightClass}</p>
          <p><strong>Price:</strong> {formatCAD(selectedOutbound.price)}</p>
        </div>
      </div>

      {/* Return */}
      {tripType === "roundtrip" && selectedInbound && (
        <div className="text-left mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">🛬 Return Flight</h3>
          <div className="space-y-1 text-gray-800">
            <p><strong>From:</strong> {to}</p>
            <p><strong>To:</strong> {from}</p>
            <p><strong>Departure:</strong> {formatDate(selectedInbound.departureDate)} at {selectedInbound.departureTime}</p>
            <p><strong>Arrival:</strong> {formatDate(selectedInbound.arrivalDate)} at {selectedInbound.arrivalTime}</p>
            <p><strong>Duration:</strong> {selectedInbound.duration}</p>
            <p><strong>Class:</strong> {flightClass}</p>
            <p><strong>Price:</strong> {formatCAD(selectedInbound.price)}</p>
          </div>
        </div>
      )}

      {/* Passengers */}
      <div className="text-left mb-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">👥 Passengers</h3>
        <div className="space-y-1 text-gray-800">
          {passengerData.passengers.map((p: any, idx: number) => (
            <p key={idx}>
              <strong>Passenger {idx + 1}:</strong> {p.firstName} {p.lastName} | {p.gender} | DOB: {formatDate(p.dateOfBirth)}
            </p>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="text-xl font-semibold mb-8 text-right text-gray-800">
      <p>Total Passengers: {passengerCount}</p>
<p>Total Amount Paid: {formatCAD(totalPrice)}</p>

      </div>

      {/* Button */}
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