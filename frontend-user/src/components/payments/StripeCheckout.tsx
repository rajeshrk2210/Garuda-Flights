import { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import apiURL from "../../config/config";
import { formatCurrency } from "../../utils/formatCurrency";

interface StripeCheckoutProps {
  amount: number;
}

const StripeCheckout = ({ amount }: StripeCheckoutProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (amount <= 0) {
      setError("Amount is missing or invalid.");
    } else {
      setError("");
    }
  }, [amount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!stripe || !elements) {
      setError("Stripe not loaded");
      setLoading(false);
      return;
    }

    try {
      // Step 1: Create payment intent
      const res = await fetch(`${apiURL}/api/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      const clientSecret = data.clientSecret;

      // Step 2: Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
        setLoading(false);
        return;
      }

      if (result.paymentIntent.status === "succeeded") {
        // Step 3: Booking creation
        const flightData = localStorage.getItem("selectedFlight");
        const passengerData = localStorage.getItem("passengerDetails");
        const token = localStorage.getItem("token");

        if (!flightData || !passengerData || !token) {
          setError("Required booking details missing.");
          setLoading(false);
          return;
        }

        const { selectedOutbound, selectedInbound, flightClass } = JSON.parse(flightData);
        const seatClass = flightClass;

        const parsedPassengers = JSON.parse(passengerData);
        const passengers = parsedPassengers.passengers;
        const contact = parsedPassengers.contactInfo; // ✅ FIXED KEY

        if (!passengers?.length || !contact?.email) {
          setError("Passenger or contact details are incomplete.");
          setLoading(false);
          return;
        }


        const flights = [selectedOutbound._id];
        if (selectedInbound) flights.push(selectedInbound._id);

        const createBookingRes = await fetch(`${apiURL}/api/bookings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            flights,
            seatClass,
            passengers,
            contactDetails: contact, // ✅ FIXED KEY
            price: amount,
          }),          
        });

        if (!createBookingRes.ok) {
          const errData = await createBookingRes.json();
          setError(`Booking failed: ${errData.message}`);
          setLoading(false);
          return;
        }

        const bookingData = await createBookingRes.json();
        localStorage.setItem("pnr", bookingData.booking.pnr);
        localStorage.setItem("paymentSuccess", "true");

        // Step 4: Redirect
        navigate("/confirmation");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      setError("Something went wrong during payment.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold text-teal-700 mb-4">
        Stripe Payment ({formatCurrency(amount)})
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="border p-3 mb-4 rounded">
          <CardElement />
        </div>
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button
          type="submit"
          disabled={!stripe || loading}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 w-full"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default StripeCheckout;
