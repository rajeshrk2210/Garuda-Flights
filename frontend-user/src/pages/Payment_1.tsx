import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiURL from "../config/config";

const Payment = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const flight = localStorage.getItem("selectedFlight");
    const passengers = localStorage.getItem("passengerDetails");
    if (!flight || !passengers) {
      alert("Missing booking details. Redirecting...");
      navigate("/flights");
    }
  }, [navigate]);

  const handlePayment = async () => {
    if (loading) return;

    if (!cardNumber || !name || !expiry || !cvv) {
      alert("❌ Please fill in all fields.");
      return;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      alert("❌ Card number must be 16 digits.");
      return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      alert("❌ CVV must be 3 or 4 digits.");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      alert("❌ Expiry should be in MM/YY format.");
      return;
    }

    const flightData = localStorage.getItem("selectedFlight");
    const passengerData = localStorage.getItem("passengerDetails");
    const token = localStorage.getItem("token");

    if (!flightData || !passengerData || !token) {
      alert("❌ Missing booking details or authentication token.");
      return;
    }

    try {
      setLoading(true);
      const { selectedOutbound, selectedInbound, passengers, flightClass } = JSON.parse(flightData);
      const { passengers: passengerList, contactInfo } = JSON.parse(passengerData);

      const payload = {
        flights: [selectedOutbound._id, ...(selectedInbound?._id ? [selectedInbound._id] : [])],
        seatClass: flightClass,
        passengers: passengerList,
        contactDetails: contactInfo,
        price: (selectedOutbound.price || 0) + (selectedInbound?.price || 0),
      };

      const res = await fetch(`${apiURL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("paymentSuccess", "true");
        localStorage.setItem("pnr", data.booking.pnr);
        alert("✅ Booking confirmed!");
        navigate("/confirmation");
      } else {
        alert("❌ Booking failed: " + data.message);
      }
    } catch (error) {
      console.error("❌ Error during booking:", error);
      alert("❌ Booking failed due to an error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-2xl font-bold mb-6 text-teal-700">💳 Payment</h2>

      <input
        type="text"
        placeholder="Card Number (16 digits)"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
        className="border p-2 rounded w-full mb-4"
        maxLength={16}
      />

      <input
        type="text"
        placeholder="Name on Card"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <input
        type="text"
        placeholder="Expiry (MM/YY)"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <input
        type="text"
        placeholder="CVV"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
        className="border p-2 rounded w-full mb-6"
        maxLength={4}
      />

      <button
        onClick={handlePayment}
        disabled={loading}
        className={`bg-green-600 text-white px-6 py-2 rounded w-full hover:bg-green-700 transition duration-200 ${
          loading ? "opacity-60 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default Payment;
