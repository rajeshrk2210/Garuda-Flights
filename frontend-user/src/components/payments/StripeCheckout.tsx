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
      setError(""); // Clear error when amount is valid
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
      const res = await fetch(`${apiURL}/api/payments/create-payment-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      const clientSecret = data.clientSecret;

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });

      if (result.error) {
        setError(result.error.message || "Payment failed");
      } else if (result.paymentIntent.status === "succeeded") {
        localStorage.setItem("paymentSuccess", "true");
        navigate("/confirmation");
      }
    } catch (err) {
      setError("Something went wrong.");
      console.error(err);
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
