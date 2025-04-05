import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Confirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isPaymentSuccess = localStorage.getItem("paymentSuccess");
    if (!isPaymentSuccess) {
      navigate("/flights");
    }

    // 🧹 Optional: Clear all booking-related data after showing confirmation
    return () => {
      localStorage.removeItem("selectedFlight");
      localStorage.removeItem("passengerDetails");
      localStorage.removeItem("paymentSuccess");
    };
  }, [navigate]);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-lg rounded text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 Booking Confirmed!</h2>
      <p className="text-gray-700 text-lg mb-6">
        Thank you for booking with <span className="font-semibold text-blue-600">GarudaFlights</span>.
        Your tickets have been successfully booked.
      </p>

      <p className="text-md text-gray-600 mb-8">
        A confirmation email with your booking details has been sent to your registered email address.
      </p>

      <button
        onClick={() => navigate("/")}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Go to Home
      </button>
    </div>
  );
};

export default Confirmation;
