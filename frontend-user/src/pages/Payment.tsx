import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const flight = localStorage.getItem("selectedFlight");
    const passengers = localStorage.getItem("passengerDetails");
    if (!flight || !passengers) {
      alert("Missing booking details. Redirecting...");
      navigate("/flights");
    }
  }, [navigate]);

  const handlePayment = () => {
    // Basic validations
    if (!cardNumber || !name || !expiry || !cvv) {
      alert("Please fill in all fields.");
      return;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
      alert("Card number must be 16 digits.");
      return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      alert("CVV must be 3 or 4 digits.");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      alert("Expiry should be in MM/YY format.");
      return;
    }

    // 💳 Consider all transactions as successful for now
    localStorage.setItem("paymentSuccess", "true");
    alert("✅ Payment successful!");
    navigate("/confirmation"); // You can create a separate Confirmation.tsx page
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-blue-700">💳 Payment</h2>

      <input
        type="text"
        placeholder="Card Number (16 digits)"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        className="border p-2 rounded w-full mb-3"
        maxLength={16}
      />

      <input
        type="text"
        placeholder="Name on Card"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />

      <input
        type="text"
        placeholder="Expiry (MM/YY)"
        value={expiry}
        onChange={(e) => setExpiry(e.target.value)}
        className="border p-2 rounded w-full mb-3"
      />

      <input
        type="text"
        placeholder="CVV"
        value={cvv}
        onChange={(e) => setCvv(e.target.value)}
        className="border p-2 rounded w-full mb-3"
        maxLength={4}
      />

      <button
        onClick={handlePayment}
        className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
      >
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
